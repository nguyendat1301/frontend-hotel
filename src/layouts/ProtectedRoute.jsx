import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from '../pages/Loading';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  // Chưa đăng nhập
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Không phải admin
  if (String(user.role || '').toLowerCase() !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;