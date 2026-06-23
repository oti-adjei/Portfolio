import Reveal from '@/components/Reveal';

export interface TimelineNode {
  period: string;
  title: string;
  org?: string;
  detail?: string;
}

interface TimelineProps {
  nodes: TimelineNode[];
}

export default function Timeline({ nodes }: TimelineProps) {
  return (
    <div className="relative">
      {/* horizontal track with overflow-x for narrow screens */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2">
        <div className="relative min-w-max">
          {/* horizontal rule */}
          <div className="absolute left-0 right-0 top-3 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

          <ol className="flex items-start gap-12">
            {nodes.map((n, i) => (
              <Reveal key={`${n.title}-${i}`} origin="bottom" delay={i * 80}>
                <li className="relative w-56 pt-8">
                  {/* dot anchored on the rule */}
                  <span className="absolute left-0 top-0 w-6 h-6 rounded-full bg-white ring-1 ring-gray-200 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-gray-900" />
                  </span>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">{n.period}</p>
                  <p className="mt-1.5 text-[15px] font-semibold text-gray-900 leading-snug">
                    {n.title}
                  </p>
                  {n.org && (
                    <p className="text-[12px] text-gray-500 mt-0.5">{n.org}</p>
                  )}
                  {n.detail && (
                    <p className="mt-2 text-[12px] text-gray-600 leading-relaxed">{n.detail}</p>
                  )}
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
