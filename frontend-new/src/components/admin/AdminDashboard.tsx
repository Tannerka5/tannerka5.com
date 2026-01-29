import { useState, useEffect, type FC } from 'react';
import { apiClient } from '../../lib/api';
import AdminProjects from './AdminProjects';
import AdminBlogPosts from './AdminBlogPosts';

const AdminDashboard: FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'blog'>('projects');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = apiClient.getToken();
    if (!token) {
      window.location.replace('/admin/login');
      return;
    }
    setIsAuthenticated(true);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    apiClient.logout();
    window.location.href = '/admin/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-gray-900 flex items-center justify-center">
        <div className="text-earth dark:text-gray-100">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-sage/20 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-display font-bold text-earth dark:text-gray-100">
              Admin Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-sage/20 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'projects'
                  ? 'border-accent text-accent dark:text-accent-light'
                  : 'border-transparent text-earth/70 dark:text-gray-400 hover:text-earth dark:hover:text-gray-300'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'blog'
                  ? 'border-accent text-accent dark:text-accent-light'
                  : 'border-transparent text-earth/70 dark:text-gray-400 hover:text-earth dark:hover:text-gray-300'
              }`}
            >
              Blog Posts
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'projects' && <AdminProjects />}
        {activeTab === 'blog' && <AdminBlogPosts />}
      </main>
    </div>
  );
};

export default AdminDashboard;