import { Box, Divider, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import BillingTable from "@/containers/Invoices/BillingTable";
import { URL_PATH } from "@/constants/UrlPath";
import { Invoice } from "@/types/invoice";

import revenueImg from "@/assets/TotalRevenue(Paid).svg";
import pendingImg from "@/assets/PendingAmount.svg";
import invoiceImg from "@/assets/TotalInvoices.svg";

export type InvoiceStatus = "Paid" | "Pending" | "Overdue";

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
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Load invoices from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("invoiceList");
    const parsed: Invoice[] = stored ? JSON.parse(stored) : [];
    setInvoices(parsed);
  }, []);

  // Memoized Calculations 
  const { totalRevenue, pendingAmount, totalInvoices } = useMemo(() => {
    const revenue = invoices
      .filter(inv => inv.status === "Paid")
      .reduce((sum, inv) => sum + inv.price, 0);

    const pending = invoices
      .filter(inv => inv.status === "Pending")
      .reduce((sum, inv) => sum + inv.price, 0);

    return {
      totalRevenue: revenue,
      pendingAmount: pending,
      totalInvoices: invoices.length,
    };
  }, [invoices]);

  return (
    <Box>
     <Typography variant="h5" mb={2}>
      Invoices
    </Typography>
    <Divider sx={{ mb: 3 }} />
      {/* Cards */}
      <Box
        display="flex"
        flexDirection={{xs:"column", md:"row"}}
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
          }}>
          <Box>
             <Typography fontWeight={600} fontSize={{ xs: 15, md: 18 }}>
              ₹ {totalRevenue.toLocaleString()}
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
             height: {  md: 105}
          }}
        >
          <Box>
            <Typography fontWeight={600} fontSize={{ xs: 15, md: 18 }}>
              ₹ {pendingAmount.toLocaleString()}
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
             height: {  md: 105}
          }}
        >
          <Box>
            <Typography fontWeight={600} fontSize={{ xs: 15, md: 18 }}>
              {totalInvoices}
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
        onCreate={() => navigate(URL_PATH.CreateInvoice)}
        onView={(invoice: Invoice) =>
          navigate(`${URL_PATH.InvoiceView}/${invoice.invoice}`, {
            state: invoice,
          })
        }
      />
    </Box>
  );
};

export default Billing;
