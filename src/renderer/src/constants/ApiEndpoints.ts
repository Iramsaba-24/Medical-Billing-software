export const API_BASE_URL = 'http://localhost:5158/api'; 

export const API_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/Auth/register`,
  LOGIN: `${API_BASE_URL}/Auth/login`,
  ACTIVATE_SUBSCRIPTION: `${API_BASE_URL}/UserSubscription/activate`,
  DOCTOR: `${API_BASE_URL}/Doctor`,
  MEDICINE_GROUP: `${API_BASE_URL}/MedicineGroup`,
  DISTRIBUTOR: `${API_BASE_URL}/Distributor`,
  MEDICINE: `${API_BASE_URL}/Medicine`,
};