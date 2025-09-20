import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ROUTES } from '../../constants';
import {
  HomeIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  BellIcon,
  UserIcon,
  Cog6ToothIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: HomeIcon },
  { name: 'Schedule Therapy', href: ROUTES.THERAPY_SCHEDULE, icon: CalendarDaysIcon },
  { name: 'Therapy History', href: ROUTES.THERAPY_HISTORY, icon: ClockIcon },
  { name: 'Progress Tracking', href: ROUTES.PROGRESS_TRACKING, icon: ChartBarIcon },
  { name: 'Notifications', href: ROUTES.NOTIFICATIONS, icon: BellIcon },
  { name: 'Profile', href: ROUTES.PROFILE, icon: UserIcon },
  { name: 'Settings', href: ROUTES.SETTINGS, icon: Cog6ToothIcon },
];

const doctorNavigation = [
  { name: 'Dashboard', href: ROUTES.DOCTOR_DASHBOARD, icon: HomeIcon },
  { name: 'Patient Management', href: ROUTES.PATIENT_MANAGEMENT, icon: UserGroupIcon },
  { name: 'Schedule Therapy', href: ROUTES.THERAPY_SCHEDULE, icon: CalendarDaysIcon },
  { name: 'Therapy History', href: ROUTES.THERAPY_HISTORY, icon: ClockIcon },
  { name: 'Notifications', href: ROUTES.NOTIFICATIONS, icon: BellIcon },
  { name: 'Profile', href: ROUTES.PROFILE, icon: UserIcon },
  { name: 'Settings', href: ROUTES.SETTINGS, icon: Cog6ToothIcon },
];

const Sidebar = ({ isOpen, onClose, user }) => {
  const location = useLocation();
  const currentNavigation = user?.role === 'doctor' ? doctorNavigation : navigation;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 bg-primary-600">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <HeartIcon className="w-5 h-5 text-primary-600" />
          </div>
          <span className="text-white font-bold text-lg">AyurSutra</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {currentNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
              onClick={onClose}
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

      {/* User info */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {user?.role || 'User'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <SidebarContent />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <SidebarContent />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
