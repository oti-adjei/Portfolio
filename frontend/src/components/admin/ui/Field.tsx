import { useId } from 'react';

export type FieldOption = { value: string; label: string };

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  as?: 'input' | 'textarea' | 'select';
  type?: 'text' | 'email' | 'url' | 'number' | 'password' | 'date' | 'time';
  placeholder?: string;
  rows?: number;
  options?: FieldOption[];
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  error?: string;
  icon?: string;
}

const controlBase =
  'w-full min-h-11 px-4 py-2.5 text-[13px] rounded-xl bg-white ring-1 transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-500';

export default function Field({
  label,
  value,
  onChange,
  as = 'input',
  type = 'text',
  placeholder = '',
  rows = 4,
  options = [],
  required = false,
  disabled = false,
  hint,
  error,
  icon,
}: FieldProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const ring = error ? 'ring-red-300 focus:ring-red-400' : 'ring-gray-200 focus:ring-signal/50';

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[12px] font-medium text-gray-700">
        {label}
        {required && <span className="text-signal ml-1">*</span>}
      </label>

      <div className="relative">
        {icon && as === 'input' && (
          <i className={`${icon} absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400`} aria-hidden="true" />
        )}

        {as === 'textarea' ? (
          <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            required={required}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={`${controlBase} ${ring} resize-y leading-[1.7]`}
          />
        ) : as === 'select' ? (
          <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={`${controlBase} ${ring} pr-9 appearance-none`}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={`${controlBase} ${ring} ${icon ? 'pl-10' : ''}`}
          />
        )}

        {as === 'select' && (
          <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true" />
        )}
      </div>

      {error ? (
        <p id={`${id}-error`} className="text-[12px] text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[12px] text-gray-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
