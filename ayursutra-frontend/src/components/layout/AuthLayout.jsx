import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const AuthLayout = ({ children }) => {
  const { toggle, isDark } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-wellness-50 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">AyurSutra</span>
        </Link>
        
        <button
          onClick={toggle}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <SunIcon className="w-5 h-5 text-yellow-500" />
          ) : (
            <MoonIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © 2024 AyurSutra. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
