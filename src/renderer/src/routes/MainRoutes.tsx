import { RouteObject } from 'react-router-dom';
import Layout from '@/containers/layout/Header';
import DashboardPage from '@/view/dashboardPages/DashboardPage';
import { URL_PATH } from '@/constants/UrlPath';
import SalesBilling from '@/view/dashboardPages/SalesBilling';

export const mainRoutes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      {
        path: URL_PATH.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: URL_PATH.SalesBilling,
        element: <SalesBilling />,
      }
    ],
  },
];
