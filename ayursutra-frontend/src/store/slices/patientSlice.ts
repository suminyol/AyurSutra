import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Patient, ProgressData, ProgressChart } from '../../types';
import { patientService } from '../../services/patientService';

interface PatientState {
  patients: Patient[];
  currentPatient: Patient | null;
  progressData: ProgressData[];
  progressCharts: ProgressChart[];
  isLoading: boolean;
  error: string | null;
  filters: {
    search?: string;
    status?: string;
    therapyType?: string;
  };
}

const initialState: PatientState = {
  patients: [],
  currentPatient: null,
  progressData: [],
  progressCharts: [],
  isLoading: false,
  error: null,
  filters: {},
};

// Async thunks
export const fetchPatients = createAsyncThunk(
  'patient/fetchPatients',
  async (filters: any, { rejectWithValue }) => {
    try {
      const response = await patientService.getAllPatients(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch patients');
    }
  }
);

export const fetchPatientsByDoctor = createAsyncThunk(
  'patient/fetchPatientsByDoctor',
  async (doctorId: string, { rejectWithValue }) => {
    try {
      const response = await patientService.getPatientsByDoctor(doctorId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch doctor patients');
    }
  }
);


export const fetchPatientById = createAsyncThunk(
  'patient/fetchPatientById',
  async (patientId: string, { rejectWithValue }) => {
    try {
      const response = await patientService.getPatientById(patientId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch patient details');
    }
  }
);

export const updatePatient = createAsyncThunk(
  'patient/updatePatient',
  async ({ patientId, patientData }: { patientId: string; patientData: Partial<Patient> }, { rejectWithValue }) => {
    try {
      const response = await patientService.updatePatient(patientId, patientData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update patient');
    }
  }
);

export const fetchProgressData = createAsyncThunk(
  'patient/fetchProgressData',
  async (patientId: string, { rejectWithValue }) => {
    try {
      const response = await patientService.getProgressData(patientId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch progress data');
    }
  }
);

export const addProgressData = createAsyncThunk(
  'patient/addProgressData',
  async (progressData: Omit<ProgressData, 'id'>, { rejectWithValue }) => {
    try {
      const response = await patientService.addProgressData(progressData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add progress data');
    }
  }
);

export const fetchProgressCharts = createAsyncThunk<ProgressChart[], string>(
  'patient/fetchProgressCharts',
  async (patientId: string, { rejectWithValue }) => {
    try {
      const response = await patientService.getProgressCharts(patientId);
      // Ensure response is ProgressChart[] or fallback to empty array
      return (response ?? []) as ProgressChart[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch progress charts');
    }
  }
);

export const createProgressChart = createAsyncThunk(
  'patient/createProgressChart',
  async (chartData: Omit<ProgressChart, 'id'>, { rejectWithValue }) => {
    try {
      const response = await patientService.createProgressChart(chartData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create progress chart');
    }
  }
);

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setCurrentPatient: (state, action: PayloadAction<Patient | null>) => {
      state.currentPatient = action.payload;
    },
    setFilters: (state, action: PayloadAction<any>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
       // Fetch patients by doctor
      .addCase(fetchPatientsByDoctor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatientsByDoctor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.patients = action.payload.patients || action.payload; // Handle both response formats
        state.error = null;
      })
      .addCase(fetchPatientsByDoctor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch patients
      .addCase(fetchPatients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.patients = action.payload.patients;
        state.error = null;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch patient by ID
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        state.currentPatient = action.payload;
      })
      // Update patient
      .addCase(updatePatient.fulfilled, (state, action) => {
        const index = state.patients.findIndex(patient => patient.id === action.payload.id);
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
        if (state.currentPatient?.id === action.payload.id) {
          state.currentPatient = action.payload;
        }
      })
      // Fetch progress data
      .addCase(fetchProgressData.fulfilled, (state, action) => {
        state.progressData = action.payload;
      })
      // Add progress data
      .addCase(addProgressData.fulfilled, (state, action) => {
        // No payload to push since the fulfilled payload type is void
      })
      // Fetch progress charts
      .addCase(fetchProgressCharts.fulfilled, (state, action) => {
        state.progressCharts = action.payload;
      })
      // Create progress chart
      .addCase(createProgressChart.fulfilled, (state, action) => {
        state.progressCharts.push(action.payload.data);
      });
  },
});

export const { setCurrentPatient, setFilters, clearFilters, clearError } = patientSlice.actions;
export default patientSlice.reducer;
