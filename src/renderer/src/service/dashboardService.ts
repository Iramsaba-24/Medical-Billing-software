import axiosInstance from "@/service/axiosConfig";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";

// export interface DashboardCardsResponse {
//   TotalRevenue: number;
//   InventoryStatus: string;
//   MedicineAvailableCount: number;
//   MedicineShortageCount: number;
// }
export interface DashboardCardsResponse {
  totalRevenue: number;
  inventoryStatus: string;
  medicineAvailableCount: number;
  medicineShortageCount: number;
}

export interface DashboardInventoryResponse {
  medicineCount: number;
  medicineGroupCount: number;
}

export interface DashboardTopSellingResponse {
  medicineName: string;
  quantity: number;
}

// cards
export const getDashboardCards = async () => {
  const res = await axiosInstance.get<DashboardCardsResponse>(
    API_ENDPOINTS.DASHBOARD_CARDS
  );
  return res.data;
};

// inventory
export const getDashboardInventory = async (duration: string) => {
  const res = await axiosInstance.get<DashboardInventoryResponse>(
    `${API_ENDPOINTS.DASHBOARD_INVENTORY}?durationType=${duration}`
  );
  return res.data;
};

// top selling
export const getTopSellingMedicine = async (duration: string) => {
  const res = await axiosInstance.get<DashboardTopSellingResponse>(
    `${API_ENDPOINTS.DASHBOARD_TOP_SELLING}?durationType=${duration}`
  );
  return res.data;
};