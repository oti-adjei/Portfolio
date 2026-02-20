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
    {
      label: 'Newsletter',
      value: content.newsletterSubscribers.length,
      icon: 'ri-mail-send-line',
      color: 'bg-pink-500',
      link: '/admin/newsletter',
    },
    {
      label: 'Messages',
      value: content.contactSubmissions.length,
      icon: 'ri-message-3-line',
      color: 'bg-indigo-500',
      link: '/admin/contact-submissions',
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
    { path: '/admin/newsletter', icon: 'ri-mail-send-line', label: 'Newsletter', description: 'Manage subscribers' },
    { path: '/admin/contact-submissions', icon: 'ri-message-3-line', label: 'Messages', description: 'Manage contact submissions' },
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {content.contactSubmissions.slice(0, 5).map((submission) => (
                <Link
                  key={submission.id}
                  to="/admin/contact-submissions"
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{submission.name}</p>
                    <p className="text-sm text-gray-600">{submission.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{new Date(submission.created_at).toLocaleDateString()}</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      submission.status === 'new'
                        ? 'bg-yellow-100 text-yellow-700'
                        : submission.status === 'read'
                        ? 'bg-blue-100 text-blue-700'
                        : submission.status === 'replied'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {submission.status}
                    </span>
                  </div>
                </Link>
              ))}
              {content.contactSubmissions.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No recent messages</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
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

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-sm text-gray-500">New This Week</div>
              <div className="text-2xl font-bold text-gray-900">
                {content.contactSubmissions.filter(s => {
                  const oneWeekAgo = new Date();
                  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                  return new Date(s.created_at) > oneWeekAgo;
                }).length}
              </div>
            </div>
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
