

import { useRoutes } from "react-router-dom";
import { authRoutes } from "@/routes/AuthenticationRoutes";
import { mainRoutes } from "@/routes/MainRoutes";
import ProtectedRoute from "@/routes/ProtectedRoute";

function App() {

  const routes = useRoutes([
    // Public Routes
    {
      path: "/",
      children: authRoutes,
    },

    // Protected Routes
    {
      element: <ProtectedRoute />,
      children: mainRoutes,
    },
  ]);

  return routes;
}

export default App;