import { RouteObject } from 'react-router-dom';
// import Login from '../view/auth/Login';
// import Register from '../view/auth/Register';
import { URL_PATH } from '../constants/UrlPath';

export const authRoutes: RouteObject[] = [
  {
    path: URL_PATH.LOGIN,
    //  element: <Login />,
  },
  {
    path: URL_PATH.REGISTER,
    // element: <Register />,
  },
];
