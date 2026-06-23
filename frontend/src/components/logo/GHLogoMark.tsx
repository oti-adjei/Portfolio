import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface Props {
  variant?: 'dark' | 'light';
  autoplay?: boolean;
  pulse?: boolean;
  onComplete?: () => void;
  className?: string;
  ariaLabel?: string;
}

const GREEN = '#00e281';

export default function GHLogoMark({
  variant = 'dark',
  autoplay = true,
  pulse = false,
  onComplete,
  className = '',
  ariaLabel = 'George Heavenson',
}: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!autoplay || !ref.current) return;
    const root = ref.current;
    const ring = root.querySelector('.gh-ring');
    const hVerts = root.querySelectorAll('.gh-h-vert');
    const hCross = root.querySelector('.gh-h-cross');
    const smile = root.querySelector('.gh-smile');

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      onComplete?.();
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(ring, { scale: 0.55, opacity: 0, transformOrigin: '86.5px 86.5px' });
      gsap.set(hVerts, { y: 36, opacity: 0 });
      gsap.set(hCross, { scaleX: 0, opacity: 0, transformOrigin: '50% 50%' });
      gsap.set(smile, { y: -140, opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          if (completedRef.current) return;
          completedRef.current = true;
          if (pulse) {
            gsap.to(root, {
              scale: 1.04,
              duration: 1.4,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
              transformOrigin: '50% 50%',
            });
          }
          onComplete?.();
        },
      });

      tl.to(ring, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.6)' }, 0)
        .to(hVerts, { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out', stagger: 0.08 }, 0.35)
        .to(hCross, { scaleX: 1, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.5)
        .to(smile, { y: 0, opacity: 1, duration: 0.9, ease: 'bounce.out' }, 0.6);
    }, ref);

    return () => ctx.revert();
  }, [autoplay, pulse, onComplete]);

  const darkFill = variant === 'light' ? '#ffffff' : '#02231c';

  return (
    <svg
      ref={ref}
      viewBox="0 0 190 172.96"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={ariaLabel}
      role="img"
    >
      <path
        className="gh-ring"
        fill={GREEN}
        d="m171.75,72.08h-16.96c.98,4.64,1.5,9.46,1.5,14.4,0,.76-.02,1.51-.04,2.26-1.2,37.45-32.04,67.55-69.78,67.55S16.66,124.97,16.66,86.48,47.98,16.66,86.47,16.66c27.35,0,51.07,15.8,62.52,38.76h18.19C154.69,23.03,123.22,0,86.47,0,38.79,0,0,38.79,0,86.48s38.79,86.48,86.47,86.48,85.25-37.57,86.45-84.22c.02-.75.03-1.51.03-2.26,0-4.9-.41-9.72-1.2-14.4Z"
      />
      <rect className="gh-h-vert" fill={GREEN} x="36.38" y="54.14" width="16.66" height="52.55" />
      <rect className="gh-h-vert" fill={GREEN} x="97.82" y="54.14" width="16.66" height="52.55" />
      <rect className="gh-h-cross" fill={GREEN} x="40.6" y="72.08" width="148.89" height="16.66" />
      <path className="gh-smile" fill={darkFill} d="m51.37,125.16h54.08s-27.04,30.44-54.08,0Z" />
    </svg>
  );
}
