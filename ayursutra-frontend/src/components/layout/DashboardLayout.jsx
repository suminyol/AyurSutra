import { useState } from 'react';
import { useAppSelector } from '../../hooks/redux';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />
      {/* Header */}
      <Header onMenuClick={() => setSidebarOpen(true)} user={user} />
      {/* Main content area */}
      <div className="lg:pl-64 pt-16">
        {/* Main content */}
        <main>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;