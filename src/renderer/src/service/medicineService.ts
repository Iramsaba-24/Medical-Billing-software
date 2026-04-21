import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";
 
 
// frontend form data
export interface MedicineFormData {
  medicineName: string;
  batchNumber?: string; 
  hsnCode?: string;
  //  mrpPerTablet: number;
  numberOfStrips: number;
  tabletsPerStrip: number;
  looseTablets: number;
  purchasePricePerStrip: number;
  mrpPerStrip: number;
  gstPercent: number;
  purchaseDate?: string;
  invoiceNumber?: string;
  expiryDate: string;
  companyName?: string;
  strength: string;
  type: string;
  distributorId: number;
  groupId: number;
  manufacturingDate?: string;
  minimumQuantity: number;
  maximumQuantity: number;
}

 
 
// backend response
export interface MedicineResponse {
  medicineId: number;
  medicineName: string;
  batchNumber?: string;
  hsnCode?: string;
   mrpPerTablet: number;
  totalStockTablets: number;

  purchasePricePerStrip: number;
  mrpPerStrip: number;
  gstPercent: number;

  purchasePricePerTablet: number;
  expiryDate: string;
  companyName?: string;
  type: string;
  strength?: string;

  distributorId: number;
  distributorName?: string;

  groupId: number;
  groupName?: string;
  category?: string;

  // totalPrice: number;
  // finalPrice: number;
    stockValue: number;
  status: string;
  isLowStock: boolean;

  manufacturingDate?: string;

  minimumQuantity: number;
  maximumQuantity: number;
}
 
 
// token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
 
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};
 
 
export const getMedicines = async (search?: string) => {
  try {
    const res = await axios.get(API_ENDPOINTS.MEDICINE, {
      ...getAuthHeaders(),
      params: { search },
    });
    return res.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};
 
export const addMedicine = async (
  data: MedicineFormData
) => {

  const payload = {
    ...data,
      hsnCode: data.hsnCode || "",
    batchNumber: data.batchNumber?.toString() || "",
    expiryDate: new Date(data.expiryDate).toISOString(),
    purchaseDate: data.purchaseDate
      ? new Date(data.purchaseDate).toISOString()
      : undefined,
    manufacturingDate: data.manufacturingDate
      ? new Date(data.manufacturingDate).toISOString()
      : undefined,
  };

  console.log("FINAL PAYLOAD:", payload);

  const res = await axios.post(
    API_ENDPOINTS.MEDICINE,
    payload,
    getAuthHeaders()
  );

  return res.data.data;
};
 
export const updateMedicine = async (
  id: number,
  data: MedicineFormData
) => {

  const payload = {
    ...data,
      hsnCode: data.hsnCode || "",
    batchNumber: data.batchNumber?.toString() || "",
    expiryDate: new Date(data.expiryDate).toISOString(),
    purchaseDate: data.purchaseDate
      ? new Date(data.purchaseDate).toISOString()
      : undefined,
    manufacturingDate: data.manufacturingDate
      ? new Date(data.manufacturingDate).toISOString()
      : undefined,
  };

  console.log("UPDATE PAYLOAD:", payload);

  const res = await axios.put(
    `${API_ENDPOINTS.MEDICINE}/${id}`,
    payload,
    getAuthHeaders()
  );

  return res.data.data;
};
 
export const deleteMedicine = async (id: number): Promise<void> => {
  await axios.delete(
    `${API_ENDPOINTS.MEDICINE}/${id}`,
    getAuthHeaders()
  );
};