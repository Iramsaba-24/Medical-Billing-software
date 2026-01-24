 import { useState, useMemo } from "react";
import { Paper, Typography, Chip, MenuItem, Select, FormControl, Stack,} from "@mui/material";
import { UniversalTable, Column } from "@/components/uncontrolled/UniversalTable";

// Invoice object type
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
  //  Filter States
  const [statusFilter, setStatusFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All Time");

  // Dummy data
  const [invoices] = useState<InvoiceData[]>([
    { invoice: "INV-001", patient: "Rajesh Kumar", date: "01/15/2026", price: 2500, gst: 12, total: 2800, status: "Paid" },
    { invoice: "INV-002", patient: "Priya Singh", date: "12/20/2026", price: 5400, gst: 12, total: 6048, status: "Pending" },
    { invoice: "INV-003", patient: "Amit Verma", date: "01/10/2026", price: 1500, gst: 12, total: 1680, status: "Paid" },
    { invoice: "INV-004", patient: "Sneha Reddy", date: "03/01/2027", price: 8200, gst: 12, total: 9184, status: "Overdue" },
    { invoice: "INV-005", patient: "Vikram Rao", date: "01/20/2026", price: 3200, gst: 12, total: 3584, status: "Pending" },
  ]);

  // Filter Logic
  const filteredData = useMemo(() => {
    return invoices.filter((inv) => {
      // Status Match
      const matchesStatus = statusFilter === "All" || inv.status === statusFilter;

      // Time/Date Match
      const invDate = new Date(inv.date);
      const today = new Date();
      let matchesTime = true;

      if (timeFilter === "This Month") {
        matchesTime = invDate.getMonth() === today.getMonth() && 
                      invDate.getFullYear() === today.getFullYear();
      } else if (timeFilter === "Last 7 Days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        matchesTime = invDate >= sevenDaysAgo && invDate <= today;
      }
      return matchesStatus && matchesTime;
    });
  }, [invoices, statusFilter, timeFilter]);

  // Configuration for the table columns
  const columns: Column<InvoiceData>[] = [
    { key: "invoice", label: "Invoice" },
    { key: "patient", label: "Patient" },
    { key: "date", label: "Date" },
    { key: "price",  label: "Price",  render: (row) => `₹ ${row.price.toFixed(2)}` },
    { key: "gst",  label: "GST(%)",   render: (row) => `${row.gst}%` },
    { key: "total", label: "Total",  render: (row) => `₹ ${row.total.toFixed(2)}` },
    { key: "status", label: "Status", render: (row) => {
        const styles: Record<string, { bg: string; color: string }> = {
          Paid: { bg: "#E8F5E9", color: "#2E7D32" },    
          Pending: { bg: "#FFF9C4", color: "#F9A825" }, 
          Overdue: { bg: "#FFEBEE", color: "#D32F2F" },  
        };
        const current = styles[row.status];
        return (
          <Chip label={row.status} size="small"
            sx={{ backgroundColor: current.bg, color: current.color, fontWeight: "600", borderRadius: "4px" }}
          />
        );
      },
    },
  ];

  return (
    <Paper sx={{ p: 4, boxShadow: "0 2px 10px rgba(0,0,0,0.05)", borderRadius: "12px" }}>
      
      {/* Header Stack */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: "600" }}>
          Invoice Report Table
        </Typography>

        <Stack direction="row" spacing={2}>
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
  );
};

export default InvoiceTable;