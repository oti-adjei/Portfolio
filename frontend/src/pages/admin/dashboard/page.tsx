import { Link } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useContent } from '../../../admin/contexts/AdminContentContext';
import { Button, Card, EmptyState, Notice, PageHeader, StatusBadge } from '../../../components/admin/ui';

function categoryCount(category: string, values: Array<{ category: string }>): number {
  return values.filter((item) => item.category.toLowerCase() === category.toLowerCase()).length;
}

export default function AdminDashboard() {
  const { content, isLoading, refresh } = useContent();

  const stats = [
    { label: 'Projects', value: content.projects.length, icon: 'ri-folder-line', link: '/admin/projects' },
    { label: 'Blog posts', value: content.blogPosts.length, icon: 'ri-article-line', link: '/admin/blog' },
    { label: 'Notes', value: content.notes.length, icon: 'ri-sticky-note-line', link: '/admin/notes' },
    { label: 'Streams', value: content.streamEvents.length, icon: 'ri-live-line', link: '/admin/streams' },
    { label: 'Subscribers', value: content.newsletterSubscribers.length, icon: 'ri-mail-send-line', link: '/admin/newsletter' },
    { label: 'Messages', value: content.contactSubmissions.length, icon: 'ri-message-3-line', link: '/admin/contact-submissions' },
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

  const newThisWeek = content.contactSubmissions.filter((submission) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(submission.created_at) > oneWeekAgo;
  }).length;

  const recent = content.contactSubmissions.slice(0, 5);

  return (
    <AdminLayout>
      <div className="max-w-[1380px] mx-auto">
        <PageHeader
          eyebrow="Overview"
          title="Dashboard"
          description="Everything on the site, at a glance."
          actions={
            <Button icon="ri-refresh-line" onClick={() => void refresh()} loading={isLoading}>
              Refresh
            </Button>
          }
        />

        {isLoading && (
          <div className="mb-5">
            <Notice>Loading admin data…</Notice>
          </div>
        )}

        {/* Counts */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.link}
              className="rounded-2xl ring-1 ring-black/5 bg-white p-4 hover:ring-signal/30 transition-colors group"
            >
              <i className={`${stat.icon} text-gray-300 group-hover:text-signal transition-colors`} aria-hidden="true" />
              <div className="mt-1.5 text-2xl font-bold tracking-tight text-gray-900 tabular-nums">{stat.value}</div>
              <div className="text-[12px] text-gray-500">{stat.label}</div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          <div className="lg:col-span-2">
            <Card
              title="Recent messages"
              actions={
                <Link
                  to="/admin/contact-submissions"
                  className="text-[12px] text-gray-500 hover:text-signal transition-colors"
                >
                  View inbox
                </Link>
              }
              padded={false}
            >
              {recent.length === 0 ? (
                <EmptyState
                  icon="ri-message-3-line"
                  title="No messages yet"
                  description="Contact form submissions land here."
                />
              ) : (
                <ul>
                  {recent.map((submission) => (
                    <li key={submission.id} className="border-b border-black/5 last:border-0">
                      <Link
                        to="/admin/contact-submissions"
                        className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-gray-900 truncate">{submission.name}</p>
                          <p className="text-[12px] text-gray-500 truncate">{submission.email}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[11px] text-gray-400 tabular-nums">
                            {new Date(submission.created_at).toLocaleDateString()}
                          </span>
                          <StatusBadge status={submission.status} />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <div className="space-y-3">
            <Card title="Projects by category">
              <dl className="space-y-2.5">
                {['web', 'mobile', 'desktop'].map((category) => (
                  <div key={category} className="flex items-baseline justify-between">
                    <dt className="text-[11px] uppercase tracking-[0.14em] text-gray-400">{category}</dt>
                    <dd className="text-[15px] font-semibold text-gray-900 tabular-nums">
                      {categoryCount(category, content.projects)}
                    </dd>
                  </div>
                ))}
              </dl>
            </Card>

            <Card title="New this week">
              <p className="text-3xl font-bold tracking-tight text-gray-900 tabular-nums">{newThisWeek}</p>
              <p className="text-[12px] text-gray-500 mt-0.5">contact submissions</p>
            </Card>
          </div>
        </div>

        <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400 mb-3">Edit content</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="flex items-center gap-3 rounded-2xl ring-1 ring-black/5 bg-white px-4 py-3.5 hover:ring-signal/30 transition-colors group"
            >
              <span className="w-9 h-9 rounded-full bg-cream-surface inline-flex items-center justify-center text-gray-500 group-hover:text-signal transition-colors shrink-0">
                <i className={link.icon} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-medium text-gray-900 truncate">{link.label}</span>
                <span className="block text-[12px] text-gray-500 truncate">{link.description}</span>
              </span>
              <i
                className="ri-arrow-right-line text-gray-300 group-hover:text-signal group-hover:translate-x-0.5 transition-all shrink-0"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
