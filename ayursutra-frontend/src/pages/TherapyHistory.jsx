import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchTherapySessions } from '../store/slices/therapySlice';
import { ClockIcon, CheckCircleIcon, XCircleIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const TherapyHistory = () => {
  const dispatch = useAppDispatch();
  const { sessions, isLoading } = useAppSelector((state) => state.therapy);

  useEffect(() => {
    dispatch(fetchTherapySessions());
  }, [dispatch]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Therapy History</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View all your therapy sessions and their status
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            All Sessions
          </h2>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          ) : sessions.length > 0 ? (
            <div className="space-y-4">
              {sessions.map((session) => (
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
                        {new Date(session.scheduledDate).toLocaleDateString()} at {session.startTime} - {session.endTime}
                      </p>
                      {session.notes && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {session.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                    {getStatusIcon(session.status)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No therapy history</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your therapy sessions will appear here once you book them.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TherapyHistory;
