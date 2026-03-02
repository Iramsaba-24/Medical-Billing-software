import { RouteObject } from "react-router-dom";
import LOGIN from "@/view/auth/LoginPage";
import { URL_PATH } from "../constants/UrlPath";
import RegisterPage from "@/view/auth/RegisterPage";
import CardPayment from "@/view/auth/CardPayment";
import PaymentSuccess from "@/view/auth/PaymentSuccess";
import UpiPayment from "@/view/auth/UpiPaymanet";



export const authRoutes: RouteObject[] = [
  {
    index: true,
    element: <RegisterPage />,
  },

      {
        path: URL_PATH.CardPayment,
        element: <CardPayment />,
      },
      {
        path: URL_PATH.UpiPayment,
        element: <UpiPayment />,
      },
      {
        path: URL_PATH.PaymentSuccess,
        element: <PaymentSuccess />,
      },
   
  {
    path: URL_PATH.LOGIN,
    element: <LOGIN />,
  },
  
];


