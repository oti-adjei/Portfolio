import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import FormInput from '../../../components/admin/FormInput';
import { useContent } from '../../../admin/contexts/AdminContentContext';

export default function AdminFooter() {
  const { content: site, updateContent, saveSection } = useContent();
  const [saved, setSaved] = useState(false);
  const content = site.footer;

  const handleSave = async () => {
    await saveSection('footer');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogoChange = (value: string) => {
    updateContent({ footer: { ...content, logo: { ...content.logo, text: value } } });
  };

  const handleCopyrightChange = (value: string) => {
    updateContent({ footer: { ...content, copyright: value } });
  };

  const handleLinkChange = (index: number, field: 'label' | 'url', value: string) => {
    const newLinks = [...content.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    updateContent({ footer: { ...content, links: newLinks } });
  };

  const handleAddLink = () => {
    updateContent({
      footer: {
        ...content,
        links: [...content.links, { id: `footer-link-${Date.now()}`, label: 'New Link', url: '#' }],
      },
    });
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = content.links.filter((_, i) => i !== index);
    updateContent({ footer: { ...content, links: newLinks } });
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
            onClick={() => void handleSave()}
            className="px-6 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <i className="ri-save-line"></i>
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Logo</h2>
            <FormInput label="Logo Text" value={content.logo.text} onChange={handleLogoChange} placeholder="Enter logo text" />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Copyright</h2>
            <FormInput label="Copyright Text" value={content.copyright} onChange={handleCopyrightChange} placeholder="© 2024 Your Name. All rights reserved." />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Footer Links</h2>
              <button onClick={handleAddLink} className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap flex items-center gap-2">
                <i className="ri-add-line"></i>
                Add Link
              </button>
            </div>

            <div className="space-y-4">
              {content.links.map((link, index) => (
                <div key={link.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <FormInput label="Label" value={link.label} onChange={(value) => handleLinkChange(index, 'label', value)} placeholder="Link label" />
                      <FormInput label="URL" value={link.url} onChange={(value) => handleLinkChange(index, 'url', value)} placeholder="https://..." type="url" />
                    </div>
                    <button onClick={() => handleRemoveLink(index)} className="mt-8 w-10 h-10 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
