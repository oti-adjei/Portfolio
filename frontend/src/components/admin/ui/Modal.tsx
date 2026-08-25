import { useEffect, useRef, type ReactNode } from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
}

export default function Modal({ title, onClose, footer, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  useEffect(() => {
    panelRef.current
      ?.querySelector<HTMLElement>('input, textarea, select, button')
      ?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-2xl rounded-2xl bg-white ring-1 ring-black/5 shadow-lg max-h-[90vh] flex flex-col"
      >
        <header className="flex items-center justify-between gap-4 px-5 py-4 border-b border-black/5">
          <h2 className="text-[15px] font-semibold tracking-tight text-gray-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <i className="ri-close-line" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">{children}</div>

        {footer && (
          <footer className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-5 py-4 border-t border-black/5">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
