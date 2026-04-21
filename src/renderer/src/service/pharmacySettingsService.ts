// pharmacySettingsService.ts
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";


// TYPES

export interface PharmacySettingsRequest {
  userId: number;

   logoUrl?: string | null;
  pharmacyName: string | null;
  address: string | null;
//   pharmacyName: string;
//   address: string;
  drugLicenseNumber: string;
  fssaiNumber: string;
  contactNumber: string;
  email: string;
//   logoUrl?: string;
}

export interface PharmacySettingsResponse {
  ownerName: string;
  drugLicenseNo: string;
  settingId: number;
  userId: number;
  
//   pharmacyName: string;
//   address: string;
  drugLicenseNumber: string;
  fssaiNumber: string;
  contactNumber: string;
  email: string;
//logoUrl?: string;
  createdAt: string;
  updatedAt: string;
    // logoUrl: string | null;
    logoUrl?: string | null;
  pharmacyName: string | null;
  address: string | null;

}


// SERVICE

const axiosInstance = axios.create({
  baseURL: API_ENDPOINTS.PHARMACY_SETTINGS,
  headers: { "Content-Type": "application/json" },
});

export const pharmacySettingsService = {
  /** GET settings by userId */
  async getSettings(userId: number): Promise<PharmacySettingsResponse> {
    const { data } = await axiosInstance.get(`/${userId}`);
    return data;
  },

  /** CREATE or UPDATE settings */
  async saveSettings(
    payload: PharmacySettingsRequest
  ): Promise<PharmacySettingsResponse> {
    const { data } = await axiosInstance.post("/", payload);
    return data;
  },
};