 import { useState, useMemo } from "react";
import { Box, Typography, MenuItem, Select, FormControl, Stack } from "@mui/material";
import { UniversalTable, Column } from "@/components/uncontrolled/UniversalTable";

// Define the type
type DistributorRow = {
  name: string;
  email: string;
  contact: string;
  lastPurchaseDate: string;
  status: "Active" | "Inactive";
};

// dummy data
const distributorData: DistributorRow[] = [
  { name: "MediSupply Co.", email: "medi@example.com", contact: "+91 1234567890", lastPurchaseDate: "08/15/2026", status: "Active" },
  { name: "PharmaCare Ltd.", email: "pharmac@example.com", contact: "+91 1234567890", lastPurchaseDate: "12/20/2026", status: "Active" },
  { name: "MediSupply Co.", email: "medi@example.com", contact: "+91 1234567890", lastPurchaseDate: "01/10/2026", status: "Active" },
  { name: "MedEquip Inc.", email: "medequip@example.com", contact: "+91 1234567890", lastPurchaseDate: "03/01/2027", status: "Active" },
  { name: "MedEquip Inc.", email: "medequip@example.com", contact: "+91 1234567890", lastPurchaseDate: "01/15/2026", status: "Inactive" },
];

function DistributorsPage() {
  //  Filter sathi States
  const [statusFilter, setStatusFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All Time");

  //  Filter Logic
  const filteredData = useMemo(() => {
    return distributorData.filter((distributor) => {
      // Status Filter
      const matchesStatus = statusFilter === "All" || distributor.status === statusFilter;

      // Time Filter Logic
      const purchaseDate = new Date(distributor.lastPurchaseDate);
      const today = new Date();
      let matchesTime = true;

      if (timeFilter === "This Month") {
        matchesTime = purchaseDate.getMonth() === today.getMonth() && 
                      purchaseDate.getFullYear() === today.getFullYear();
      } else if (timeFilter === "Last 30 Days") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        matchesTime = purchaseDate >= thirtyDaysAgo && purchaseDate <= today;
      }

      return matchesStatus && matchesTime;
    });
  }, [statusFilter, timeFilter]);

  // Define the table columns
  const columns: Column<DistributorRow>[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "contact", label: "Contact" },
    { key: "lastPurchaseDate", label: "Last Purchase Date" },
    { 
      key: "status", 
      label: "Status",
      render: (row) => (
        <Typography 
          sx={{ 
            color: row.status === "Active" ? "#4caf50" : "#f44336", 
            fontWeight: "bold",
            fontSize: "0.85rem"
          }}
        >
          {row.status}
        </Typography>
      )
    },
  ];

  return (
    <Box sx={{ p: 4, bgcolor: "#f9fafb", minHeight: "100vh" }}>
      <Box sx={{ bgcolor: "#fff", p: 3, borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        
        {/* Header and Dropdowns Stack */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#111827" }}>
            Distributors List
          </Typography>

          <Stack direction="row" spacing={2}>
            {/* Status Dropdown */}
            <FormControl size="small">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ minWidth: 130, borderRadius: "8px", fontSize: "0.85rem" }}
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>

            {/* Time Filter Dropdown */}
            <FormControl size="small">
              <Select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                sx={{ minWidth: 140, borderRadius: "8px", fontSize: "0.85rem" }}
              >
                <MenuItem value="All Time">All Time</MenuItem>
                <MenuItem value="This Month">This Month</MenuItem>
                <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>

        {/* Universal Table component */}
        <UniversalTable<DistributorRow>
          data={filteredData}   
          columns={columns}         
          showSearch={true}         
          showExport={true}         
          enableCheckbox={true}     
          getRowId={(row) => `${row.name}-${row.lastPurchaseDate}`}
        />
      </Box>
    </Box>
  );
}

export default DistributorsPage;