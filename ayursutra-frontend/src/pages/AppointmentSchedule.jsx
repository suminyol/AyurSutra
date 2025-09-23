import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchAppointments } from '../store/slices/appointmentSlice';
import { CalendarDaysIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';

const AppointmentSchedule = () => {
  const dispatch = useAppDispatch();
  
  // Selector for Redux state
  const { appointments, isLoading } = useAppSelector((state) => state.appointments);

  useEffect(() => {
    // Fetch initial appointment data
    dispatch(fetchAppointments());
  }, [dispatch]);

  // Create a sorted copy of appointments to avoid mutating state
  // Sorted by date, most recent first.
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB - dateA;
  });

  const getStatusChipClass = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border border-blue-200 dark:border-blue-800';
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 border border-red-200 dark:border-red-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600';
    }
  };


  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-6 py-6 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">All Appointments</h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
            View and manage all scheduled patient appointments.
          </p>
        </div>
      </div>

      {/* All Appointments List */}
      <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Appointment History
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            A complete log of all appointments in the system.
          </p>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">Loading appointments...</div>
          ) : sortedAppointments.length > 0 ? (
            <div className="space-y-4">
              {sortedAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                      <CalendarDaysIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                        {appointment.type?.charAt(0).toUpperCase() + appointment.type?.slice(1) || 'Appointment'}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center">
                        <UserIcon className="w-4 h-4 mr-1.5" />
                        Patient: {appointment.patient?.user?.name || 'N/A'}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                          <CalendarDaysIcon className="w-4 h-4 mr-1.5" />
                          {new Date(appointment.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1.5" />
                          {appointment.time || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${getStatusChipClass(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CalendarDaysIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No Appointments Found</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                There are currently no appointments in the system.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>  
  );
};

export default AppointmentSchedule;