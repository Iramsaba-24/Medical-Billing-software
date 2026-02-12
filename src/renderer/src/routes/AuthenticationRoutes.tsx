import { RouteObject } from 'react-router-dom';
 import LOGIN from '@/view/auth/LoginPage';
// import Register from '../view/auth/Register';
import { URL_PATH } from '../constants/UrlPath';
import LoginPage from '@/view/auth/LoginPage';


export const authRoutes: RouteObject[] = [
  {
<<<<<<< HEAD
    path: URL_PATH.LoginPage,
    element: <LoginPage />,
  },
=======
        index: true,
        element: <LOGIN />,
      },
>>>>>>> 3517e4559ed4b29a1b92c598d8f493fbaa58a07e
  {
    path: URL_PATH.REGISTER,
    // element: <Register />,
  },
];
