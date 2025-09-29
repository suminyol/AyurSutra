import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchPatientsByDoctor } from '../../store/slices/patientSlice';
import { UserGroupIcon, PlusIcon, MagnifyingGlassIcon, SparklesIcon, ChatBubbleLeftRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import AddPatientModal from '../doctor/AddPatientModal';

const PatientManagement = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { patients, isLoading } = useAppSelector((state) => state.patient);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddPatientModalOpen, setAddPatientModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPatientsByDoctor());
  }, [dispatch]);

  const filteredPatients = patients.filter(patient => {
    const patientName = (patient?.user?.name ?? '').toLowerCase();
    const patientEmail = (patient?.user?.email ?? '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return patientName.includes(search) || patientEmail.includes(search);
  });

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

          {/* Search */}
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
                <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>)}
                </div>
              ) : filteredPatients.length > 0 ? (
                <div className="space-y-4">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 transition-all duration-200"
                    >
                      <div
                        onClick={() => handlePatientClick(patient.id)}
                        className="flex items-center space-x-4 cursor-pointer flex-grow min-w-0"
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <UserGroupIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {patient.user?.name}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                            {patient.user?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                          Joined {new Date(patient.createdAt).toLocaleDateString()}
                        </p>
                        <button
                            onClick={() => handlePatientClick(patient.id)}
                            className="p-2.5 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-600 rounded-lg transition-colors"
                            title="View Patient Record & Feedback"
                        >
                            <ChatBubbleLeftRightIcon className="h-5 w-5" />
                        </button>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                          Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                    <UserGroupIcon className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">No patients found</h3>
                    <p className="mt-1 text-sm text-slate-500">Add a new patient to get started.</p>
                </div>
              )}
            </div>
          </div>
          
          <AddPatientModal
            isOpen={isAddPatientModalOpen}
            onClose={() => setAddPatientModalOpen(false)}
            onPatientAdded={() => {
              setAddPatientModalOpen(false);
              dispatch(fetchPatientsByDoctor());
            }}
          />
    </div>  
  );
};

export default PatientManagement;

