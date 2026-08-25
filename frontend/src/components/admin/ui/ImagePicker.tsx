import { useState } from 'react';

interface ImagePickerProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspectRatio?: string;
  hint?: string;
}

export default function ImagePicker({
  label,
  value,
  onChange,
  aspectRatio = '16/9',
  hint,
}: ImagePickerProps) {
  const [broken, setBroken] = useState(false);

  const handleChange = (url: string) => {
    setBroken(false);
    onChange(url);
  };

  return (
    <div className="space-y-2">
      <label className="block text-[12px] font-medium text-gray-700" htmlFor={`image-${label}`}>
        {label}
      </label>

      <input
        id={`image-${label}`}
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="/assets/… or https://…"
        className="w-full min-h-11 px-4 py-2.5 text-[13px] rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
      />

      {value && (
        <div className="relative rounded-xl overflow-hidden ring-1 ring-black/5 bg-gray-50">
          {broken ? (
            <div style={{ aspectRatio }} className="w-full flex items-center justify-center text-[12px] text-gray-400 gap-2">
              <i className="ri-image-off-line" aria-hidden="true" />
              Image failed to load
            </div>
          ) : (
            <div style={{ aspectRatio }} className="w-full">
              <img
                src={value}
                alt=""
                className="w-full h-full object-cover"
                onError={() => setBroken(true)}
              />
            </div>
          )}
          <button
            type="button"
            onClick={() => handleChange('')}
            aria-label={`Remove ${label}`}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 ring-1 ring-black/5 text-gray-600 hover:text-red-600 inline-flex items-center justify-center transition-colors"
          >
            <i className="ri-close-line" aria-hidden="true" />
          </button>
        </div>
      )}

      {hint && <p className="text-[12px] text-gray-400">{hint}</p>}
    </div>
  );
}
