export interface LinkMeta {
  icon: string;
  /** Primary links get the filled treatment; the rest render as outline pills. */
  primary: boolean;
}

/**
 * Choose an icon and prominence for a project link from its URL.
 *
 * Links are stored as a bare `{ label, url }` pair with no declared kind, so
 * the URL is what we have. Order matters: the APK check must run before the
 * GitHub one, since release downloads are hosted on github.com.
 */
export function linkMeta(url: string): LinkMeta {
  const u = url.toLowerCase();

  if (u.endsWith('.apk') || u.includes('/releases/download/')) {
    return { icon: 'ri-download-2-line', primary: true };
  }
  if (u.includes('play.google.com')) return { icon: 'ri-google-play-fill', primary: true };
  if (u.includes('apps.apple.com') || u.includes('testflight')) {
    return { icon: 'ri-app-store-fill', primary: true };
  }
  if (u.includes('github.com')) return { icon: 'ri-github-fill', primary: false };
  if (u.includes('figma.com')) return { icon: 'ri-shapes-line', primary: false };
  if (u.includes('youtube.com') || u.includes('youtu.be') || u.includes('vimeo.com')) {
    return { icon: 'ri-play-circle-line', primary: false };
  }
  return { icon: 'ri-arrow-right-up-line', primary: true };
}
