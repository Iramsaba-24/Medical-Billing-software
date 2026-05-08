import { Box, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import BillingTable from "@/containers/Invoices/BillingTable";
import { Invoice } from "@/types/invoice";
import revenueImg from "@/assets/TotalRevenue(Paid).svg";
import pendingImg from "@/assets/PendingAmount.svg";
import invoiceImg from "@/assets/TotalInvoices.svg";
export type InvoiceStatus = "Paid" | "Pending" | "Overdue";
import { getAllRetailInvoices } from "@/service/retailInvoiceService";
 
 
const cardHover = {
  cursor: "pointer",
  border: "1px solid transparent",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: { md: "translateY(-6px) scale(1.02)" },
    boxShadow: "0px 12px 30px rgba(0,0,0,0.15)",
    borderColor: "#1976d2",
  },
};
 
 
const Billing = () => {
 const [invoices, setInvoices] = useState<Invoice[]>([]);
 
const fetchInvoices = async () => {
  try {
    const data = await getAllRetailInvoices();
    const mapped: Invoice[] = data
  .sort((a: { retailInvoiceId: number }, b: { retailInvoiceId: number }) =>
    a.retailInvoiceId - b.retailInvoiceId
  )
  .map((inv: {
      retailInvoiceId: number;
      customerName?: string;
      invoiceDate: string;
      totalAmount: number;
      paymentStatus: string;
    }) => ({
      invoice: String(inv.retailInvoiceId),
      name: inv.customerName || "",
       customerName: inv.customerName || "",
  patient: inv.customerName || "",
      invoiceDate: new Date(inv.invoiceDate).toLocaleDateString("en-GB"),
      price: inv.totalAmount,
      paymentStatus: inv.paymentStatus,
      status: inv.paymentStatus as InvoiceStatus,
      medicines: [],
      doctor: "",
      address: "",
      date: new Date(inv.invoiceDate).toLocaleDateString("en-GB"),
    }));
    setInvoices(mapped);
  } catch (error) {
    console.error("Error fetching invoices", error);
  }
};
 
useEffect(() => {
  fetchInvoices();
 
  const handleInvoiceUpdated = async () => {
    try {
      const data = await getAllRetailInvoices();
      const mapped: Invoice[] = data
        .sort((a: { retailInvoiceId: number }, b: { retailInvoiceId: number }) =>
          a.retailInvoiceId - b.retailInvoiceId
        )
        .map((inv: {
          retailInvoiceId: number;
          customerName?: string;
          invoiceDate: string;
          totalAmount: number;
          paymentStatus: string;
        }) => ({
          invoice: String(inv.retailInvoiceId),
          name: inv.customerName || "",
           customerName: inv.customerName || "",
  patient: inv.customerName || "",
          invoiceDate: new Date(inv.invoiceDate).toLocaleDateString("en-GB"),
          price: inv.totalAmount,
          paymentStatus: inv.paymentStatus,
      status: inv.paymentStatus as InvoiceStatus,
          medicines: [],
          doctor: "",
          address: "",
          date: new Date(inv.invoiceDate).toLocaleDateString("en-GB"),
        }));
      setInvoices(mapped);
    } catch (error) {
      console.error("Error fetching invoices", error);
    }
  };
 
  window.addEventListener("invoiceUpdated", handleInvoiceUpdated);
 
  return () => {
    window.removeEventListener("invoiceUpdated", handleInvoiceUpdated);
  };
}, []);
 
 
// const [dashboard] = useState({
//   totalRevenue: 0,
//   pendingAmount: 0,
//   totalInvoices: 0
// });
 
 
const dashboard = {
  totalRevenue: invoices
    .filter(inv => inv.paymentStatus === "Paid")
    .reduce((sum, inv) => sum + (inv.price ?? 0), 0),
 
  pendingAmount: invoices
    .filter(inv => inv.paymentStatus === "Pending" || inv.paymentStatus === "Overdue")
    .reduce((sum, inv) => sum + (inv.price ?? 0), 0),
 
  totalInvoices: invoices.length,
};
 
 
  return (
    <Box>
      <Typography sx={{
        fontSize: { xs: 20, sm: 24, md: 28 },
        fontWeight: 700,
        color: '#111827',
        mt: { xs: 1, md: 0.5 },
        mb: 0.5
      }} >
 
        Invoices
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {/* Cards */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        mb={4}
        gap={2}
      >
 
        {/* Revenue Card */}
<Box
 
          p={{ xs: 2, md: 5 }}
          bgcolor="#fff"
          borderRadius={2}
          boxShadow={1}
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            ...cardHover,
            flex: "1 1 0",
            minWidth: 0,
            height: { md: 105 }
          }}>
          <Box>
            <Typography fontWeight={600} fontSize={{ xs: 15, md: 18 }}>
              ₹ {dashboard.totalRevenue.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Revenue (Paid)
            </Typography>
          </Box>
          <Box
            component="img"
            src={revenueImg}
            alt="Revenue"
            sx={{
              width: { xs: 44, md: 80 },
              height: { xs: 44, md: 80 },
              flexShrink: 0,
            }}
          />
        </Box>
 
        {/* Pending Card */}
        <Box
          p={{ xs: 2, md: 5 }}
          bgcolor="#fff"
          borderRadius={2}
          boxShadow={1}
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            ...cardHover,
            flex: "1 1 0",
            minWidth: 0,
            height: { md: 105 }
          }}>
          <Box>
            <Typography fontWeight={600} fontSize={{ xs: 15, md: 18 }}>
              ₹ {dashboard.pendingAmount.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending Amount
            </Typography>
          </Box>
          <Box
            component="img"
            src={pendingImg}
            alt="Pending"
            sx={{
              width: { xs: 44, md: 80 },
              height: { xs: 44, md: 80 },
              flexShrink: 0,
            }}
          />
        </Box>
 
        {/* Total Invoices */}
        <Box
          p={{ xs: 2, md: 5 }}
          bgcolor="#fff"
          borderRadius={2}
          boxShadow={1}
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            ...cardHover,
            flex: "1 1 0",
            minWidth: 0,
            height: { md: 105 }
          }}
        >
          <Box>
            <Typography fontWeight={600} fontSize={{ xs: 15, md: 18 }}>
              {dashboard.totalInvoices}
            </Typography>
            <Typography variant="body2" color="text.secondary">
 
              Total Invoices
            </Typography>
          </Box>
          <Box
            component="img"
            src={invoiceImg}
            alt="Invoices"
            sx={{
              width: { xs: 44, md: 80 },
              height: { xs: 44, md: 80 },
              flexShrink: 0,
            }}
          />
        </Box>
      </Box>
 
      <BillingTable
        invoices={invoices}
        setInvoices={setInvoices}
          refetchInvoices={fetchInvoices}
      />
</Box>
 
  );
 
};
 
export default Billing;
 
 
 