export const API_BASE_URL = "http://localhost:5158/api";

export const API_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/Auth/register`,
  LOGIN: `${API_BASE_URL}/Auth/login`,
  ACTIVATE_SUBSCRIPTION: `${API_BASE_URL}/UserSubscription/activate`,
  DOCTOR: `${API_BASE_URL}/Doctor`,
  MEDICINE_GROUP: `${API_BASE_URL}/MedicineGroup`,
  DISTRIBUTOR: `${API_BASE_URL}/Distributor`,
  MEDICINE: `${API_BASE_URL}/Medicine`,
  INVOICE: `${API_BASE_URL}/Invoice`,
  INVOICE_ITEM: `${API_BASE_URL}/InvoiceItem`,
  PHARMACY_SETTINGS: `${API_BASE_URL}/pharmacySettings`,
  CUSTOMER: `${API_BASE_URL}/Customer`,
  RETAIL_INVOICE: `${API_BASE_URL}/RetailInvoice`,
  RETAIL_INVOICE_ITEMS: `${API_BASE_URL}/RetailInvoiceItems`,
  REORDER: `${API_BASE_URL}/Reorder`,
LOW_STOCK: `${API_BASE_URL}/Medicine/low-stock`,
LAST_PURCHASE: `${API_BASE_URL}/ReorderLevels`, 
};
 
