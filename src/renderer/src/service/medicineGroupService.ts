import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";

// types
export interface MedicineGroupRequest {
  groupName: string;
  category: string;
}

export interface MedicineGroupResponse {
  groupId: number;
  groupName: string;
  category: string;
   medicineCount: number;
}

// token helper
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token not found");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


// GET all groups
export const getMedicineGroups = async (): Promise<MedicineGroupResponse[]> => {
  const res = await axios.get(
    API_ENDPOINTS.MEDICINE_GROUP,
    getAuthHeaders()
  );

  return res.data.data; 
};

//get grp by id
export const getMedicineGroupById = async (id: number) => {
  const res = await axios.get(
    `${API_ENDPOINTS.MEDICINE_GROUP}/${id}`,
    getAuthHeaders()
  );

  return res.data.data;
};


// ADD group
export const addMedicineGroup = async (
  data: MedicineGroupRequest
): Promise<MedicineGroupResponse> => {

  const res = await axios.post(
    API_ENDPOINTS.MEDICINE_GROUP,
    data,
    getAuthHeaders()
  );

  return res.data.data;
};


// UPDATE
export const updateMedicineGroup = async (
  id: number,
  data: MedicineGroupRequest
) => {
  const res = await axios.put(
    `${API_ENDPOINTS.MEDICINE_GROUP}/${id}`,
    data,
    getAuthHeaders()
  );

  return res.data.data;
};


// DELETE
export const deleteMedicineGroup = async (id: number) => {
  await axios.delete(
    `${API_ENDPOINTS.MEDICINE_GROUP}/${id}`,
    getAuthHeaders()
  );
};