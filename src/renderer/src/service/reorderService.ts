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
export type ApproveOrderPayload = {
  distributorName: string; 
  paid: number;
  unpaid: number;
  paymentMode: string;
  medicines: {
    medicineName: string;
    strength: string;
    qty: number;
    amount: number;
  }[];
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
export type ReorderResponse = {
  id: number;
  distributorName: string;
  emailAddress: string;
  createdAt: string;
  existingMedicines: {
    id: number;
    medicineName: string;
    strength: string;
    companyName: string;
    qty: number;
        paidAmount: number | null;    
    unPaidAmount: number | null;  
    paymentType: string | null;
  }[];
  newMedicines: {
    id: number;
    medicineName: string;
    strength: string;
    qty: number;
  }[];
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
export const getLastPurchases = async (): Promise<ReorderResponse[]> => {
  const res = await axios.get<ReorderResponse[]>(
    API_ENDPOINTS.REORDER,
    getAuthHeaders()
  );
  return res.data; 
};
// approve order
export const approveReorder = async (
  id: number,
  payload: {
    distributorName: string;
    emailAddress: string;
    existingMedicines: {
      medicineName: string;
      strength: string;
      companyName: string;
      qty: number;
      paidAmount: number;
      unPaidAmount: number;
      paymentType: string;
    }[];
    newMedicines: {
      medicineName: string;
      strength: string;
      qty: number;
      paidAmount: number;
      unPaidAmount: number;
      paymentType: string;
    }[];
  }
): Promise<void> => {
  await axios.put(
    `${API_ENDPOINTS.REORDER}/${id}`,
    payload,
    getAuthHeaders()
  );
};

// हे add कर - file च्या शेवटी
export const deleteReorder = async (id: number): Promise<void> => {
  await axios.delete(
    `${API_ENDPOINTS.REORDER}/${id}`,
    getAuthHeaders()
  );
};