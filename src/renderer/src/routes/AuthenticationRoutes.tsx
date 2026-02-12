import { RouteObject } from 'react-router-dom';
 import LOGIN from '@/view/auth/LoginPage';
// import Register from '../view/auth/Register';
import { URL_PATH } from '../constants/UrlPath';


export const authRoutes: RouteObject[] = [
  {
        index: true,
        element: <LOGIN />,
      },
  {
    path: URL_PATH.REGISTER,
    // element: <Register />,
  },
];
