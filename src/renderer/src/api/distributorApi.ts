import axios from "axios";

/*TYPES*/

export type DistributorStatus = "ACTIVE" | "INACTIVE";

export interface DistributorRequest {
  companyName: string;
  email: string;
  mobile: string;
  date: string;     
  address: string;
}

export interface DistributorResponse {
  id: number;
  companyName: string;
  email: string;
  mobile: string;
  date: string;
  address: string;
  status: DistributorStatus;
}

/*AXIOS INSTANCE */

const API_BASE_URL = "http://localhost:8080/api/distributors";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/*CREATE */
export const createDistributor = async (
  data: DistributorRequest
): Promise<DistributorResponse> => {
  const res = await api.post<DistributorResponse>("/", data);
  return res.data;
};

/*GET ALL*/
export const getAllDistributors = async (): Promise<DistributorResponse[]> => {
  const res = await api.get<DistributorResponse[]>("/");
  return res.data;
};

/* GET BY ID */
export const getDistributorById = async (
  id: number
): Promise<DistributorResponse> => {
  const res = await api.get<DistributorResponse>(`/${id}`);
  return res.data;
};

/* UPDATE*/
export const updateDistributor = async (
  id: number,
  data: DistributorRequest
): Promise<DistributorResponse> => {
  const res = await api.put<DistributorResponse>(`/${id}`, data);
  return res.data;
};

/*UPDATE STATUS*/
export const updateDistributorStatus = async (
  id: number,
  status: DistributorStatus
): Promise<DistributorResponse> => {
  const res = await api.patch<DistributorResponse>(
    `/${id}/status`,
    null,
    { params: { status } }
  );
  return res.data;
};

/*DELETE*/
export const deleteDistributor = async (id: number): Promise<void> => {
  await api.delete<void>(`/${id}`);
};
