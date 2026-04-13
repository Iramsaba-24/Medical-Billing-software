// import { InvoiceData } from "@/containers/Report/InvoiceTable";

// //  API response ka exact type define karo
// type ApiInvoice = {
//   invoice: string;
//   name: string;
//   invoiceDate: string;
//   price: number;
//   gst?: number;
//   total?: number;
//   paymentStatus: "Paid" | "Pending" | "Overdue";
// };

// const API_URL = "/api/invoices";

// export const getAllInvoices = async (): Promise<InvoiceData[]> => {
//   const response = await fetch(API_URL);

//   if (!response.ok) {
//     throw new Error("Failed to fetch invoices");
//   }

//   const data: ApiInvoice[] = await response.json();

//   return data.map((item) => ({
//     invoice: item.invoice,
//     name: item.name,
//     date: item.invoiceDate,
//     price: item.price,
//     gst: item.gst ?? 0,
//     total: item.total ?? item.price,
//     status: item.paymentStatus,
//   }));
// };