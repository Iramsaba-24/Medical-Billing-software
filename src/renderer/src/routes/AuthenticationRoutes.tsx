import { RouteObject } from "react-router-dom";
import LOGIN from "@/view/auth/LoginPage";
import { URL_PATH } from "../constants/UrlPath";
import RegisterPage from "@/view/auth/RegisterPage";
import ProceedToPaymentPage from "@/view/auth/ProceedToPaymentPage";

export const authRoutes: RouteObject[] = [
  {
    index: true,
    element: <RegisterPage />,
  },
  {
    path: URL_PATH.ProceedToPaymentPage,
    element: <ProceedToPaymentPage />,
  },
  {
    path: URL_PATH.LOGIN,
    element: <LOGIN />,
  },
];
