import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import GHLogoFull from './logo/GHLogoFull';

const SESSION_KEY = 'gh_intro_played';

type Theme = 'light' | 'cream' | 'dark' | 'auto';
type ResolvedTheme = 'light' | 'cream' | 'dark';

interface Props {
  /** When true, always plays (bypasses session storage gate). */
  force?: boolean;
  /**
   * 'light' = white bg + dark logo
   * 'cream' = #faf8ef bg + dark logo (site "dark" mode)
   * 'dark'  = gray-900 bg + white logo (reserved for other uses)
   * 'auto'  = white in OS light mode, cream in OS dark mode
   */
  theme?: Theme;
}

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme !== 'auto') return theme;
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'cream' : 'light';
}

export default function PageLoader({ force = false, theme = 'auto' }: Props) {
  const [mounted, setMounted] = useState(() => {
    if (force) return true;
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(SESSION_KEY) !== '1';
  });
  const resolved = useMemo(() => resolveTheme(theme), [theme]);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mounted]);

  if (!mounted) return null;

  const handleComplete = () => {
    if (!overlayRef.current) {
      setMounted(false);
      sessionStorage.setItem(SESSION_KEY, '1');
      return;
    }
    gsap.to(overlayRef.current, {
      yPercent: -100,
      duration: 0.85,
      delay: 0.45,
      ease: 'power3.inOut',
      onComplete: () => {
        sessionStorage.setItem(SESSION_KEY, '1');
        setMounted(false);
      },
    });
  };

  const bgStyle = resolved === 'cream' ? { backgroundColor: '#faf8ef' } : undefined;
  const bgClass =
    resolved === 'dark' ? 'bg-gray-900' : resolved === 'light' ? 'bg-white' : '';
  const logoVariant = resolved === 'dark' ? 'light' : 'dark';

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-[100] flex items-center justify-center ${bgClass}`}
      style={bgStyle}
      aria-hidden="true"
    >
      <GHLogoFull
        variant={logoVariant}
        autoplay
        onComplete={handleComplete}
        className="w-[78%] max-w-[640px] sm:w-[60%] sm:max-w-[720px]"
      />
    </div>
  );
}
