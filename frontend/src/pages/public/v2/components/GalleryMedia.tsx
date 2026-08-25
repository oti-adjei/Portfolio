import { isVideoUrl } from '@/shared/media/isVideo';

interface GalleryMediaProps {
  url: string;
  caption?: string;
  /** Applied to images only — video sizes itself, see below. */
  className?: string;
}

/**
 * Renders a gallery entry as a video or an image, chosen by file extension.
 *
 * Two deliberate differences for video:
 *
 * - `object-contain` on an ink backdrop rather than `object-cover`. Gallery
 *   videos are usually portrait screen recordings, and cover-cropping a 9:16
 *   phone demo inside a wide grid cell cuts the actual content away.
 * - `preload="metadata"`, so the poster frame arrives but the body does not
 *   until the visitor presses play. This only pays off if the file is
 *   faststart-encoded (moov atom at the front); otherwise the browser has to
 *   fetch the whole file to find the metadata.
 */
export default function GalleryMedia({ url, caption, className = '' }: GalleryMediaProps) {
  if (isVideoUrl(url)) {
    return (
      <video
        src={url}
        className="w-full max-h-[70vh] object-contain bg-ink"
        controls
        playsInline
        muted
        loop
        preload="metadata"
        aria-label={caption || 'Project video'}
      />
    );
  }

  return <img src={url} alt={caption ?? ''} className={className} loading="lazy" />;
}
