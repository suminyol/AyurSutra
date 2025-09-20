import { useState } from 'react';
import { useAppSelector } from '../../hooks/redux';
import Sidebar from './Sidebar';
import Header from './Header';
import { Bars3Icon } from '@heroicons/react/24/outline';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Header */}
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
        />

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
