import { RouteObject } from "react-router-dom";
import LOGIN from "@/view/auth/LoginPage";
import { URL_PATH } from "../constants/UrlPath";
import RegisterPage from "@/view/auth/RegisterPage";

import BusinessDetails from "@/view/auth/BusinessDetails";
import ChoosePlan from "@/view/auth/ChoosePlan";
import AccountSetup from "@/view/auth/AccountSetup";
import NetPurchaseDetails from "@/view/auth/NetPurchaseDetails";
import ProceedToPaymentPage from "@/view/auth/ProceedToPaymentPage";
import NetBanking from "@/view/auth/NetBanking";
import ReceiverDetails from "@/view/auth/ReceiverDetails";


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
          path: URL_PATH.ChoosePlan,
          element: <ChoosePlan />,
        },
        {
          path: URL_PATH.AccountSetup,
          element: <AccountSetup />,
        },
 
 {
    path: URL_PATH.BusinessDetails,
    element: <BusinessDetails />,
  },

   {
    path: URL_PATH.NetPurchaseDetails,
    element: <NetPurchaseDetails />,
  },
  {
    path: URL_PATH.ProceedToPaymentPage,
    element: <ProceedToPaymentPage />,
  },
  {
    path: URL_PATH.NetBanking,
    element: <NetBanking />,
  },
  {
    path: URL_PATH.ReceiverDetails,
    element: <ReceiverDetails />,
  },

  
];


