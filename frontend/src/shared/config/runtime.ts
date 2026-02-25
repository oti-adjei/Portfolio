export type ContentSource = "api" | "mock";

const DEFAULT_CONTENT_SOURCE: ContentSource = "api";

let warnedInvalidSource = false;

export function getContentSource(): ContentSource {
  const raw = (import.meta.env.VITE_CONTENT_SOURCE ?? "").trim().toLowerCase();
  if (raw === "api" || raw === "mock") {
    return raw;
  }

  if (!warnedInvalidSource && import.meta.env.DEV && raw) {
    console.warn(
      `[runtime] Invalid VITE_CONTENT_SOURCE="${raw}". Falling back to "${DEFAULT_CONTENT_SOURCE}".`
    );
    warnedInvalidSource = true;
  }

  return DEFAULT_CONTENT_SOURCE;
}

export function isApiMode(): boolean {
  return getContentSource() === "api";
}

export function isMockMode(): boolean {
  return getContentSource() === "mock";
}
