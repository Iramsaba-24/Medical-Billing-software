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
  supplier:string ;
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
  unit: string;        
  groupId: number;     
  distributorId: number;

  
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

  const payload: MedicineRequest = {
    itemName: data.itemName,
    unit: data.unit,
    quantity: data.quantity,
    pricePerUnit: data.pricePerUnit,
    expiryDate: new Date(data.expiryDate).toISOString(),

    groupId: Number(data.medicineGroup),  
    distributorId: Number(data.supplier), 
    batchNumber: "NA",
    company: "NA",
    gstPercentage: 0
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
): Promise<MedicineResponse> => {
  const payload: MedicineRequest = {
    itemName: data.itemName,
    unit: data.unit,
    quantity: data.quantity,
    pricePerUnit: data.pricePerUnit,
    expiryDate: new Date(data.expiryDate).toISOString(),
    groupId: Number(data.medicineGroup),
    distributorId: Number(data.supplier),
    batchNumber: "NA",
    company: "NA",
    gstPercentage: 0,
  };

  const res = await axios.put(
    `${API_ENDPOINTS.MEDICINE}/${id}`,
    payload,
    getAuthHeaders()
  );
  return res.data.data;
};