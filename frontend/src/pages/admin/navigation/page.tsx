import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import FormInput from '../../../components/admin/FormInput';
import { useContent } from '../../../admin/contexts/AdminContentContext';

export default function AdminNavigation() {
  const { content: site, updateContent, saveSection } = useContent();
  const [saved, setSaved] = useState(false);
  const content = site.navigation;

  const handleSave = async () => {
    await saveSection('navigation');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogoChange = (value: string) => {
    updateContent({ navigation: { ...content, logo: { ...content.logo, text: value } } });
  };

  const handleMenuItemChange = (index: number, field: 'label' | 'url', value: string) => {
    const newItems = [...content.menuItems];
    newItems[index] = { ...newItems[index], [field]: value };
    updateContent({ navigation: { ...content, menuItems: newItems } });
  };

  const handleAddMenuItem = () => {
    updateContent({
      navigation: {
        ...content,
        menuItems: [...content.menuItems, { id: `nav-${Date.now()}`, label: 'New Item', url: '/new' }],
      },
    });
  };

  const handleRemoveMenuItem = (index: number) => {
    const newItems = content.menuItems.filter((_, i) => i !== index);
    updateContent({ navigation: { ...content, menuItems: newItems } });
  };

  const handleCtaChange = (field: 'label' | 'url', value: string) => {
    updateContent({ navigation: { ...content, ctaButton: { ...content.ctaButton, [field]: value } } });
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Navigation Settings</h1>
            <p className="text-gray-600 mt-2">Manage your site navigation menu and logo</p>
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Menu Items</h2>
              <button onClick={handleAddMenuItem} className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap flex items-center gap-2">
                <i className="ri-add-line"></i>
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {content.menuItems.map((item, index) => (
                <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <FormInput label="Label" value={item.label} onChange={(value) => handleMenuItemChange(index, 'label', value)} placeholder="Menu label" />
                      <FormInput label="Link" value={item.url} onChange={(value) => handleMenuItemChange(index, 'url', value)} placeholder="/path" type="text" />
                    </div>
                    <button onClick={() => handleRemoveMenuItem(index)} className="mt-8 w-10 h-10 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <i className="ri-delete-bin-line text-lg"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">CTA Button</h2>
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Button Text" value={content.ctaButton.label} onChange={(value) => handleCtaChange('label', value)} placeholder="Button text" />
              <FormInput label="Button Link" value={content.ctaButton.url} onChange={(value) => handleCtaChange('url', value)} placeholder="/path" type="text" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
