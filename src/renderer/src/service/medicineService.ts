import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";

// frontend form data
export interface MedicineFormData {
  itemName: string;
  unit: string;
  quantity: number;
  pricePerUnit: number;
  expiryDate: string;
  medicineGroup: string;
  supplier: string;
}

// backend request
interface MedicineRequest {
  itemName: string;
  unit: string;
  quantity: number;
  pricePerUnit: number;
  expiryDate: string;
  groupId: number;
  distributorId: number;

  batchNumber: string;
  company: string;
  gstPercentage: number;
}


// backend response
export interface MedicineResponse {
  medicineId: number;
  itemName: string;
  quantity: number;
  pricePerUnit: number;
  expiryDate: string;


  
}

interface MedicineGroup {
  groupId: number;
  groupName: string;
}

interface Distributor {
  distributorId: number;
  companyName: string;
  status: string;
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
  const res = await axios.get(API_ENDPOINTS.MEDICINE, {
    ...getAuthHeaders(),
    params: { search },
  });

  return res.data.data; 
};


export const addMedicine = async (
  data: MedicineFormData
): Promise<MedicineResponse> => {

  const groups: MedicineGroup[] = JSON.parse(
    localStorage.getItem("medicineGroups") || "[]"
  );

  const distributors: Distributor[] = JSON.parse(
    localStorage.getItem("distributors") || "[]"
  );

  const selectedGroup = groups.find(
    (g) => g.groupName === data.medicineGroup
  );

  const selectedDistributor = distributors.find(
    (d) => d.companyName === data.supplier
  );

  if (!selectedGroup) {
    throw new Error("Invalid medicine group selected");
  }

  if (!selectedDistributor) {
    throw new Error("Invalid supplier selected");
  }

 
const payload: MedicineRequest = {
  itemName: data.itemName,
  unit: data.unit,
  quantity: data.quantity,
  pricePerUnit: data.pricePerUnit,
  expiryDate: new Date(data.expiryDate).toISOString(),
  groupId: selectedGroup.groupId,
 distributorId: selectedDistributor.distributorId,

  
  batchNumber: "NA",
  company: data.supplier, 
  gstPercentage: 0
};

  const res = await axios.post(
    API_ENDPOINTS.MEDICINE,
    payload,
    getAuthHeaders()
  );

  return res.data.data;
};