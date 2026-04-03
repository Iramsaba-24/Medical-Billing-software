import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";
import { CustomerData } from "@/view/CustomerMaster";

//  token header 
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


//  GET all customers
export const getAllCustomers = async (): Promise<CustomerData[]> => {
  const res = await axios.get(
    API_ENDPOINTS.CUSTOMER,
    getAuthHeaders()
  );
  return res.data;
};


//  GET customer by ID
export const getCustomerById = async (
  id: number | string
): Promise<CustomerData> => {
  const res = await axios.get(
    `${API_ENDPOINTS.CUSTOMER}/${id}`,
    getAuthHeaders()
  );
  return res.data;
};


//  CREATE customer
export const createCustomer = async (
  data: CustomerData
): Promise<CustomerData> => {

  const customerData = {
    ...data,
    userId: getUserId(), // agar backend me required ho
  };

  const res = await axios.post(
    API_ENDPOINTS.CUSTOMER,
    customerData,
    getAuthHeaders()
  );

  return res.data;
};

//  UPDATE customer
export const updateCustomer = async (
  id: number | string,
  data: CustomerData
): Promise<CustomerData> => {

  const customerData = {
    ...data,
    userId: getUserId(),
  };

  const res = await axios.put(
    `${API_ENDPOINTS.CUSTOMER}/${id}`,
    customerData,
    getAuthHeaders()
  );

  return res.data;
};


//  DELETE customer
export const deleteCustomer = async (
  id: number | string
): Promise<void> => {
  await axios.delete(
    `${API_ENDPOINTS.CUSTOMER}/${id}`,
    getAuthHeaders()
  );
};