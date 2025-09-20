import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchTherapyTypes, fetchTherapySessions, bookTherapySession } from '../store/slices/therapySlice';
import { useEffect } from 'react';
import { CalendarDaysIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const TherapySchedule = () => {
  const dispatch = useAppDispatch();
  const { therapyTypes, sessions, isLoading } = useAppSelector((state) => state.therapy);
  const { user } = useAppSelector((state) => state.auth);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTherapy, setSelectedTherapy] = useState('');

  useEffect(() => {
    dispatch(fetchTherapyTypes());
    dispatch(fetchTherapySessions());
  }, [dispatch]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedTherapy || !selectedDate || !selectedTime) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await dispatch(bookTherapySession({
        therapyTypeId: selectedTherapy,
        preferredDate: selectedDate,
        preferredTime: selectedTime,
      })).unwrap();
      toast.success('Therapy session booked successfully!');
      setSelectedDate(new Date().toISOString().split('T')[0]);
      setSelectedTime('');
      setSelectedTherapy('');
    } catch (error) {
      toast.error(error || 'Failed to book session');
    }
  };

  const timeSlots = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Schedule Therapy</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Book your Panchakarma therapy sessions
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Booking Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Book New Session
            </h2>
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Therapy Type
                </label>
                <select
                  value={selectedTherapy}
                  onChange={(e) => setSelectedTherapy(e.target.value)}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                >
                  <option value="">Select therapy type</option>
                  {therapyTypes.map((therapy) => (
                    <option key={therapy.id} value={therapy.id}>
                      {therapy.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                >
                  <option value="">Select time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isLoading ? 'Booking...' : 'Book Session'}
              </button>
            </form>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Upcoming Sessions
              </h2>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
              ) : sessions.filter(s => s.status === 'scheduled').length > 0 ? (
                <div className="space-y-4">
                  {sessions
                    .filter(s => s.status === 'scheduled')
                    .slice(0, 5)
                    .map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                            <CalendarDaysIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                              {session.therapyType?.name || 'Therapy Session'}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(session.scheduledDate).toLocaleDateString()} at {session.startTime}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {session.status}
                          </span>
                          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <ClockIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No upcoming sessions</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Book your first therapy session to get started.
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

export default TherapySchedule;
