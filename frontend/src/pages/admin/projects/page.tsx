import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useContent } from '../../../admin/contexts/AdminContentContext';
import type { Project } from '../../../types/siteContent';

export default function AdminProjects() {
  const { content } = useContent();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  useEffect(() => {
    let filtered = content.projects;

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(p => p.category.toLowerCase() === filterCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.overview.description.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredProjects(filtered);
  }, [content.projects, searchQuery, filterCategory]);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'web', label: 'Web' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'desktop', label: 'Desktop' },
    { id: 'saas', label: 'SaaS' },
  ];

  const handleProjectClick = (projectId: string) => {
    navigate(`/admin/projects/edit/${projectId}`);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects Manager</h1>
            <p className="text-gray-600 mt-2">Manage your portfolio projects</p>
          </div>
          <Link
            to="/admin/projects/new"
            className="px-6 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <i className="ri-add-line"></i>
            New Project
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-12 gap-4">
            {/* Search */}
            <div className="col-span-8">
              <div className="relative">
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects by title, description, or tags..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="col-span-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(String(project.id))}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={project.thumbnail.url}
                  alt={project.thumbnail.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-500">{project.year}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    project.category.toLowerCase() === 'web' ? 'bg-blue-100 text-blue-700' :
                    project.category.toLowerCase() === 'mobile' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {project.category.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {project.overview.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  <i className="ri-image-line mr-1"></i>
                  {project.gallery.images.length} images
                </span>
                <i className="ri-arrow-right-line text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all"></i>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-folder-open-line text-3xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterCategory !== 'all' 
                ? 'Try adjusting your filters or search query'
                : 'Get started by creating your first project'
              }
            </p>
            {!searchQuery && filterCategory === 'all' && (
              <Link
                to="/admin/projects/new"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
              >
                <i className="ri-add-line"></i>
                Create Project
              </Link>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">{content.projects.length}</div>
            <div className="text-sm text-gray-600">Total Projects</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-blue-600">
              {content.projects.filter(p => p.category.toLowerCase() === 'web').length}
            </div>
            <div className="text-sm text-gray-600">Web Projects</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-purple-600">
              {content.projects.filter(p => p.category.toLowerCase() === 'mobile').length}
            </div>
            <div className="text-sm text-gray-600">Mobile Projects</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-green-600">
              {content.projects.filter(p => p.category.toLowerCase() === 'desktop').length}
            </div>
            <div className="text-sm text-gray-600">Desktop Projects</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
