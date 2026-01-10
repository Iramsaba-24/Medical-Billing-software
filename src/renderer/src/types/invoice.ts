export type InvoiceStatus = "Paid" | "Pending" | "Overdue";

export type MedicineItem = {
  name: string;
  batch?: string;
  expiry?: string;
  qty: string;
  amount: number;
};

export type Invoice = {
  invoice: string;
  patient: string;
  date: string;
  price: number;
  status: InvoiceStatus;
  medicines: MedicineItem[];
};
