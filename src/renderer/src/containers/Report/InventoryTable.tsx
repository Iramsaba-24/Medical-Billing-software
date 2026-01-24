import { useState, useMemo } from "react";
import { Box, Chip, Typography, MenuItem, Select, FormControl, Stack } from "@mui/material";
import { UniversalTable, Column } from "@/components/uncontrolled/UniversalTable";

//  Structure definition
type InventoryItem = {
  id: string;
  item: string;
  category: "Medicine" | "Supplies";
  stock: string;
  reorder: number;
  supplier: string;
  expiryDate: string; 
  status: string;
};

const inventoryData: InventoryItem[] = [
  
  { id: "101", item: "Paracetamol 500mg", category: "Medicine", stock: "20 Tablets", reorder: 100, supplier: "MediSupply Co.", expiryDate: "08/15/2026", status: "Low Stock" },
  { id: "102", item: "Syringes (5ml)", category: "Supplies", stock: "150 Units", reorder: 200, supplier: "MedEquip Inc.", expiryDate: "01/15/2027", status: "Low Stock" },
  { id: "201", item: "Insulin Injection", category: "Medicine", stock: "10 Vials", reorder: 30, supplier: "MediSupply Co.", expiryDate: "01/25/2026", status: "Near Expiry" },
  { id: "202", item: "Cough Syrup", category: "Medicine", stock: "45 Bottles", reorder: 100, supplier: "PharmaCare Ltd.", expiryDate: "01/29/2026", status: "Near Expiry" },
  { id: "301", item: "Surgical Gloves", category: "Supplies", stock: "100 Pairs", reorder: 500, supplier: "MedEquip Inc.", expiryDate: "10/12/2025", status: "Expired" },
  { id: "302", item: "Antibiotics (Amoxicillin)", category: "Medicine", stock: "12 Capsules", reorder: 50, supplier: "PharmaCare Ltd.", expiryDate: "11/20/2025", status: "Expired" },
  { id: "401", item: "Vitamin C", category: "Medicine", stock: "80 Tablets", reorder: 200, supplier: "MediSupply Co.", expiryDate: "01/27/2026", status: "Near Expiry" },
];

function InventoryTable() {
  // State for Filters
  const [stockStatus, setStockStatus] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All Time");

  // Filter Logic
  const filteredData = useMemo(() => {
    return inventoryData.filter((item) => {
      // Stock Status Filter logic
      const matchesStock = stockStatus === "All" || item.status === stockStatus;

      // Time/Date Filter Logic
      const itemDate = new Date(item.expiryDate);
      const today = new Date();
      
      let matchesTime = true;
      if (timeFilter === "This Month") {
        // Check if Month and Year match
        matchesTime = itemDate.getMonth() === today.getMonth() && 
                      itemDate.getFullYear() === today.getFullYear();
      } else if (timeFilter === "6 Days") {
        const sixDaysLater = new Date();
        sixDaysLater.setDate(today.getDate() + 6);
        matchesTime = itemDate >= today && itemDate <= sixDaysLater;
      }

      return matchesStock && matchesTime;
    });
  }, [stockStatus, timeFilter]);

  //  Table Columns Configuration
  const columns: Column<InventoryItem>[] = [
    { key: "item", label: "Item",
      render: (row) => (
        <Box>
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 500 }}>{row.item}</Typography>
          <Typography sx={{ fontSize: "0.7rem", color: "#9e9e9e" }}>ID: {row.id}</Typography>
        </Box>
      ),
    },
    { key: "category", label: "Category",
      render: (row) => (
        <Chip label={row.category} size="small"
          sx={{ 
            bgcolor: row.category === "Medicine" ? "#d1fae5" : "#e0f2fe", 
            color: "#065f46",
            fontWeight: 600,
            borderRadius: "6px",
          }}
        />
      ),
    },
    { key: "stock", label: "Stock",
      render: (row) => (
        <Box>
          <Typography sx={{ fontSize: "0.9rem" }}>{row.stock}</Typography>
          <Typography sx={{ fontSize: "0.7rem", color: "#9e9e9e" }}>Reorder: {row.reorder}</Typography>
        </Box>
      ),
    },
    { key: "supplier", label: "Supplier" },
    { key: "expiryDate", label: "Expiry Date" },
    { key: "status", label: "Status",
      render: (row) => {
        let statusColor = "#f97316"; 
        if (row.status === "Expired") statusColor = "#ef4444"; 
        if (row.status === "Near Expiry") statusColor = "#eab308";
        
        return (
          <Typography sx={{ color: statusColor, fontWeight: 600, fontSize: "0.85rem" }}>
            {row.status}
          </Typography>
        );
      },
    },
  ];

  return (
    <Box sx={{ p: 4, bgcolor: "#f9fafb", minHeight: "100vh" }}>
      <Box sx={{ bgcolor: "#fff", p: 3, borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        
        {/* Header and Dropdowns Row */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "600", color: "#111827" }}>
            Inventory Stock Report
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            {/* Stock Status Dropdown */}
            <FormControl size="small">
              <Select
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value)}
                sx={{ minWidth: 140, borderRadius: "8px", fontSize: "0.85rem", bgcolor: "#fff" }}
              >
                <MenuItem value="All">All Stock</MenuItem>
                <MenuItem value="Low Stock">Low Stock</MenuItem>
                <MenuItem value="Near Expiry">Near Expiry</MenuItem>
                <MenuItem value="Expired">Expired</MenuItem>
              </Select>
            </FormControl>

            {/* Time Filter Dropdown */}
            <FormControl size="small">
              <Select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                sx={{ minWidth: 140, borderRadius: "8px", fontSize: "0.85rem", bgcolor: "#fff" }}
              >
                <MenuItem value="All Time">All Time</MenuItem>
                <MenuItem value="6 Days">6 Days</MenuItem>
                <MenuItem value="This Month">This Month</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
        
        {/* Universal Table Component */}
        <UniversalTable<InventoryItem>
          data={filteredData}       
          columns={columns}  
          showSearch={true}        
          showExport={true}        
          enableCheckbox={true}     
          rowsPerPage={5}           
          getRowId={(row) => row.id} 
        />
      </Box>
    </Box>
  );
}

export default InventoryTable;