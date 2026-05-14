 
import { Navigate, Outlet } from "react-router-dom";
 
const ProtectedRoute = () => {
  const token = localStorage.getItem("accessToken");
 
  console.log("Protected Route Token:", token);
 
  if (!token) {
    return <Navigate to="/" replace />;
  }
 
  return <Outlet />;
};
 
export default ProtectedRoute;
 