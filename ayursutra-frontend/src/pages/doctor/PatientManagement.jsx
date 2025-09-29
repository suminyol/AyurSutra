import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- IMPORT useNavigate
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchPatientsByDoctor } from '../../store/slices/patientSlice';
import { UserGroupIcon, PlusIcon, MagnifyingGlassIcon, SparklesIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import AddPatientModal from '../doctor/AddPatientModal';
// We no longer need PatientDetailsModal here, it's being replaced by a page.

const PatientManagement = () => {
  const navigate = useNavigate(); // <-- INITIALIZE useNavigate
  const dispatch = useAppDispatch();
  const { patients, isLoading } = useAppSelector((state) => state.patient);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddPatientModalOpen, setAddPatientModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      dispatch(fetchPatientsByDoctor());
      setUser(storedUser);
    }
  }, [dispatch]);

  const filteredPatients = patients.filter(patient => {
    const patientName = (patient?.user?.name ?? '').toLowerCase();
    const patientEmail = (patient?.user?.email ?? '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return patientName.includes(search) || patientEmail.includes(search);
  });

  // --- MODIFIED: Handle navigation ---
  const handlePatientClick = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  return (
    <div className="space-y-8">
          {/* Header Section */}
          <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-6 py-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <div>
                  <button
                    onClick={() => navigate(-1)}
                    className="mb-4 inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back 
                  </button>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Patient Management</h1>
                  <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                    Manage your patients and their therapy records
                  </p>
                </div>
                <button
                  onClick={() => setAddPatientModalOpen(true)}
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 hover:shadow-xl"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Patient
                </button>
              </div>
            </div>
          </div>

          {/* Search (No changes here) */}
          <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="p-6">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search patients by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Patients List */}
          <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Patients ({filteredPatients.length})
              </h2>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="animate-pulse space-y-4">{/* ... */}</div>
              ) : filteredPatients.length > 0 ? (
                <div className="space-y-4">
                  {filteredPatients.map((patient) => (
                    // --- MODIFIED: Added onClick handler for navigation ---
                    <div
                      key={patient.id}
                      onClick={() => handlePatientClick(patient.id)}
                      className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer border border-slate-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 hover:shadow-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                          <UserGroupIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                            {patient.user?.name}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {patient.user?.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                          Joined {new Date(patient.createdAt).toLocaleDateString()}
                        </p>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                          Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">{/* ... */}</div>
              )}
            </div>
          </div>
          
          {/* We no longer need the PatientDetailsModal here */}

          <AddPatientModal
            isOpen={isAddPatientModalOpen}
            onClose={() => setAddPatientModalOpen(false)}
            onPatientAdded={() => {
              setAddPatientModalOpen(false);
              dispatch(fetchPatientsByDoctor()); // Refresh the patient list after adding a new patient
            }}
          />
    </div>  
  );
};

export default PatientManagement;
