import { useState } from 'react';
import { useAppSelector } from '../../hooks/redux';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex">

      {/* Main area */}
      <div className="flex flex-col flex-1">
        {/* Header - remove any margin or padding above */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
        />
        <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;