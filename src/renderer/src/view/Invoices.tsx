import { Box, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import BillingTable from "@/containers/invoices/BillingTable";
import { Invoice } from "@/types/invoice";
import revenueImg from "@/assets/TotalRevenue(Paid).svg";
import pendingImg from "@/assets/PendingAmount.svg";
import invoiceImg from "@/assets/TotalInvoices.svg";
import { getAllRetailInvoices } from "@/service/retailInvoiceService";

export type InvoiceStatus = "Paid" | "Pending" | "Overdue";

type RetailInvoiceResponse = {
  retailInvoiceId: number;
  customerName?: string;
  invoiceDate: string;
  totalAmount: number;
  paymentStatus: string;
};

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

  const fetchInvoices = async (): Promise<void> => {
    try {
      const data: RetailInvoiceResponse[] =
        await getAllRetailInvoices();

      const mapped: Invoice[] = data
        .sort(
          (
            a: RetailInvoiceResponse,
            b: RetailInvoiceResponse
          ) => a.retailInvoiceId - b.retailInvoiceId
        )
        .map(
          (
            inv: RetailInvoiceResponse,
            index: number
          ): Invoice => ({
            srNo: index + 1,

            invoice: String(inv.retailInvoiceId),

            customerName: inv.customerName || "",

            patient: inv.customerName || "",

            invoiceDate: new Date(
              inv.invoiceDate
            ).toLocaleDateString("en-GB"),

            price: inv.totalAmount,

            paymentStatus: inv.paymentStatus,

            status: inv.paymentStatus as InvoiceStatus,

            medicines: [],
          })
        );

      setInvoices(mapped);
    } catch (error: unknown) {
      console.error("Error fetching invoices", error);
    }
  };

  useEffect(() => {
    fetchInvoices();

    const handleInvoiceUpdated = async (): Promise<void> => {
      await fetchInvoices();
    };

    window.addEventListener(
      "invoiceUpdated",
      handleInvoiceUpdated
    );

    return () => {
      window.removeEventListener(
        "invoiceUpdated",
        handleInvoiceUpdated
      );
    };
  }, []);

  const dashboard = {
    totalRevenue: invoices
      .filter(
        (inv: Invoice) => inv.paymentStatus === "Paid"
      )
      .reduce(
        (sum: number, inv: Invoice): number =>
          sum + (inv.price ?? 0),
        0
      ),

    pendingAmount: invoices
      .filter(
        (inv: Invoice) =>
          inv.paymentStatus === "Pending" ||
          inv.paymentStatus === "Overdue"
      )
      .reduce(
        (sum: number, inv: Invoice): number =>
          sum + (inv.price ?? 0),
        0
      ),

    totalInvoices: invoices.length,
  };

  return (
    <Box>
      <Typography
        sx={{
          fontSize: { xs: 20, sm: 24, md: 28 },
          fontWeight: 700,
          color: "#111827",
          mt: { xs: 1, md: 0.5 },
          mb: 0.5,
        }}
      >
        Invoices
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
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
            height: { md: 105 },
          }}
        >
          <Box>
            <Typography
              fontWeight={600}
              fontSize={{ xs: 15, md: 18 }}
            >
              ₹ {dashboard.totalRevenue.toLocaleString()}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
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
            height: { md: 105 },
          }}
        >
          <Box>
            <Typography
              fontWeight={600}
              fontSize={{ xs: 15, md: 18 }}
            >
              ₹ {dashboard.pendingAmount.toLocaleString()}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
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
            height: { md: 105 },
          }}
        >
          <Box>
            <Typography
              fontWeight={600}
              fontSize={{ xs: 15, md: 18 }}
            >
              {dashboard.totalInvoices}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
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