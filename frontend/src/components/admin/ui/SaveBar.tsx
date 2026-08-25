import Button from './Button';

interface SaveBarProps {
  onSave: () => void;
  saving?: boolean;
  saved?: boolean;
  dirty?: boolean;
  label?: string;
}

export default function SaveBar({
  onSave,
  saving = false,
  saved = false,
  dirty = true,
  label = 'Save changes',
}: SaveBarProps) {
  return (
    <div className="sticky bottom-0 z-20 mt-6 -mx-4 sm:-mx-5 md:-mx-6 px-4 sm:px-5 md:px-6 py-3 bg-white/85 backdrop-blur-md border-t border-black/5 flex items-center justify-end gap-3">
      <span aria-live="polite" className="text-[12px] text-gray-500">
        {saved ? (
          <span className="text-emerald-600 inline-flex items-center gap-1">
            <i className="ri-check-line" aria-hidden="true" />
            Saved
          </span>
        ) : dirty ? (
          'Unsaved changes'
        ) : null}
      </span>
      <Button variant="primary" icon="ri-save-line" loading={saving} onClick={onSave}>
        {label}
      </Button>
    </div>
  );
}
