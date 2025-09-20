import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';
import {
  HomeIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ClockIcon,
  BellIcon,
  UserIcon,
  Cog6ToothIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: ROUTES.DOCTOR_DASHBOARD, icon: HomeIcon },
  { name: 'Patient Management', href: ROUTES.PATIENT_MANAGEMENT, icon: UserGroupIcon },
  { name: 'Schedule Therapy', href: ROUTES.THERAPY_SCHEDULE, icon: CalendarDaysIcon },
  { name: 'Therapy History', href: ROUTES.THERAPY_HISTORY, icon: ClockIcon },
  { name: 'Notifications', href: ROUTES.NOTIFICATIONS, icon: BellIcon },
  { name: 'Profile', href: ROUTES.PROFILE, icon: UserIcon },
  { name: 'Settings', href: ROUTES.SETTINGS, icon: Cog6ToothIcon },
];

const DoctorLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <HeartIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">AyurSutra</span>
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
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isActive
                          ? 'text-primary-500'
                          : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
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

export default DoctorLayout;
