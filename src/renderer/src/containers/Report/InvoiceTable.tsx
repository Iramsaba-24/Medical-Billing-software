import { useState, useMemo, useEffect } from "react";
import { Paper, Typography, Chip, Stack, Divider } from "@mui/material";
import {
  UniversalTable,
  Column,
} from "@/components/uncontrolled/UniversalTable";
import { useForm, FormProvider } from "react-hook-form";
import DropdownField from "@/components/controlled/DropdownField";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";

export type InvoiceData = {
  invoice: string;
  name: string;
  date: string;
  price: number;
  gst?: number;
  total?: number;
  status: "Paid" | "Pending" | "Overdue";
};

type FilterForm = {
  statusFilter: string;
  timeFilter: string;
};

type InvoiceApi = {
  retailInvoiceId: number;
  customerName: string;
  invoiceDate: string;
  totalAmount: number;
  paymentStatus: "Paid" | "Pending" | "Overdue";
};

const InvoiceTable = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);

  const methods = useForm<FilterForm>({
    defaultValues: {
      statusFilter: "All",
      timeFilter: "All Time",
    },
  });

  const { watch } = methods;
  const statusFilter = watch("statusFilter");
  const timeFilter = watch("timeFilter");

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: token ? `Bearer ${token}` : "" };

      const res = await axios.get<InvoiceApi[]>(API_ENDPOINTS.RETAIL_INVOICE, {
        headers,
      });

      const apiData: InvoiceApi[] = res.data || [];

      const formatted: InvoiceData[] = apiData.map((inv) => ({
        invoice: String(inv.retailInvoiceId),
        name: inv.customerName,
        date: new Date(inv.invoiceDate).toLocaleDateString("en-GB"),
        price: inv.totalAmount,
        gst: 0,
        total: inv.totalAmount,
        status: inv.paymentStatus,
      }));

      setInvoices(formatted);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setInvoices([]);
    }
  };

  useEffect(() => {
    fetchInvoices();

    window.addEventListener("invoiceUpdated", fetchInvoices);

    return () => {
      window.removeEventListener("invoiceUpdated", fetchInvoices);
    };
  }, []);

  const filteredData = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesStatus =
        statusFilter === "All" || inv.status === statusFilter;

      if (!inv.date) return false;

      const parts = inv.date.split("/");

      if (parts.length !== 3) return false;

      const invDate = new Date(
        Number(parts[2]),
        Number(parts[1]) - 1,
        Number(parts[0])
      );

      const today = new Date();

      let matchesTime = true;

      if (timeFilter === "This Month") {
        matchesTime =
          invDate.getMonth() === today.getMonth() &&
          invDate.getFullYear() === today.getFullYear();
      }

      if (timeFilter === "Last 7 Days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        matchesTime = invDate >= sevenDaysAgo && invDate <= today;
      }

      return matchesStatus && matchesTime;
    });
  }, [invoices, statusFilter, timeFilter]);

  const handleDeleteSelected = (rowsToDelete: InvoiceData[]) => {
    const updatedInvoices = invoices.filter(
      (inv) => !rowsToDelete.some((row) => row.invoice === inv.invoice)
    );

    setInvoices(updatedInvoices);

    window.dispatchEvent(new Event("invoiceUpdated"));
  };

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Paid", value: "Paid" },
    { label: "Pending", value: "Pending" },
    { label: "Overdue", value: "Overdue" },
  ];

  const timeOptions = [
    { label: "All Time", value: "All Time" },
    { label: "This Month", value: "This Month" },
    { label: "Last 7 Days", value: "Last 7 Days" },
  ];

  const columns: Column<InvoiceData>[] = [
    { key: "invoice", label: "Invoice" },
    { key: "name", label: "Name" },
    { key: "date", label: "Date" },
    {
      key: "price",
      label: "Price",
      render: (row) => `₹ ${row.price.toFixed(2)}`,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const styles: Record<string, { bg: string; color: string }> = {
          Paid: { bg: "#E8F5E9", color: "#2E7D32" },
          Pending: { bg: "#FFF9C4", color: "#F9A825" },
          Overdue: { bg: "#FFEBEE", color: "#D32F2F" },
        };

        const current = styles[row.status];

        return (
          <Chip
            label={row.status}
            size="small"
            sx={{
              backgroundColor: current.bg,
              color: current.color,
              fontWeight: 600,
              borderRadius: "4px",
            }}
          />
        );
      },
    },
  ];

  return (
    <FormProvider {...methods}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          Invoice Report Table
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <DropdownField
            name="statusFilter"
            label="Status"
            options={statusOptions}
          />

          <DropdownField
            name="timeFilter"
            label="Time Filter"
            options={timeOptions}
          />
        </Stack>

        <div style={{ width: "100%", overflowX: "auto" }}>
          <UniversalTable<InvoiceData>
            data={filteredData}
            columns={columns}
            showSearch
            showExport
            getRowId={(row) => row.invoice}
            onDeleteSelected={handleDeleteSelected}
          />
        </div>
      </Paper>
    </FormProvider>
  );
};

export default InvoiceTable;
