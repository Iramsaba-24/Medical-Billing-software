import { ReactNode } from "react";

export type InvoiceStatus = "Paid" | "Pending" | "Overdue";

export type MedicineItem = {
  name: string;
  batch?: string;
  expiry?: string;
  qty: string;
  amount: number;
};

export type Invoice = {
  customerName: ReactNode;
  invoice: string;
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
};
