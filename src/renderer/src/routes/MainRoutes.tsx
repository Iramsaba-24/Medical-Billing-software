import { RouteObject } from "react-router-dom";
import Layout from "@/containers/layout/Header";
import { URL_PATH } from "@/constants/UrlPath";
import Invoices from "@/view/Invoices";
import CreateInvoice from "@/containers/Invoices/CreateInvoice";
import InvoiceView from "@/containers/Invoices/InvoiceView";
import Inventory from "@/view/Inventory";
import InventoryList from "@/containers/inventory/InvetoryList";
import MedicineGroup from "@/containers/inventory/MedicineGroup";
import MedicineGroupView from "@/containers/inventory/MedicineGroupView";
import AddMedicineGroup from "@/containers/inventory/AddMedicineGroup";
import AddInventoryItem from "@/containers/inventory/AddInventoryItem";
import Landing from "@/containers/landing-page/LandingPage";
import Dashboard from "@/view/Dashboard";
import CustomerMaster from "@/view/CustomerMaster";
import DoctorTable from "@/view/Doctors";
import AddDoctor from "@/containers/doctors/AddDoctor";
import DoctorsDetail from "@/containers/doctors/DoctorsDetail";
import DistributorsPage from "@/view/DistributorsPage";

import ReportPage from "@/view/ReportPage";
import Reorder from "@/containers/inventory/ReorderList";
import DistributorDetails from "@/containers/Distributors/DistributorsDetails";
import PharmacyProfile from "@/containers/setting/PharmacyProfile";
import Setting from "@/containers/layout/Setting";

import DistributorsForm from "@/containers/Distributors/DistributorsForm";
import InventorySettings from "@/containers/setting/InventorySettings";

import MediPoints from "@/containers/billing/MediPoints";
import Billing from "@/view/Billing";
import PaymentMethod from "@/containers/billing/PaymentMethod";
import RetailInvoice from "@/containers/billing/RetailInvoice";
import CustomerSettings from "@/containers/setting/CustomerSettings";
import InvoiceSettings from "@/containers/setting/InvoiceSetting";

export const mainRoutes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },

      { path: URL_PATH.Dashboard, element: <Dashboard /> },
      {
        path: URL_PATH.Invoices,
        element: <Invoices />,
      },
      {
        path: URL_PATH.Customer,
        element: <CustomerMaster />,
      },
      {
        path: URL_PATH.Doctors,
        element: <DoctorTable />,
      },
      {
        path: URL_PATH.AddDoctor,
        element: <AddDoctor />,
      },
      {
        path: URL_PATH.DoctorsDetail,
        element: <DoctorsDetail />,
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
        path: URL_PATH.Inventory,
        element: <Inventory />,
      },
      {
        path: URL_PATH.InventoryList,
        element: <InventoryList />,
      },
      {
        path: URL_PATH.Reorder,
        element: <Reorder />,
      },
      {
        path: URL_PATH.MedicineGroup,
        element: <MedicineGroup />,
      },
      {
        path: "/medicine-groups/:id",
        element: <MedicineGroupView />,
      },
      {
        path: URL_PATH.AddMedicineGroup,
        element: <AddMedicineGroup />,
      },
      {
        path: URL_PATH.AddInventoryItem,
        element: <AddInventoryItem />,
      },
      {
        path: URL_PATH.DistributorsPage,
        element: <DistributorsPage />,
      },
      {
        path: URL_PATH.DistributorsForm,
        element: <DistributorsForm />,
      },
      {
        path: URL_PATH.DistributorDetails,
        element: <DistributorDetails />,
      },
      {
        path: URL_PATH.ReportPage,
        element: <ReportPage />,
      },
      {
        path: URL_PATH.DistributorDetails,
        element: <DistributorDetails />,
      },
      {
        path: URL_PATH.CustomerSetting,
        element: <CustomerSettings />,
      },
      {
        path: URL_PATH.InvoiceSetting,
        element: <InvoiceSettings />,
      },
      {
        path: URL_PATH.InventorySettings,
        element: <InventorySettings />,
      },

      {
        path: URL_PATH.Setting,
        element: <Setting />,
      },

      {
        path: URL_PATH.MediPoints,
        element: <MediPoints />,
      },

      {
        path: URL_PATH.Billing,
        element: <Billing />,
      },
      {
        path: `${URL_PATH.Billing}/:invoiceNo`,
        element: <Billing />,
      },
      {
        path: URL_PATH.PaymentMethod,
        element: <PaymentMethod />,
      },

      {
        path: URL_PATH.PharmacyProfile,
        element: <PharmacyProfile />,
      },
      {
        path: URL_PATH.RetailInvoice,
        element: <RetailInvoice />,
      },
    ],
  },
];
