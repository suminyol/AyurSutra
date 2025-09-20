import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchPatients } from '../../store/slices/patientSlice';
import { fetchTherapySessions } from '../../store/slices/therapySlice';
import { fetchNotifications } from '../../store/slices/notificationSlice';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import {
  UserGroupIcon,
  CalendarDaysIcon,
  ClockIcon,
  BellIcon,
  PlusIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const DoctorDashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { patients, isLoading: patientsLoading } = useAppSelector((state) => state.patient);
  const { sessions, isLoading: sessionsLoading } = useAppSelector((state) => state.therapy);
  const { notifications, unreadCount } = useAppSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchPatients());
    dispatch(fetchTherapySessions());
    dispatch(fetchNotifications());
  }, [dispatch]);

  const todaySessions = sessions
    .filter(session => {
      const today = new Date().toDateString();
      const sessionDate = new Date(session.scheduledDate).toDateString();
      return sessionDate === today && session.status === 'scheduled';
    })
    .slice(0, 5);

  const recentPatients = patients.slice(0, 5);

  const stats = [
    {
      name: 'Total Patients',
      value: patients.length,
      icon: UserGroupIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      name: "Today's Sessions",
      value: todaySessions.length,
      icon: CalendarDaysIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      name: 'Completed Sessions',
      value: sessions.filter(s => s.status === 'completed').length,
      icon: ClockIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
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
            Welcome back, Dr. {user?.name || 'Practitioner'}!
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Here's an overview of your practice and today's schedule.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
        {/* Today's Sessions */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Today's Sessions
              </h3>
              <Link
                to={ROUTES.THERAPY_SCHEDULE}
                className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                View all
              </Link>
            </div>
            <div className="mt-5">
              {sessionsLoading ? (
                <div className="animate-pulse space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
              ) : todaySessions.length > 0 ? (
                <div className="space-y-3">
                  {todaySessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.therapyType?.name || 'Therapy Session'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {session.startTime} - {session.endTime}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {session.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No sessions today</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    You have a free day! Schedule new sessions or review patient records.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Recent Patients
              </h3>
              <Link
                to={ROUTES.PATIENT_MANAGEMENT}
                className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                View all
              </Link>
            </div>
            <div className="mt-5">
              {patientsLoading ? (
                <div className="animate-pulse space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
              ) : recentPatients.length > 0 ? (
                <div className="space-y-3">
                  {recentPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                          <UserGroupIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {patient.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {patient.email}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(patient.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No patients yet</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Start by adding your first patient to the system.
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
              to={ROUTES.PATIENT_MANAGEMENT}
              className="relative group bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                  <UserGroupIcon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Manage Patients
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  View and manage patient records
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
              to={ROUTES.THERAPY_SCHEDULE}
              className="relative group bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400">
                  <CalendarDaysIcon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Schedule Therapy
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Book therapy sessions for patients
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
              to={ROUTES.THERAPY_HISTORY}
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
                  Check therapy session history
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

export default DoctorDashboard;
