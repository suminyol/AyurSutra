import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchProgressData, fetchProgressCharts } from '../../store/slices/patientSlice';
import { ChartBarIcon, CalendarDaysIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-6 py-6 border-b border-slate-200 dark:border-slate-700">
              
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Progress Tracking</h1>
              <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                Monitor your therapy progress and recovery milestones
              </p>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-200">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-xl p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-semibold text-slate-500 dark:text-slate-400 truncate">
                        Overall Progress
                      </dt>
                      <dd className="text-2xl font-bold text-slate-900 dark:text-white">
                        85%
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-200">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-xl p-3 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800">
                    <ChartBarIcon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-semibold text-slate-500 dark:text-slate-400 truncate">
                        Data Points
                      </dt>
                      <dd className="text-2xl font-bold text-slate-900 dark:text-white">
                        {progressData.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-200">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-xl p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                    <CalendarDaysIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-semibold text-slate-500 dark:text-slate-400 truncate">
                        Days Tracked
                      </dt>
                      <dd className="text-2xl font-bold text-slate-900 dark:text-white">
                        30
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-200">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-xl p-3 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800">
                    <ChartBarIcon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-semibold text-slate-500 dark:text-slate-400 truncate">
                        Charts
                      </dt>
                      <dd className="text-2xl font-bold text-slate-900 dark:text-white">
                        {progressCharts.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Charts */}
          <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Progress Charts
              </h2>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                </div>
              ) : progressCharts.length > 0 ? (
                <div className="space-y-6">
                  {progressCharts.map((chart) => (
                    <div key={chart.id} className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        {chart.title}
                      </h3>
                      <div className="h-64 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-600">
                        <p className="text-slate-500 dark:text-slate-400">Chart visualization will be implemented here</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <ChartBarIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No progress data</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Your progress charts will appear here once you start tracking your therapy.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Data Points */}
          <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Recent Data Points
              </h2>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                  ))}
                </div>
              ) : progressData.length > 0 ? (
                <div className="space-y-4">
                  {progressData.slice(0, 10).map((data) => (
                    <div
                      key={data.id}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 hover:shadow-lg"
                    >
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {data.metric}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {new Date(data.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                          {data.value} {data.unit}
                        </p>
                        {data.notes && (
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            {data.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <ChartBarIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No data points</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Your progress data will appear here once you start tracking.
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

export default ProgressTracking;