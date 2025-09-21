import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import notificationReducer from './slices/notificationSlice';
import appointmentsReducer from './slices/appointmentSlice';
import patientReducer from './slices/patientSlice';
import doctorsReducer from './slices/doctorSlice';
import treatmentReducer from './slices/treatmentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,  
    theme: themeReducer,
    notifications: notificationReducer,
    appointments: appointmentsReducer,
    doctors: doctorsReducer,
    patient: patientReducer,
    treatment: treatmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
