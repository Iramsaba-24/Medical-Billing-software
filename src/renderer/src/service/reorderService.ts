import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

export type LowStockResponse = {
  medicineId: number;
  itemName: string;
  quantity: number;
  unit: string;
};

export type LowStockApiResponse = {
  message: string;
  data: LowStockResponse[];
};

export type ReorderLevelsResponse = {
  reorderId: number;
  medicineName: string;
  companyName: string;
  reorderQuantity: number;
  minimumQuantity: number;
  unit: string;
  purchaseRate: number;
  mrp: number;
  gstPercentage: number;
  discount: number;
  amount: number;
  gstAmount: number;
  finalAmount: number;
  SrNo: number;
  medicineId: number;
  expiryDate: string;
};

export type ReorderApiResponse = {
  message: string;
  data: ReorderLevelsResponse[];
};

// reorder
export const createReorder = async (data: {
  distributorId: number;
  email: string;
  items: { medicineId: number; quantity: number }[];
}) => {
  const res = await axios.post(
    API_ENDPOINTS.REORDER,
    data,
    getAuthHeaders()
  );
  return res.data;
};

// low stock
export const getLowStock = async (): Promise<LowStockApiResponse> => {
  const res = await axios.get<LowStockApiResponse>(
    API_ENDPOINTS.LOW_STOCK,
    getAuthHeaders()
  );
  return res.data;
};

// last purchase
export const getLastPurchases = async (): Promise<ReorderApiResponse> => {
  const res = await axios.get<ReorderApiResponse>(
    API_ENDPOINTS.LAST_PURCHASE,
    getAuthHeaders()
  );
  return res.data;
};