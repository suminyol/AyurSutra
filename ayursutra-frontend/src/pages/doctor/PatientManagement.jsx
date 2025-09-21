import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchPatients } from '../../store/slices/patientSlice';
import { UserGroupIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import AddPatientModal from '../doctor/AddPatientModal';

const PatientManagement = () => {
  const dispatch = useAppDispatch();
  // === NOTE: Make sure you are selecting from the correct slice, e.g., state.patients ===
  const { patients, isLoading } = useAppSelector((state) => state.patient); 
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddPatientModalOpen, setAddPatientModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  // === UPDATED: Corrected filtering logic with optional chaining ===
  const filteredPatients = patients.filter(patient => {
    const patientName = (patient?.user?.name ?? '').toLowerCase();
    const patientEmail = (patient?.user?.email ?? '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return patientName.includes(search) || patientEmail.includes(search);
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Patient Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your patients and their therapy records
          </p>
        </div>
        <button
          onClick={() => setAddPatientModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Patient
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Patients List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Patients ({filteredPatients.length})
          </h2>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          ) : filteredPatients.length > 0 ? (
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <UserGroupIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      {/* === UPDATED: Corrected display logic === */}
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {patient.user?.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {patient.user?.email}
                      </p>
                      {patient.phone && (
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {patient.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Joined {new Date(patient.createdAt).toLocaleDateString()}
                    </p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No patients found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm ? 'No patients match your search criteria.' : 'Start by adding your first patient.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={isAddPatientModalOpen}
        onClose={() => setAddPatientModalOpen(false)}
        onPatientAdded={() => {
          setAddPatientModalOpen(false);
          dispatch(fetchPatients());
        }}
      />
    </div>
  );
};

export default PatientManagement;