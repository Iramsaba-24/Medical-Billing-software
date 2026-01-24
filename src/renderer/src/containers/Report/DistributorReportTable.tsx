 import { useState, useMemo } from "react";
import { Typography, MenuItem, Select, FormControl, Stack, Paper, Divider } from "@mui/material";
import { UniversalTable, Column } from "@/components/uncontrolled/UniversalTable";

// Define the data structure for a Distributor
type DistributorRow = {
  name: string;
  email: string;
  contact: string;
  lastPurchaseDate: string;
  status: "Active" | "Inactive";
};

// Sample data for the distributors
const distributorData: DistributorRow[] = [
  { name: "MediSupply Co.", email: "medi@example.com", contact: "+91 1234567890", lastPurchaseDate: "08/15/2026", status: "Active" },
  { name: "PharmaCare Ltd.", email: "pharmac@example.com", contact: "+91 1234567890", lastPurchaseDate: "12/20/2026", status: "Active" },
  { name: "MediSupply Co.", email: "medi@example.com", contact: "+91 1234567890", lastPurchaseDate: "01/10/2026", status: "Active" },
  { name: "MedEquip Inc.", email: "medequip@example.com", contact: "+91 1234567890", lastPurchaseDate: "03/01/2027", status: "Active" },
  { name: "MedEquip Inc.", email: "medequip@example.com", contact: "+91 1234567890", lastPurchaseDate: "01/15/2026", status: "Inactive" },
];

function DistributorReportTable() {
  // States to store filter choices
  const [statusFilter, setStatusFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All Time");

  // Filter logic: This runs whenever a filter changes
  const filteredData = useMemo(() => {
    return distributorData.filter((distributor) => {
      //  Filter by Status (Active/Inactive)
      const matchesStatus = statusFilter === "All" || distributor.status === statusFilter;
      
      //  Filter by Time (Purchase Date)
      const purchaseDate = new Date(distributor.lastPurchaseDate);
      const today = new Date();
      let matchesTime = true;

      if (timeFilter === "This Month") {
        matchesTime = purchaseDate.getMonth() === today.getMonth() && purchaseDate.getFullYear() === today.getFullYear();
      } else if (timeFilter === "Last 30 Days") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        matchesTime = purchaseDate >= thirtyDaysAgo && purchaseDate <= today;
      }
      return matchesStatus && matchesTime;
    });
  }, [statusFilter, timeFilter]);

  // Define table columns
  const columns: Column<DistributorRow>[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "contact", label: "Contact" },
    { key: "lastPurchaseDate", label: "Last Purchase Date" },
    { 
      key: "status", 
      label: "Status",
      // Color coding: Green for Active, Red for Inactive
      render: (row) => (
        <Typography sx={{ color: row.status === "Active" ? "#4caf50" : "#f44336", fontWeight: "bold", fontSize: "0.85rem" }}>
          {row.status}
        </Typography>
      )
    },
  ];

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
        Distributors List
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Filter Dropdowns */}
      <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mb: 2 }}>
        <FormControl size="small">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 130, borderRadius: "8px" }}>
            <MenuItem value="All">All Status</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small">
          <Select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} sx={{ minWidth: 140, borderRadius: "8px" }}>
            <MenuItem value="All Time">All Time</MenuItem>
            <MenuItem value="This Month">This Month</MenuItem>
            <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* reusable Table */}
      <UniversalTable<DistributorRow>
        data={filteredData}   
        columns={columns}         
        showSearch={true}         
        showExport={true}         
        enableCheckbox={true}     
        getRowId={(row) => `${row.name}-${row.lastPurchaseDate}`}
      />
    </Paper>
  );
}

export default DistributorReportTable;