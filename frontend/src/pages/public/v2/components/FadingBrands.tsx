import { useEffect, useState } from 'react';
import { experimentBrands } from './brandsData';

const VISIBLE = 4;
const INTERVAL_MS = 3500;

export default function FadingBrands() {
  const [page, setPage] = useState(0);
  const [phase, setPhase] = useState<'in' | 'out'>('in');

  const totalPages = Math.max(1, Math.ceil(experimentBrands.length / VISIBLE));

  useEffect(() => {
    const fadeOut = setTimeout(() => setPhase('out'), INTERVAL_MS - 600);
    const swap = setTimeout(() => {
      setPage((p) => (p + 1) % totalPages);
      setPhase('in');
    }, INTERVAL_MS);
    return () => {
      clearTimeout(fadeOut);
      clearTimeout(swap);
    };
  }, [page, totalPages]);

  const start = page * VISIBLE;
  const visibleBrands = Array.from({ length: VISIBLE }, (_, i) => {
    const idx = (start + i) % experimentBrands.length;
    return experimentBrands[idx];
  });

  return (
    <section className="px-8 lg:px-12 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
        <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 whitespace-nowrap shrink-0">
          Worked with
        </p>
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 items-center">
          {visibleBrands.map((b, i) => (
            <div
              key={`${b.name}-${page}-${i}`}
              className="h-10 flex items-center justify-center"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <img
                src={b.logo}
                alt={b.name}
                className={`max-h-8 w-auto opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 ${
                  phase === 'out' ? 'opacity-0 -translate-y-1' : ''
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
