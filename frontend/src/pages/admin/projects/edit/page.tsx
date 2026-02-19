import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../../../components/admin/AdminLayout';
import FormInput from '../../../../components/admin/FormInput';
import FormTextarea from '../../../../components/admin/FormTextarea';
import ImageUpload from '../../../../components/admin/ImageUpload';
import { useContent } from '../../../../contexts/ContentContext';
import type { Project } from '../../../../types/siteContent';

export default function EditProject() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { content, updateContent } = useContent();

  const [activeTab, setActiveTab] = useState<'basic' | 'overview' | 'details' | 'gallery'>('basic');
  const [project, setProject] = useState<Project | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Determine if this is a new project
  const isNewProject = !id || id === 'new';

  // ------------------------------------------------------------
  // Initialise project (new or existing)
  // ------------------------------------------------------------
  useEffect(() => {
    if (isNewProject) {
      // Template for a new project
      setProject({
        id: `project-${Date.now()}`,
        title: '',
        category: 'web',
        year: new Date().getFullYear().toString(),
        thumbnail: {
          url: 'https://readdy.ai/api/search-image?query=modern%20minimalist%20web%20design%20interface%20clean%20white%20background%20professional%20technology&width=800&height=600&seq=new-project-thumb&orientation=landscape',
          alt: 'New Project',
        },
        tags: [],
        overview: {
          description: '',
          client: '',
          duration: '',
          role: '',
        },
        details: {
          challenge: '',
          solution: '',
          results: [],
        },
        gallery: { images: [] },
      });
    } else {
      const existingProject = content.projects.find((p) => p.id === id);
      if (existingProject) {
        setProject(existingProject);
      } else {
        navigate('/admin/projects');
      }
    }
  }, [id, isNewProject, content.projects, navigate]);

  // ------------------------------------------------------------
  // Save handler with basic validation & error handling
  // ------------------------------------------------------------
  const handleSave = async () => {
    if (!project) return;

    setIsSaving(true);

    // Simple required‑field validation
    if (!project.title.trim()) {
      alert('Please enter a project title');
      setIsSaving(false);
      return;
    }

    try {
      const updatedProjects = isNewProject
        ? [...content.projects, project]
        : content.projects.map((p) => (p.id === project.id ? project : p));

      await updateContent({ projects: updatedProjects });

      // Small delay for UI feedback
      setTimeout(() => {
        setIsSaving(false);
        navigate('/admin/projects');
      }, 500);
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save the project. Please try again.');
      setIsSaving(false);
    }
  };

  // ------------------------------------------------------------
  // Delete handler (only for existing projects)
  // ------------------------------------------------------------
  const handleDelete = async () => {
    if (!project || isNewProject) return;

    try {
      const updatedProjects = content.projects.filter((p) => p.id !== project.id);
      await updateContent({ projects: updatedProjects });
      navigate('/admin/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete the project. Please try again.');
    }
  };

  // ------------------------------------------------------------
  // Tag helpers
  // ------------------------------------------------------------
  const addTag = () => {
    if (!project) return;
    setProject({ ...project, tags: [...project.tags, ''] });
  };

  const updateTag = (index: number, value: string) => {
    if (!project) return;
    const newTags = [...project.tags];
    newTags[index] = value;
    setProject({ ...project, tags: newTags });
  };

  const removeTag = (index: number) => {
    if (!project) return;
    setProject({ ...project, tags: project.tags.filter((_, i) => i !== index) });
  };

  // ------------------------------------------------------------
  // Result helpers (project.details.results)
  // ------------------------------------------------------------
  const addResult = () => {
    if (!project) return;
    setProject({
      ...project,
      details: {
        ...project.details,
        results: [...project.details.results, ''],
      },
    });
  };

  const updateResult = (index: number, value: string) => {
    if (!project) return;
    const newResults = [...project.details.results];
    newResults[index] = value;
    setProject({
      ...project,
      details: { ...project.details, results: newResults },
    });
  };

  const removeResult = (index: number) => {
    if (!project) return;
    setProject({
      ...project,
      details: {
        ...project.details,
        results: project.details.results.filter((_, i) => i !== index),
      },
    });
  };

  // ------------------------------------------------------------
  // Gallery helpers
  // ------------------------------------------------------------
  const addGalleryImage = () => {
    if (!project) return;
    setProject({
      ...project,
      gallery: {
        images: [
          ...project.gallery.images,
          {
            url:
              'https://readdy.ai/api/search-image?query=modern%20design%20interface%20clean%20professional&width=1200&height=800&seq=gallery-' +
              Date.now() +
              '&orientation=landscape',
            caption: '',
          },
        ],
      },
    });
  };

  const updateGalleryImage = (index: number, field: 'url' | 'caption', value: string) => {
    if (!project) return;
    const newImages = [...project.gallery.images];
    newImages[index] = { ...newImages[index], [field]: value };
    setProject({ ...project, gallery: { images: newImages } });
  };

  const removeGalleryImage = (index: number) => {
    if (!project) return;
    setProject({
      ...project,
      gallery: { images: project.gallery.images.filter((_, i) => i !== index) },
    });
  };

  const moveGalleryImage = (index: number, direction: 'up' | 'down') => {
    if (!project) return;
    const newImages = [...project.gallery.images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newImages.length) return;
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setProject({ ...project, gallery: { images: newImages } });
  };

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  if (!project) return null;

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'ri-information-line' },
    { id: 'overview', label: 'Overview', icon: 'ri-file-text-line' },
    { id: 'details', label: 'Details', icon: 'ri-list-check' },
    { id: 'gallery', label: 'Gallery', icon: 'ri-gallery-line' },
  ];

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/projects"
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <i className="ri-arrow-left-line text-gray-600"></i>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isNewProject ? 'New Project' : 'Edit Project'}
              </h1>
              <p className="text-gray-600 mt-1">{project.title || 'Untitled Project'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isNewProject && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2.5 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
              >
                <i className="ri-delete-bin-line mr-2"></i>
                Delete
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="ri-save-line mr-2"></i>
                  Save Project
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-teal-600 border-b-2 border-teal-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* ---------- Basic Info ---------- */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <FormInput
                  label="Project Title"
                  value={project.title}
                  onChange={(value) => setProject({ ...project, title: value })}
                  placeholder="Enter project title"
                  required
                />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={project.category}
                      onChange={(e) =>
                        setProject({ ...project, category: e.target.value as any })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="web">Web</option>
                      <option value="mobile">Mobile</option>
                      <option value="desktop">Desktop</option>
                    </select>
                  </div>

                  <FormInput
                    label="Year"
                    value={project.year}
                    onChange={(value) => setProject({ ...project, year: value })}
                    placeholder="2024"
                  />
                </div>

                <ImageUpload
                  label="Thumbnail Image"
                  value={project.thumbnail.url}
                  onChange={(value) => setProject({ ...project, thumbnail: { ...project.thumbnail, url: value } })}
                  aspectRatio="4/3"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="space-y-3">
                    {project.tags.map((tag, index) => (
                      <div key={index} className="flex gap-3">
                        <input
                          type="text"
                          value={tag}
                          onChange={(e) => updateTag(index, e.target.value)}
                          placeholder="Enter tag"
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => removeTag(index)}
                          className="w-10 h-10 flex items-center justify-center rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addTag}
                      className="w-full px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-teal-500 hover:text-teal-600 transition-colors"
                    >
                      <i className="ri-add-line mr-2"></i>
                      Add Tag
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ---------- Overview ---------- */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <FormTextarea
                  label="Description"
                  value={project.overview.description}
                  onChange={(value) =>
                    setProject({
                      ...project,
                      overview: { ...project.overview, description: value },
                    })
                  }
                  placeholder="Brief description of the project"
                  rows={4}
                />

                <div className="grid grid-cols-3 gap-6">
                  <FormInput
                    label="Client"
                    value={project.overview.client}
                    onChange={(value) =>
                      setProject({
                        ...project,
                        overview: { ...project.overview, client: value },
                      })
                    }
                    placeholder="Client name"
                  />

                  <FormInput
                    label="Duration"
                    value={project.overview.duration}
                    onChange={(value) =>
                      setProject({
                        ...project,
                        overview: { ...project.overview, duration: value },
                      })
                    }
                    placeholder="3 months"
                  />

                  <FormInput
                    label="Role"
                    value={project.overview.role}
                    onChange={(value) =>
                      setProject({
                        ...project,
                        overview: { ...project.overview, role: value },
                      })
                    }
                    placeholder="Lead Designer"
                  />
                </div>
              </div>
            )}

            {/* ---------- Details ---------- */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <FormTextarea
                  label="Challenge"
                  value={project.details.challenge}
                  onChange={(value) =>
                    setProject({
                      ...project,
                      details: { ...project.details, challenge: value },
                    })
                  }
                  placeholder="Describe the main challenge or problem"
                  rows={4}
                />

                <FormTextarea
                  label="Solution"
                  value={project.details.solution}
                  onChange={(value) =>
                    setProject({
                      ...project,
                      details: { ...project.details, solution: value },
                    })
                  }
                  placeholder="Explain how you solved the problem"
                  rows={4}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Results
                  </label>
                  <div className="space-y-3">
                    {project.details.results.map((result, index) => (
                      <div key={index} className="flex gap-3">
                        <input
                          type="text"
                          value={result}
                          onChange={(e) => updateResult(index, e.target.value)}
                          placeholder="Enter result or achievement"
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => removeResult(index)}
                          className="w-10 h-10 flex items-center justify-center rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addResult}
                      className="w-full px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-teal-500 hover:text-teal-600 transition-colors"
                    >
                      <i className="ri-add-line mr-2"></i>
                      Add Result
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ---------- Gallery ---------- */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <i className="ri-information-line text-blue-600 text-lg"></i>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Gallery Images</p>
                      <p>
                        Add images to showcase your project. You can reorder them by using the
                        up/down arrows.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {project.gallery.images.map((image, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => moveGalleryImage(index, 'up')}
                            disabled={index === 0}
                            className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <i className="ri-arrow-up-line text-sm"></i>
                          </button>
                          <button
                            onClick={() => moveGalleryImage(index, 'down')}
                            disabled={index === project.gallery.images.length - 1}
                            className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <i className="ri-arrow-down-line text-sm"></i>
                          </button>
                        </div>

                        <div className="flex-1 space-y-4">
                          <ImageUpload
                            label={`Image ${index + 1}`}
                            value={image.url}
                            onChange={(value) => updateGalleryImage(index, 'url', value)}
                            aspectRatio="16/9"
                          />

                          <FormInput
                            label="Caption (Optional)"
                            value={image.caption}
                            onChange={(value) => updateGalleryImage(index, 'caption', value)}
                            placeholder="Describe this image"
                          />
                        </div>

                        <button
                          onClick={() => removeGalleryImage(index)}
                          className="w-10 h-10 flex items-center justify-center rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addGalleryImage}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-teal-500 hover:text-teal-600 transition-colors"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Add Gallery Image
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-error-warning-line text-2xl text-red-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Delete Project?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete &quot;{project.title}&quot;? This action cannot be
                undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                >
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
