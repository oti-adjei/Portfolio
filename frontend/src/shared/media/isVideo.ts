const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.m4v'];

/**
 * Detect video by file extension. Gallery entries are plain URL strings with no
 * declared media type, so the extension is all we have — and R2 keys preserve
 * whatever case the uploaded filename had (`.MP4` is real in this data), hence
 * the lowercasing. A query string is stripped first so cache-busted URLs still match.
 */
export function isVideoUrl(url: string): boolean {
  const path = url.split(/[?#]/)[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => path.endsWith(ext));
}
