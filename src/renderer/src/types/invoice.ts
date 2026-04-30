import { ReactNode } from "react";

export type InvoiceStatus = "Paid" | "Pending" | "Overdue";

export type MedicineItem = {
  name: string;
  medicineName?: string;   
  batch?: string;
  expiry?: string;
  qty: string;
  quantity?: number;
  amount: number;
  companyName?: string;
  strength?: string;
  medicineId?: number;   
};

export type Invoice = {
  customerName: ReactNode;
  invoice: string;
  retailInvoiceId?: number;  
  patient: string;
  invoiceDate?: string;
  price: number;
  paymentStatus?: string;
  status: InvoiceStatus;
  medicines: MedicineItem[];
  type?: "retail" | "distributor";
  gstIn?: string;        
  distributorId?: string;
  totalAmount?: number;
  usedPoints?: number;
  gstPercent?: number;
};