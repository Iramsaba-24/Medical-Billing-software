import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";

// types
// REQUEST
export interface InvoiceRequest {
  userId: number;
  distributorId: number;
  invoiceType: string;
  invoiceDate: string;
  totalAmount: number;
  totalGST: number;
  totalDiscount: number;
  medipointsEarned: number;
  paymentStatus: string;
}

// RESPONSE
export interface InvoiceResponse {
  invoiceId: number;
  totalAmount: number;
  totalGST: number;
  paymentStatus: string;
}
 export type InvoiceListResponse = {
  invoiceId: number;
  invoiceDate: string;
  totalAmount: number;
  paymentStatus: string;
  distributorName?: string;
  distributorId: number;
};
// helpers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

const getUserId = (): number => {
  const id = localStorage.getItem("userId");
  if (!id) throw new Error("User not logged in");
  return Number(id);
};

// CREATE INVOICE
export const createInvoice = async (
  data: Omit<InvoiceRequest, "userId">
): Promise<InvoiceResponse> => {
  const payload: InvoiceRequest = {
    ...data,
    userId: getUserId(),
  };

  const res = await axios.post(
    API_ENDPOINTS.INVOICE,
    payload,
    getAuthHeaders()
  );

  return res.data;
};
export const getInvoiceById = async (invoiceId: number) => {
  const res = await axios.get(`${API_ENDPOINTS.INVOICE}/${invoiceId}`);
  return res.data;
};
export const getAllInvoices = async (): Promise<InvoiceListResponse[]> => {
  const res = await axios.get(API_ENDPOINTS.INVOICE, getAuthHeaders());
  return res.data;
};