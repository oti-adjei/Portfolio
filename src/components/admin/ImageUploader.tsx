import { useState } from 'react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  aspectRatio?: string;
}

export default function ImageUploader({ value, onChange, label, aspectRatio = '16/9' }: ImageUploaderProps) {
  const [inputValue, setInputValue] = useState(value);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleUrlSubmit = () => {
    onChange(inputValue);
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {/* Image Preview */}
      {value && (
        <div className="relative rounded-lg overflow-hidden border border-gray-200" style={{ aspectRatio }}>
          <img src={value} alt={label} className="w-full h-full object-cover" />
          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <i className="ri-delete-bin-line"></i>
          </button>
        </div>
      )}

      {/* URL Input Toggle */}
      {!showUrlInput ? (
        <button
          onClick={() => setShowUrlInput(true)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <i className="ri-link mr-2"></i>
          {value ? 'Change Image URL' : 'Add Image URL'}
        </button>
      ) : (
        <div className="space-y-2">
          <input
            type="url"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <div className="flex gap-2">
            <button
              onClick={handleUrlSubmit}
              className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors"
            >
              Apply
            </button>
            <button
              onClick={() => {
                setInputValue(value);
                setShowUrlInput(false);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
