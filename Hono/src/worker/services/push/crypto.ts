/**
 * Web Push crypto, WebCrypto only — no Node polyfill.
 *
 * Two specs are involved and they are independent of each other:
 *   VAPID   (RFC 8292) — proves to the push service who is sending. ECDSA P-256 / ES256 JWT.
 *   Payload (RFC 8291) — encrypts the message so the push service can't read it.
 *                        ECDH P-256 -> HKDF-SHA256 -> AES-128-GCM, "aes128gcm" encoding.
 *
 * Verified against workerd: crypto.subtle.sign for ECDSA returns the raw r||s pair (64 bytes)
 * that JWS requires, not DER — a DER signature would be rejected by every push service.
 */

export function b64urlEncode(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function b64urlDecode(input: string): Uint8Array {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

function concat(...arrays: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(arrays.reduce((n, a) => n + a.length, 0));
  let offset = 0;
  for (const a of arrays) {
    out.set(a, offset);
    offset += a.length;
  }
  return out;
}

const utf8 = (s: string) => new TextEncoder().encode(s);

/** Big-endian uint16, used for the aes128gcm record size and key lengths. */
function uint16(n: number): Uint8Array {
  return new Uint8Array([(n >> 8) & 0xff, n & 0xff]);
}

/**
 * Imports a raw (65-byte, uncompressed) P-256 public key.
 *
 * WebCrypto will not import a raw ECDH public key with usages, hence the empty array —
 * it is only ever used as the `public` parameter of a deriveBits call.
 */
async function importRawPublicKey(raw: Uint8Array, algorithm: "ECDH" | "ECDSA"): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", raw as BufferSource, { name: algorithm, namedCurve: "P-256" }, true, []);
}

/**
 * Rebuilds a signing key from a base64url raw private scalar plus its public point.
 *
 * VAPID keys are conventionally distributed as raw values (that is what every key generator
 * and browser API emits), but WebCrypto will only import a private key as JWK or PKCS#8. So
 * the raw d/x/y are reassembled into a JWK here.
 */
export async function importVapidPrivateKey(privateKeyB64: string, publicKeyB64: string): Promise<CryptoKey> {
  const publicKey = b64urlDecode(publicKeyB64);
  if (publicKey.length !== 65 || publicKey[0] !== 0x04) {
    throw new Error("VAPID public key must be a 65-byte uncompressed P-256 point");
  }

  const jwk: JsonWebKey = {
    kty: "EC",
    crv: "P-256",
    d: privateKeyB64,
    x: b64urlEncode(publicKey.slice(1, 33)),
    y: b64urlEncode(publicKey.slice(33, 65)),
    ext: true,
  };

  return crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
}

/**
 * Signs the VAPID JWT for one push endpoint.
 *
 * `aud` must be the origin of the endpoint, not the full URL — push services reject a token
 * whose audience carries the subscription path.
 */
export async function createVapidToken(
  endpoint: string,
  subject: string,
  publicKeyB64: string,
  privateKeyB64: string
): Promise<string> {
  const audience = new URL(endpoint).origin;

  const header = b64urlEncode(utf8(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const payload = b64urlEncode(
    utf8(
      JSON.stringify({
        aud: audience,
        exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
        sub: subject,
      })
    )
  );

  const key = await importVapidPrivateKey(privateKeyB64, publicKeyB64);
  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    utf8(`${header}.${payload}`)
  );

  return `${header}.${payload}.${b64urlEncode(signature)}`;
}

async function hkdf(
  ikm: BufferSource,
  salt: BufferSource,
  info: Uint8Array,
  lengthBits: number
): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  return crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, key, lengthBits);
}

/**
 * Encrypts a payload for one subscription using Content-Encoding: aes128gcm (RFC 8188/8291).
 *
 * Output layout is the aes128gcm record: salt(16) || rs(4) || idlen(1) || as_public(65) || ciphertext.
 */
export async function encryptPayload(
  plaintext: string,
  subscriberPublicKeyB64: string,
  authSecretB64: string
): Promise<Uint8Array> {
  const subscriberPublic = b64urlDecode(subscriberPublicKeyB64);
  const authSecret = b64urlDecode(authSecretB64);

  // Ephemeral "application server" keypair — a fresh one per message, per spec.
  const serverKeys = (await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"]
  )) as CryptoKeyPair;

  // exportKey is typed as returning ArrayBuffer | JsonWebKey; only "jwk" yields the latter.
  const serverPublic = new Uint8Array(
    (await crypto.subtle.exportKey("raw", serverKeys.publicKey)) as ArrayBuffer
  );

  // workerd's generated types name the peer key `$public`, but the runtime implements the
  // standard WebCrypto `public` (verified against workerd — `$public` is a types-only
  // artefact). Cast rather than rename, so the value sent to the runtime stays correct.
  const ecdhParams = {
    name: "ECDH",
    public: await importRawPublicKey(subscriberPublic, "ECDH"),
  } as unknown as Parameters<typeof crypto.subtle.deriveBits>[0];

  const sharedSecret = await crypto.subtle.deriveBits(ecdhParams, serverKeys.privateKey, 256);

  // First HKDF: mix the ECDH secret with the subscription's auth secret.
  // info = "WebPush: info" || 0x00 || ua_public || as_public
  const ikm = await hkdf(
    sharedSecret,
    authSecret as BufferSource,
    concat(utf8("WebPush: info"), new Uint8Array([0]), subscriberPublic, serverPublic),
    256
  );

  // Second HKDF: derive the content encryption key and nonce from a fresh random salt.
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(ikm, salt as BufferSource, concat(utf8("Content-Encoding: aes128gcm"), new Uint8Array([0])), 128);
  const nonce = await hkdf(ikm, salt as BufferSource, concat(utf8("Content-Encoding: nonce"), new Uint8Array([0])), 96);

  const key = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt"]);

  // 0x02 is the final-record delimiter; a non-final record would use 0x01.
  const padded = concat(utf8(plaintext), new Uint8Array([2]));
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, key, padded as BufferSource)
  );

  const recordSize = new Uint8Array(4);
  new DataView(recordSize.buffer).setUint32(0, 4096);

  return concat(salt, recordSize, new Uint8Array([serverPublic.length]), serverPublic, ciphertext);
}

export { concat, uint16 };
