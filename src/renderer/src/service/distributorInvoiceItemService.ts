import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";

// types
export interface DistributorInvoiceItemFormData {
  invoiceId: number;
  medicineId: number;
  quantity: number;
  mrp: number;
  discountPrice: number;
  amount: number;
}

export interface DistributorInvoiceItemResponse {
  invoiceItemId: number;
  invoiceId: number;
  medicineId: number;
  quantity: number;
  price: number;
  gstPercent: number;
  discount: number;
  amount: number;
  subtotal: number;
  gstAmount: number;
}

// HELPERS
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

// API
// ADD single item
export const addDistributorInvoiceItem = async (
  data: DistributorInvoiceItemFormData
): Promise<DistributorInvoiceItemResponse> => {
  const res = await axios.post(
    `${API_ENDPOINTS.INVOICE_ITEM}`,
    data,
    getAuthHeaders()
  );
  return res.data;
};
// GET by invoice ID
export const getItemsByInvoiceId = async (
  invoiceId: number
): Promise<DistributorInvoiceItemResponse[]> => {
  const res = await axios.get(
    `${API_ENDPOINTS.INVOICE_ITEM}/invoice/${invoiceId}`,
    getAuthHeaders()
  );
  return res.data;
};

// DELETE item
export const deleteInvoiceItem = async (id: number): Promise<void> => {
  await axios.delete(
    `${API_ENDPOINTS.INVOICE_ITEM}/${id}`,
    getAuthHeaders()
  );
};