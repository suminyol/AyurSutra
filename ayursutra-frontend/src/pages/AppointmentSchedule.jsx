import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchAppointments, createAppointment } from '../store/slices/appointmentSlice';
import { fetchDoctors } from '../store/slices/doctorSlice';
import { fetchPatients } from '../store/slices/patientSlice';
import { CalendarDaysIcon, ClockIcon, UserIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const getInitialDate = () => {
  const now = new Date();
  if (now.getHours() >= 17) {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }
  return now.toISOString().split('T')[0];
};

const AppointmentSchedule = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // Selectors for Redux state
  const { user } = useAppSelector((state) => state.auth);
  const { appointments, isLoading: isBooking } = useAppSelector((state) => state.appointments);
  const { doctors, isLoading: areDoctorsLoading } = useAppSelector((state) => state.doctors);
  const { patients, isLoading: arePatientsLoading } = useAppSelector((state) => state.patient);

  // Form state (used by patients)
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDate, setSelectedDate] = useState(getInitialDate());
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('consultation');
  const [reason, setReason] = useState('');

  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(fetchDoctors());
    if (user?.role === 'doctor') {
      dispatch(fetchPatients());
    }
  }, [dispatch, user?.role]);

  // --- LOGIC FOR PATIENT BOOKING FORM ---
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedTime || !reason) {
      toast.error('Please fill out all required fields.');
      return;
    }

    const appointmentData = {
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      type: appointmentType,
      reason: reason,
    };
    
    try {
      await dispatch(createAppointment(appointmentData)).unwrap();
      toast.success('Appointment booked successfully!');
      setSelectedDoctor('');
      setSelectedDate(new Date().toISOString().split('T')[0]);
      setSelectedTime('');
      setReason('');
    } catch (error) {
      toast.error(error || 'Failed to book appointment');
    }
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
  ];

  const getAvailableTimeSlots = () => {
    const bookedSlots = appointments
      .filter(
        (appointment) =>
          appointment.doctor?.id === selectedDoctor &&
          new Date(appointment.date).toISOString().split('T')[0] === selectedDate &&
          (appointment.status === 'scheduled' || appointment.status === 'confirmed')
      )
      .map((appointment) => appointment.time);

    let availableSlots = timeSlots.filter(slot => !bookedSlots.includes(slot));
    const today = new Date();
    const isSelectedDateToday = new Date(selectedDate).toDateString() === today.toDateString();

    if (!isSelectedDateToday) return availableSlots;

    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();

    return availableSlots.filter(time => {
      const [slotHour, slotMinute] = time.split(':').map(Number);
      if (slotHour > currentHour) return true;
      return slotHour === currentHour && slotMinute > currentMinute;
    });
  };

  const upcomingAppointments = appointments
    .filter(appointment => ['scheduled', 'confirmed'].includes(appointment.status))
    .slice(0, 5);

  // --- LOGIC FOR DOCTOR'S VIEW ---
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB - dateA;
  });

  const getStatusChipClass = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border border-blue-200 dark:border-blue-800';
      case 'confirmed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 border border-red-200 dark:border-red-800';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600';
    }
  };


  // --- CONDITIONAL RENDERING BASED ON USER ROLE ---
  if (user?.role === 'doctor') {
    // --- RENDER DOCTOR'S VIEW (LIST ONLY) ---
    return (
      <div className="space-y-8">
        <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-6 py-6 border-b border-slate-200 dark:border-slate-700">
          
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">All Appointments</h1>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400">View and manage all scheduled patient appointments.</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="p-6">
            {isBooking ? <div className="text-center py-12">Loading...</div> : sortedAppointments.length > 0 ? (
              <div className="space-y-4">
                {sortedAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                        <CalendarDaysIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white">{appointment.type?.charAt(0).toUpperCase() + appointment.type?.slice(1)}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center"><UserIcon className="w-4 h-4 mr-1.5" /> Patient: {appointment.patient?.user?.name || 'N/A'}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center"><CalendarDaysIcon className="w-4 h-4 mr-1.5" />{new Date(appointment.date).toLocaleDateString()}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center"><ClockIcon className="w-4 h-4 mr-1.5" />{appointment.time || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${getStatusChipClass(appointment.status)}`}>{appointment.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12"><h3 className="text-lg font-semibold text-slate-900 dark:text-white">No Appointments Found</h3></div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER PATIENT'S VIEW (FORM + LIST) ---
  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-6 py-6 border-b border-slate-200 dark:border-slate-700">
        <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back 
          </button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Schedule Appointment</h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">Book your consultation or follow-up appointments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700"><h2 className="text-lg font-bold text-slate-900 dark:text-white">Book New Appointment</h2></div>
            <div className="p-6">
              <form onSubmit={handleBooking} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Doctor</label>
                  <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2.5" required>
                    <option value="">{areDoctorsLoading ? 'Loading...' : 'Select a doctor'}</option>
                    {doctors.filter(d => d.user).map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.user.name} ({doctor.specialization})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Appointment Type</label>
                  <select value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2.5" required>
                    <option value="consultation">Consultation</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="therapy">Therapy Session</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Date</label>
                  <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2.5" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Time</label>
                  <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2.5" required>
                    <option value="">Select time</option>
                    {getAvailableTimeSlots().map((time) => <option key={time} value={time}>{time}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Reason for Visit</label>
                  <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2.5" required placeholder="Briefly describe your symptoms..."/>
                </div>
                <button type="submit" disabled={isBooking} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-4 rounded-lg font-semibold">{isBooking ? 'Booking...' : 'Book Appointment'}</button>
              </form>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700"><h2 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming Appointments</h2></div>
            <div className="p-6">
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center"><CalendarDaysIcon className="w-6 h-6 text-white" /></div>
                        <div>
                          <h3 className="text-base font-semibold text-slate-900 dark:text-white">{appointment.type?.charAt(0).toUpperCase() + appointment.type?.slice(1)}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">with Dr. {appointment.doctor?.user?.name}</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">{appointment.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12"><h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No upcoming appointments</h3></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>  
  );
};

export default AppointmentSchedule;