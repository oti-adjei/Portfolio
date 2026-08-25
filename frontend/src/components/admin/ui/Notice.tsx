import type { ReactNode } from 'react';

type Tone = 'success' | 'error' | 'info';

interface NoticeProps {
  tone?: Tone;
  children: ReactNode;
  onDismiss?: () => void;
}

const tones: Record<Tone, { wrap: string; icon: string }> = {
  success: { wrap: 'bg-emerald-50 text-emerald-800 ring-emerald-100', icon: 'ri-check-line' },
  error: { wrap: 'bg-red-50 text-red-800 ring-red-100', icon: 'ri-error-warning-line' },
  info: { wrap: 'bg-gray-50 text-gray-700 ring-gray-200', icon: 'ri-information-line' },
};

export default function Notice({ tone = 'info', children, onDismiss }: NoticeProps) {
  const config = tones[tone];
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-2.5 rounded-xl ring-1 px-4 py-3 text-[13px] ${config.wrap}`}
    >
      <i className={`${config.icon} mt-0.5 shrink-0`} aria-hidden="true" />
      <div className="flex-1">{children}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        >
          <i className="ri-close-line" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
