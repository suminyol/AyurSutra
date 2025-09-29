import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchAppointments } from '../store/slices/appointmentSlice';
import { CalendarDaysIcon,ArrowLeftIcon } from '@heroicons/react/24/outline';

const AppointmentCard = ({ appointment }) => {
  const isPast = new Date(appointment.date) < new Date();
  
  const statusColors = {
    scheduled: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800',
    completed: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 border-red-200 dark:border-red-800',
  };

  return (
    <div className={`flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 ${isPast && appointment.status === 'scheduled' ? 'opacity-60' : ''}`}>
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <CalendarDaysIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {appointment.type?.charAt(0).toUpperCase() + appointment.type?.slice(1) || 'Treatment'} with Dr. {appointment.doctor?.user?.name || 'Doctor'}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {new Date(appointment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} at {appointment.time}
          </p>
        </div>
      </div>
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[appointment.status] || statusColors.completed}`}>
        {appointment.status}
      </span>
    </div>
  );
};

const AllAppointmentsPage = () => {
    const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { appointments, isLoading } = useAppSelector((state) => state.appointments);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const upcomingAppointments = appointments.filter(app => app.status === 'scheduled').sort((a, b) => new Date(a.date) - new Date(b.date));
  const pastAppointments = appointments.filter(app => app.status !== 'scheduled').sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="p-6">
            <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back 
          </button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Appointments</h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
            View your complete history of upcoming and past treatment sessions.
          </p>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center p-12">Loading appointments...</div>
      ) : (
        <>
          {/* Upcoming Appointments Section */}
          <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming</h2>
            </div>
            <div className="p-6 space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(app => <AppointmentCard key={app._id} appointment={app} />)
              ) : (
                <p className="text-center text-slate-500 py-8">You have no upcoming appointments scheduled.</p>
              )}
            </div>
          </div>

          {/* Past Appointments Section */}
          <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">History</h2>
            </div>
            <div className="p-6 space-y-4">
              {pastAppointments.length > 0 ? (
                pastAppointments.map(app => <AppointmentCard key={app._id} appointment={app} />)
              ) : (
                <p className="text-center text-slate-500 py-8">You have no past appointments.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AllAppointmentsPage;