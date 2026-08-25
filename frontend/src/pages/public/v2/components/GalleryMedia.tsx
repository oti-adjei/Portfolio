import { useEffect, useRef } from 'react';
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
 * Video plays itself through exactly once, the first time it scrolls into
 * view, then stops and leaves the controls for a replay. It does not loop:
 * a looping clip in a page of stills reads as an advert, and it keeps
 * decoding while the reader is trying to read.
 *
 * Autoplay only happens muted (every browser requires it) and never when the
 * visitor has asked for reduced motion — in that case the poster frame and
 * the play button are the whole experience.
 */
export default function GalleryMedia({ url, caption, className = '' }: GalleryMediaProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || hasPlayedRef.current) continue;
          hasPlayedRef.current = true;
          observer.disconnect();
          // Rejects when the browser declines autoplay; nothing to do but
          // leave the controls, which is already the fallback.
          void video.play().catch(() => {});
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  if (isVideoUrl(url)) {
    return (
      <video
        ref={videoRef}
        src={url}
        className="w-full max-h-[70vh] object-contain bg-ink"
        controls
        playsInline
        muted
        preload="metadata"
        aria-label={caption || 'Project video'}
      />
    );
  }

  return <img src={url} alt={caption ?? ''} className={className} loading="lazy" />;
}
