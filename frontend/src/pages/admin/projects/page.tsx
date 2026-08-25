import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useContent } from '../../../admin/contexts/AdminContentContext';
import { Badge, Button, EmptyState, PageHeader, Toolbar } from '../../../components/admin/ui';

const categories = [
  { id: 'all', label: 'All projects' },
  { id: 'web', label: 'Web' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'desktop', label: 'Desktop' },
  { id: 'saas', label: 'SaaS' },
];

export default function AdminProjects() {
  const { content } = useContent();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredProjects = useMemo(() => {
    let filtered = content.projects;

    if (filterCategory !== 'all') {
      filtered = filtered.filter((p) => p.category.toLowerCase() === filterCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.overview.description.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [content.projects, searchQuery, filterCategory]);

  const isFiltered = Boolean(searchQuery) || filterCategory !== 'all';

  return (
    <AdminLayout>
      <div className="max-w-[1380px] mx-auto">
        <PageHeader
          eyebrow="Content"
          title="Projects"
          description={`${content.projects.length} in the portfolio`}
          actions={
            <Link to="/admin/projects/new">
              <Button variant="primary" icon="ri-add-line">
                New project
              </Button>
            </Link>
          }
        />

        <Toolbar
          search={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by title, description, or tag…"
        >
          <div className="flex flex-wrap gap-1.5">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setFilterCategory(category.id)}
                className={`px-3 py-1.5 rounded-full text-[12px] transition-colors ${
                  filterCategory === category.id
                    ? 'bg-signal text-white'
                    : 'bg-white ring-1 ring-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </Toolbar>

        {filteredProjects.length === 0 ? (
          <div className="rounded-2xl ring-1 ring-black/5 bg-white">
            <EmptyState
              icon="ri-folder-open-line"
              title="No projects found"
              description={
                isFiltered
                  ? 'Try adjusting the filters or search.'
                  : 'Get started by creating the first project.'
              }
              action={
                isFiltered ? (
                  <Button
                    icon="ri-close-line"
                    onClick={() => {
                      setSearchQuery('');
                      setFilterCategory('all');
                    }}
                  >
                    Clear filters
                  </Button>
                ) : (
                  <Link to="/admin/projects/new">
                    <Button variant="primary" icon="ri-add-line">
                      Create project
                    </Button>
                  </Link>
                )
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => navigate(`/admin/projects/edit/${String(project.id)}`)}
                className="text-left rounded-2xl ring-1 ring-black/5 bg-white overflow-hidden hover:ring-signal/30 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/40"
              >
                <div className="aspect-[4/3] overflow-hidden bg-cream-surface">
                  <img
                    src={project.thumbnail.url}
                    alt={project.thumbnail.alt}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-[14px] font-semibold tracking-tight text-gray-900 truncate group-hover:text-signal transition-colors">
                        {project.title}
                      </h2>
                      <p className="text-[12px] text-gray-400 tabular-nums">{project.year}</p>
                    </div>
                    <Badge tone="outline">{project.category.toLowerCase()}</Badge>
                  </div>

                  <p className="mt-2 text-[13px] text-gray-500 line-clamp-2">{project.overview.description}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} tone="cream">
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && <Badge tone="muted">+{project.tags.length - 3}</Badge>}
                  </div>
                </div>

                <div className="px-4 py-2.5 border-t border-black/5 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 inline-flex items-center gap-1">
                    <i className="ri-image-line" aria-hidden="true" />
                    {project.gallery.images.length} images
                  </span>
                  <i
                    className="ri-arrow-right-line text-gray-300 group-hover:text-signal group-hover:translate-x-0.5 transition-all"
                    aria-hidden="true"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
