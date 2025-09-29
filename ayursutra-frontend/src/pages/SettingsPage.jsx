import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { Cog6ToothIcon, SunIcon, MoonIcon, BellIcon, ShieldCheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const SettingsPage = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');
  const navigate = useNavigate();
  const { mode, toggle, isDark } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });
  // Change password modal state (moved to top level)
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
       <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-6 py-6 border-b border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-4 inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Back 
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
                    <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                        Manage your account settings and preferences
                    </p>
                </div>
            </div>
      
      <div className="space-y-6">
        {/* Appearance Settings */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Cog6ToothIcon className="h-5 w-5 mr-2" />
              Appearance
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Theme</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose your preferred theme
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isDark ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDark ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {isDark ? (
                    <MoonIcon className="h-5 w-5" />
                  ) : (
                    <SunIcon className="h-5 w-5" />
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <BellIcon className="h-5 w-5 mr-2" />
              Notifications
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive notifications via email
                </p>
              </div>
              <button
                onClick={() => handleNotificationChange('email')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.email ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.email ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Push Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive push notifications in your browser
                </p>
              </div>
              <button
                onClick={() => handleNotificationChange('push')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.push ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.push ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">SMS Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive notifications via SMS
                </p>
              </div>
              <button
                onClick={() => handleNotificationChange('sms')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.sms ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.sms ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              Security
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Change Password</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Update your account password
                </p>
              </div>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setShowPasswordModal(true)}>
                Change
              </button>
      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Change Password</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setPasswordError('');
                setPasswordSuccess('');
                setPasswordLoading(true);
                try {
                  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/change-password`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('ayursutra_auth_token')}`
                    },
                    body: JSON.stringify({ currentPassword, newPassword })
                  });
                  const data = await res.json();
                  if (!res.ok || !data.success) {
                    setPasswordError(data.message || 'Failed to change password');
                  } else {
                    setPasswordSuccess('Password changed successfully!');
                    setCurrentPassword('');
                    setNewPassword('');
                    setShowPasswordModal(false);
                  }
                } catch (err) {
                  setPasswordError('Server error');
                } finally {
                  setPasswordLoading(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block mb-1">Current Password</label>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block mb-1">New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-2 border rounded" required />
              </div>
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
              {passwordSuccess && <p className="text-green-500 text-sm">{passwordSuccess}</p>}
              <div className="flex justify-end space-x-2">
                <button type="button" className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200" onClick={() => setShowPasswordModal(false)} disabled={passwordLoading}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white" disabled={passwordLoading}>{passwordLoading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
            </div>

            
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Account</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Delete Account</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Permanently delete your account and all data
                </p>
              </div>
              <button
                className="px-4 py-2 border border-red-300 dark:border-red-600 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => setShowDeleteModal(true)}
                disabled={deleteLoading}
              >
                Delete
              </button>
              {deleteError && <p className="text-red-500 text-sm mt-2">{deleteError}</p>}
              {deleteSuccess && <p className="text-green-500 text-sm mt-2">{deleteSuccess}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
