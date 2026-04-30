// import { Navigate, Outlet } from 'react-router-dom';
// import type { ReactElement } from 'react';
// // import { URL_PATH } from '@/constants/UrlPath';
 
// interface ProtectedRouteProps {
//   element: ReactElement;
// }
 
// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
//   const token = localStorage.getItem('accessToken');
 
//   if (!token) {
//     return <Navigate to={"/"} replace />;
//   }
 
//   return element ? element : <Outlet />;
// };
 
// export default ProtectedRoute;
 
 
 
 
// import { Navigate, Outlet } from 'react-router-dom';
// import type { ReactElement } from 'react';
// import { URL_PATH } from "@/constants/UrlPath";
 
// interface ProtectedRouteProps {
//   element?: ReactElement;
// }
 
// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
//   const token = localStorage.getItem('accessToken');
 
//   if (!token) {
//     return <Navigate to={URL_PATH.LOGIN} replace />;
//   }
 
//   return element ? element : <Outlet />;
// };
 
// export default ProtectedRoute;
 
 