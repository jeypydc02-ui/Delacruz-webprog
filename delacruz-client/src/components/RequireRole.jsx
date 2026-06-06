import { Navigate, useLocation } from 'react-router-dom';
import { getRole, isAuthenticated } from '../services/auth';

const RequireRole = ({ allow, fallback = '/', children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/auth/signin" replace state={{ from: location }} />;
  }

  const role = getRole();
  const allowed = Array.isArray(allow) ? allow : [allow];
  if (allow && !allowed.includes(role)) {
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default RequireRole;
