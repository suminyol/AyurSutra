import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchPatientById, setCurrentPatient } from '../../store/slices/patientSlice';
import toast from 'react-hot-toast';
import { SparklesIcon, ArrowLeftIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import FeedbackDisplay from './FeedbackDisplay';

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
    const dispatch = useAppDispatch();

    const { currentPatient, isLoading } = useAppSelector((state) => state.patient);
    const [treatment, setTreatment] = useState(null);
    const [formData, setFormData] = useState(getInitialFormData());

    useEffect(() => {
        const loadData = async () => {
            if (patientId) {
                dispatch(fetchPatientById(patientId));
                try {
                    // --- HIGHLIGHT: Corrected the API URL construction ---
                    // The VITE_API_BASE_URL variable should be set to 'http://localhost:3000/api'
                    // The path here should NOT include a leading '/api'.
                    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/treatment-plans/patient/${patientId}`;
                    // --- END HIGHLIGHT ---


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
                    console.error("Error fetching treatment:", error);
                    toast.error(error.message || "Could not load treatment data.");
                }
            }
        };

        loadData();

        return () => {
            dispatch(setCurrentPatient(null));
        };
    }, [patientId, dispatch]);

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
                            
                            <div className="p-6">
                                {/* Summary Section */}
                                {(isEditingPlan ? editedPlan : currentTreatmentPlan)?.summary && (
                                    <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Treatment Summary</h3>
                                        {isEditingPlan ? (
                                            <textarea
                                                value={editedPlan?.summary || ''}
                                                onChange={(e) => setEditedPlan({...editedPlan, summary: e.target.value})}
                                                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                                                rows={3}
                                            />
                                        ) : (
                                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                                {currentTreatmentPlan.summary}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Day-wise Plan */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Daily Treatment Schedule</h3>
                                    <div className="grid gap-4">
                                        {(isEditingPlan ? editedPlan : currentTreatmentPlan)?.schedule?.map((dayPlan, index) => (
                                            <div key={dayPlan.day} className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 bg-slate-50 dark:bg-slate-700/30">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="text-md font-semibold text-slate-900 dark:text-white">
                                                        Day {dayPlan.day}
                                                    </h4>
                                                    {dayPlan.doctor_consultation?.toLowerCase() === 'yes' && (
                                                        <span className="px-2 py-1 text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-full">
                                                            Doctor Consultation
                                                        </span>
                                                    )}
                                                    
                                                </div>
                                                
                                                <ul className="space-y-2">
                                                    {dayPlan.plan?.map((task, taskIndex) => (
                                                        <li key={taskIndex} className="flex items-start space-x-2">
                                                            <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                                                            {isEditingPlan ? (
                                                                <input
                                                                    type="text"
                                                                    value={task}
                                                                    onChange={(e) => {
                                                                        const newSchedule = [...editedPlan.schedule];
                                                                        newSchedule[index].plan[taskIndex] = e.target.value;
                                                                        setEditedPlan({...editedPlan, schedule: newSchedule});
                                                                    }}
                                                                    className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                                                />
                                                            ) : (
                                                                <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                                                    {task}
                                                                </span>
                                                            )}
                                                        </li>
                                                    )) || []}
                                                </ul>
                                                {currentTreatmentPlan?.schedule[index]?.feedback && !isEditingPlan && (
                                                    <FeedbackDisplay feedback={currentTreatmentPlan.schedule[index].feedback} />
                                                )}
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

