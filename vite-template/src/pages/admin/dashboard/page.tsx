
import { Link } from 'react-router-dom';
import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useContent } from '../../../contexts/ContentContext';
import { contentService } from '../../../services/contentService';

export default function AdminDashboard() {
  const { content, resetContent, isModified } = useContent();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await resetContent();
      setShowResetConfirm(false);
      alert('Content has been reset to defaults');
    } catch (error) {
      console.error('Reset failed:', error);
      alert('Failed to reset content');
    } finally {
      setIsResetting(false);
    }
  };

  const handleExport = () => {
    try {
      contentService.exportContent();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export content');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          await contentService.importContent(file);
          window.location.reload();
        } catch (error) {
          console.error('Import failed:', error);
          alert('Failed to import content. Please check the file format.');
        }
      }
    };
    input.click();
  };

  const stats = [
    {
      label: 'Total Projects',
      value: content.projects.length,
      icon: 'ri-folder-line',
      color: 'bg-blue-500',
      link: '/admin/projects',
    },
    {
      label: 'Web Projects',
      value: content.projects.filter((p) => p.category === 'web').length,
      icon: 'ri-window-line',
      color: 'bg-teal-500',
      link: '/admin/projects',
    },
    {
      label: 'Mobile Projects',
      value: content.projects.filter((p) => p.category === 'mobile').length,
      icon: 'ri-smartphone-line',
      color: 'bg-purple-500',
      link: '/admin/projects',
    },
    {
      label: 'Desktop Projects',
      value: content.projects.filter((p) => p.category === 'desktop').length,
      icon: 'ri-computer-line',
      color: 'bg-green-500',
      link: '/admin/projects',
    },
  ];

  const quickLinks = [
    {
      path: '/admin/home',
      icon: 'ri-home-line',
      label: 'Home Page',
      description: 'Edit hero, about, services',
    },
    {
      path: '/admin/about',
      icon: 'ri-user-line',
      label: 'About Page',
      description: 'Edit bio, expertise, journey',
    },
    {
      path: '/admin/contact',
      icon: 'ri-mail-line',
      label: 'Contact Page',
      description: 'Edit contact info and form',
    },
    {
      path: '/admin/projects',
      icon: 'ri-folder-line',
      label: 'Projects',
      description: 'Manage portfolio projects',
    },
    {
      path: '/admin/works',
      icon: 'ri-gallery-line',
      label: 'Works Page',
      description: 'Edit works page settings',
    },
    {
      path: '/admin/navigation',
      icon: 'ri-navigation-line',
      label: 'Navigation',
      description: 'Edit menu and logo',
    },
    {
      path: '/admin/footer',
      icon: 'ri-layout-bottom-line',
      label: 'Footer',
      description: 'Edit footer content',
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your portfolio content</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
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

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
            >
              <i className="ri-download-line mr-2"></i>
              Export Content
            </button>
            <button
              onClick={handleImport}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <i className="ri-upload-line mr-2"></i>
              Import Content
            </button>
            {isModified && (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2.5 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
              >
                <i className="ri-restart-line mr-2"></i>
                Reset to Defaults
              </button>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                    <i className={`${link.icon} text-2xl text-gray-600 group-hover:text-teal-600 transition-colors`}></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">
                      {link.label}
                    </h3>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </div>
                  <i className="ri-arrow-right-line text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all"></i>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-error-warning-line text-2xl text-red-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Reset to Defaults?</h3>
              <p className="text-gray-600 text-center mb-6">
                This will restore all content to the original defaults. All your changes will be lost. This
                action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  disabled={isResetting}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  disabled={isResetting}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap disabled:opacity-50"
                >
                  {isResetting ? 'Resetting...' : 'Reset Content'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
