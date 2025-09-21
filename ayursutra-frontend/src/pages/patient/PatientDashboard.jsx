import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchAppointments } from '../../store/slices/appointmentSlice';
import { fetchNotifications } from '../../store/slices/notificationSlice';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import {
  CalendarDaysIcon,
  ClockIcon,
  ChartBarIcon,
  BellIcon,
  PlusIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const PatientDashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { appointments, isLoading } = useAppSelector((state) => state.appointments);
  const { notifications, unreadCount } = useAppSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(fetchNotifications());
  }, [dispatch]);

  const upcomingAppointments = appointments
    .filter(appointment => appointment.status === 'scheduled')
    .slice(0, 3);

  const recentNotifications = notifications.slice(0, 3);

  const stats = [
    {
      name: 'Upcoming Appointments',
      value: appointments.filter(a => a.status === 'scheduled').length,
      icon: CalendarDaysIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      name: 'Completed Appointments',
      value: appointments.filter(a => a.status === 'completed').length,
      icon: ClockIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      name: 'Unread Notifications',
      value: unreadCount,
      icon: BellIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name || 'Patient'}!
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Here's an overview of your Panchakarma treatment journey.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-md ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Sessions */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Upcoming Treatments
              </h3>
              <Link
                to={ROUTES.APPOINTMENT_SCHEDULE}
                className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                View all
              </Link>
            </div>
            <div className="mt-5">
              {isLoading ? (
                <div className="animate-pulse space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
              ) : upcomingAppointments.length > 0 ? (
                <div className="space-y-3">
                  // This is the new, corrected code
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {/* Use 'appointment' and the correct properties from your new model */}
                        {(appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1))} with Dr. {appointment.doctor?.user?.name || '...'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {appointment.status}
                    </span>
                  </div>
                ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No upcoming sessions</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Schedule your first treatment session to get started.
                  </p>
                  <div className="mt-6">
                    <Link
                      to={ROUTES.APPOINTMENT_SCHEDULE}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Schedule Appointment
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Recent Notifications
              </h3>
              <Link
                to={ROUTES.NOTIFICATIONS}
                className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                View all
              </Link>
            </div>
            <div className="mt-5">
              {recentNotifications.length > 0 ? (
                <div className="space-y-3">
                  {recentNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg ${
                        notification.isRead
                          ? 'bg-gray-50 dark:bg-gray-700'
                          : 'bg-primary-50 dark:bg-primary-900/20'
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No notifications</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    You're all caught up! Check back later for updates.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to={ROUTES.APPOINTMENT_SCHEDULE}
              className="relative group bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400">
                  <CalendarDaysIcon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Schedule Appointment
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Book your next Panchakarma appointment
                </p>
              </div>
              <span
                className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <ArrowRightIcon className="h-5 w-5" />
              </span>
            </Link>

            <Link
              to={ROUTES.PROGRESS_TRACKING}
              className="relative group bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400">
                  <ChartBarIcon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Track Progress
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Monitor your treatment progress
                </p>
              </div>
              <span
                className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <ArrowRightIcon className="h-5 w-5" />
              </span>
            </Link>

            <Link
              to={ROUTES.TREATMENT_HISTORY}
              className="relative group bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-yellow-50 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400">
                  <ClockIcon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  View History
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Check your treatement history
                </p>
              </div>
              <span
                className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <ArrowRightIcon className="h-5 w-5" />
              </span>
            </Link>

            <Link
              to={ROUTES.NOTIFICATIONS}
              className="relative group bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-400">
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  View all notifications
                </p>
              </div>
              <span
                className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <ArrowRightIcon className="h-5 w-5" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
