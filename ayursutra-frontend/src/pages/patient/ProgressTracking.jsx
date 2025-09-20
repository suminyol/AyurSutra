import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchProgressData, fetchProgressCharts } from '../../store/slices/patientSlice';
import { ChartBarIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const ProgressTracking = () => {
  const dispatch = useAppDispatch();
  const { progressData, progressCharts, isLoading } = useAppSelector((state) => state.patient);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchProgressData(user.id));
      dispatch(fetchProgressCharts(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Progress Tracking</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Monitor your therapy progress and recovery milestones
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-green-100 dark:bg-green-900">
                  <TrendingUpIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Overall Progress
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    85%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-blue-100 dark:bg-blue-900">
                  <ChartBarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Data Points
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {progressData.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-yellow-100 dark:bg-yellow-900">
                  <CalendarDaysIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Days Tracked
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    30
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-purple-100 dark:bg-purple-900">
                  <ChartBarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Charts
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {progressCharts.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Charts */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Progress Charts
          </h2>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ) : progressCharts.length > 0 ? (
            <div className="space-y-6">
              {progressCharts.map((chart) => (
                <div key={chart.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {chart.title}
                  </h3>
                  <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Chart visualization will be implemented here</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No progress data</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your progress charts will appear here once you start tracking your therapy.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Data Points */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Recent Data Points
          </h2>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          ) : progressData.length > 0 ? (
            <div className="space-y-4">
              {progressData.slice(0, 10).map((data) => (
                <div
                  key={data.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {data.metric}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(data.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {data.value} {data.unit}
                    </p>
                    {data.notes && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {data.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No data points</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your progress data will appear here once you start tracking.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracking;
