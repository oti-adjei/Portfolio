export const ALLOWED_FOLDERS = ["projects", "me", "brand"] as const;
export type AllowedFolder = (typeof ALLOWED_FOLDERS)[number];

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export type AllowedMime = "image/png" | "image/jpeg" | "image/webp";

export function isAllowedFolder(value: string): value is AllowedFolder {
  return (ALLOWED_FOLDERS as readonly string[]).includes(value);
}

/**
 * Identify an image from its leading bytes. The browser-supplied Content-Type
 * is a hint and is not trusted. SVG is deliberately unrecognised — it can
 * carry script and these objects are served from a real domain.
 */
export function sniffImageType(bytes: Uint8Array): AllowedMime | null {
  if (bytes.length < 12) return null;

  const startsWith = (...sig: number[]) => sig.every((byte, i) => bytes[i] === byte);

  if (startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "image/png";
  if (startsWith(0xff, 0xd8, 0xff)) return "image/jpeg";

  const isRiff = startsWith(0x52, 0x49, 0x46, 0x46);
  const isWebp =
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
  if (isRiff && isWebp) return "image/webp";

  return null;
}

export function slugifyFilename(name: string): string {
  const withoutExtension = name.replace(/\.[^.]+$/, "");
  const slug = withoutExtension
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "image";
}

function defaultRandom(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8);
}

export function buildObjectKey(
  folder: string,
  filename: string,
  now: Date = new Date(),
  random: () => string = defaultRandom
): string {
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${folder}/${year}-${month}/${slugifyFilename(filename)}-${random()}.webp`;
}
