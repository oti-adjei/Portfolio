import { useState } from 'react';

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  label: string;
}

const commonIcons = [
  'ri-home-line',
  'ri-briefcase-line',
  'ri-user-line',
  'ri-mail-line',
  'ri-phone-line',
  'ri-map-pin-line',
  'ri-code-line',
  'ri-palette-line',
  'ri-smartphone-line',
  'ri-computer-line',
  'ri-tools-line',
  'ri-lightbulb-line',
  'ri-rocket-line',
  'ri-star-line',
  'ri-heart-line',
  'ri-settings-line',
  'ri-search-line',
  'ri-shopping-cart-line',
  'ri-camera-line',
  'ri-image-line',
  'ri-file-line',
  'ri-folder-line',
  'ri-download-line',
  'ri-upload-line',
  'ri-share-line',
  'ri-link-line',
  'ri-external-link-line',
  'ri-arrow-right-line',
  'ri-arrow-left-line',
  'ri-check-line',
  'ri-close-line',
  'ri-add-line',
  'ri-subtract-line',
];

export default function IconPicker({ value, onChange, label }: IconPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [customIcon, setCustomIcon] = useState(value);

  const handleIconSelect = (icon: string) => {
    onChange(icon);
    setCustomIcon(icon);
    setShowPicker(false);
  };

  const handleCustomIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const icon = e.target.value;
    setCustomIcon(icon);
    onChange(icon);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={customIcon}
            onChange={handleCustomIconChange}
            placeholder="e.g., ri-home-line"
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <i className={value || 'ri-grid-line'}></i>
        </button>
        
        {value && (
          <div className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg bg-gray-50">
            <i className={value + ' text-xl'}></i>
          </div>
        )}
      </div>

      {showPicker && (
        <div className="p-4 border border-gray-300 rounded-lg bg-white max-h-64 overflow-y-auto">
          <div className="grid grid-cols-8 gap-2">
            {commonIcons.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => handleIconSelect(icon)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all ${
                  value === icon
                    ? 'border-teal-500 bg-teal-50 text-teal-600'
                    : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                }`}
              >
                <i className={icon + ' text-lg'}></i>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
