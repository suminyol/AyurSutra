import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchAppointments, createAppointment } from '../store/slices/appointmentSlice';
import { fetchDoctors } from '../store/slices/doctorSlice';
import { fetchPatients } from '../store/slices/patientSlice';
import { CalendarDaysIcon, ClockIcon, UserIcon, SparklesIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const getInitialDate = () => {
  const now = new Date();
  // If current time is 5 PM (17:00) or later, default to tomorrow
  if (now.getHours() >= 17) {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }
  return now.toISOString().split('T')[0];
};

const AppointmentSchedule = () => {
  const dispatch = useAppDispatch();
  
  // Selectors for Redux state
  const { user } = useAppSelector((state) => state.auth);
  const { appointments, isLoading: isBooking } = useAppSelector((state) => state.appointments);
  const { doctors, isLoading: areDoctorsLoading } = useAppSelector((state) => state.doctors);
  const { patients, isLoading: arePatientsLoading } = useAppSelector((state) => state.patient);

  // Form state
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDate, setSelectedDate] = useState(getInitialDate());
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('consultation');
  const [reason, setReason] = useState('');

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchAppointments());
    dispatch(fetchDoctors());
    // Only fetch the full patient list if the user is a doctor
    if (user?.role === 'doctor') {
      dispatch(fetchPatients());
    }
  }, [dispatch, user?.role]);

  const handleBooking = async (e) => {
    e.preventDefault();
    const isDoctor = user?.role === 'doctor';

    // Validation
    if (isDoctor && !selectedPatient) {
      toast.error('Please select a patient to book for.');
      return;
    }
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

    // Add patient ID if the user is a doctor
    if (isDoctor) {
      appointmentData.patient = selectedPatient;
    }

    try {
      await dispatch(createAppointment(appointmentData)).unwrap();
      toast.success('Appointment booked successfully!');
      
      // Reset form
      setSelectedDoctor('');
      // Only reset patient selector if it's visible
      if (isDoctor) {
        setSelectedPatient('');
      }
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
    // Get slots already booked for the selected doctor on the selected date
    const bookedSlots = appointments
      .filter(
        (appointment) =>
          appointment.doctor?.id === selectedDoctor &&
          new Date(appointment.date).toISOString().split('T')[0] === selectedDate &&
          (appointment.status === 'scheduled' || appointment.status === 'confirmed')
      )
      .map((appointment) => appointment.time);

    // Filter out the booked slots from the master list
    let availableSlots = timeSlots.filter(slot => !bookedSlots.includes(slot));

    const today = new Date();
    const isSelectedDateToday = new Date(selectedDate).toDateString() === today.toDateString();

    if (!isSelectedDateToday) {
      return availableSlots; // For future dates, just show non-booked slots
    }

    // For today, also filter out past time slots
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();

    return availableSlots.filter(time => {
      const [slotHour, slotMinute] = time.split(':').map(Number);
      if (slotHour > currentHour) return true;
      return slotHour === currentHour && slotMinute > currentMinute;
    });
  };

  const upcomingAppointments = appointments
    .filter(appointment => appointment.status === 'scheduled')
    .slice(0, 5);

  return (
    <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-6 py-6 border-b border-slate-200 dark:border-slate-700">
               
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Schedule Appointment</h1>
                <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                  Book your consultation or follow-up appointments
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Booking Form */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Book New Appointment
                    </h2>
                  </div>
                  <div className="p-6">
                    <form onSubmit={handleBooking} className="space-y-6">
                      {/* Doctor Selector */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Doctor
                        </label>
                        <select 
                          value={selectedDoctor} 
                          onChange={(e) => setSelectedDoctor(e.target.value)} 
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200" 
                          required
                        >
                          <option value="">{areDoctorsLoading ? 'Loading doctors...' : 'Select a doctor'}</option>
                          {doctors.filter(d => d.user).map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                              {doctor.user.name} ({doctor.specialization})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Patient Selector for Doctors */}
                      {user?.role === 'doctor' && (
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Patient
                          </label>
                          <select 
                            value={selectedPatient} 
                            onChange={(e) => setSelectedPatient(e.target.value)} 
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200" 
                            required
                          >
                            <option value="">{arePatientsLoading ? 'Loading patients...' : 'Select a patient'}</option>
                            {patients.filter(p => p.user).map((patient) => (
                              <option key={patient.id} value={patient.id}>
                                {patient.user.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Appointment Type Selector */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Appointment Type
                        </label>
                        <select 
                          value={appointmentType} 
                          onChange={(e) => setAppointmentType(e.target.value)} 
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200" 
                          required
                        >
                          <option value="consultation">Consultation</option>
                          <option value="follow-up">Follow-up</option>
                          <option value="therapy">Therapy Session</option>
                        </select>
                      </div>

                      {/* Date Selector */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Date
                        </label>
                        <input 
                          type="date" 
                          value={selectedDate} 
                          onChange={(e) => setSelectedDate(e.target.value)} 
                          min={new Date().toISOString().split('T')[0]} 
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200" 
                          required 
                        />
                      </div>

                      {/* Time Selector */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Time
                        </label>
                        <select 
                          value={selectedTime} 
                          onChange={(e) => setSelectedTime(e.target.value)} 
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200" 
                          required
                        >
                          <option value="">Select time</option>
                          {getAvailableTimeSlots().map((time) => (
                            <option key={time} value={time}>{time} </option>
                          ))}
                        </select>
                      </div>

                      {/* Reason Field */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Reason for Visit
                        </label>
                        <textarea 
                          value={reason} 
                          onChange={(e) => setReason(e.target.value)} 
                          rows={4} 
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none" 
                          required 
                          placeholder="Briefly describe your symptoms or reason for this appointment..."
                        />
                      </div>

                      <button 
                        type="submit" 
                        disabled={isBooking} 
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                      >
                        {isBooking ? 'Booking...' : 'Book Appointment'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Upcoming Appointments List */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Upcoming Appointments
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Your scheduled appointments
                    </p>
                  </div>
                  <div className="p-6">
                    {upcomingAppointments.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 hover:shadow-lg"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                                <CalendarDaysIcon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                                  {appointment.type?.charAt(0).toUpperCase() + appointment.type?.slice(1) || 'Appointment'}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  with Dr. {appointment.doctor?.user?.name || 'Doctor'}
                                </p>
                                <div className="flex items-center space-x-4 mt-1">
                                  <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                                    <CalendarDaysIcon className="w-4 h-4 mr-1" />
                                    {new Date(appointment.date).toLocaleDateString()}
                                  </p>
                                  <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                                    <ClockIcon className="w-4 h-4 mr-1" />
                                    {appointment.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
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
                        <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No upcoming appointments</h3>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                          Book your first appointment using the form on the left.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
    </div>  
  );
};

export default AppointmentSchedule;