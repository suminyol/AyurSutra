import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Appointment, CreateAppointmentData } from '../../types';
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

// Async thunks
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (filters?: any, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAppointments(filters);
      return response.appointments;
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

// --- ADD THIS NEW ASYNC THUNK ---
export const cancelAppointment = createAsyncThunk(
  'appointments/cancelAppointment',
  async (appointmentId: string, { rejectWithValue }) => {
    try {
      const updatedAppointment = await appointmentService.cancelAppointment(appointmentId);
      return updatedAppointment;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to cancel appointment');
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
      // Fetch Appointments
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
      })
      // Create Appointment (This logic was missing, I've added it)
      .addCase(createAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
          state.appointments.unshift(action.payload); // Add new appointment to the top of the list
      })
      // --- ADD THIS LOGIC FOR CANCELLING ---
      .addCase(cancelAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
        const index = state.appointments.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload; // Update the appointment with the new 'cancelled' status
        }
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentAppointment, clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer;