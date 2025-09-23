import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchPatientsByDoctor } from '../../store/slices/patientSlice';
import { fetchAppointments } from '../../store/slices/appointmentSlice';
import { fetchNotifications } from '../../store/slices/notificationSlice';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import AddPatientModal from './AddPatientModal'; // Adjust path if necessary
import {
  UserGroupIcon,
  CalendarDaysIcon,
  ClockIcon,
  BellIcon,
  PlusIcon,
  EyeIcon,
  DocumentTextIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const DoctorDashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { patients, isLoading: patientsLoading } = useAppSelector((state) => state.patient);
  const { appointments, isLoading: appointmentsLoading } = useAppSelector((state) => state.appointments);
  const { notifications, unreadCount } = useAppSelector((state) => state.notifications);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPatientsByDoctor());
    dispatch(fetchAppointments());
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handlePatientAdded = () => {
    handleCloseModal();
    dispatch(fetchPatientsByDoctor());
  };

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
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
    },
    {
      name: "Today's Appointments",
      value: todaysAppointments.length,
      icon: CalendarDaysIcon,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      borderColor: 'border-teal-200 dark:border-teal-800',
    },
    {
      name: 'Completed Appointments',
      value: appointments.filter(a => a.status === 'completed').length,
      icon: ClockIcon,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
    },
    {
      name: 'Unread Notifications',
      value: unreadCount,
      icon: BellIcon,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      borderColor: 'border-teal-200 dark:border-teal-800',
    },
  ];
  
  const quickActions = [
    {
      name: 'Add New Patient',
      description: 'Register a new patient in the system',
      icon: PlusIcon,
      onClick: handleOpenModal,
      color: 'from-emerald-600 to-teal-600',
    },
    {
      name: 'View Appointments',
      description: 'Manage your appointment schedule',
      icon: CalendarDaysIcon,
      href: ROUTES.APPOINTMENT_SCHEDULE,
      color: 'from-teal-600 to-emerald-600',
    },
    // --- NEW: Added 'Manage Patients' card ---
    {
      name: 'Manage Patients',
      description: 'View and manage all patient records',
      icon: UserGroupIcon,
      href: ROUTES.PATIENT_MANAGEMENT,
      color: 'from-emerald-600 to-teal-600',
    },
  ];

  return (
    <>
      <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-6 py-8 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-4">
                  
                </div>
                <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                  Welcome back, Dr. {user?.name || 'Practitioner'}!
                </h1>
                <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                  Here's an overview of your practice and today's schedule.
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.name} className="bg-white dark:bg-slate-800 overflow-hidden shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-200">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 rounded-xl p-3 ${stat.bgColor} border ${stat.borderColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
                      </div>
                      <div className="ml-4 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-semibold text-slate-500 dark:text-slate-400 truncate">
                            {stat.name}
                          </dt>
                          <dd className="text-2xl font-bold text-slate-900 dark:text-white">
                            {stat.value}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Today's Appointments */}
              <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Today's Appointments
                    </h3>
                    <Link
                      to={ROUTES.APPOINTMENT_SCHEDULE}
                      className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                    >
                      <span>View all</span>
                      <EyeIcon className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  {appointmentsLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <div className="rounded-lg bg-slate-200 dark:bg-slate-700 h-12 w-12"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : todaysAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {todaysAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                              <UserGroupIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {appointment.patient?.user?.name || 'Patient Name'}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {appointment.time}
                              </p>
                            </div>
                          </div>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                            {appointment.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CalendarDaysIcon className="mx-auto h-12 w-12 text-slate-400" />
                      <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">No appointments today</h3>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        You have a free day! Time to relax.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Patients */}
              <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Recent Patients
                    </h3>
                    <Link
                      to={ROUTES.PATIENT_MANAGEMENT}
                      className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                    >
                      <span>View all</span>
                      <EyeIcon className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  {patientsLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <div className="rounded-lg bg-slate-200 dark:bg-slate-700 h-12 w-12"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recentPatients.length > 0 ? (
                    <div className="space-y-4">
                      {recentPatients.map((patient) => (
                        <div
                          key={patient.id}
                          className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200"
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg flex items-center justify-center">
                            <UserGroupIcon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                              {patient.user?.name || 'Patient Name'}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                              {patient.user?.email || 'No email'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <UserGroupIcon className="mx-auto h-12 w-12 text-slate-400" />
                      <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">No patients yet</h3>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Start by adding your first patient.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Quick Actions
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Frequently used actions to manage your practice
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {quickActions.map((action) => {
                    const ActionComponent = action.href ? Link : 'button';
                    const props = action.href ? { to: action.href } : { onClick: action.onClick, type: 'button' };
                    
                    return (
                      <ActionComponent
                        key={action.name}
                        {...props}
                        className="group text-left relative rounded-xl border-2 border-slate-200 dark:border-slate-700 p-6 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 hover:shadow-lg"
                      >
                        <div>
                          <span className={`rounded-lg inline-flex p-3 bg-gradient-to-r ${action.color} shadow-lg`}>
                            <action.icon className="h-6 w-6 text-white" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            <span className="absolute inset-0" aria-hidden="true" />
                            {action.name}
                          </h3>
                          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            {action.description}
                          </p>
                        </div>
                      </ActionComponent>
                    );
                  })}
                </div>
              </div>
            </div>
      </div>

      <AddPatientModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPatientAdded={handlePatientAdded}
      />
    </>
  );
};

export default DoctorDashboard;