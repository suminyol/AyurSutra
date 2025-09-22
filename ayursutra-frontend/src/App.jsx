import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
import TreatmentHistory from './pages/TreatmentHistory';
import PatientManagement from './pages/doctor/PatientManagement';
import ProgressTracking from './pages/patient/ProgressTracking';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import PatientRecord from './pages/doctor/PatientRecord';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

// Paste this new component inside your App.jsx file, before AppContent.
// Replace your old LoginRedirect function with this new one in App.jsx

// Replace your old LoginRedirect function with this new one in App.jsx

function LoginRedirect() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation(); // This gets your current URL path

  useEffect(() => {
    if (isAuthenticated && user) {
      const targetDashboard = user.role === 'patient' 
        ? ROUTES.PATIENT_DASHBOARD 
        : ROUTES.DOCTOR_DASHBOARD;
      
      // THE FIX:
      // Only redirect if the user is on the homepage or login page.
      // This stops the redirect from happening on every other page.
      if (location.pathname === '/' || location.pathname === '/login') {
        navigate(targetDashboard, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location.pathname]); // Add location.pathname here

  return null; // This component still does not render anything.
}
// ...existing code...

function AppContent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('ayursutra_auth_token');
    if (token && !user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  useEffect(() => {
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

          {/* Patient Routes - Fixed to use DashboardLayout */}
          <Route path="/patient/dashboard" element={
            <ProtectedRoute requiredRole="patient">
              <DashboardLayout>
                <PatientDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/patient/progress" element={
            <ProtectedRoute requiredRole="patient">
              <DashboardLayout>
                <ProgressTracking />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Doctor Routes - Fixed to use DashboardLayout */}
          <Route path="/doctor/dashboard" element={
            <ProtectedRoute requiredRole="doctor">
              <DashboardLayout>
                <DoctorDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
           <Route path="/patient/:patientId" element={
          <ProtectedRoute requiredRole="doctor">
              <DashboardLayout>
                  <PatientRecord />
              </DashboardLayout>
          </ProtectedRoute>
      } />
          <Route path="/doctor/patients" element={
            <ProtectedRoute requiredRole="doctor">
              <DashboardLayout>
                <PatientManagement />
              </DashboardLayout>
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
                <TreatmentHistory />
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
          position="top-center"
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

// ...existing code...



  function App() {
    return (
      <Provider store={store}>
        <AppContent />
      </Provider>
    );
  }

  export default App;