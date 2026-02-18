import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import FormInput from '../../../components/admin/FormInput';
import { siteContent } from '../../../mocks/siteContent';
import type { SiteContent } from '../../../types/siteContent';

export default function AdminFooter() {
  const [content, setContent] = useState<SiteContent['footer']>(siteContent.footer);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('siteContent');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.footer) {
        setContent(parsed.footer);
      }
    }
  }, []);

  const handleSave = () => {
    const stored = localStorage.getItem('siteContent');
    const currentContent = stored ? JSON.parse(stored) : { ...siteContent };
    currentContent.footer = content;
    localStorage.setItem('siteContent', JSON.stringify(currentContent));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogoChange = (value: string) => {
    setContent({ ...content, logo: { ...content.logo, text: value } });
  };

  const handleCopyrightChange = (value: string) => {
    setContent({ ...content, copyright: value });
  };

  const handleLinkChange = (index: number, field: 'label' | 'url', value: string) => {
    const newLinks = [...content.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setContent({ ...content, links: newLinks });
  };

  const handleAddLink = () => {
    setContent({
      ...content,
      links: [...content.links, { id: `footer-link-${Date.now()}`, label: 'New Link', url: '#' }],
    });
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = content.links.filter((_, i) => i !== index);
    setContent({ ...content, links: newLinks });
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Footer Settings</h1>
            <p className="text-gray-600 mt-2">Manage your site footer content</p>
          </div>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <i className="ri-save-line"></i>
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        <div className="space-y-8">
          {/* Logo Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Logo</h2>
            <FormInput
              label="Logo Text"
              value={content.logo.text}
              onChange={handleLogoChange}
              placeholder="Enter logo text"
            />
          </div>

          {/* Copyright Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Copyright</h2>
            <FormInput
              label="Copyright Text"
              value={content.copyright}
              onChange={handleCopyrightChange}
              placeholder="© 2024 Your Name. All rights reserved."
            />
          </div>

          {/* Footer Links Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Footer Links</h2>
              <button
                onClick={handleAddLink}
                className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap flex items-center gap-2"
              >
                <i className="ri-add-line"></i>
                Add Link
              </button>
            </div>

            <div className="space-y-4">
              {content.links.map((link, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <FormInput
                        label="Label"
                        value={link.label}
                        onChange={(value) => handleLinkChange(index, 'label', value)}
                        placeholder="Link label"
                      />
                      <FormInput
                        label="URL"
                        value={link.url}
                        onChange={(value) => handleLinkChange(index, 'url', value)}
                        placeholder="https://..."
                        type="url"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveLink(index)}
                      className="mt-8 w-10 h-10 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <i className="ri-delete-bin-line text-lg"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
