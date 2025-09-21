import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { fetchUserProfile } from './store/slices/authSlice';
import { fetchNotifications } from './store/slices/notificationSlice';
import { ROUTES } from './constants';


// Layout Components
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import PatientLayout from './components/layout/PatientLayout';
import DoctorLayout from './components/layout/DoctorLayout';

// Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AppointmentSchedule from './pages/AppointmentSchedule';
import TherapyHistory from './pages/TherapyHistory';
import PatientManagement from './pages/doctor/PatientManagement';
import ProgressTracking from './pages/patient/ProgressTracking';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

// Paste this new component inside your App.jsx file, before AppContent.
function LoginRedirect() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // This effect watches for when a user becomes authenticated.
    if (isAuthenticated && user) {
      // When they log in, it sends them to the correct dashboard.
      const targetDashboard = user.role === 'patient' 
        ? ROUTES.PATIENT_DASHBOARD 
        : ROUTES.DOCTOR_DASHBOARD;
      navigate(targetDashboard, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return null; // This component does not render anything to the screen.
}

function AppContent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is authenticated on app load
    if (isAuthenticated && !user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated, user]);

  useEffect(() => {
    // Fetch notifications if user is authenticated
    if (isAuthenticated) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

    return (
      <Router>
         <LoginRedirect />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            } />
            <Route path="/register" element={
              <AuthLayout>
                <RegisterPage />
              </AuthLayout>
            } />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  {user?.role === 'patient' ? <PatientDashboard /> : <DoctorDashboard />}
                </DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Patient Routes */}
            <Route path="/patient/*" element={
              <ProtectedRoute requiredRole="patient">
                <PatientLayout>
                  <Routes>
                    <Route path="dashboard" element={<PatientDashboard />} />
                    <Route path="progress" element={<ProgressTracking />} />
                  </Routes>
                </PatientLayout>
              </ProtectedRoute>
            } />

            {/* Doctor Routes */}
            <Route path="/doctor/*" element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorLayout>
                  <Routes>
                    <Route path="dashboard" element={<DoctorDashboard />} />
                    <Route path="patients" element={<PatientManagement />} />
                  </Routes>
                </DoctorLayout>
              </ProtectedRoute>
            } />

            {/* Shared Routes */}
            <Route path={ROUTES.APPOINTMENT_SCHEDULE} element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AppointmentSchedule />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path={ROUTES.TREATMENT_HISTORY} element={
              <ProtectedRoute>
                <DashboardLayout>
                  <TherapyHistory />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <NotificationsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ProfilePage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SettingsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </div>
      </Router>
    );
  }



  function App() {
    return (
      <Provider store={store}>
        <AppContent />
      </Provider>
    );
  }

  export default App;