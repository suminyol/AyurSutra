import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = user?.role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
