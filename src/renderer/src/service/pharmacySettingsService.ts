import axios from "axios";
import { API_BASE_URL } from "@/constants/ApiEndpoints";

export interface PharmacySettingsResponse {
  settingId: number;
  userId: number;
  pharmacyName: string | null;
  address: string | null;
  logoUrl?: string | null;
  drugLicenseNumber: string;
  fssaiNumber: string;
  contactNumber: string;
  email: string;
  ownerName: string;
  drugLicenseNo: string;
  createdAt: string;
  updatedAt: string;
}

export interface PharmacySettingsRequest {
  userId: number;
  pharmacyName: string | null;
  address: string | null;
  logoUrl?: string | null;
  drugLicenseNumber: string;
  fssaiNumber: string;
  contactNumber: string;
  email: string;
}

export const pharmacySettingsService = {
  async getSettings(userId: number): Promise<PharmacySettingsResponse> {
    const { data } = await axios.get(
      `${API_BASE_URL}/pharmacySettings/${userId}`
    );
    return data;
  },

  async saveSettings(
    payload: PharmacySettingsRequest
  ): Promise<PharmacySettingsResponse> {
    const { data } = await axios.post(
      `${API_BASE_URL}/pharmacySettings`,
      payload
    );
    return data;
  },
};