import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";

/*TYPES  */

// frontend form data
export interface DistributorFormData {
  companyName: string;
  ownerName?: string;
  phone: string;
  email: string;
  registrationNumber: string;
  website?: string;
  gstin: string;
  address: string;
  createdAt: string;

  // bank
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branch: string;
  ifscCode: string;
  upiId: string;
}

// backend request
interface DistributorRequest {
  userId: number;
  companyName: string;
  phone: string;
  email: string;
  registrationNumber: string;
  website?: string;
  gstin: string;
  address: string;
  createdAt: string;

  BankDetails: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    branch: string;
    ifscCode: string;
    upiId: string;
  };
}

// backend response
export interface DistributorResponse {
  distributorId: number;
  companyName: string;
  phone: string;
  email: string;
  registrationNumber: string;
  website?: string;
  gstin: string;
  address: string;
  createdAt: string;

  BankDetails?: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    branch: string;
    ifscCode: string;
    upiId: string;
  };
}

/* ================= HELPERS ================= */

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

/* ================= API CALLS ================= */

// GET all distributors
export const getDistributors = async (): Promise<DistributorResponse[]> => {
  const res = await axios.get(
    API_ENDPOINTS.DISTRIBUTOR,
    getAuthHeaders()
  );

  return res.data;
};

// GET distributor by ID
export const getDistributorById = async (
  id: number
): Promise<DistributorResponse> => {
  const res = await axios.get(
    `${API_ENDPOINTS.DISTRIBUTOR}/${id}`,
    getAuthHeaders()
  );

  return res.data;
};

// ADD distributor
export const addDistributor = async (
  data: DistributorFormData
): Promise<DistributorResponse> => {

const distributorData: DistributorRequest = {
  userId: getUserId(),
  companyName: data.companyName,
  phone: data.phone,
  email: data.email,
  registrationNumber: String(data.registrationNumber), // ← string मध्ये convert करा
  website: data.website || undefined,
  gstin: data.gstin,
  address: data.address,
createdAt: data.createdAt 
  ? new Date(data.createdAt).toISOString() 
  : new Date().toISOString(),  BankDetails: {
    bankName: data.bankName,
    accountNumber: data.accountNumber,
    accountHolderName: data.accountHolderName,
    branch: data.branch,
    ifscCode: data.ifscCode,
    upiId: data.upiId,
  },
};

  const res = await axios.post(
    API_ENDPOINTS.DISTRIBUTOR,
    distributorData,
    getAuthHeaders()
  );

  return res.data;
};

// UPDATE distributor
export const updateDistributor = async (
  id: number,
  data: DistributorFormData
): Promise<DistributorResponse> => {

  const distributorData: DistributorRequest = {
    userId: getUserId(),
    companyName: data.companyName,
    phone: data.phone,
    email: data.email,
    registrationNumber: data.registrationNumber,
    website: data.website,
    gstin: data.gstin,
    address: data.address,
    createdAt: data.createdAt,

    BankDetails: {
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      accountHolderName: data.accountHolderName,
      branch: data.branch,
      ifscCode: data.ifscCode,
      upiId: data.upiId,
    },
  };

  const res = await axios.put(
    `${API_ENDPOINTS.DISTRIBUTOR}/${id}`,
    distributorData,
    getAuthHeaders()
  );

  return res.data;
};

// DELETE distributor
export const deleteDistributor = async (id: number): Promise<void> => {
  await axios.delete(
    `${API_ENDPOINTS.DISTRIBUTOR}/${id}`,
    getAuthHeaders()
  );
};