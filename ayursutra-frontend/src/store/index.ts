import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import notificationReducer from './slices/notificationSlice';
import therapyReducer from './slices/therapySlice';
import patientReducer from './slices/patientSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    notifications: notificationReducer,
    therapy: therapyReducer,
    patient: patientReducer,
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
