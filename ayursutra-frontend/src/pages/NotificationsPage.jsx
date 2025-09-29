import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchNotifications, markNotificationAsRead, deleteNotification } from '../store/slices/notificationSlice';
import { BellIcon, TrashIcon, CheckIcon, SparklesIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const NotificationsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { notifications, isLoading } = useAppSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await dispatch(markNotificationAsRead(notificationId)).unwrap();
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await dispatch(deleteNotification(notificationId)).unwrap();
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 border border-red-200 dark:border-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800';
      case 'low':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/40 dark:text-slate-200 border border-slate-200 dark:border-slate-800';
    }
  };
  
  return (
    <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-6 py-6 border-b border-slate-200 dark:border-slate-700">
                <button
                onClick={() => navigate(-1)}
                className="mb-4 inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back 
              </button>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Notifications</h1>
                <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                  Stay updated with your therapy sessions and important alerts
                </p>
              </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  All Notifications ({notifications.length})
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Manage your notifications and stay informed
                </p>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                    ))}
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map((notification) =>{
                      const Component = notification.link ? Link : 'div';
                     return (
                      <Component
                        key={notification.id}
                        to={notification.link || '#'}
                        className={`block p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                          notification.isRead
                            ? 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600'
                            : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                                <BellIcon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                                  {notification.title}
                                </h3>
                                <div className="flex items-center space-x-2 mt-1">
                                 
                                  {!notification.isRead && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200 border border-teal-200 dark:border-teal-800">
                                      New
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 ml-13">
                              {notification.message}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 ml-13">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.isRead && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevents the parent Link from being clicked
                                  e.preventDefault();  // Prevents any default browser action
                                  handleMarkAsRead(notification.id);
                                }}
                                className="p-2.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200"
                                title="Mark as read"
                              >
                                <CheckIcon className="h-5 w-5" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevents the parent Link from being clicked
                                e.preventDefault();  // Prevents any default browser action
                                handleDelete(notification.id);
                              }}
                              className="p-2.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                              title="Delete notification"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </Component>
                    )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <BellIcon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No notifications</h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      You're all caught up! Check back later for updates.
                    </p>
                  </div>
                )}
              </div>
            </div>
    </div>  
  );
};

export default NotificationsPage;