

import { useState, useMemo, useEffect } from "react";
import {
  Paper,
  Typography,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { UniversalTable, Column } from "@/components/uncontrolled/UniversalTable";

import { useForm, FormProvider } from "react-hook-form"; 
import DropdownField from "@/components/controlled/DropdownField"; 

//  TYPES

export type InvoiceData = {
  invoice: string;
  patient: string;
  date: string;
  price: number;
  gst: number;
  total: number;
  status: "Paid" | "Pending" | "Overdue";
  [key: string]: string | number | undefined;
};

// ADDED (Form type)
type FilterForm = {
  statusFilter: string;
  timeFilter: string;
};

const InvoiceTable = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);

  //  REMOVED
  // const [statusFilter, setStatusFilter] = useState("All");
  // const [timeFilter, setTimeFilter] = useState("All Time");

  //  added (react-hook-form)
  const methods = useForm<FilterForm>({
    defaultValues: {
      statusFilter: "All",
      timeFilter: "All Time",
    },
  });

  const { watch } = methods;

  // added (watch filter values)
  const statusFilter = watch("statusFilter");
  const timeFilter = watch("timeFilter");

  // LOAD INVOICES

  useEffect(() => {
    const loadInvoices = () => {
      const stored = localStorage.getItem("invoiceList");
      const parsed: InvoiceData[] = stored ? JSON.parse(stored) : [];
      setInvoices(parsed);
    };

    loadInvoices();

    window.addEventListener("invoiceUpdated", loadInvoices);

    return () => {
      window.removeEventListener("invoiceUpdated", loadInvoices);
    };
  }, []);

  //  FILTER LOGIC 

  const filteredData = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesStatus =
        statusFilter === "All" || inv.status === statusFilter;

      const invDate = new Date(inv.date);
      const today = new Date();
      let matchesTime = true;

      if (timeFilter === "This Month") {
        matchesTime =
          invDate.getMonth() === today.getMonth() &&
          invDate.getFullYear() === today.getFullYear();
      } else if (timeFilter === "Last 7 Days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        matchesTime = invDate >= sevenDaysAgo && invDate <= today;
      }

      return matchesStatus && matchesTime;
    });
  }, [invoices, statusFilter, timeFilter]);


  // ADDED (Dropdown Options)

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

  // TABLE COLUMNS 

  const columns: Column<InvoiceData>[] = [
    { key: "invoice", label: "Invoice" },
    { key: "patient", label: "Patient" },
    { key: "date", label: "Date" },
    {
      key: "price",
      label: "Price",
      render: (row) => `₹ ${row.price.toFixed(2)}`,
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
        `₹ ${row.total?.toFixed(2) ?? row.price.toFixed(2)}`,
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
              fontWeight: "600",
              borderRadius: "4px",
            }}
          />
        );
      },
    },
  ];

  return (
    //  added (Required wrapper for dropdown)
    <FormProvider {...methods}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          Invoice Report Table
        </Typography>

        <Divider sx={{ mb: 3 }} />

     
        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mb: 2 }}>

          {/* Status Filter */}
          <DropdownField
            name="statusFilter"
            label="Status"
            options={statusOptions}
            isStatic
            freeSolo={false}
            floatLabel
            
          />

          {/* Time Filter */}
          <DropdownField
            name="timeFilter"
            label="Time Filter"
            options={timeOptions}
            isStatic
            freeSolo={false}
            floatLabel
            
          />

        </Stack>

        <UniversalTable<InvoiceData>
          data={filteredData}
          columns={columns}
          showSearch
          showExport
          enableCheckbox
          getRowId={(row) => row.invoice}
        />
      </Paper>
    </FormProvider>
  );
};

export default InvoiceTable;


