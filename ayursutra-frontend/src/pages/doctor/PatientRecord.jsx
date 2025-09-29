import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Imports for redux hooks and actions are removed as we are making this component self-contained.
import toast from 'react-hot-toast';
import { SparklesIcon, ArrowLeftIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

// --- START: SELF-CONTAINED COMPONENT ---
// To resolve the import error, the FeedbackDisplay component is now defined directly inside this file.
const FeedbackDisplay = ({ feedback }) => {
    if (!feedback) return null;

    const getSymptomStatus = (level) => {
        switch (level) {
            case 'better': return { text: 'Better', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' };
            case 'same': return { text: 'Same', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30' };
            case 'worse': return { text: 'Worse', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' };
            default: return { text: 'N/A', color: 'text-slate-500', bgColor: 'bg-slate-100 dark:bg-slate-700' };
        }
    };

    const symptomStatus = getSymptomStatus(feedback.symptomStatus);

    return (
        <div className="mt-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                    <strong className="w-28 font-semibold text-slate-600 dark:text-slate-300">Symptom Status:</strong>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${symptomStatus.color} ${symptomStatus.bgColor}`}>
                        {symptomStatus.text}
                    </span>
                </div>
                <div className="flex items-center">
                    <strong className="w-28 font-semibold text-slate-600 dark:text-slate-300">Energy Level:</strong>
                    <span className="text-slate-800 dark:text-slate-200">{feedback.energyLevel || 'N/A'} / 10</span>
                </div>
                 <div className="flex items-center">
                    <strong className="w-28 font-semibold text-slate-600 dark:text-slate-300">Sleep Quality:</strong>
                    <span className="text-slate-800 dark:text-slate-200">{feedback.sleepQuality || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                    <strong className="w-28 font-semibold text-slate-600 dark:text-slate-300">Stress Level:</strong>
                     <span className="text-slate-800 dark:text-slate-200">{feedback.stressLevel || 'N/A'} / 10</span>
                </div>
            </div>
            {feedback.comments && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                     <strong className="font-semibold text-slate-600 dark:text-slate-300">Additional Comments:</strong>
                     <p className="mt-1 text-sm text-slate-700 dark:text-slate-400 italic">"{feedback.comments}"</p>
                </div>
            )}
        </div>
    );
};
// --- END: SELF-CONTAINED COMPONENT ---


const FORM_SECTIONS = {
    "PATIENT INFO": {
        age: { label: "Age", type: 'select', options: ['Child (0-15)', 'Adult (16-40)', 'Middle Age (41-60)', 'Senior (60+)'] },
        gender: { label: "Gender", type: 'select', options: ['Male', 'Female', 'Other'] },
        chiefComplaint: { label: "Chief Complaint", type: 'select', options: ['Digestive Issues', 'Joint/Muscle Pain', 'Respiratory Problems', 'Skin Conditions', 'Mental Stress', 'Sleep Issues'] },
        duration: { label: "Duration", type: 'select', options: ['Recent (< 1 month)', 'Ongoing (1-6 months)', 'Chronic (> 6 months)'] }
    },
    "AYURVEDIC EXAMINATION": {
        nadi: { label: "Nadi (Pulse)", type: 'select', options: ['Vata', 'Pitta', 'Kapha', 'Mixed'] },
        jihva: { label: "Jihva (Tongue)", type: 'select', options: ['Clean', 'Coated', 'Red/Inflamed'] },
        mala: { label: "Mala (Stool)", type: 'select', options: ['Normal', 'Hard/Dry', 'Loose/Burning', 'Heavy/Sticky'] },
        mutra: { label: "Mutra (Urine)", type: 'select', options: ['Clear', 'Yellow', 'Dark/Concentrated'] },
        agni: { label: "Agni (Digestive Fire)", type: 'select', options: ['Strong', 'Moderate', 'Weak', 'Variable'] }
    },
    "PHYSICAL EXAMINATION": {
        bodyBuild: { label: "Body Build", type: 'select', options: ['Thin (Vata)', 'Medium (Pitta)', 'Heavy (Kapha)'] },
        skin: { label: "Skin", type: 'select', options: ['Dry', 'Normal', 'Oily'] },
        sleepPattern: { label: "Sleep Pattern", type: 'select', options: ['Good', 'Disturbed', 'Excessive'] },
        energyLevel: { label: "Energy Level", type: 'select', options: ['High', 'Moderate', 'Low'] }
    },
    "DOSHA ANALYSIS": {
        vataSymptoms: { label: "Vata Symptoms Present", type: 'checkbox', options: ['Anxiety/Worry', 'Constipation', 'Joint Pain', 'Insomnia', 'Dry Skin'], severity: 'vataSeverity' },
        pittaSymptoms: { label: "Pitta Symptoms Present", type: 'checkbox', options: ['Anger/Irritability', 'Acidity/Heartburn', 'Skin Rashes', 'Excessive Heat', 'Loose Stools'], severity: 'pittaSeverity' },
        kaphaSymptoms: { label: "Kapha Symptoms Present", type: 'checkbox', options: ['Depression/Lethargy', 'Weight Gain', 'Cold/Cough', 'Congestion', 'Slow Digestion'], severity: 'kaphaSeverity' }
    },
    "SYMPTOM ANALYSIS": {
        digestive: { label: "Digestive System", type: 'select', options: ['Normal', 'Weak Appetite', 'Acidity', 'Bloating', 'Constipation', 'Loose Motions'] },
        respiratory: { label: "Respiratory System", type: 'select', options: ['Normal', 'Cough', 'Breathlessness', 'Chest Congestion', 'Wheezing'] },
        musculoskeletal: { label: "Musculoskeletal System", type: 'select', options: ['Normal', 'Joint Pain', 'Back Pain', 'Muscle Weakness', 'Stiffness'] },
        mental: { label: "Mental State", type: 'select', options: ['Calm', 'Anxious', 'Irritable', 'Depressed', 'Restless'] },
        sleep: { label: "Sleep Quality", type: 'select', options: ['Sound Sleep', 'Difficulty Sleeping', 'Disturbed Sleep', 'Excessive Sleep'] }
    }
};

const getInitialFormData = () => {
    const initialState = {};
    Object.values(FORM_SECTIONS).forEach(section => {
        Object.keys(section).forEach(key => {
            if (section[key].type === 'checkbox') {
                initialState[key] = {};
                section[key].options.forEach(opt => initialState[key][opt.replace(/[\/\s-]/g, '')] = false);
                initialState[section[key].severity] = 'Mild';
            } else {
                initialState[key] = '';
            }
        });
    });
    return initialState;
};

const PatientRecord = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();
    // Redux dispatch is removed.
    
    // --- START: LOCAL STATE REPLACEMENT FOR REDUX ---
    // The component now uses local state instead of a Redux store.
    const [currentPatient, setCurrentPatient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // --- END: LOCAL STATE REPLACEMENT FOR REDUX ---

    const [treatment, setTreatment] = useState(null);
    const [formData, setFormData] = useState(getInitialFormData());

    useEffect(() => {
        const loadData = async () => {
            if (patientId) {
                setIsLoading(true);
                // --- START: SIMULATED DATA FETCHING ---
                // This replaces the Redux async thunk `fetchPatientById`.
                // In a real app, you would fetch patient details here.
                // For now, we simulate finding a patient.
                try {
                     // Mock patient data for demonstration
                    const mockPatient = {
                        _id: patientId,
                        user: { name: "John Doe" },
                        examinationData: {} // Assuming this can be populated from the form
                    };
                    setCurrentPatient(mockPatient);
                    
                    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/treatment-plans/patient/${patientId}`;
                    const response = await fetch(apiUrl, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('ayursutra_auth_token')}` }
                    });

                    if (response.ok) {
                        const result = await response.json();
                        setTreatment(result.data);
                        toast.success('Treatment and feedback loaded!');
                    } else if (response.status === 404) {
                        console.log("No existing treatment found for this patient.");
                        setTreatment(null);
                    } else {
                        const errorResult = await response.json();
                        throw new Error(errorResult.message || 'Failed to fetch treatment from server.');
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                    toast.error(error.message || "Could not load patient data.");
                } finally {
                    setIsLoading(false);
                }
                // --- END: SIMULATED DATA FETCHING ---
            }
        };

        loadData();

        return () => {
            // This replaces the Redux action `setCurrentPatient(null)`.
            setCurrentPatient(null);
        };
    }, [patientId]);

    useEffect(() => {
        if (currentPatient?.examinationData) {
            setFormData(prev => ({ ...getInitialFormData(), ...currentPatient.examinationData }));
        }
    }, [currentPatient]);

    const totalFieldCount = useMemo(() => Object.values(FORM_SECTIONS).reduce((count, section) => count + Object.keys(section).length, 0), []);

    const progress = useMemo(() => {
        if (!formData) return 0;
        let filledFields = 0;
        Object.values(FORM_SECTIONS).forEach(section => {
            Object.keys(section).forEach(key => {
                const value = formData[key];
                if (section[key].type === 'checkbox') {
                    if (Object.values(value || {}).some(v => v === true)) filledFields++;
                } else if (typeof value === 'string' && value) {
                    filledFields++;
                }
            });
        });
        if (totalFieldCount === 0) return 100;
        return Math.min(Math.round((filledFields / (totalFieldCount - 9)) * 100), 100);
    }, [formData, totalFieldCount]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            const [group, symptom] = name.split('.');
            setFormData(prev => ({ ...prev, [group]: { ...(prev[group] || {}), [symptom]: checked } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        toast.success('Patient examination data saved!');
    };
    
    const handleGenerateSolution = async () => {
        toast.loading('Generating AI Solution...');
    };

    if (isLoading && !currentPatient) {
        return <div className="p-8 text-center">Loading patient details...</div>;
    }
    if (!currentPatient) {
        return <div className="p-8 text-center">Patient not found or you do not have access.</div>;
    }

    const activePlan = treatment?.doctorCustomizedPlan?.isCustomized ? treatment.doctorCustomizedPlan : treatment?.aiGeneratedPlan;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                         <div className="flex justify-between items-start">
                             <div>
                                <button onClick={() => navigate('/doctor/patients')} className="mb-4 inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-500">
                                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                    Back to Patient List
                                </button>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Ayurvedic Assessment</h1>
                                <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                                    Patient: <span className="font-semibold">{currentPatient.user.name}</span>
                                </p>
                             </div>
                             <div className="text-right">
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Assessment Completion</span>
                                <div className="w-40 mt-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                    <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{progress}%</span>
                             </div>
                         </div>
                    </div>
                    
                    {/* Form Sections Rendering */}
                    {Object.entries(FORM_SECTIONS).map(([sectionTitle, fields]) => (
                        <div key={sectionTitle} className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
                            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{sectionTitle}</h2>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(fields).map(([key, config]) => (
                                    <div key={key} className={config.type === 'checkbox' ? 'md:col-span-2' : ''}>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{config.label}</label>
                                        {config.type === 'select' && (
                                            <select name={key} value={formData[key] || ''} onChange={handleChange} className="w-full pl-4 pr-10 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all">
                                                <option value="" disabled>Select...</option>
                                                {config.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        )}
                                        {config.type === 'checkbox' && (
                                            <div className="mt-2 p-4 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                    {config.options.map(opt => {
                                                        const checkboxName = opt.replace(/[\/\s-]/g, '');
                                                        return (
                                                        <label key={opt} className="flex items-center space-x-3">
                                                            <input type="checkbox" name={`${key}.${checkboxName}`} checked={formData[key]?.[checkboxName] || false} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"/>
                                                            <span className="text-sm text-slate-600 dark:text-slate-300">{opt}</span>
                                                        </label>
                                                    )})}
                                                </div>
                                                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-600">
                                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Severity</label>
                                                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                                                        {['Mild', 'Moderate', 'Severe'].map(sev => (
                                                            <label key={sev} className="flex items-center space-x-3">
                                                                <input type="radio" name={config.severity} value={sev} checked={formData[config.severity] === sev} onChange={handleChange} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"/>
                                                                <span className="text-sm text-slate-600 dark:text-slate-300">{sev}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Treatment Plan Display Section */}
                    {activePlan && (
                        <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                             <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 border-b border-slate-200 dark:border-slate-700">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Treatment Plan</h2>
                             </div>
                             <div className="p-6">
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{activePlan.summary}</p>
                             </div>
                        </div>
                    )}
                    
                    {/* Patient Daily Feedback Section */}
                    {treatment && (
                         <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                                    <ChatBubbleLeftRightIcon className="h-6 w-6 mr-3 text-emerald-600" />
                                    Patient Daily Feedback
                                </h2>
                            </div>
                            <div className="p-6 space-y-6">
                                {(() => {
                                    const feedbackEntries = treatment.schedule
                                        ?.filter(day => day.feedback && Object.keys(day.feedback).length > 0)
                                        .sort((a, b) => new Date(b.feedback.submittedAt) - new Date(a.feedback.submittedAt)) || [];

                                    if (feedbackEntries.length > 0) {
                                        return feedbackEntries.map((day) => (
                                            <div key={day._id || day.day} className="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-b-0 last:pb-0">
                                                <h4 className="text-md font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                                    Feedback for Day {day.day}
                                                    <span className="text-xs font-normal text-slate-500 ml-2">
                                                        (Submitted on {new Date(day.feedback.submittedAt).toLocaleDateString()})
                                                    </span>
                                                </h4>
                                                <FeedbackDisplay feedback={day.feedback} />
                                            </div>
                                        ));
                                    } else {
                                        return (
                                            <div className="text-center py-8">
                                                <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto text-slate-400" />
                                                <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">No Feedback Submitted</h3>
                                                <p className="mt-1 text-sm text-slate-500">This patient has not submitted any daily feedback yet.</p>
                                            </div>
                                        );
                                    }
                                })()}
                            </div>
                         </div>
                    )}

                    {/* Action Buttons */}
                     <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col sm:flex-row justify-end items-center gap-4">
                         <button onClick={handleSave} className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-all">
                             Save Assessment
                         </button>
                         <button onClick={handleGenerateSolution} disabled={progress < 100} className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                             <SparklesIcon className="h-5 w-5 mr-2" />
                             Generate AI Solution
                         </button>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default PatientRecord;

