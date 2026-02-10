import { RouteObject } from 'react-router-dom';
// import Login from '../view/auth/Login';
// import Register from '../view/auth/Register';
import { URL_PATH } from '../constants/UrlPath';
import LoginPage from '@/view/auth/LoginPage';

export const authRoutes: RouteObject[] = [
  {
    path: URL_PATH.LoginPage,
    element: <LoginPage />,
  },
  {
    path: URL_PATH.REGISTER,
    // element: <Register />,
  },
];
