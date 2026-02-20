import { Link } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useContent } from '../../../admin/contexts/AdminContentContext';

function categoryCount(category: string, values: Array<{ category: string }>): number {
  return values.filter((item) => item.category.toLowerCase() === category.toLowerCase()).length;
}

export default function AdminDashboard() {
  const { content, isLoading, refresh } = useContent();

  const stats = [
    {
      label: 'Total Projects',
      value: content.projects.length,
      icon: 'ri-folder-line',
      color: 'bg-blue-500',
      link: '/admin/projects',
    },
    {
      label: 'Blog Posts',
      value: content.blogPosts.length,
      icon: 'ri-article-line',
      color: 'bg-teal-500',
      link: '/admin/blog',
    },
    {
      label: 'Notes',
      value: content.notes.length,
      icon: 'ri-sticky-note-line',
      color: 'bg-amber-500',
      link: '/admin/notes',
    },
    {
      label: 'Streams',
      value: content.streamEvents.length,
      icon: 'ri-live-line',
      color: 'bg-purple-500',
      link: '/admin/streams',
    },
  ];

  const quickLinks = [
    { path: '/admin/home', icon: 'ri-home-line', label: 'Home Page', description: 'Edit hero, about, services' },
    { path: '/admin/about', icon: 'ri-user-line', label: 'About Page', description: 'Edit bio, expertise, journey' },
    { path: '/admin/contact', icon: 'ri-mail-line', label: 'Contact Page', description: 'Edit contact info and form' },
    { path: '/admin/projects', icon: 'ri-folder-line', label: 'Projects', description: 'Manage portfolio projects' },
    { path: '/admin/blog', icon: 'ri-article-line', label: 'Blog', description: 'Manage posts and publish state' },
    { path: '/admin/notes', icon: 'ri-sticky-note-line', label: 'Notes', description: 'Manage learning notes' },
    { path: '/admin/streams', icon: 'ri-live-line', label: 'Streams', description: 'Manage stream events' },
    { path: '/admin/navigation', icon: 'ri-navigation-line', label: 'Navigation', description: 'Edit menu and logo' },
    { path: '/admin/footer', icon: 'ri-layout-bottom-line', label: 'Footer', description: 'Edit footer content' },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your portfolio content</p>
          </div>
          <button
            onClick={() => void refresh()}
            className="px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50"
          >
            Refresh Data
          </button>
        </div>

        {isLoading && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 text-gray-600">
            Loading admin data...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Link key={index} to={stat.link} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <i className={`${stat.icon} text-2xl text-white`}></i>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-500">WEB</div>
            <div className="text-2xl font-bold text-gray-900">{categoryCount('web', content.projects)}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-500">MOBILE</div>
            <div className="text-2xl font-bold text-gray-900">{categoryCount('mobile', content.projects)}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-500">DESKTOP</div>
            <div className="text-2xl font-bold text-gray-900">{categoryCount('desktop', content.projects)}</div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <Link key={index} to={link.path} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                    <i className={`${link.icon} text-2xl text-gray-600 group-hover:text-teal-600 transition-colors`}></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">{link.label}</h3>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </div>
                  <i className="ri-arrow-right-line text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all"></i>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
