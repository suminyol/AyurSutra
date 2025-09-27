import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster, toast } from 'react-hot-toast';
import { io } from 'socket.io-client'; // 👈 Import Socket.IO client
import { store } from './store';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { fetchUserProfile } from './store/slices/authSlice';
import { fetchNotifications, addLiveNotification } from './store/slices/notificationSlice'; // 👈 Import the new real-time action
import { ROUTES } from './constants';

// Layout and Page Components
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';
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
import ProtectedRoute from './components/ProtectedRoute';

function LoginRedirect() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && user) {
      const targetDashboard = user.role === 'patient' 
        ? ROUTES.PATIENT_DASHBOARD 
        : ROUTES.DOCTOR_DASHBOARD;
      
      if (location.pathname === '/' || location.pathname === '/login') {
        navigate(targetDashboard, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location.pathname]);

  return null;
}

function AppContent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('ayursutra_auth_token');
    if (token && !user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  // --- 👇 REAL-TIME NOTIFICATION LOGIC ---
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchNotifications());

      // THE FIX: Use `import.meta.env.VITE_API_BASE_URL` for Vite environment variables
      const socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000', {
        transports: ['websocket'] 
      });

      socket.emit('join', { userId: user.id });

      socket.on('new_notification', (notification) => {
        dispatch(addLiveNotification(notification));
        
        toast.success(`🔔 New Notification: ${notification.title}`, {
          duration: 5000,
        });
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [dispatch, isAuthenticated, user?.id]);
  // --- END REAL-TIME NOTIFICATION LOGIC ---

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
            <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
            <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout>{user?.role === 'patient' ? <PatientDashboard /> : <DoctorDashboard />}</DashboardLayout></ProtectedRoute>} />
            
            {/* Patient Routes */}
            <Route path={ROUTES.PATIENT_DASHBOARD} element={<ProtectedRoute requiredRole="patient"><DashboardLayout><PatientDashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.PROGRESS_TRACKING} element={<ProtectedRoute requiredRole="patient"><DashboardLayout><ProgressTracking /></DashboardLayout></ProtectedRoute>} />

            {/* Doctor Routes */}
            <Route path={ROUTES.DOCTOR_DASHBOARD} element={<ProtectedRoute requiredRole="doctor"><DashboardLayout><DoctorDashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/patient/:patientId" element={<ProtectedRoute requiredRole="doctor"><DashboardLayout><PatientRecord /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.PATIENT_MANAGEMENT} element={<ProtectedRoute requiredRole="doctor"><DashboardLayout><PatientManagement /></DashboardLayout></ProtectedRoute>} />

            {/* Shared Routes */}
            <Route path={ROUTES.APPOINTMENT_SCHEDULE} element={<ProtectedRoute><DashboardLayout><AppointmentSchedule /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.TREATMENT_HISTORY} element={<ProtectedRoute><DashboardLayout><TreatmentHistory /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.NOTIFICATIONS} element={<ProtectedRoute><DashboardLayout><NotificationsPage /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.PROFILE} element={<ProtectedRoute><DashboardLayout><ProfilePage /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.SETTINGS} element={<ProtectedRoute><DashboardLayout><SettingsPage /></DashboardLayout></ProtectedRoute>} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: { background: 'var(--toast-bg)', color: 'var(--toast-color)' },
            success: { iconTheme: { primary: '#22c55e', secondary: '#ffffff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#ffffff' } },
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

