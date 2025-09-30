import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchPatientById, setCurrentPatient } from '../../store/slices/patientSlice';
import toast from 'react-hot-toast';
import { SparklesIcon, ArrowLeftIcon, ChatBubbleLeftRightIcon, PencilSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
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

    const { user: loggedInDoctor } = useAppSelector((state) => state.auth);
    const { currentPatient, isLoading } = useAppSelector((state) => state.patient);
    const [treatment, setTreatment] = useState(null);
    const [isPlanLoading, setIsPlanLoading] = useState(true);
    const [formData, setFormData] = useState(getInitialFormData());
    const [isEditing, setIsEditing] = useState(false);
    const [editedPlan, setEditedPlan] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            if (patientId) {
                setIsPlanLoading(true);
                dispatch(fetchPatientById(patientId));
                try {
                    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/treatment-plans/patient/${patientId}`;
                    const response = await fetch(apiUrl, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('ayursutra_auth_token')}` }
                    });

                    if (response.ok) {
                        const result = await response.json();
                        setTreatment(result.data);
                    } else if (response.status !== 404) {
                        const errorResult = await response.json();
                        throw new Error(errorResult.message || 'Failed to fetch treatment from server.');
                    } else {
                         setTreatment(null);
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                    toast.error(error.message || "Could not load patient data.");
                } finally {
                    setIsPlanLoading(false);
                }
            }
        };

        loadData();
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
        const countableFields = totalFieldCount - 9;
        if (countableFields <= 0) return 100;
        return Math.min(Math.round((filledFields / countableFields) * 100), 100);
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

    const formatDataForAI = (data) => {
      let reportString = "Ayurvedic Patient Assessment Report:\n\n";
      Object.entries(FORM_SECTIONS).forEach(([sectionTitle, fields]) => {
        reportString += `--- ${sectionTitle} ---\n`;
        Object.entries(fields).forEach(([key, config]) => {
          if (config.type === 'select') {
            if (data[key]) reportString += `${config.label}: ${data[key]}\n`;
          } else if (config.type === 'checkbox') {
            const selectedSymptoms = Object.entries(data[key] || {})
              .filter(([, isChecked]) => isChecked)
              .map(([symptomKey]) => config.options.find(opt => opt.replace(/[\/\s-]/g, '') === symptomKey))
              .filter(Boolean);
            if (selectedSymptoms.length > 0) {
              reportString += `${config.label}: ${selectedSymptoms.join(', ')}\n`;
              reportString += `Severity: ${data[config.severity]}\n`;
            }
          }
        });
        reportString += "\n";
      });
      return reportString;
    };

    const handleGenerateSolution = async () => {
        if (progress < 100) {
            toast.error('Please complete the entire form before generating a solution.');
            return;
        }

        const createPlanPromise = async () => {
            const formattedDataString = formatDataForAI(formData);

            const aiResponse = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: formattedDataString }),
            });
            if (!aiResponse.ok) throw new Error('Failed to get response from AI service.');
            const planFromAI = await aiResponse.json();

            const planData = {
                patientId: patientId,
                doctorId: loggedInDoctor?.doctorId,
                patientName: currentPatient?.user?.name || 'Unknown',
                summary: planFromAI.summary,
                schedule: planFromAI.schedule,
                formData: formData
            };

            const serverResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/treatment-plans`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('ayursutra_auth_token')}`
                },
                body: JSON.stringify(planData),
            });

            if (!serverResponse.ok) {
                const errorResult = await serverResponse.json();
                throw new Error(errorResult.message || 'Failed to save treatment plan.');
            }

            const savedPlan = await serverResponse.json();
            setTreatment(savedPlan.data); // Update the UI to show the new plan
        };

        toast.promise(createPlanPromise(), {
            loading: 'Generating and saving plan...',
            success: 'Treatment plan created successfully!',
            error: (err) => err.message || 'Failed to create plan.',
        });
    };
    
    const handleEditClick = () => {
        setEditedPlan(JSON.parse(JSON.stringify(treatment)));
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedPlan(null);
    };

    const handleSaveEdits = async () => {
        if (!editedPlan?._id) {
            toast.error("Cannot save: Plan ID is missing.");
            return;
        }

        const savePromise = async () => {
            const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/treatment-plans/${editedPlan._id}`;
            
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('ayursutra_auth_token')}`
                },
                body: JSON.stringify({
                    schedule: editedPlan.schedule,
                    summary: editedPlan.summary 
                }),
            });

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.message || 'Failed to save the plan.');
            }

            const result = await response.json();
            setTreatment(result.data); // Update state with the saved plan from the server
            setIsEditing(false);
            setEditedPlan(null);
        };

        toast.promise(savePromise(), {
            loading: 'Saving changes...',
            success: 'Treatment plan updated successfully!',
            error: (err) => err.message || 'Could not save changes.',
        });
    };

    const handleDayPlanChange = (dayIndex, taskIndex, value) => {
        const newSchedule = [...editedPlan.schedule];
        newSchedule[dayIndex].plan[taskIndex] = value;
        setEditedPlan({ ...editedPlan, schedule: newSchedule });
    };

    if (isLoading || isPlanLoading) return <div className="p-8 text-center">Loading patient details...</div>;
    if (!currentPatient) return <div className="p-8 text-center">Patient not found or you do not have access.</div>;

    const activePlan = isEditing ? editedPlan : treatment;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                         <div className="flex justify-between items-start">
                            <div>
                                <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-500">
                                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                    Back
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
                    
                    {/* Form Sections */}
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
                    
                    {/* Treatment Plan & Feedback Section */}
                    {activePlan ? (
                        <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
                           <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                               <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                                   <ChatBubbleLeftRightIcon className="h-6 w-6 mr-3 text-emerald-600" />
                                   Treatment Plan & Feedback
                               </h2>
                               {activePlan && !isEditing && (
                                    <button onClick={handleEditClick} className="inline-flex items-center px-3 py-1.5 text-sm font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg">
                                        <PencilSquareIcon className="h-4 w-4 mr-1"/> Edit Plan
                                    </button>
                               )}
                               {isEditing && (
                                    <div className="flex items-center space-x-2">
                                        <button onClick={handleSaveEdits} className="inline-flex items-center px-3 py-1.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"><CheckIcon className="h-4 w-4 mr-1"/> Save</button>
                                        <button onClick={handleCancelEdit} className="inline-flex items-center px-3 py-1.5 text-sm font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg"><XMarkIcon className="h-4 w-4 mr-1"/> Cancel</button>
                                    </div>
                                )}
                           </div>
                           
                            <div className="p-6">
                                <div className="space-y-6">
                                    {activePlan.schedule?.map((dayPlan, dayIndex) => (
                                        <div key={dayPlan._id || dayPlan.day} className="border border-slate-200 dark:border-slate-600 rounded-xl p-4 bg-slate-50 dark:bg-slate-700/30">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-md font-semibold text-slate-900 dark:text-white">Day {dayPlan.day}</h4>
                                                {dayPlan.doctor_consultation?.toLowerCase() === 'yes' && (
                                                    <span className="px-2 py-1 text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-full">
                                                        Doctor Consultation
                                                    </span>
                                                )}
                                            </div>
                                            <ul className="space-y-2 mb-4">
                                                {dayPlan.plan.map((task, taskIndex) => (
                                                    <li key={taskIndex} className="flex items-start space-x-2">
                                                        <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                                                        {isEditing ? (
                                                            <input 
                                                                type="text"
                                                                value={task}
                                                                onChange={(e) => handleDayPlanChange(dayIndex, taskIndex, e.target.value)}
                                                                className="w-full bg-white dark:bg-slate-600 p-1 rounded border border-slate-300 dark:border-slate-500 text-sm"
                                                            />
                                                        ) : (
                                                            <span className="text-sm text-slate-700 dark:text-slate-300">{task}</span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                            
                                            {dayPlan.feedback && !isEditing && (
                                                <FeedbackDisplay feedback={dayPlan.feedback} />
                                            )}
                                            {!dayPlan.feedback && !isEditing && (
                                                 <p className="text-sm text-slate-500 italic mt-4 pt-4 border-t border-dashed border-slate-300 dark:border-slate-600">No feedback submitted for this day.</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col sm:flex-row justify-end items-center gap-4">
                            <button onClick={() => {}} className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-all">
                                Save Assessment
                            </button>
                            <button onClick={handleGenerateSolution} disabled={progress < 100} className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                <SparklesIcon className="h-5 w-5 mr-2" />
                                Generate AI Solution
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientRecord;