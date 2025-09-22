import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useTheme } from '../../hooks/useTheme';
import { logoutUser } from '../../store/slices/authSlice';
import LeafIcon from '../icons/LeafIcon';
import { ROUTES } from '../../constants';
import {
  Bars3Icon,
  BellIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Header = ({ onMenuClick, user }) => {
  const dispatch = useAppDispatch();
  const { unreadCount } = useAppSelector((state) => state.notifications);
  const { toggle, isDark } = useTheme();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 shadow-lg sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-slate-700 dark:text-slate-300 lg:hidden hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Logo - Left side */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
           <LeafIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">AyurSutra</span>
        </Link>
      </div>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1" />
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Theme toggle */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-slate-400 hover:text-emerald-600 dark:text-slate-500 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200"
            onClick={toggle}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <SunIcon className="h-6 w-6 text-amber-500" aria-hidden="true" />
            ) : (
              <MoonIcon className="h-6 w-6 text-slate-600" aria-hidden="true" />
            )}
          </button>

          {/* Notifications */}
          <Link
            to={ROUTES.NOTIFICATIONS}
            className="-m-2.5 p-2.5 text-slate-400 hover:text-emerald-600 dark:text-slate-500 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200 relative"
            aria-label="View notifications"
          >
            <BellIcon className="h-6 w-6" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center shadow-lg">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200 dark:lg:bg-slate-700" />

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="-m-1.5 flex items-center p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200">
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-sm">
                <UserIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-semibold leading-6 text-slate-900 dark:text-white" aria-hidden="true">
                  {user?.name || 'User'}
                </span>
              </span>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-xl bg-white dark:bg-slate-800 py-2 shadow-2xl ring-1 ring-slate-900/5 dark:ring-slate-700 focus:outline-none border border-slate-200 dark:border-slate-700">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/profile"
                      className={`${
                        active ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'
                      } flex items-center px-4 py-2 text-sm font-medium rounded-lg mx-2 transition-all duration-200`}
                    >
                      <UserIcon className="h-4 w-4 mr-3" />
                      Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link 
                      to="/settings"
                      className={`${
                        active ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'
                      } flex items-center px-4 py-2 text-sm font-medium rounded-lg mx-2 transition-all duration-200`}
                    >
                      <Cog6ToothIcon className="h-4 w-4 mr-3" />
                      Settings
                    </Link>
                  )}
                </Menu.Item>
                <div className="my-1 h-px bg-slate-200 dark:bg-slate-700 mx-2" />
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`${
                        active ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' : 'text-slate-700 dark:text-slate-300'
                      } flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg mx-2 transition-all duration-200`}
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Header;