import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const jwtToken = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('jwt_token='));

  if (!jwtToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
