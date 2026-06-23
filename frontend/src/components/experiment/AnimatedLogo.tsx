import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface AnimatedLogoProps {
  src?: string;
  alt?: string;
  size?: number;
}

export default function AnimatedLogo({
  src = '/GHlog.png',
  alt = 'Georgie',
  size = 28,
}: AnimatedLogoProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const idleTweenRef = useRef<gsap.core.Tween | null>(null);
  const glowTweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Intro
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.4, rotate: -90 },
        { opacity: 1, scale: 1, rotate: 0, duration: 1.1, ease: 'back.out(1.7)' },
      );

      // Idle slow spin
      idleTweenRef.current = gsap.to(el, {
        rotate: '+=360',
        duration: 28,
        repeat: -1,
        ease: 'none',
        delay: 1.2,
      });

      // Glow pulse
      glowTweenRef.current = gsap.to(el, {
        filter: 'drop-shadow(0 0 6px rgba(247,81,36,0.55))',
        duration: 2.2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 1.2,
      });
    });

    return () => ctx.revert();
  }, []);

  const onEnter = () => {
    const el = imgRef.current;
    if (!el) return;
    idleTweenRef.current?.pause();
    gsap.to(el, { scale: 1.18, duration: 0.25, ease: 'power2.out' });
  };

  const onLeave = () => {
    const el = imgRef.current;
    if (!el) return;
    gsap.to(el, { scale: 1, duration: 0.3, ease: 'power2.out' });
    idleTweenRef.current?.resume();
  };

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ height: size, width: size }}
      className="object-contain will-change-transform cursor-pointer"
    />
  );
}
