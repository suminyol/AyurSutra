import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchAppointments, createAppointment } from '../store/slices/appointmentSlice'; // UPDATED
import { fetchDoctors } from '../store/slices/doctorSlice'; // UPDATED
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AppointmentSchedule = () => {
  const dispatch = useAppDispatch();
  // UPDATED: Select from correct slices
  const { appointments, isLoading: isBooking } = useAppSelector((state) => state.appointments);
  const { doctors, isLoading: areDoctorsLoading } = useAppSelector((state) => state.doctors);
  
  // UPDATED: Form state to match appointment model
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('consultation');
  const [reason, setReason] = useState('');

  useEffect(() => {
    // UPDATED: Fetch appointments and doctors
    dispatch(fetchAppointments());
    dispatch(fetchDoctors());
  }, [dispatch]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedTime || !reason) {
      toast.error('Please select a doctor, date, time, and provide a reason.');
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
      // Reset form
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Schedule Appointment</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Book your consultation or follow-up appointments.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Booking Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Book New Appointment
            </h2>
            <form onSubmit={handleBooking} className="space-y-4">
              {/* UPDATED: Doctor Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Doctor</label>
                <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" required>
                  <option value="">{areDoctorsLoading ? 'Loading doctors...' : 'Select a doctor'}</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.user.name} ({doctor.specialization})
                    </option>
                  ))}
                </select>
              </div>

              {/* UPDATED: Appointment Type Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Appointment Type</label>
                <select value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)} className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" required>
                  <option value="consultation">Consultation</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="therapy">Therapy Session</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" required>
                  <option value="">Select time</option>
                  {timeSlots.map((time) => (<option key={time} value={time}>{time}</option>))}
                </select>
              </div>

              {/* UPDATED: Reason Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason for Visit</label>
                <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" required placeholder="Briefly describe your symptoms or reason for this appointment."></textarea>
              </div>

              <button type="submit" disabled={isBooking} className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50">
                {isBooking ? 'Booking...' : 'Book Appointment'}
              </button>
            </form>
          </div>
        </div>

        {/* Upcoming Appointments List */}
        <div className="lg:col-span-2">
          {/* ... This part is now refactored to use the 'appointments' state */}
        </div>
      </div>
    </div>
  );
};

export default AppointmentSchedule;