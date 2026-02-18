import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BillingTable from "@/containers/Invoices/BillingTable";
import { URL_PATH } from "@/constants/UrlPath";
import { Invoice } from "@/types/invoice";

import revenueImg from "@/assets/TotalRevenue(Paid).svg";
import pendingImg from "@/assets/PendingAmount.svg";
import invoiceImg from "@/assets/TotalInvoices.svg";


export type InvoiceStatus = "Paid" | "Pending" | "Overdue";

export type MedicineItem = {
  name: string;
  batch: string;
  expiry: string;
  qty: string;
  amount: number;
};

/*  STYLES  */

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

  return (
    <Box>
      <Box>
        <Typography
          sx={{
            fontSize: { xs: 20, sm: 24, md: 28 },
            fontWeight: 700,
            color: '#111827',
            mt: {xs:1 , md:0.5},
            mb:0.5
          }}
        >
          Invoices
        </Typography>
      </Box>

      <Box
        display="flex"
        flexDirection={{xs:"column", md:"row"}}
        mb={4}
        gap={2}
      >

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
          }}
        >

          <Box>
            <Typography fontWeight={600} fontSize={{ xs: 15, md: 18 }}>
              ₹ 4,000
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
          }}
        >

          <Box>
            <Typography fontWeight={600} fontSize={{ xs: 15, md: 18 }}>
              ₹ 16,800
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
          }}
        >

          <Box>
            <Typography fontWeight={600} fontSize={{ xs: 15, md: 18 }}>
              5
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
