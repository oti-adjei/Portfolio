import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useContent } from '../../../admin/contexts/AdminContentContext';
import { PageHeader, SaveBar } from '../../../components/admin/ui';

type Section = 'hero' | 'form' | 'info' | 'map';

export default function AdminContact() {
  const { content, updateContent, saveSection } = useContent();
  const [activeSection, setActiveSection] = useState<Section>('hero');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const contactPage = content.contactPage;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection('contactPage');
      setHasChanges(false);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: 'hero' as Section, label: 'Hero Section', icon: 'ri-home-heart-line' },
    { id: 'form' as Section, label: 'Contact Form', icon: 'ri-mail-line' },
    { id: 'info' as Section, label: 'Contact Info', icon: 'ri-information-line' },
    { id: 'map' as Section, label: 'Map Settings', icon: 'ri-map-pin-line' }
  ];

  const updateHero = (field: string, value: any) => {
    const updated = {
      ...content,
      contactPage: {
        ...contactPage,
        hero: {
          ...contactPage.hero,
          [field]: value
        }
      }
    };
    updateContent(updated);
    setHasChanges(true);
  };

  const updateForm = (field: string, value: any) => {
    const updated = {
      ...content,
      contactPage: {
        ...contactPage,
        form: {
          ...contactPage.form,
          [field]: value
        }
      }
    };
    updateContent(updated);
    setHasChanges(true);
  };

  const updateContactInfo = (field: string, value: any) => {
    const updated = {
      ...content,
      contactPage: {
        ...contactPage,
        contactInfo: {
          ...contactPage.contactInfo,
          [field]: value
        }
      }
    };
    updateContent(updated);
    setHasChanges(true);
  };

  const updateMap = (field: string, value: any) => {
    const updated = {
      ...content,
      contactPage: {
        ...contactPage,
        map: {
          ...contactPage.map,
          [field]: value
        }
      }
    };
    updateContent(updated);
    setHasChanges(true);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <PageHeader eyebrow="Pages" title="Contact page" description="Contact details, form copy and socials." />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Section Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl ring-1 ring-black/5 p-4 lg:sticky lg:top-24">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Sections</h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-signal/10 text-signal'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <i className={`${section.icon} text-lg`}></i>
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Editor */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl ring-1 ring-black/5 p-6">
              {/* Hero Section */}
              {activeSection === 'hero' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Hero Section</h2>
                  
                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Label</label>
                    <input
                      type="text"
                      value={contactPage.hero.label}
                      onChange={(e) => updateHero('label', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Heading Lines</label>
                    <div className="space-y-3">
                      {contactPage.hero.headingLines.map((line, index) => (
                        <input
                          key={index}
                          type="text"
                          value={line}
                          onChange={(e) => {
                            const updated = [...contactPage.hero.headingLines];
                            updated[index] = e.target.value;
                            updateHero('headingLines', updated);
                          }}
                          placeholder={`Line ${index + 1}`}
                          className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Description</label>
                    <textarea
                      value={contactPage.hero.description}
                      onChange={(e) => updateHero('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>
                </div>
              )}

              {/* Contact Form Section */}
              {activeSection === 'form' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Contact Form Settings</h2>
                  
                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Form Title</label>
                    <input
                      type="text"
                      value={contactPage.form.title}
                      onChange={(e) => updateForm('title', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Form Fields</label>
                    <div className="space-y-4">
                      {contactPage.form.fields.map((field, index) => (
                        <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Label</label>
                              <input
                                type="text"
                                value={field.label}
                                onChange={(e) => {
                                  const updated = [...contactPage.form.fields];
                                  updated[index] = { ...updated[index], label: e.target.value };
                                  updateForm('fields', updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Placeholder</label>
                              <input
                                type="text"
                                value={field.placeholder}
                                onChange={(e) => {
                                  const updated = [...contactPage.form.fields];
                                  updated[index] = { ...updated[index], placeholder: e.target.value };
                                  updateForm('fields', updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => {
                                  const updated = [...contactPage.form.fields];
                                  updated[index] = { ...updated[index], required: e.target.checked };
                                  updateForm('fields', updated);
                                }}
                                className="w-4 h-4 rounded accent-signal"
                              />
                              <span className="text-xs text-gray-600">Required</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Submit Button Text</label>
                    <input
                      type="text"
                      value={contactPage.form.submitButton.label}
                      onChange={(e) => updateForm('submitButton', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Success Message</label>
                    <textarea
                      value={contactPage.form.messages.success}
                      onChange={(e) => updateForm('messages', { ...contactPage.form.messages, success: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Error Message</label>
                    <textarea
                      value={contactPage.form.messages.error}
                      onChange={(e) => updateForm('messages', { ...contactPage.form.messages, error: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>
                </div>
              )}

              {/* Contact Info Section */}
              {activeSection === 'info' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Contact Cards</label>
                    <div className="space-y-4">
                      {contactPage.contactInfo.cards.map((card, index) => (
                        <div key={card.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 bg-signal/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <i className={`${card.icon} text-xl text-signal`}></i>
                            </div>
                            <input
                              type="text"
                              value={card.label}
                              onChange={(e) => {
                                const updated = [...contactPage.contactInfo.cards];
                                updated[index] = { ...updated[index], label: e.target.value };
                                updateContactInfo('cards', updated);
                              }}
                              placeholder="Card Title"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-signal/50 focus:border-transparent"
                            />
                          </div>
                          <input
                            type="text"
                            value={card.value}
                            onChange={(e) => {
                              const updated = [...contactPage.contactInfo.cards];
                              updated[index] = { ...updated[index], value: e.target.value };
                              updateContactInfo('cards', updated);
                            }}
                            placeholder="Value"
                            className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50 mb-2"
                          />
                          <input
                            type="text"
                            value={card.link ?? ''}
                            onChange={(e) => {
                              const updated = [...contactPage.contactInfo.cards];
                              updated[index] = { ...updated[index], link: e.target.value };
                              updateContactInfo('cards', updated);
                            }}
                            placeholder="Link URL"
                            className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Social Links</label>
                    <div className="space-y-3">
                      {contactPage.contactInfo.socialLinks.map((social, index) => (
                        <div key={social.id} className="flex gap-3 items-center p-3 border border-gray-200 rounded-lg">
                          <i className={`${social.icon} text-xl text-gray-600`}></i>
                          <input
                            type="text"
                            value={social.platform}
                            onChange={(e) => {
                              const updated = [...contactPage.contactInfo.socialLinks];
                              updated[index] = { ...updated[index], platform: e.target.value };
                              updateContactInfo('socialLinks', updated);
                            }}
                            placeholder="Platform"
                            className="flex-1 px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                          />
                          <input
                            type="url"
                            value={social.url}
                            onChange={(e) => {
                              const updated = [...contactPage.contactInfo.socialLinks];
                              updated[index] = { ...updated[index], url: e.target.value };
                              updateContactInfo('socialLinks', updated);
                            }}
                            placeholder="URL"
                            className="flex-1 px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Availability Status</label>
                    <input
                      type="text"
                      value={contactPage.contactInfo.availability.status}
                      onChange={(e) => updateContactInfo('availability', { ...contactPage.contactInfo.availability, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>
                </div>
              )}

              {/* Map Section */}
              {activeSection === 'map' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Map Settings</h2>
                  
                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Map Title</label>
                    <input
                      type="text"
                      value={contactPage.map.title}
                      onChange={(e) => updateMap('title', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Google Maps Embed URL</label>
                    <textarea
                      value={contactPage.map.embedUrl}
                      onChange={(e) => updateMap('embedUrl', e.target.value)}
                      rows={4}
                      placeholder="Paste your Google Maps embed URL here"
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50 font-mono text-xs"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Get embed URL from Google Maps → Share → Embed a map
                    </p>
                  </div>

                  {contactPage.map.embedUrl && (
                    <div>
                      <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Preview</label>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <iframe
                          src={contactPage.map.embedUrl}
                          width="100%"
                          height="300"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

        <SaveBar onSave={() => void handleSave()} saving={isSaving} saved={justSaved} dirty={hasChanges} />
    </AdminLayout>
  );
}
