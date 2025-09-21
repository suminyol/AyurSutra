import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Appointment, CreateAppointmentData } from '../../types'; // Make sure the path to your types is correct
import { appointmentService } from '../../services/appointmentService';

interface AppointmentState {
  appointments: Appointment[];
  currentAppointment: Appointment | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  currentAppointment: null,
  isLoading: false,
  error: null,
};

// Async thunk to fetch appointments
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (filters?: any, { rejectWithValue }) => {
    try {
      // The service returns an object { appointments: [], pagination: {} }
      const response = await appointmentService.getAppointments(filters);
      return response.appointments; // We only need the appointments array here
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch appointments');
    }
  }
);

export const createAppointment = createAsyncThunk(
  'appointments/createAppointment',
  async (appointmentData: CreateAppointmentData, { rejectWithValue }) => {
    try {
      const newAppointment = await appointmentService.createAppointment(appointmentData);
      return newAppointment;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create appointment');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setCurrentAppointment: (state, action: PayloadAction<Appointment | null>) => {
      state.currentAppointment = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action: PayloadAction<Appointment[]>) => {
        state.isLoading = false;
        state.appointments = action.payload;
        state.error = null;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentAppointment, clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer;