import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchPatientById, savePatientExamination, generateAiSolution, setCurrentPatient } from '../../store/slices/patientSlice';
import toast from 'react-hot-toast';
import { SparklesIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

// --- FORM STRUCTURE DEFINITION (No changes) ---
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
    const [formData, setFormData] = useState(getInitialFormData());

    useEffect(() => {
        if (patientId) {
            dispatch(fetchPatientById(patientId));
        }
        return () => {
            dispatch(setCurrentPatient(null));
        };
    }, [patientId, dispatch]);

    useEffect(() => {
        if (currentPatient?.examinationData) {
            setFormData(prev => ({ ...getInitialFormData(), ...currentPatient.examinationData }));
        } else {
            setFormData(getInitialFormData());
        }
    }, [currentPatient]);
    
    // --- MODIFIED: Rewritten progress logic for accuracy and stability ---
    const totalFieldCount = useMemo(() => {
        // Counts every conceptual field from the definition
        return Object.values(FORM_SECTIONS).flatMap(Object.keys).length;
    }, []);

    const progress = useMemo(() => {
        // 1. Guard against the crash
        if (!formData) return 0;

        let filledFields = 0;
        Object.entries(formData).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                // For checkbox groups, count as filled if at least one is checked
                if (Object.values(value).some(v => v === true)) {
                    filledFields++;
                }
            } else if (typeof value === 'string' && value) {
                // For dropdowns and radio buttons, count if they have any value
                filledFields++;
            }
        });
        
        if (totalFieldCount === 0) return 100; // Avoid division by zero
        const calculatedProgress = Math.round((filledFields / totalFieldCount) * 100);
        return Math.min(calculatedProgress, 100); // Ensure progress doesn't exceed 100%
    }, [formData, totalFieldCount]);
    
    
    // --- MODIFIED: Made handleChange more defensive ---
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            const [group, symptom] = name.split('.');
            setFormData(prev => ({
                ...prev,
                // 2. Guard against spreading a null/undefined object
                [group]: { ...(prev[group] || {}), [symptom]: checked }
            }));
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
            if (data[key]) {
              reportString += `${config.label}: ${data[key]}\n`;
            }
          } else if (config.type === 'checkbox') {
            const selectedSymptoms = Object.entries(data[key] || {})
              .filter(([, isChecked]) => isChecked)
              .map(([symptomKey]) => {
                // Find the original symptom name with correct casing and symbols
                return config.options.find(opt => opt.replace(/[\/\s-]/g, '') === symptomKey);
              })
              .filter(Boolean); // Filter out any undefined if no match is found

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

    const handleSave = async () => {
        const promise = dispatch(savePatientExamination({ patientId, examinationData: formData })).unwrap();
        toast.promise(promise, {
            loading: 'Saving record...',
            success: 'Patient record saved successfully!',
            error: 'Failed to save record.',
        });
    };
    
    // --- REPLACE your existing handleGenerateSolution function with this one ---
    const handleGenerateSolution = async () => {
        if (progress < 100) {
            toast.error('Please complete the entire form before generating a solution.');
            return;
        }
        await handleSave();
        
        // 1. Format the data into a string
        const formattedDataString = formatDataForAI(formData);

        // Optional: Log the string to the console to verify its format before sending
        console.log("Formatted Data String for AI Model:\n", formattedDataString);

        // 2. Dispatch the Redux action with the formatted string
        // Note: You will need to update your `generateAiSolution` thunk to handle this `formDataString`.
        const promise = dispatch(generateAiSolution({ patientId, formDataString: formattedDataString })).unwrap();
        
        toast.promise(promise, {
            loading: 'Analyzing data and generating AI solution...',
            success: (result) => `AI solution generated successfully!`,
            error: 'Failed to generate AI solution.',
        });
    };

    if (isLoading && !currentPatient) return <div className="p-8 text-center">Loading patient details...</div>;
    if (!currentPatient) return <div className="p-8 text-center">Patient not found.</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                         <div className="flex justify-between items-start">
                             <div>
                                <button onClick={() => navigate('/patients')} className="mb-4 inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-500">
                                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                    Back to Patient List
                                </button>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Ayurvedic Assessment</h1>
                                <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                                    Patient: <span className="font-semibold">{currentPatient.user.name}</span>
                                </p>
                             </div>
                             <div className="text-right">
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Profile Completion</span>
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

                    {/* Action Buttons */}
                     <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col sm:flex-row justify-end items-center gap-4">
                         <button onClick={handleSave} disabled={isLoading} className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-all">
                             Save Progress
                         </button>
                         <button onClick={handleGenerateSolution} disabled={isLoading || progress < 100} className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                             <SparklesIcon className="h-5 w-5 mr-2" />
                             {isLoading ? 'Processing...' : 'Generate AI Solution'}
                         </button>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default PatientRecord;

