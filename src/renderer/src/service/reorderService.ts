import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";
 
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};
 
export type LowStockResponse = {
  medicineId: number;
  itemName: string;
  quantity: number;
  unit: string;
};
export type ApproveOrderPayload = {
  distributorName: string;
  paid: number;
  unpaid: number;
  paymentMode: string;
  medicines: {
    medicineName: string;
    strength: string;
    qty: number;
    amount: number;
  }[];
};
 
export type LowStockApiResponse = {
  message: string;
  data: LowStockResponse[];
};
 
export type ReorderLevelsResponse = {
  reorderId: number;
  medicineName: string;
  companyName: string;
  reorderQuantity: number;
  minimumQuantity: number;
  unit: string;
  purchaseRate: number;
  mrp: number;
  gstPercentage: number;
  discount: number;
  amount: number;
  gstAmount: number;
  finalAmount: number;
  SrNo: number;
  medicineId: number;
  expiryDate: string;
};
 
export type ReorderApiResponse = {
  message: string;
  data: ReorderLevelsResponse[];
};
export type ReorderResponse = {
  id: number;
  distributorName: string;
  emailAddress: string;
  createdAt: string;
  existingMedicines: {
    id: number;
    medicineName: string;
    strength: string;
    companyName: string;
    qty: number;
        paidAmount: number | null;    
    unPaidAmount: number | null;  
    paymentType: string | null;
  }[];
  newMedicines: {
    id: number;
    medicineName: string;
    strength: string;
    qty: number;
  }[];
};
 
// low stock
export const getLowStock = async (): Promise<LowStockApiResponse> => {
  const res = await axios.get<LowStockApiResponse>(
    API_ENDPOINTS.LOW_STOCK,
    getAuthHeaders()
  );
  return res.data;
};
 
 
// last purchasehistory
export type PurchaseHistoryResponse = {
  id: number;
  medicineName: string;
  strength: string;
  companyName: string;
  qty: number;
  paidAmount: number | null;
  unPaidAmount: number | null;
  paymentType: string | null;
  medicineType: string;
};
// existing reorder
 export type ExistingReorderResponse = {
  id: number;
  createdAt: string;
  companyName: string;
  medicineName: string;
  strength: string;
  qty: number;
  existingMedicines: {
    medicineName: string;
    strength: string;
    companyName: string;
    qty: number;
  }[];
};
// new order
export type NewOrderResponse = {
  id: number;
  companyName: string;
  newMedicines: {
    id: number;
    medicineName: string;
    strength: string;
    qty: number;
  }[];
};
 
export const getPurchaseHistory = async (): Promise<PurchaseHistoryResponse[]> => {
  const res = await axios.get<PurchaseHistoryResponse[]>(
    API_ENDPOINTS.REORDER_PURCHASE_HISTORY,
    getAuthHeaders()
  );
  return res.data;
};
 
export const deletePurchaseHistory = async (id: number): Promise<void> => {
  await axios.delete(
    `${API_ENDPOINTS.REORDER_PURCHASE_HISTORY}/${id}`,
    getAuthHeaders()
  );
};
//email send
export const sendReorderEmail = async (
  orderType: "reorder" | "neworder",
  distributor: string,
  medicines: {
    medicineName?: string;
    medicineId?: string;
    strengthType: string;
    qty?: string;
    quantity?: string | number;
  }[]
): Promise<void> => {

  const endpoint =
    orderType === "reorder"
      ? API_ENDPOINTS.REORDER_EXISTING
      : API_ENDPOINTS.REORDER_NEW;

  const requests = medicines.map((m) => {

    const payload =
      orderType === "neworder"
        ? {
            medicineName:
              m.medicineName || m.medicineId || "",

            strength: m.strengthType || "",

            companyName: distributor,

            qty: Number(
              m.qty || m.quantity || 0
            ),

            paidAmount: null,
            unPaidAmount: null,
            paymentType: null,
            isApproved: false,
          }
        : {
            medicineName:
            m.medicineName || m.medicineId || "",
            strength: m.strengthType || "",
            companyName: distributor,
            qty: Number(
              m.qty || m.quantity || 0
            ),

            paidAmount: null,
            unPaidAmount: null,
            paymentType: null,
            isApproved: false,
          };

    return axios.post(
      endpoint,
      payload,
      getAuthHeaders()
    );
  });

  await Promise.all(requests);
};
// existing reorder
export const getExistingReorders = async (): Promise<ExistingReorderResponse[]> => {
  const res = await axios.get<ExistingReorderResponse[]>(
    API_ENDPOINTS.REORDER_EXISTING,
    getAuthHeaders()
  );
 
  return res.data;
};
// Approve existing reorder
export const approveExistingReorder = async (
  id: number,
  payload: {
    distributorName: string;
    emailAddress: string;
    existingMedicines: {
      medicineName: string;
      strength: string;
      companyName: string;
      qty: number;
      paidAmount: number;
      unPaidAmount: number;
      paymentType: string;
    }[];
    newMedicines: never[];
  }
): Promise<void> => {
  await axios.put(
    `${API_ENDPOINTS.REORDER_EXISTING}/${id}`,
    payload,
    getAuthHeaders()
  );
};
//new order
export const getNewReorders = async (): Promise<NewOrderResponse[]> => {
  const res = await axios.get<{
    id: number;
    medicineName: string;
    strength: string;
    companyName: string;
    qty: number;
  }[]>(
    API_ENDPOINTS.REORDER_NEW,
    getAuthHeaders()
  );
 
  //  grouped by companyName
  const grouped = res.data.reduce((acc, item) => {
   const existing = acc.find(
  g => g.companyName === item.companyName
);

if (existing) {
  existing.newMedicines.push({
    id: item.id,
    medicineName: item.medicineName,
    strength: item.strength,
    qty: item.qty,
  });
} else {
  acc.push({
    id: item.id,
    companyName: item.companyName,
    newMedicines: [
      {
        id: item.id,
        medicineName: item.medicineName,
        strength: item.strength,
        qty: item.qty,
      },
    ],
  });
}
    return acc;
  }, [] as NewOrderResponse[]);
 
  return grouped;
};
// Approve and delete existing medicines
export const approveAndDeleteExistingMedicine = async (
  id: number,
  medicines: {
    medicineName: string;
    strength: string;
    companyName: string;
    qty: number;
    paidAmount: number;
    unPaidAmount: number;
    paymentType: string;
  }[]
): Promise<void> => {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
 
  // Save each medicine to the existing purchase history
  for (const m of medicines) {
    await axios.post(
      API_ENDPOINTS.REORDER_EXISTING,
      {
        medicineName: m.medicineName,
        strength: m.strength,
        companyName: m.companyName,
        qty: m.qty,
        paidAmount: m.paidAmount,
        unPaidAmount: m.unPaidAmount,
        paymentType: m.paymentType,
        IsApproved: true,  
      },
      { headers }
    );
  }
 
  // Delete the existing purchase history
  await axios.delete(
    `${API_ENDPOINTS.REORDER_EXISTING}/${id}`,
    { headers }
  );
};
export const approveAndDeleteNewMedicine = async (
  id: number,
  medicines: {
    medicineName: string;
    strength: string;
    companyName: string;
    qty: number;
    paidAmount: number;
    unPaidAmount: number;
    paymentType: string;
  }[]
): Promise<void> => {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
 
  // Save each medicine to the new purchase history
  for (const m of medicines) {
    await axios.post(
      API_ENDPOINTS.REORDER_NEW,
      {
        medicineName: m.medicineName,
        strength: m.strength,
        companyName: m.companyName,
        qty: m.qty,
        paidAmount: m.paidAmount,
        unPaidAmount: m.unPaidAmount,
        paymentType: m.paymentType,
        IsApproved: true,  
      },
      { headers }
    );
  }
  // Delete the new purchase history
  await axios.delete(
    `${API_ENDPOINTS.REORDER_NEW}/${id}`,
    { headers }
  );
};
 