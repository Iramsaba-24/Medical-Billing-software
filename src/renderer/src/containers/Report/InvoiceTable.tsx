import { useState, useMemo } from "react";
import {
  Paper,
  Typography,
  Chip,
  MenuItem,
  Select,
  FormControl,
  Stack,
  Divider,
} from "@mui/material";
import {
  UniversalTable,
  Column,
} from "@/components/uncontrolled/UniversalTable";

// Define the structure of an Invoice object
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

const InvoiceTable = () => {
  // State to store the selected status and time filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All Time");

  // Sample data for the table
  const [invoices] = useState<InvoiceData[]>([
    {
      invoice: "INV-001",
      patient: "Rajesh Kumar",
      date: "01/15/2026",
      price: 2500,
      gst: 12,
      total: 2800,
      status: "Paid",
    },
    {
      invoice: "INV-002",
      patient: "Priya Singh",
      date: "12/20/2026",
      price: 5400,
      gst: 12,
      total: 6048,
      status: "Pending",
    },
    {
      invoice: "INV-003",
      patient: "Amit Verma",
      date: "01/10/2026",
      price: 1500,
      gst: 12,
      total: 1680,
      status: "Paid",
    },
    {
      invoice: "INV-004",
      patient: "Sneha Reddy",
      date: "03/01/2027",
      price: 8200,
      gst: 12,
      total: 9184,
      status: "Overdue",
    },
    {
      invoice: "INV-005",
      patient: "Vikram Rao",
      date: "01/20/2026",
      price: 3200,
      gst: 12,
      total: 3584,
      status: "Pending",
    },
  ]);

  // Logic to filter data based on Status and Time selection
  const filteredData = useMemo(() => {
    return invoices.filter((inv) => {
      // Check if status matches
      const matchesStatus =
        statusFilter === "All" || inv.status === statusFilter;

      // Check if date matches the selected time range
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

  // Define table columns and how to display the data
  const columns: Column<InvoiceData>[] = [
    { key: "invoice", label: "Invoice" },
    { key: "patient", label: "Patient" },
    { key: "date", label: "Date" },
    // Format price with currency symbol
    {
      key: "price",
      label: "Price",
      render: (row) => `₹ ${row.price.toFixed(2)}`,
    },
    { key: "gst", label: "GST(%)", render: (row) => `${row.gst}%` },
    // Format total with currency symbol
    {
      key: "total",
      label: "Total",
      render: (row) => `₹ ${row.total.toFixed(2)}`,
    },
    // Display status as a colorful Chip
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
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      {/* Title Section */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
        Invoice Report Table
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Filter Dropdowns Section */}
      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={2}
        sx={{ mb: 2 }}
      >
        {/* Status Filter */}
        <FormControl size="small">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 130, borderRadius: "8px", fontSize: "0.85rem" }}
          >
            <MenuItem value="All">All Status</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Overdue">Overdue</MenuItem>
          </Select>
        </FormControl>

        {/* Time Filter */}
        <FormControl size="small">
          <Select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            sx={{ minWidth: 140, borderRadius: "8px", fontSize: "0.85rem" }}
          >
            <MenuItem value="All Time">All Time</MenuItem>
            <MenuItem value="This Month">This Month</MenuItem>
            <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Main Table Component */}
      <UniversalTable<InvoiceData>
        data={filteredData}
        columns={columns}
        showSearch
        showExport
        enableCheckbox
        getRowId={(row) => row.invoice}
      />
    </Paper>
  );
};

export default InvoiceTable;
