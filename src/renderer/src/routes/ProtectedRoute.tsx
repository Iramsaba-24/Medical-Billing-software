import { Navigate, Outlet } from 'react-router-dom';
import type { ReactElement } from 'react';
 
interface ProtectedRouteProps {
  element: ReactElement;
}
 
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const token = localStorage.getItem('accessToken');
 
  if (!token) {
    return <Navigate to="/pages/login" replace />;
  }
 
  return element ? element : <Outlet />;
};
 
export default ProtectedRoute;
 
 