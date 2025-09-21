import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Doctor } from '../../types';
import { doctorService } from '../../services/doctorService';

interface DoctorState {
  doctors: Doctor[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DoctorState = {
  doctors: [],
  isLoading: false,
  error: null,
};

export const fetchDoctors = createAsyncThunk('doctors/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await doctorService.getAllDoctors();
    return response.doctors;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default doctorSlice.reducer;