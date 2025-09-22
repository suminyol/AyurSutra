import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchPatientById } from '../../store/slices/patientSlice';
// --- MODIFIED: Replaced UserMdIcon with UserIcon ---
import { ArrowLeftIcon, CalendarDaysIcon, SparklesIcon, UserIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const TreatmentPlan = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { currentPatient, currentTreatmentPlan, isLoading } = useAppSelector((state) => state.patient);

    useEffect(() => {
        // Fetch patient info if it's not already in the state
        if (!currentPatient && patientId) {
            dispatch(fetchPatientById(patientId));
        }
    }, [currentPatient, patientId, dispatch]);

    if (isLoading) {
        return <div className="text-center p-8">Loading Treatment Plan...</div>;
    }

    if (!currentPatient || !currentTreatmentPlan) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <SparklesIcon className="h-8 w-8 text-white" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">No Treatment Plan Found</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">A plan has not been generated for this patient yet.</p>
                <button
                    onClick={() => navigate(`/patient/${patientId}`)}
                    className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Go Back to Assessment
                </button>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                        <button onClick={() => navigate(`/patient/${patientId}`)} className="mb-4 inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-500">
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />
                            Back to Patient Assessment
                        </button>
                        <div className="flex justify-between items-start">
                             <div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI-Generated Treatment Plan</h1>
                                <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                                    A personalized daily schedule for <span className="font-semibold">{currentPatient.user.name}</span>.
                                </p>
                             </div>
                             <div className="flex-shrink-0 flex items-center space-x-2">
                                <SparklesIcon className="h-6 w-6 text-emerald-500" />
                                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Powered by AI</span>
                             </div>
                        </div>
                    </div>

                    {/* Day-wise Plan */}
                    <div className="space-y-6">
                        {currentTreatmentPlan.schedule.map((dayPlan) => (
                            <div key={dayPlan.day} className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <div className="p-5 flex items-center space-x-4 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <CalendarDaysIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Day {dayPlan.day}</h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    {dayPlan.doctor_consultation.toLowerCase() === 'yes' && (
                                        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 flex items-center space-x-3">
                                            {/* --- MODIFIED: Replaced UserMdIcon with UserIcon --- */}
                                            <UserIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0"/>
                                            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Doctor Consultation Scheduled for Today.</p>
                                        </div>
                                    )}
                                    <ul className="space-y-3">
                                        {dayPlan.plan.map((task, index) => (
                                            <li key={index} className="flex items-start space-x-3">
                                                <CheckCircleIcon className="h-5 w-5 text-teal-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-base text-slate-600 dark:text-slate-300">{task}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TreatmentPlan;

