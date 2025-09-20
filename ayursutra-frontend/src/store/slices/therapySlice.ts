import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TherapySession, TherapyType, PatientFeedback, TherapyBookingForm } from '../../types';
import { therapyService } from '../../services/therapyService';

interface TherapyState {
  sessions: TherapySession[];
  therapyTypes: TherapyType[];
  currentSession: TherapySession | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status?: string;
    therapyType?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
}

const initialState: TherapyState = {
  sessions: [],
  therapyTypes: [],
  currentSession: null,
  isLoading: false,
  error: null,
  filters: {},
};

// Async thunks
export const fetchTherapySessions = createAsyncThunk(
  'therapy/fetchSessions',
  async (filters?: any, { rejectWithValue }) => {
    try {
      const response = await therapyService.getSessions(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch therapy sessions');
    }
  }
);

export const fetchTherapyTypes = createAsyncThunk(
  'therapy/fetchTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await therapyService.getTherapyTypes();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch therapy types');
    }
  }
);

export const bookTherapySession = createAsyncThunk(
  'therapy/bookSession',
  async (bookingData: TherapyBookingForm, { rejectWithValue }) => {
    try {
      const response = await therapyService.bookSession(bookingData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to book therapy session');
    }
  }
);

export const cancelTherapySession = createAsyncThunk(
  'therapy/cancelSession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      await therapyService.cancelSession(sessionId);
      return sessionId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to cancel therapy session');
    }
  }
);

export const rescheduleTherapySession = createAsyncThunk(
  'therapy/rescheduleSession',
  async ({ sessionId, newDate, newTime }: { sessionId: string; newDate: string; newTime: string }, { rejectWithValue }) => {
    try {
      const response = await therapyService.rescheduleSession(sessionId, newDate, newTime);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to reschedule therapy session');
    }
  }
);

export const submitFeedback = createAsyncThunk(
  'therapy/submitFeedback',
  async (feedback: PatientFeedback, { rejectWithValue }) => {
    try {
      const response = await therapyService.submitFeedback(feedback);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to submit feedback');
    }
  }
);

export const fetchSessionById = createAsyncThunk(
  'therapy/fetchSessionById',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const response = await therapyService.getSessionById(sessionId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch session details');
    }
  }
);

const therapySlice = createSlice({
  name: 'therapy',
  initialState,
  reducers: {
    setCurrentSession: (state, action: PayloadAction<TherapySession | null>) => {
      state.currentSession = action.payload;
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
      // Fetch sessions
      .addCase(fetchTherapySessions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTherapySessions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = action.payload;
        state.error = null;
      })
      .addCase(fetchTherapySessions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch therapy types
      .addCase(fetchTherapyTypes.fulfilled, (state, action) => {
        state.therapyTypes = action.payload;
      })
      // Book session
      .addCase(bookTherapySession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(bookTherapySession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions.unshift(action.payload);
        state.error = null;
      })
      .addCase(bookTherapySession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Cancel session
      .addCase(cancelTherapySession.fulfilled, (state, action) => {
        const index = state.sessions.findIndex(session => session.id === action.payload);
        if (index !== -1) {
          state.sessions[index].status = 'cancelled';
        }
        if (state.currentSession?.id === action.payload) {
          state.currentSession.status = 'cancelled';
        }
      })
      // Reschedule session
      .addCase(rescheduleTherapySession.fulfilled, (state, action) => {
        const index = state.sessions.findIndex(session => session.id === action.payload.id);
        if (index !== -1) {
          state.sessions[index] = action.payload;
        }
        if (state.currentSession?.id === action.payload.id) {
          state.currentSession = action.payload;
        }
      })
      // Submit feedback
      .addCase(submitFeedback.fulfilled, (state, action) => {
        const sessionIndex = state.sessions.findIndex(session => session.id === action.payload.sessionId);
        if (sessionIndex !== -1) {
          state.sessions[sessionIndex].feedback = action.payload;
        }
        if (state.currentSession?.id === action.payload.sessionId) {
          state.currentSession.feedback = action.payload;
        }
      })
      // Fetch session by ID
      .addCase(fetchSessionById.fulfilled, (state, action) => {
        state.currentSession = action.payload;
      });
  },
});

export const { setCurrentSession, setFilters, clearFilters, clearError } = therapySlice.actions;
export default therapySlice.reducer;
