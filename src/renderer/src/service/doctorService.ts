import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";
 
// types
// frontend form data
export interface DoctorFormData {
  doctorName: string;
  degree: string;
  phone: string;
  email: string;
  registrationNumber: string;
  hospitalAddress: string;
    isActive?: boolean;
    IsActive?: boolean;
}
 
// backend request
interface DoctorRequest extends DoctorFormData {
  userId: number;
  clinicName: string;
  IsActive: boolean;
}
 
// backend response
export interface DoctorResponse {
  SrNo: number;
  doctorId: number;
  doctorName: string;
  degree: string; 
  phone: string;
  email: string;
  registrationNumber: string; 
  hospitalAddress: string;
   isActive: boolean;
    IsActive?: boolean;
}
 
// helpers
// token header
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
 
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};
 
// userId
const getUserId = (): number => {
  const id = localStorage.getItem("userId");
  if (!id) {
    throw new Error("User not logged in");
  }
  return Number(id);
};
 
// api calling
// GET all doctors
export const getDoctors = async (): Promise<DoctorResponse[]> => {
  const res = await axios.get(
    API_ENDPOINTS.DOCTOR,
    getAuthHeaders() // token
  );
  return res.data;
};
 
// ADD doctor
export const addDoctor = async (
  data: DoctorFormData
): Promise<DoctorResponse> => {
 
  const doctorData: DoctorRequest = {
    ...data,
    userId: getUserId(),
    clinicName: "Default Clinic",
    IsActive: data.isActive ?? data.IsActive ?? true,//nullish coalescing 
  };
 
  const res = await axios.post(
    API_ENDPOINTS.DOCTOR,
    doctorData,
    getAuthHeaders() // token
  );
  return res.data;
};
// UPDATE doctor
export const updateDoctor = async (
  id: number,
  data: DoctorFormData
): Promise<DoctorResponse> => {
 
  const doctorData: DoctorRequest = {
    ...data,
    userId: getUserId(),
    clinicName: "Default Clinic",
    IsActive: data.isActive ?? data.IsActive ?? true,
  };
 
  const res = await axios.put(
    `${API_ENDPOINTS.DOCTOR}/${id}`,
    doctorData,
    getAuthHeaders() // token
  );
 
  return res.data;
};
 
// DELETE doctor
export const deleteDoctor = async (id: number): Promise<void> => {
  await axios.delete(
    `${API_ENDPOINTS.DOCTOR}/${id}`,
    getAuthHeaders() // token
  );
};