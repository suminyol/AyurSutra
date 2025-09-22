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
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: HomeIcon },
  { name: 'Schedule Treatment', href: ROUTES.APPOINTMENT_SCHEDULE, icon: CalendarDaysIcon },
  { name: 'Treatment History', href: ROUTES.TREATMENT_HISTORY, icon: ClockIcon },
  { name: 'Progress Tracking', href: ROUTES.PROGRESS_TRACKING, icon: ChartBarIcon },
  { name: 'Notifications', href: ROUTES.NOTIFICATIONS, icon: BellIcon },
  { name: 'Profile', href: ROUTES.PROFILE, icon: UserIcon },
  { name: 'Settings', href: ROUTES.SETTINGS, icon: Cog6ToothIcon },
];

const doctorNavigation = [
  { name: 'Dashboard', href: ROUTES.DOCTOR_DASHBOARD, icon: HomeIcon },
  { name: 'Patient Management', href: ROUTES.PATIENT_MANAGEMENT, icon: UserGroupIcon },
  { name: 'Schedule Therapy', href: ROUTES.APPOINTMENT_SCHEDULE, icon: CalendarDaysIcon },
  { name: 'Therapy History', href: ROUTES.TREATMENT_HISTORY, icon: ClockIcon },
  { name: 'Notifications', href: ROUTES.NOTIFICATIONS, icon: BellIcon },
  { name: 'Profile', href: ROUTES.PROFILE, icon: UserIcon },
  { name: 'Settings', href: ROUTES.SETTINGS, icon: Cog6ToothIcon },
];

const Sidebar = ({ isOpen, onClose, user }) => {
  const location = useLocation();
  const currentNavigation = user?.role === 'doctor' ? doctorNavigation : navigation;

  const SidebarContent = () => (
    <div className="flex flex-col h-screen pt-16"> {/* Changed h-full to h-screen */}
      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {currentNavigation.map((item) => {
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
              onClick={onClose}
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

      {/* User info */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-full flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-sm">
            <UserIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
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
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
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
              <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full h-screen bg-white dark:bg-slate-800 shadow-2xl border-r border-slate-200 dark:border-slate-700">
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
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-200"
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
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col h-screen bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-2xl">
          <SidebarContent />
        </div>
      </div>
    </>
  );
};

export default Sidebar;