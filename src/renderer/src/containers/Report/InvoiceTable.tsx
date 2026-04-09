import { useState, useMemo, useEffect } from "react";
import { Paper, Typography, Chip, Stack, Divider } from "@mui/material";
import { UniversalTable, Column } from "@/components/uncontrolled/UniversalTable";
import { useForm, FormProvider } from "react-hook-form";
import DropdownField from "@/components/controlled/DropdownField";

// TYPES
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

  // ✅ API CALL (NO LOCALSTORAGE)
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch("http://localhost:3000/invoices");

        if (!res.ok) {
          throw new Error("Failed to fetch invoices");
        }

        const data: InvoiceData[] = await res.json();
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, []);

  // FILTER LOGIC
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
    { key: "name", label: "Patient Name" },
    { key: "date", label: "Date" },
    {
      key: "price",
      label: "Price",
      render: (row) => `₹ ${row.price?.toFixed(2)}`,
    },
    {
      key: "gst",
      label: "GST(%)",
      render: (row) => `${row.gst ?? 0}%`,
    },
    {
      key: "total",
      label: "Total",
      render: (row) =>
        `₹ ${row.total?.toFixed(2) ?? row.price?.toFixed(2)}`,
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

        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mb: 2 }}>
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
            enableCheckbox
            getRowId={(row) => row.invoice}
          />
        </div>
      </Paper>
    </FormProvider>
  );
};

export default InvoiceTable;