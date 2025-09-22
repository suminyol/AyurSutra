import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import LeafIcon from '../icons/LeafIcon';
import { SunIcon, MoonIcon, HeartIcon } from '@heroicons/react/24/outline';

const AuthLayout = ({ children }) => {
  const { toggle, isDark } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col justify-center py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
           <LeafIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            AyurSutra
          </span>
        </Link>
        
        {/* Theme Toggle */}
        <button
          onClick={toggle}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <SunIcon className="w-5 h-5 text-yellow-500" />
          ) : (
            <MoonIcon className="w-5 h-5 text-slate-600" />
          )}
        </button>
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md sm:max-w-2xl">
          <div className="bg-white dark:bg-slate-800 py-8 px-8 sm:px-10 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
            {children}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          © 2024 AyurSutra. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;