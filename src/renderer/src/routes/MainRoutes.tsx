import { RouteObject } from 'react-router-dom';
import Layout from '@/containers/layout/Header';
import { URL_PATH } from '@/constants/UrlPath';
import Invoices from '@/view/Invoices'
import CreateInvoice from '@/containers/Invoices/CreateInvoice';
import InvoiceView from '@/containers/Invoices/InvoiceView';
import DistributorsTable from '@/containers/Distributors/DistributorsTable';
import AddForm from '@/containers/Distributors/AddForm';

export const mainRoutes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Invoices />,
      },
      {
        path: URL_PATH.Invoices,
        element: <Invoices />,
      },
      {
        path: URL_PATH.CreateInvoice,
        element: <CreateInvoice />,
      },
      {
        path: `${URL_PATH.InvoiceView}/:invoiceNo`,
        element: <InvoiceView />,
      },
      {
        path: URL_PATH.DistributorsTable,
        element: <DistributorsTable />,
      },
      {
        path: URL_PATH.AddForm,
        element: <AddForm />,
      },
      
    ],
  },
];
