import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";



export interface RetailInvoicePayload {
  userId: number;
  customerId: number;
  invoiceType: string;
  invoiceDate: string;
  totalAmount: number;
  totalGST: number;
  totalDiscount: number;
  medipointsEarned: number;
  paymentStatus: string;
}

export interface RetailInvoiceResponse {
  retailInvoiceId: number;
  totalAmount: number;
  paymentStatus: string;
  customerName: string;
  invoiceDate: string; 
}

export interface RetailInvoiceItemPayload {
  retailInvoiceId: number;
  medicineId: number;
  quantity: number;
  price: number;
  gstPercent: number;
  discount: number;
}

export const createSingleRetailInvoiceItem = async (item: {
  retailInvoiceId: number;
  medicineId: number;
  quantity: number;
  price: number;
  gstPercent: number;
  discount: number;
}) => {
  const res = await axios.post(
    API_ENDPOINTS.RETAIL_INVOICE_ITEMS,
    item,
    getAuthHeaders()
  );

  return res.data;
};


// token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

// invoice
export const createRetailInvoice = async (data: {
  userId: number;
  customerId: number;
  invoiceType: string;
  invoiceDate: string;
  totalAmount: number;
  totalGST: number;
  totalDiscount: number;
  medipointsEarned: number;
  paymentStatus: string;
}) => {
  const res = await axios.post(
    API_ENDPOINTS.RETAIL_INVOICE,
    data,
    getAuthHeaders()
  );

  return res.data;
};

// item
export const createRetailInvoiceItems = async (items: {
  retailInvoiceId: number;
  medicineId: number;
  quantity: number;
  price: number;
  gstPercent: number;
  discount: number;
}[]) => {
  const itemsWithSrNo = items.map((item, index) => ({
    ...item,
    SrNo: index + 1,
  }));

  const res = await axios.post(
    `${API_ENDPOINTS.RETAIL_INVOICE_ITEMS}/bulk`,
    itemsWithSrNo,
    getAuthHeaders()
  );

  return res.data;
};

// payment status
export const updatePaymentStatus = async (
  invoiceId: number,
  paymentStatus: string
) => {
  const res = await axios.patch(
    `${API_ENDPOINTS.RETAIL_INVOICE}/${invoiceId}/payment-status`,
    paymentStatus,
    {
      ...getAuthHeaders(),
      headers: {
        ...getAuthHeaders().headers,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
};

// all invoice
export const getAllRetailInvoices = async () => {
  const res = await axios.get(
    API_ENDPOINTS.RETAIL_INVOICE,
    getAuthHeaders()
  );

  return res.data;
};

//invoice by id
export const getRetailInvoiceById = async (id: number) => {
  const res = await axios.get(
    `${API_ENDPOINTS.RETAIL_INVOICE}/${id}`,
    getAuthHeaders()
  );

  return res.data;
};

// delete
export const deleteRetailInvoice = async (id: number) => {
  const res = await axios.delete(
    `${API_ENDPOINTS.RETAIL_INVOICE}/${id}`,
    getAuthHeaders()
  );

  return res.data;
};


export const getRetailInvoiceItemsByInvoiceId = async (invoiceId: number) => {
  const res = await axios.get(
    `${API_ENDPOINTS.RETAIL_INVOICE_ITEMS}/by-invoice/${invoiceId}`,
    getAuthHeaders()
  );
  return res.data;
}; 


export const updateRetailInvoice = async (
  id: number,
  data: {
    userId: number;
    customerId: number;
    invoiceType: string;
    invoiceDate: string;
    totalAmount: number;
    totalGST: number;
    totalDiscount: number;
    medipointsEarned: number;
    paymentStatus: string;
  }
) => {
  const res = await axios.put(
    `${API_ENDPOINTS.RETAIL_INVOICE}/${id}`,
    data,
    getAuthHeaders()
  );
  return res.data;
};

export const deleteRetailInvoiceItemsByInvoiceId = async (invoiceId: number) => {
  const res = await axios.delete(
    `${API_ENDPOINTS.RETAIL_INVOICE_ITEMS}/by-invoice/${invoiceId}`,
    getAuthHeaders()
  );
  return res.data;
};