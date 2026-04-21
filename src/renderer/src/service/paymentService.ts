import { axiosInstance } from "@/service/authService";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";

// frontend form data
export interface UpiPaymentFormData {
   invoiceId: number;
   subscriptionId: number;
  amountPaid: number;
  upiReference: string;
  transactionReference: string;
  customerId: number;
  
}

// backend request
interface UpiPaymentRequest extends UpiPaymentFormData {
  paymentMethod: string;
}

// backend response
export interface PaymentResponse {
  paymentId: number;
  invoiceId: number;
  paymentMethod: string;
  amountPaid: number;
  paymentDate: string;
  paymentStatus: string;
}

// token header
// const getAuthHeaders = () => {
//   const token = localStorage.getItem("token");

//   return {
//     headers: {
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//   };
// };

// CREATE UPI PAYMENT
export const createUpiPayment = async (
  data: UpiPaymentFormData
): Promise<PaymentResponse> => {

  const paymentData: UpiPaymentRequest = {
    ...data,
    paymentMethod: "UPI",
  };

  const res = await axiosInstance.post(
    "/CustomerPayment/upi",
    paymentData,
    // getAuthHeaders()
  );

  return res.data;
};