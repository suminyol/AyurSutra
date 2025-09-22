import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';
import LeafIcon from '../icons/LeafIcon';
import {
  HomeIcon,
  CalendarDaysIcon,
  ClockIcon,
  ChartBarIcon,
  BellIcon,
  UserIcon,
  Cog6ToothIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: ROUTES.PATIENT_DASHBOARD, icon: HomeIcon },
  { name: 'Schedule Therapy', href: ROUTES.THERAPY_SCHEDULE, icon: CalendarDaysIcon },
  { name: 'Therapy History', href: ROUTES.THERAPY_HISTORY, icon: ClockIcon },
  { name: 'Progress Tracking', href: ROUTES.PROGRESS_TRACKING, icon: ChartBarIcon },
  { name: 'Notifications', href: ROUTES.NOTIFICATIONS, icon: BellIcon },
  { name: 'Profile', href: ROUTES.PROFILE, icon: UserIcon },
  { name: 'Settings', href: ROUTES.SETTINGS, icon: Cog6ToothIcon },
];

const PatientLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                <LeafIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">AyurSutra</span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-3 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-900 dark:from-emerald-900/40 dark:to-teal-900/40 dark:text-emerald-100 shadow-lg border border-emerald-200 dark:border-emerald-800'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white hover:shadow-md'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isActive
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
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

export default PatientLayout;