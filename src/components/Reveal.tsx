import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react';

const transforms = {
  bottom: { hidden: 'translateY(40px)', visible: 'translateY(0)' },
  left:   { hidden: 'translateX(-50px)', visible: 'translateX(0)' },
  right:  { hidden: 'translateX(50px)',  visible: 'translateX(0)' },
  top:    { hidden: 'translateY(-40px)', visible: 'translateY(0)' },
};

interface RevealProps {
  children: ReactNode;
  origin?: keyof typeof transforms;
  delay?: number;
  className?: string;
}

export default function Reveal({ children, origin = 'bottom', delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = transforms[origin].visible;
          observer.unobserve(el);
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [origin]);

  const style: CSSProperties = {
    opacity: 0,
    transform: transforms[origin].hidden,
    transition: `opacity 0.65s ease, transform 0.65s ease`,
    transitionDelay: `${delay}ms`,
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}
