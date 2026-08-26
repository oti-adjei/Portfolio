#!/usr/bin/env node
/**
 * Generates a VAPID keypair for Web Push.
 *
 * Uses the same WebCrypto API the Worker uses, so the key material is guaranteed to be in
 * the shape `services/push/crypto.ts` expects: a raw 65-byte uncompressed P-256 public point
 * and the raw private scalar, both base64url.
 *
 * Prints to stdout only — nothing is written to disk, so the private key never lands in the
 * repo by accident. Copy it into .dev.vars for local use and `wrangler secret put` for prod.
 */

const b64url = (buf) =>
  Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const keys = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, [
  "sign",
  "verify",
]);

const publicKey = b64url(await crypto.subtle.exportKey("raw", keys.publicKey));

// The JWK 'd' parameter is the raw private scalar, already base64url encoded.
const { d: privateKey } = await crypto.subtle.exportKey("jwk", keys.privateKey);

console.log(`
VAPID keypair generated.

Local development — add to Hono/.dev.vars:

  VAPID_PUBLIC_KEY=${publicKey}
  VAPID_PRIVATE_KEY=${privateKey}
  VAPID_SUBJECT=mailto:you@example.com

Production — run these (each will prompt for the value):

  npx wrangler secret put VAPID_PUBLIC_KEY
  npx wrangler secret put VAPID_PRIVATE_KEY
  npx wrangler secret put VAPID_SUBJECT

Keep VAPID_PRIVATE_KEY out of git. Rotating it invalidates every existing
subscription, so every device has to re-enable notifications afterwards.
`);
