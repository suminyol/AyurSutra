import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import FeedbackModal from './patient/FeedbackModal';
import { CalendarDaysIcon, SparklesIcon, UserIcon, EyeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const TreatmentHistory = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [treatmentPlan, setTreatmentPlan] = useState(null);
  
  const [correctPatientId, setCorrectPatientId] = useState(null);

  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const handleOpenFeedbackModal = (dayNumber) => {
    setSelectedDay(dayNumber);
    setFeedbackModalOpen(true);
  };

  useEffect(() => {
    // Load treatment plan for current user
    if (user?.id || user?._id) { // Check if user object is available
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
        setCorrectPatientId(foundPlan.patientId); 
      }
    }
  }, [dispatch, user?.id, user?._id]); // Added user._id to dependency array

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-6 py-6 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Your Treatment Plan</h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
            View your complete personalized Panchakarma treatment plan
          </p>
        </div>
      </div>

      {/* Treatment Plan Section */}
      {treatmentPlan ? (
        <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-6 py-5 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                  <SparklesIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Your Complete Treatment Plan
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Created on: {new Date(treatmentPlan.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                Active Plan
              </span>
            </div>
          </div>
          <div className="p-6">
            {/* Summary Section */}
            {treatmentPlan.summary && (
              <div className="mb-6 p-5 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                  <EyeIcon className="w-5 h-5 mr-2 text-emerald-600" />
                  Treatment Summary
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {treatmentPlan.summary}
                </p>
              </div>
            )}

            {/* All Days Plan */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center">
                <CalendarDaysIcon className="w-5 h-5 mr-2 text-emerald-600" />
                Daily Treatment Schedule ({treatmentPlan.schedule?.length || 0} Days)
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {treatmentPlan.schedule?.map((dayPlan) => (
                  // --- CHANGE 1: ADD flex and flex-col TO THE CARD ---
                  <div key={dayPlan.day} className="border border-slate-200 dark:border-slate-600 rounded-xl p-4 bg-white dark:bg-slate-800 hover:shadow-lg transition-all duration-200 hover:border-emerald-300 dark:hover:border-emerald-600 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center">
                        <CalendarDaysIcon className="w-4 h-4 mr-1.5 text-emerald-600" />
                        Day {dayPlan.day}
                      </h4>

                      {dayPlan.doctor_consultation?.toLowerCase() === 'yes' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                          <UserIcon className="w-3 h-3 mr-1" />
                          Doctor Visit
                        </span>
                      )}
                    </div>
                    
                    <ul className="space-y-2.5">
                      {dayPlan.plan?.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-start space-x-2.5">
                          <CheckCircleIcon className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {task}
                          </span>
                        </li>
                      )) || []}
                    </ul>
                    {/* --- CHANGE 2: REPLACE mt-4 WITH mt-auto --- */}
                    <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-600">
                      {dayPlan.feedback ? (
                        <p className="w-full text-center px-4 py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">Feedback Submitted!</p>
                      ) : (
                        <button 
                          onClick={() => handleOpenFeedbackModal(dayPlan.day)}
                          className="w-full text-center px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg"
                        >
                          Submit Daily Feedback
                        </button>
                      )}
                  </div>
                  </div>
                )) || []}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Empty State for Treatment Plan
        <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <SparklesIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No treatment plan available</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Your personalized treatment plan will appear here once created by your doctor.
              </p>
            </div>
          </div>
        </div>
      )}
      <FeedbackModal 
        isOpen={isFeedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        dayNumber={selectedDay}
        patientId={correctPatientId}
        onFeedbackSubmitted={(updatedPlan) => {
            // This updates the UI instantly with the new feedback
            setTreatmentPlan(updatedPlan);
        }}
      />
    </div>
  );
};

export default TreatmentHistory;