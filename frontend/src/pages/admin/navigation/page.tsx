import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Button, Card, Field, PageHeader, SaveBar } from '../../../components/admin/ui';
import { useContent } from '../../../admin/contexts/AdminContentContext';

export default function AdminNavigation() {
  const { content: site, updateContent, saveSection } = useContent();
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const content = site.navigation;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection('navigation');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setIsSaving(false);
    }
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
      <div className="max-w-[900px] mx-auto">
        <PageHeader
          eyebrow="Site chrome"
          title="Navigation"
          description="Menu items, logo text and the CTA button."
        />

        <div className="space-y-4">
          <Card title="Logo">
            <Field label="Logo text" value={content.logo.text} onChange={handleLogoChange} placeholder="Enter logo text" />
          </Card>

          <Card
            title="Menu items"
            actions={
              <Button icon="ri-add-line" onClick={handleAddMenuItem}>
                Add item
              </Button>
            }
          >
            <div className="space-y-3">
              {content.menuItems.map((item, index) => (
                <div key={item.id} className="flex items-end gap-3 rounded-xl ring-1 ring-black/5 p-3">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Label" value={item.label} onChange={(value) => handleMenuItemChange(index, 'label', value)} placeholder="Menu label" />
                    <Field label="Link" value={item.url} onChange={(value) => handleMenuItemChange(index, 'url', value)} placeholder="/path" />
                  </div>
                  <Button
                    variant="danger"
                    icon="ri-delete-bin-line"
                    onClick={() => handleRemoveMenuItem(index)}
                    aria-label={`Remove ${item.label}`}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card title="CTA button">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Button text" value={content.ctaButton.label} onChange={(value) => handleCtaChange('label', value)} placeholder="Button text" />
              <Field label="Button link" value={content.ctaButton.url} onChange={(value) => handleCtaChange('url', value)} placeholder="/path" />
            </div>
          </Card>
        </div>

        <SaveBar onSave={() => void handleSave()} saving={isSaving} saved={saved} />
      </div>
    </AdminLayout>
  );
}
