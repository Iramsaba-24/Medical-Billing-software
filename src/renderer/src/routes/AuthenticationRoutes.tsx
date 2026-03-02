import { RouteObject } from "react-router-dom";
import LOGIN from "@/view/auth/LoginPage";
import { URL_PATH } from "../constants/UrlPath";
import RegisterPage from "@/view/auth/RegisterPage";
import NetBanking_PurchaseDetails from "@/view/auth/NetBanking_PurchaseDetails";
import BusinessDetails from "@/view/auth/BusinessDetails";


export const authRoutes: RouteObject[] = [
  {
    index: true,
    element: <RegisterPage />,
  },
   

  {
    path: URL_PATH.LOGIN,
    element: <LOGIN />,
  },
 
 {
    path: URL_PATH.BusinessDetails,
    element: <BusinessDetails />,
  },

   {
    path: URL_PATH.NetBanking_PurchaseDetails,
    element: <NetBanking_PurchaseDetails />,
  },

  
];


