import type { ReactNode } from 'react';

type Tone = 'cream' | 'signal' | 'outline' | 'muted' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  tone?: Tone;
  icon?: string;
  children: ReactNode;
}

const tones: Record<Tone, string> = {
  cream: 'bg-cream-surface text-gray-700',
  signal: 'bg-signal/10 text-signal',
  outline: 'ring-1 ring-gray-200 text-gray-600',
  muted: 'bg-gray-100 text-gray-600',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
  info: 'bg-signal-purple/10 text-signal-purple',
};

export default function Badge({ tone = 'cream', icon, children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] ${tones[tone]}`}>
      {icon && <i className={icon} aria-hidden="true" />}
      {children}
    </span>
  );
}
