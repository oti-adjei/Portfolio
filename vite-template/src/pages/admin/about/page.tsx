import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useContent } from '../../../contexts/ContentContext';
import ImageUploader from '../../../components/admin/ImageUploader';

type Section = 'hero' | 'bio' | 'expertise' | 'journey' | 'philosophy' | 'cta';

export default function AdminAbout() {
  const { content, updateContent } = useContent();
  const [activeSection, setActiveSection] = useState<Section>('hero');
  const [hasChanges, setHasChanges] = useState(false);

  const aboutPage = content.aboutPage;

  const handleSave = () => {
    setHasChanges(false);
  };

  const sections = [
    { id: 'hero' as Section, label: 'Hero Section', icon: 'ri-user-star-line' },
    { id: 'bio' as Section, label: 'Bio Section', icon: 'ri-file-text-line' },
    { id: 'expertise' as Section, label: 'Expertise Cards', icon: 'ri-lightbulb-line' },
    { id: 'journey' as Section, label: 'Journey Timeline', icon: 'ri-road-map-line' },
    { id: 'philosophy' as Section, label: 'Philosophy', icon: 'ri-chat-quote-line' },
    { id: 'cta' as Section, label: 'Connect CTA', icon: 'ri-mail-send-line' }
  ];

  const updateHero = (field: string, value: any) => {
    const updated = {
      ...content,
      aboutPage: {
        ...aboutPage,
        hero: {
          ...aboutPage.hero,
          [field]: value
        }
      }
    };
    updateContent(updated);
    setHasChanges(true);
  };

  const updateBio = (field: string, value: any) => {
    const updated = {
      ...content,
      aboutPage: {
        ...aboutPage,
        bio: {
          ...aboutPage.bio,
          [field]: value
        }
      }
    };
    updateContent(updated);
    setHasChanges(true);
  };

  const updateExpertise = (field: string, value: any) => {
    const updated = {
      ...content,
      aboutPage: {
        ...aboutPage,
        expertise: {
          ...aboutPage.expertise,
          [field]: value
        }
      }
    };
    updateContent(updated);
    setHasChanges(true);
  };

  const updateJourney = (field: string, value: any) => {
    const updated = {
      ...content,
      aboutPage: {
        ...aboutPage,
        journey: {
          ...aboutPage.journey,
          [field]: value
        }
      }
    };
    updateContent(updated);
    setHasChanges(true);
  };

  const updatePhilosophy = (field: string, value: any) => {
    const updated = {
      ...content,
      aboutPage: {
        ...aboutPage,
        philosophy: {
          ...aboutPage.philosophy,
          [field]: value
        }
      }
    };
    updateContent(updated);
    setHasChanges(true);
  };

  const updateConnectCTA = (field: string, value: any) => {
    const updated = {
      ...content,
      aboutPage: {
        ...aboutPage,
        connectCTA: {
          ...aboutPage.connectCTA,
          [field]: value
        }
      }
    };
    updateContent(updated);
    setHasChanges(true);
  };

  const addTimelineItem = () => {
    const newItem = {
      id: `timeline-${Date.now()}`,
      year: new Date().getFullYear().toString(),
      title: 'New Milestone',
      description: 'Description of this milestone'
    };
    updateJourney('timeline', [...aboutPage.journey.timeline, newItem]);
  };

  const removeTimelineItem = (index: number) => {
    const updated = aboutPage.journey.timeline.filter((_, i) => i !== index);
    updateJourney('timeline', updated);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">About Page Editor</h1>
            <p className="text-sm text-gray-600 mt-1">Edit all sections of your about page</p>
          </div>
          {hasChanges && (
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors inline-flex items-center gap-2"
            >
              <i className="ri-save-line"></i>
              Changes Saved
            </button>
          )}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Section Navigation */}
          <div className="col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Sections</h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-teal-50 text-teal-600'
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
          <div className="col-span-9">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {/* Hero Section */}
              {activeSection === 'hero' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Hero Section</h2>
                  
                  <ImageUploader
                    value={aboutPage.hero.avatar.url}
                    onChange={(url) => updateHero('avatar', { ...aboutPage.hero.avatar, url })}
                    label="Avatar Image"
                    aspectRatio="1/1"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={aboutPage.hero.name}
                      onChange={(e) => updateHero('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <input
                      type="text"
                      value={aboutPage.hero.role}
                      onChange={(e) => updateHero('role', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                    <textarea
                      value={aboutPage.hero.tagline}
                      onChange={(e) => updateHero('tagline', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Bio Section */}
              {activeSection === 'bio' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Bio Section</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Bio Paragraphs</label>
                    <div className="space-y-3">
                      {aboutPage.bio.paragraphs.map((paragraph, index) => (
                        <div key={index}>
                          <label className="block text-xs text-gray-500 mb-1">Paragraph {index + 1}</label>
                          <textarea
                            value={paragraph}
                            onChange={(e) => {
                              const updated = [...aboutPage.bio.paragraphs];
                              updated[index] = e.target.value;
                              updateBio('paragraphs', updated);
                            }}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Expertise Section */}
              {activeSection === 'expertise' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Expertise Cards</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                    <input
                      type="text"
                      value={aboutPage.expertise.sectionTitle}
                      onChange={(e) => updateExpertise('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Expertise Items</label>
                    <div className="space-y-4">
                      {aboutPage.expertise.items.map((item, index) => (
                        <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                              <i className={`${item.icon} text-xl text-teal-500`}></i>
                            </div>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const updated = [...aboutPage.expertise.items];
                                updated[index] = { ...updated[index], title: e.target.value };
                                updateExpertise('items', updated);
                              }}
                              placeholder="Expertise Title"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                          </div>
                          <textarea
                            value={item.description}
                            onChange={(e) => {
                              const updated = [...aboutPage.expertise.items];
                              updated[index] = { ...updated[index], description: e.target.value };
                              updateExpertise('items', updated);
                            }}
                            rows={3}
                            placeholder="Expertise Description"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Journey Timeline Section */}
              {activeSection === 'journey' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Journey Timeline</h2>
                    <button
                      onClick={addTimelineItem}
                      className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors inline-flex items-center gap-2"
                    >
                      <i className="ri-add-line"></i>
                      Add Milestone
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                    <input
                      type="text"
                      value={aboutPage.journey.sectionTitle}
                      onChange={(e) => updateJourney('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Timeline Items</label>
                    <div className="space-y-4">
                      {aboutPage.journey.timeline.map((item, index) => (
                        <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 grid grid-cols-4 gap-3">
                              <input
                                type="text"
                                value={item.year}
                                onChange={(e) => {
                                  const updated = [...aboutPage.journey.timeline];
                                  updated[index] = { ...updated[index], year: e.target.value };
                                  updateJourney('timeline', updated);
                                }}
                                placeholder="Year"
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              />
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => {
                                  const updated = [...aboutPage.journey.timeline];
                                  updated[index] = { ...updated[index], title: e.target.value };
                                  updateJourney('timeline', updated);
                                }}
                                placeholder="Title"
                                className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              />
                            </div>
                            <button
                              onClick={() => removeTimelineItem(index)}
                              className="ml-3 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                          <textarea
                            value={item.description}
                            onChange={(e) => {
                              const updated = [...aboutPage.journey.timeline];
                              updated[index] = { ...updated[index], description: e.target.value };
                              updateJourney('timeline', updated);
                            }}
                            rows={2}
                            placeholder="Description"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Philosophy Section */}
              {activeSection === 'philosophy' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Philosophy Section</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
                    <input
                      type="text"
                      value={aboutPage.philosophy.label}
                      onChange={(e) => updatePhilosophy('label', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quote</label>
                    <textarea
                      value={aboutPage.philosophy.quote}
                      onChange={(e) => updatePhilosophy('quote', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Connect CTA Section */}
              {activeSection === 'cta' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Connect CTA Section</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                    <input
                      type="text"
                      value={aboutPage.connectCTA.heading}
                      onChange={(e) => updateConnectCTA('heading', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={aboutPage.connectCTA.description}
                      onChange={(e) => updateConnectCTA('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                      <input
                        type="text"
                        value={aboutPage.connectCTA.ctaButton.label}
                        onChange={(e) => updateConnectCTA('ctaButton', {
                          ...aboutPage.connectCTA.ctaButton,
                          label: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Button URL</label>
                      <input
                        type="text"
                        value={aboutPage.connectCTA.ctaButton.url}
                        onChange={(e) => updateConnectCTA('ctaButton', {
                          ...aboutPage.connectCTA.ctaButton,
                          url: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
