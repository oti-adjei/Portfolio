import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  padded?: boolean;
  children: ReactNode;
}

export default function Card({
  title,
  description,
  actions,
  footer,
  padded = true,
  children,
}: CardProps) {
  return (
    <section className="rounded-2xl ring-1 ring-black/5 bg-white overflow-hidden">
      {(title || actions) && (
        <header className="flex items-start justify-between gap-4 px-5 py-4 border-b border-black/5">
          <div>
            {title && <h2 className="text-[15px] font-semibold tracking-tight text-gray-900">{title}</h2>}
            {description && <p className="mt-0.5 text-[13px] text-gray-500">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </header>
      )}
      <div className={padded ? 'p-5' : ''}>{children}</div>
      {footer && <footer className="px-5 py-3 border-t border-black/5 bg-gray-50/50">{footer}</footer>}
    </section>
  );
}
