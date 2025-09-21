import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchPatients } from '../../store/slices/patientSlice';
import { fetchAppointments } from '../../store/slices/appointmentSlice'; // UPDATED
import { fetchNotifications } from '../../store/slices/notificationSlice';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import {
  UserGroupIcon,
  CalendarDaysIcon,
  ClockIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

const DoctorDashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { patients, isLoading: patientsLoading } = useAppSelector((state) => state.patient);
  // UPDATED: Select from the 'appointments' slice
  const { appointments, isLoading: appointmentsLoading } = useAppSelector((state) => state.appointments);
  const { notifications, unreadCount } = useAppSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchPatients());
    // UPDATED: Dispatch the correct action
    dispatch(fetchAppointments());
    dispatch(fetchNotifications());
  }, [dispatch]);

  // UPDATED: Logic now uses 'appointments' and the new data structure
  const todaysAppointments = appointments
    .filter(appointment => {
      const today = new Date().toDateString();
      const appointmentDate = new Date(appointment.date).toDateString();
      return appointmentDate === today && appointment.status === 'scheduled';
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
      name: "Today's Appointments", // UPDATED TEXT
      value: todaysAppointments.length,
      icon: CalendarDaysIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      name: 'Completed Appointments', // UPDATED TEXT
      value: appointments.filter(a => a.status === 'completed').length,
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
                {/* ... stat item JSX is unchanged ... */}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's Appointments */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Today's Appointments
              </h3>
              <Link
                to={ROUTES.APPOINTMENT_SCHEDULE} // UPDATED ROUTE
                className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                View all
              </Link>
            </div>
            <div className="mt-5">
              {appointmentsLoading ? (
                <div className="animate-pulse space-y-3">{/* ... */}</div>
              ) : todaysAppointments.length > 0 ? (
                <div className="space-y-3">
                  {todaysAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div>
                        {/* UPDATED: Displaying patient name is more useful for a doctor */}
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {appointment.patient?.user?.name || 'Patient Name'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {appointment.time}
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
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No appointments today</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    You have a free day!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Patients */}
        {/* This section is already correct and requires no changes */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
           {/* ... */}
        </div>
      </div>

      {/* Quick Actions */}
      {/* This section also needs its text and routes updated */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        {/* ... */}
      </div>
    </div>
  );
};

export default DoctorDashboard;