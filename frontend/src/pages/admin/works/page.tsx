
import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import FormInput from '../../../components/admin/FormInput';
import { useContent } from '../../../admin/contexts/AdminContentContext';
import type { SiteContent } from '../../../types/siteContent';

export default function AdminWorks() {
  const { content: globalContent, updateContent, saveSection } = useContent();
  const [content, setContent] = useState<SiteContent['worksPage']>(globalContent.worksPage);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setContent(globalContent.worksPage);
  }, [globalContent]);

  const handleSave = async () => {
    updateContent({ worksPage: content });
    await saveSection('worksPage');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCategoryChange = (index: number, value: string) => {
    const newCategories = [...content.categories];
    newCategories[index] = value;
    setContent({ ...content, categories: newCategories });
  };

  const addCategory = () => {
    setContent({
      ...content,
      categories: [...content.categories, 'NEW']
    });
  };

  const removeCategory = (index: number) => {
    const newCategories = content.categories.filter((_, i) => i !== index);
    setContent({ ...content, categories: newCategories });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Page Header</h2>
          <div className="space-y-4">
            <FormInput
              label="Page Title"
              value={content.title}
              onChange={(value) => setContent({ ...content, title: value })}
            />
            <FormInput
              label="Subtitle"
              value={content.subtitle}
              onChange={(value) => setContent({ ...content, subtitle: value })}
            />
          </div>
        </div>

        {/* Filter Categories */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filter Categories</h2>
            <button
              onClick={addCategory}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap text-sm"
            >
              + Add Category
            </button>
          </div>
          <div className="space-y-4">
            {content.categories.map((category, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1">
                  <FormInput
                    label={`Category ${index + 1}`}
                    value={category}
                    onChange={(value) => handleCategoryChange(index, value)}
                  />
                </div>
                {content.categories.length > 1 && (
                  <button
                    onClick={() => removeCategory(index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
