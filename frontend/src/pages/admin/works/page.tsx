import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useContent } from '../../../admin/contexts/AdminContentContext';
import { Button, Card, Field, PageHeader, SaveBar } from '../../../components/admin/ui';
import type { SiteContent } from '../../../types/siteContent';

export default function AdminWorks() {
  const { content: globalContent, updateContent, saveSection } = useContent();
  const [content, setContent] = useState<SiteContent['worksPage']>(globalContent.worksPage);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setContent(globalContent.worksPage);
  }, [globalContent]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      updateContent({ worksPage: content });
      await saveSection('worksPage');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCategoryChange = (index: number, value: string) => {
    const newCategories = [...content.categories];
    newCategories[index] = value;
    setContent({ ...content, categories: newCategories });
  };

  const addCategory = () => {
    setContent({ ...content, categories: [...content.categories, 'NEW'] });
  };

  const removeCategory = (index: number) => {
    setContent({ ...content, categories: content.categories.filter((_, i) => i !== index) });
  };

  return (
    <AdminLayout>
      <div className="max-w-[900px] mx-auto">
        <PageHeader eyebrow="Pages" title="Works page" description="Heading and filter categories." />

        <div className="space-y-4">
          <Card title="Page header">
            <div className="space-y-4">
              <Field
                label="Page title"
                value={content.title}
                onChange={(value) => setContent({ ...content, title: value })}
              />
              <Field
                label="Subtitle"
                value={content.subtitle}
                onChange={(value) => setContent({ ...content, subtitle: value })}
              />
            </div>
          </Card>

          <Card
            title="Filter categories"
            description="Shown as filter pills on the public works page."
            actions={
              <Button icon="ri-add-line" onClick={addCategory}>
                Add category
              </Button>
            }
          >
            <div className="space-y-3">
              {content.categories.map((category, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Field
                      label={`Category ${index + 1}`}
                      value={category}
                      onChange={(value) => handleCategoryChange(index, value)}
                    />
                  </div>
                  {content.categories.length > 1 && (
                    <Button
                      variant="danger"
                      icon="ri-delete-bin-line"
                      onClick={() => removeCategory(index)}
                      aria-label={`Remove category ${index + 1}`}
                    />
                  )}
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
