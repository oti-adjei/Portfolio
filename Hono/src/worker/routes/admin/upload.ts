import { Hono } from "hono";
import {
  MAX_UPLOAD_BYTES,
  buildObjectKey,
  isAllowedFolder,
  sniffImageType,
} from "../../services/uploads.js";

const adminUpload = new Hono<{ Bindings: Env }>();

// POST /api/admin/upload — multipart form: file, folder
adminUpload.post("/", async (c) => {
  let form: FormData;
  try {
    form = await c.req.formData();
  } catch {
    return c.json({ error: "Expected multipart/form-data" }, 400);
  }

  const folder = String(form.get("folder") ?? "");
  if (!isAllowedFolder(folder)) {
    return c.json({ error: "Unknown folder." }, 400);
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return c.json({ error: "No file provided." }, 400);
  }

  if (file.size === 0) {
    return c.json({ error: "That file is empty." }, 400);
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return c.json({ error: "That image is over the 10MB limit." }, 413);
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mime = sniffImageType(bytes);
  if (!mime) {
    return c.json({ error: "Only PNG, JPEG and WebP images are accepted." }, 415);
  }

  const key = buildObjectKey(folder, file.name);

  await c.env.IMAGES.put(key, bytes, {
    httpMetadata: {
      contentType: mime,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });

  const base = c.env.R2_PUBLIC_BASE.replace(/\/+$/, "");
  return c.json({ url: `${base}/${key}`, key, size: bytes.byteLength });
});

export default adminUpload;
