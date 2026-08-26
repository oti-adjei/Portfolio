import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useContent } from '../../../admin/contexts/AdminContentContext';
import { PageHeader, SaveBar } from '../../../components/admin/ui';
import { ImageField } from '../../../components/admin/ui';

type Section = 'hero' | 'about' | 'skills' | 'featured' | 'services' | 'stats' | 'cta';

export default function AdminHome() {
  const { content, updateContent, saveSection } = useContent();
  const [activeSection, setActiveSection] = useState<Section>('hero');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const homePage = content.homePage;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection('homePage');
      setHasChanges(false);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: 'hero' as Section, label: 'Hero Section', icon: 'ri-home-heart-line' },
    { id: 'about' as Section, label: 'About Section', icon: 'ri-user-line' },
    { id: 'skills' as Section, label: 'Skills Section', icon: 'ri-star-line' },
    { id: 'featured' as Section, label: 'Featured Works', icon: 'ri-gallery-line' },
    { id: 'services' as Section, label: 'Services', icon: 'ri-service-line' },
    { id: 'stats' as Section, label: 'Stats', icon: 'ri-bar-chart-line' },
    { id: 'cta' as Section, label: 'Contact CTA', icon: 'ri-mail-send-line' }
  ];

  const updateHero = (field: string, value: any) => {
    const updated = {
      ...content,
      homePage: {
        ...homePage,
        hero: {
          ...homePage.hero,
          [field]: value
        }
      }
    };
    updateContent(updated);
    setHasChanges(true);
  };

  const updateAbout = (field: string, value: any) => {
    const updated = {
      ...content,
      homePage: {
        ...homePage,
        about: {
          ...homePage.about,
          [field]: value
        }
      }
    };
    updateContent(updated);
    setHasChanges(true);
  };

  const updateSkills = (field: string, value: any) => {
    const updated = {
      ...content,
      homePage: {
        ...homePage,
        skills: {
          ...homePage.skills,
          [field]: value
        }
      }
    };
    updateContent(updated);
    setHasChanges(true);
  };

  const updateFeaturedWorks = (field: string, value: any) => {
    const updated = {
      ...content,
      homePage: {
        ...homePage,
        featuredWorks: {
          ...homePage.featuredWorks,
          [field]: value
        }
      }
    };
    updateContent(updated);
    setHasChanges(true);
  };

  const updateServices = (field: string, value: any) => {
    const updated = {
      ...content,
      homePage: {
        ...homePage,
        services: {
          ...homePage.services,
          [field]: value
        }
      }
    };
    updateContent(updated);
    setHasChanges(true);
  };

  const updateStats = (field: string, value: any) => {
    const updated = {
      ...content,
      homePage: {
        ...homePage,
        stats: {
          ...homePage.stats,
          [field]: value
        }
      }
    };
    updateContent(updated);
    setHasChanges(true);
  };

  const updateContactCTA = (field: string, value: any) => {
    const updated = {
      ...content,
      homePage: {
        ...homePage,
        contactCTA: {
          ...homePage.contactCTA,
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
        <PageHeader eyebrow="Pages" title="Home page" description="Hero, about, skills, featured work, services, stats and CTA." />

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
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Badge Text</label>
                    <input
                      type="text"
                      value={homePage.hero.badge}
                      onChange={(e) => updateHero('badge', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Main Heading</label>
                    <input
                      type="text"
                      value={homePage.hero.heading}
                      onChange={(e) => updateHero('heading', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Subtitle</label>
                    <textarea
                      value={homePage.hero.subtitle}
                      onChange={(e) => updateHero('subtitle', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Primary Button Text</label>
                      <input
                        type="text"
                        value={homePage.hero.ctaButton.label}
                        onChange={(e) => updateHero('ctaButton', { ...homePage.hero.ctaButton, label: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Primary Button URL</label>
                      <input
                        type="text"
                        value={homePage.hero.ctaButton.url}
                        onChange={(e) => updateHero('ctaButton', { ...homePage.hero.ctaButton, url: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Secondary Button Text</label>
                      <input
                        type="text"
                        value={homePage.hero.secondaryButton.label}
                        onChange={(e) => updateHero('secondaryButton', { ...homePage.hero.secondaryButton, label: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Secondary Button URL</label>
                      <input
                        type="text"
                        value={homePage.hero.secondaryButton.url}
                        onChange={(e) => updateHero('secondaryButton', { ...homePage.hero.secondaryButton, url: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                      />
                    </div>
                  </div>

                  <ImageField
                    value={homePage.hero.image.url}
                    onChange={(url) => updateHero('image', { ...homePage.hero.image, url })}
                    label="Hero Image"
                    folder="me"
                    aspectRatio="4/5"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Social Icons</label>
                    <div className="space-y-3">
                      {homePage.hero.socialIcons.map((social, index) => (
                        <div key={social.id} className="flex gap-3 items-center p-3 border border-gray-200 rounded-lg">
                          <i className={`${social.icon} text-xl text-gray-600`}></i>
                          <input
                            type="text"
                            value={social.platform}
                            onChange={(e) => {
                              const updated = [...homePage.hero.socialIcons];
                              updated[index] = { ...updated[index], platform: e.target.value };
                              updateHero('socialIcons', updated);
                            }}
                            placeholder="Platform"
                            className="flex-1 px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                          />
                          <input
                            type="url"
                            value={social.url}
                            onChange={(e) => {
                              const updated = [...homePage.hero.socialIcons];
                              updated[index] = { ...updated[index], url: e.target.value };
                              updateHero('socialIcons', updated);
                            }}
                            placeholder="URL"
                            className="flex-1 px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* About Section */}
              {activeSection === 'about' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">About Section</h2>
                  
                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Section Title</label>
                    <input
                      type="text"
                      value={homePage.about.sectionTitle}
                      onChange={(e) => updateAbout('sectionTitle', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Name</label>
                    <input
                      type="text"
                      value={homePage.about.name}
                      onChange={(e) => updateAbout('name', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Role</label>
                    <input
                      type="text"
                      value={homePage.about.role}
                      onChange={(e) => updateAbout('role', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Bio Paragraphs</label>
                    <div className="space-y-3">
                      {homePage.about.bio.map((paragraph, index) => (
                        <textarea
                          key={index}
                          value={paragraph}
                          onChange={(e) => {
                            const updated = [...homePage.about.bio];
                            updated[index] = e.target.value;
                            updateAbout('bio', updated);
                          }}
                          rows={3}
                          placeholder={`Paragraph ${index + 1}`}
                          className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Tools & Technologies</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {homePage.about.tools.map((tool, index) => (
                        <input
                          key={tool.id}
                          type="text"
                          value={tool.name}
                          onChange={(e) => {
                            const updated = [...homePage.about.tools];
                            updated[index] = { ...updated[index], name: e.target.value };
                            updateAbout('tools', updated);
                          }}
                          className="px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Skills Section */}
              {activeSection === 'skills' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Skills Section</h2>
                  
                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Title</label>
                    <input
                      type="text"
                      value={homePage.skills.title}
                      onChange={(e) => updateSkills('title', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Subtitle</label>
                    <input
                      type="text"
                      value={homePage.skills.subtitle}
                      onChange={(e) => updateSkills('subtitle', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Skill Clusters</label>
                    <div className="space-y-4">
                      {homePage.skills.clusters.map((cluster, clusterIndex) => (
                        <div key={cluster.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className="w-6 h-6 rounded"
                              style={{ backgroundColor: cluster.color }}
                            ></div>
                            <input
                              type="text"
                              value={cluster.name}
                              onChange={(e) => {
                                const updated = [...homePage.skills.clusters];
                                updated[clusterIndex] = { ...updated[clusterIndex], name: e.target.value };
                                updateSkills('clusters', updated);
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-signal/50 focus:border-transparent"
                            />
                          </div>
                          <div className="space-y-2">
                            {cluster.skills.map((skill, skillIndex) => (
                              <div key={skill.id} className="flex items-center gap-3">
                                <input
                                  type="text"
                                  value={skill.name}
                                  onChange={(e) => {
                                    const updated = [...homePage.skills.clusters];
                                    updated[clusterIndex].skills[skillIndex] = {
                                      ...updated[clusterIndex].skills[skillIndex],
                                      name: e.target.value
                                    };
                                    updateSkills('clusters', updated);
                                  }}
                                  className="flex-1 px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                                />
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={skill.proficiency}
                                  onChange={(e) => {
                                    const updated = [...homePage.skills.clusters];
                                    updated[clusterIndex].skills[skillIndex] = {
                                      ...updated[clusterIndex].skills[skillIndex],
                                      proficiency: parseInt(e.target.value)
                                    };
                                    updateSkills('clusters', updated);
                                  }}
                                  className="w-20 px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                                />
                                <span className="text-sm text-gray-600">%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Featured Works Section */}
              {activeSection === 'featured' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Featured Works</h2>
                  
                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Title</label>
                    <input
                      type="text"
                      value={homePage.featuredWorks.title}
                      onChange={(e) => updateFeaturedWorks('title', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Subtitle</label>
                    <input
                      type="text"
                      value={homePage.featuredWorks.subtitle}
                      onChange={(e) => updateFeaturedWorks('subtitle', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Maximum Rows</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={homePage.featuredWorks.displaySettings.maxRows}
                      onChange={(e) => updateFeaturedWorks('displaySettings', {
                        ...homePage.featuredWorks.displaySettings,
                        maxRows: parseInt(e.target.value)
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="randomize"
                      checked={homePage.featuredWorks.displaySettings.randomize}
                      onChange={(e) => updateFeaturedWorks('displaySettings', {
                        ...homePage.featuredWorks.displaySettings,
                        randomize: e.target.checked
                      })}
                      className="w-4 h-4 rounded accent-signal"
                    />
                    <label htmlFor="randomize" className="text-sm font-medium text-gray-700">
                      Randomize project order on each page load
                    </label>
                  </div>
                </div>
              )}

              {/* Services Section */}
              {activeSection === 'services' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Services Section</h2>
                  
                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Title</label>
                    <input
                      type="text"
                      value={homePage.services.title}
                      onChange={(e) => updateServices('title', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Subtitle</label>
                    <input
                      type="text"
                      value={homePage.services.subtitle}
                      onChange={(e) => updateServices('subtitle', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Service Items</label>
                    <div className="space-y-4">
                      {homePage.services.items.map((service, index) => (
                        <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 bg-signal/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <i className={`${service.icon} text-xl text-signal`}></i>
                            </div>
                            <input
                              type="text"
                              value={service.title}
                              onChange={(e) => {
                                const updated = [...homePage.services.items];
                                updated[index] = { ...updated[index], title: e.target.value };
                                updateServices('items', updated);
                              }}
                              placeholder="Service Title"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-signal/50 focus:border-transparent"
                            />
                          </div>
                          <textarea
                            value={service.description}
                            onChange={(e) => {
                              const updated = [...homePage.services.items];
                              updated[index] = { ...updated[index], description: e.target.value };
                              updateServices('items', updated);
                            }}
                            rows={2}
                            placeholder="Service Description"
                            className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Section */}
              {activeSection === 'stats' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Stats Section</h2>
                  
                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Title</label>
                    <input
                      type="text"
                      value={homePage.stats.title}
                      onChange={(e) => updateStats('title', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Subtitle</label>
                    <input
                      type="text"
                      value={homePage.stats.subtitle}
                      onChange={(e) => updateStats('subtitle', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Stat Items</label>
                    <div className="space-y-4">
                      {homePage.stats.items.map((stat, index) => (
                        <div key={stat.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            <input
                              type="text"
                              value={stat.value}
                              onChange={(e) => {
                                const updated = [...homePage.stats.items];
                                updated[index] = { ...updated[index], value: e.target.value };
                                updateStats('items', updated);
                              }}
                              placeholder="Value (e.g., 50+)"
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold focus:ring-2 focus:ring-signal/50 focus:border-transparent"
                            />
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => {
                                const updated = [...homePage.stats.items];
                                updated[index] = { ...updated[index], label: e.target.value };
                                updateStats('items', updated);
                              }}
                              placeholder="Label"
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-signal/50 focus:border-transparent"
                            />
                          </div>
                          <textarea
                            value={stat.description}
                            onChange={(e) => {
                              const updated = [...homePage.stats.items];
                              updated[index] = { ...updated[index], description: e.target.value };
                              updateStats('items', updated);
                            }}
                            rows={2}
                            placeholder="Description"
                            className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Contact CTA Section */}
              {activeSection === 'cta' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Contact CTA Section</h2>
                  
                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Heading</label>
                    <input
                      type="text"
                      value={homePage.contactCTA.heading}
                      onChange={(e) => updateContactCTA('heading', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Description</label>
                    <textarea
                      value={homePage.contactCTA.description}
                      onChange={(e) => updateContactCTA('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Button Text</label>
                      <input
                        type="text"
                        value={homePage.contactCTA.ctaButton.label}
                        onChange={(e) => updateContactCTA('ctaButton', {
                          ...homePage.contactCTA.ctaButton,
                          label: e.target.value
                        })}
                        className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Button URL</label>
                      <input
                        type="text"
                        value={homePage.contactCTA.ctaButton.url}
                        onChange={(e) => updateContactCTA('ctaButton', {
                          ...homePage.contactCTA.ctaButton,
                          url: e.target.value
                        })}
                        className="w-full px-3 py-2 rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                      />
                    </div>
                  </div>
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
