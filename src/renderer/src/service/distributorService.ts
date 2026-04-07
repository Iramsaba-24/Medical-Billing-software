import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";

/*TYPES */

// frontend form data
export interface DistributorFormData {
  companyName: string;
  ownerName: string; //  make required
  phone: string;
  email: string;
  registrationNumber: string;
  website?: string;
  gstin: string;
  address: string;

  // bank
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branch: string;
  ifscCode: string;
  upiId: string;
}

// backend request (MATCH DTO EXACTLY)
interface DistributorRequest {
  companyName: string;
  ownerName: string; //  REQUIRED
  phone: string;
  email: string;
  registrationNumber: string;
  website?: string | null;
  gstin: string;
  address: string;

  bankDetails: { 
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
  ownerName: string;
  phone: string;
  email: string;
  registrationNumber: string;
  website?: string;
  gstin: string;
  address: string;
  createdDate: string;
 //reatedAt: string;
  bankDetails?: { 
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    branch: string;
    ifscCode: string;
    upiId: string;
  };
}

/*  HELPERS */

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

/* API CALLS  */

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

//  ADD distributor (FIXED)
export const addDistributor = async (
  data: DistributorFormData
): Promise<DistributorResponse> => {

  const distributorData: DistributorRequest = {
    companyName: data.companyName,
    ownerName: data.ownerName, //  REQUIRED
    phone: data.phone,
    email: data.email,
    registrationNumber: data.registrationNumber,
    website: data.website ? data.website : null, // fix URL issue
    gstin: data.gstin,
    address: data.address,

    bankDetails: { //  MUST be nested
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

//  UPDATE distributor (FIXED)
export const updateDistributor = async (
  id: number,
  data: DistributorFormData
): Promise<DistributorResponse> => {

  const distributorData: DistributorRequest = {
    companyName: data.companyName,
    ownerName: data.ownerName,
    phone: data.phone,
    email: data.email,
    registrationNumber: data.registrationNumber,
    website: data.website ? data.website : null,
    gstin: data.gstin,
    address: data.address,

    bankDetails: {
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

