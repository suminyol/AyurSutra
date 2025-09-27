import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchTreatmentSessions } from '../store/slices/treatmentSlice';
import { ClockIcon, CheckCircleIcon, XCircleIcon, CalendarDaysIcon, SparklesIcon, UserIcon } from '@heroicons/react/24/outline';

const TreatmentHistory = () => {
  const dispatch = useAppDispatch();
  const { sessions, isLoading } = useAppSelector((state) => state.treatment);
  const { user } = useAppSelector((state) => state.auth);
  const [treatmentPlan, setTreatmentPlan] = useState(null);

  useEffect(() => {
    dispatch(fetchTreatmentSessions());
    
    // Load treatment plan for current user
    if (user?.id) {
      // Try to find treatment plan with various possible keys
      const possibleKeys = [
        `treatment_plan_${user.id}`,
        `treatment_plan_${user._id}`,
      ];
      
      let foundPlan = null;
      
      for (const key of possibleKeys) {
        const savedPlan = localStorage.getItem(key);
        if (savedPlan) {
          try {
            foundPlan = JSON.parse(savedPlan);
            break;
          } catch (error) {
            console.error('Error loading treatment plan:', error);
          }
        }
      }
      
      // If not found with direct keys, search through all treatment plans
      if (!foundPlan) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('treatment_plan_')) {
            try {
              const plan = JSON.parse(localStorage.getItem(key));
              // Take the most recent plan if multiple exist
              if (plan && plan.createdAt) {
                if (!foundPlan || new Date(plan.createdAt) > new Date(foundPlan.createdAt)) {
                  foundPlan = plan;
                }
              }
            } catch (error) {
              console.error('Error parsing treatment plan:', error);
            }
          }
        }
      }
      
      if (foundPlan) {
        setTreatmentPlan(foundPlan);
      }
    }
  }, [dispatch, user?.id]);

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Treatment Plan</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View your complete treatment plan
        </p>
      </div>

      {/* Current Treatment Plan Section */}
      {treatmentPlan && (
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <SparklesIcon className="h-6 w-6 text-emerald-600" />
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Your Complete Treatment Plan
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Created on: {new Date(treatmentPlan.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {/* Summary Section */}
            {treatmentPlan.summary && (
              <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <h3 className="text-md font-semibold text-slate-900 dark:text-white mb-3">Treatment Summary</h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {treatmentPlan.summary}
                </p>
              </div>
            )}

            {/* All Days Plan */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-slate-900 dark:text-white">Daily Treatment Schedule</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {treatmentPlan.schedule?.map((dayPlan) => (
                  <div key={dayPlan.day} className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 bg-slate-50 dark:bg-slate-700/30">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Day {dayPlan.day}
                      </h4>
                      {dayPlan.doctor_consultation?.toLowerCase() === 'yes' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                          <UserIcon className="w-3 h-3 mr-1" />
                          Doctor Visit
                        </span>
                      )}
                    </div>
                    
                    <ul className="space-y-2">
                      {dayPlan.plan?.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-start space-x-2">
                          <CheckCircleIcon className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {task}
                          </span>
                        </li>
                      )) || []}
                    </ul>
                  </div>
                )) || []}
              </div>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default TreatmentHistory;
