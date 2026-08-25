import { useRef, useState, type DragEvent } from 'react';
import { useAuth } from '../../../admin/contexts/AdminAuthContext';
import { uploadImage } from '../../../admin/services/adminApi';
import { resizeToWebp } from '../../../shared/images/resize';
import { isMockMode } from '../../../shared/config/runtime';

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: 'projects' | 'me' | 'brand';
  aspectRatio?: string;
  hint?: string;
}

type Stage = 'idle' | 'resizing' | 'uploading' | 'error';

export default function ImageField({
  label,
  value,
  onChange,
  folder = 'projects',
  aspectRatio = '16/9',
  hint,
}: ImageFieldProps) {
  const { token } = useAuth();
  const [broken, setBroken] = useState(false);
  const [stage, setStage] = useState<Stage>('idle');
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const setUrl = (url: string) => {
    setBroken(false);
    onChange(url);
  };

  const handleFile = async (file: File) => {
    setError('');

    try {
      setStage('resizing');
      const blob = await resizeToWebp(file);

      if (isMockMode()) {
        setUrl(URL.createObjectURL(blob));
        setStage('idle');
        return;
      }

      if (!token) throw new Error('Not authenticated');

      setStage('uploading');
      const result = await uploadImage(token, blob, file.name, folder);
      setUrl(result.url);
      setStage('idle');
    } catch (err) {
      console.error('Image upload failed:', err);
      setError(err instanceof Error ? err.message : 'Upload failed.');
      setStage('error');
    }
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) void handleFile(file);
  };

  const busy = stage === 'resizing' || stage === 'uploading';

  return (
    <div className="space-y-2">
      <label className="block text-[12px] font-medium text-gray-700" htmlFor={`image-${label}`}>
        {label}
      </label>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`rounded-xl border border-dashed px-4 py-5 text-center transition-colors ${
          dragging ? 'border-signal bg-signal/5' : 'border-gray-300'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = '';
          }}
        />

        {busy ? (
          <p className="text-[13px] text-gray-500 inline-flex items-center gap-2">
            <i className="ri-loader-4-line animate-spin" aria-hidden="true" />
            {stage === 'resizing' ? 'Preparing image…' : 'Uploading…'}
          </p>
        ) : (
          <>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-[13px] text-gray-700 underline underline-offset-4 hover:text-signal transition-colors"
            >
              Choose an image
            </button>
            <p className="mt-1 text-[12px] text-gray-400">
              or drop one here · PNG, JPEG or WebP · resized to 1600px WebP
            </p>
          </>
        )}
      </div>

      {error && <p className="text-[12px] text-red-600">{error}</p>}

      {/* URL field — still how you point at an existing or external image */}
      <input
        id={`image-${label}`}
        type="text"
        value={value}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://img.hearvie.dev/… or /assets/…"
        className="w-full min-h-11 px-4 py-2.5 text-[13px] rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
      />

      {value && (
        <div className="relative rounded-xl overflow-hidden ring-1 ring-black/5 bg-gray-50">
          {broken ? (
            <div
              style={{ aspectRatio }}
              className="w-full flex items-center justify-center text-[12px] text-gray-400 gap-2"
            >
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
            onClick={() => setUrl('')}
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
