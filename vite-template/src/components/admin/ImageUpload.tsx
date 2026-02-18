import { useState } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  aspectRatio?: string;
}

export default function ImageUpload({ value, onChange, label, aspectRatio = '16/9' }: ImageUploadProps) {
  const [inputValue, setInputValue] = useState(value);
  const [showPreview, setShowPreview] = useState(!!value);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setInputValue(url);
    onChange(url);
    setShowPreview(!!url);
  };

  const handleRemove = () => {
    setInputValue('');
    onChange('');
    setShowPreview(false);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      <div className="space-y-3">
        <input
          type="text"
          value={inputValue}
          onChange={handleUrlChange}
          placeholder="Enter image URL"
          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />

        {showPreview && inputValue && (
          <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
            <div style={{ aspectRatio }} className="w-full">
              <img
                src={inputValue}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setShowPreview(false)}
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
