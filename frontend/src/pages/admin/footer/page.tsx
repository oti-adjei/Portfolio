import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Button, Card, Field, PageHeader, SaveBar } from '../../../components/admin/ui';
import { useContent } from '../../../admin/contexts/AdminContentContext';

export default function AdminFooter() {
  const { content: site, updateContent, saveSection } = useContent();
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const content = site.footer;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection('footer');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setIsSaving(false);
    }
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
      <div className="max-w-[900px] mx-auto">
        <PageHeader eyebrow="Site chrome" title="Footer" description="Logo, copyright line and footer links." />

        <div className="space-y-4">
          <Card title="Logo">
            <Field label="Logo text" value={content.logo.text} onChange={handleLogoChange} placeholder="Enter logo text" />
          </Card>

          <Card title="Copyright">
            <Field
              label="Copyright text"
              value={content.copyright}
              onChange={handleCopyrightChange}
              placeholder="\u00a9 2026 George Heavenson. All rights reserved."
            />
          </Card>

          <Card
            title="Footer links"
            actions={
              <Button icon="ri-add-line" onClick={handleAddLink}>
                Add link
              </Button>
            }
          >
            <div className="space-y-3">
              {content.links.map((link, index) => (
                <div key={link.id} className="flex items-end gap-3 rounded-xl ring-1 ring-black/5 p-3">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Label" value={link.label} onChange={(value) => handleLinkChange(index, 'label', value)} placeholder="Link label" />
                    <Field label="URL" type="url" value={link.url} onChange={(value) => handleLinkChange(index, 'url', value)} placeholder="https://…" />
                  </div>
                  <Button
                    variant="danger"
                    icon="ri-delete-bin-line"
                    onClick={() => handleRemoveLink(index)}
                    aria-label={`Remove ${link.label}`}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <SaveBar onSave={() => void handleSave()} saving={isSaving} saved={saved} />
      </div>
    </AdminLayout>
  );
}
