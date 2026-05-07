
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {

  const token = localStorage.getItem("accessToken");

  // DEBUG
  console.log("TOKEN:", token);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;