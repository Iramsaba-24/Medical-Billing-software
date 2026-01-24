 import { useState, useMemo } from "react";
import { Box, Typography, MenuItem, Select, FormControl, Stack } from "@mui/material";
import { UniversalTable, Column } from "@/components/uncontrolled/UniversalTable";

// Defining the Customer object
type Customer = {
  id: number;
  name: string;
  medicines: string;
  quantity: number;
  totalPrice: number;
  referenceFrom: string;
  date: string; 
};

// Dummy data
const customerData: Customer[] = [
  { id: 1, name: "Kishor Kedar", medicines: "Medicine Two", quantity: 1, totalPrice: 152.00, referenceFrom: "Dr. Shyam Raut", date: "Jan 05, 2026" },
  { id: 2, name: "Rohit Raut", medicines: "Paracetamol", quantity: 5, totalPrice: 57.00, referenceFrom: "Dr. Kritika Kulkarni", date: "Jan 05, 2026" },
  { id: 3, name: "Smita Rao", medicines: "Honitus", quantity: 1, totalPrice: 125.00, referenceFrom: "Others", date: "Jan 04, 2026" },
  { id: 4, name: "Shilpa Rathod", medicines: "Eladi", quantity: 1, totalPrice: 160.00, referenceFrom: "Dr. Aman Sheikh", date: "Jan 03, 2026" },
  { id: 5, name: "Kanta Jain", medicines: "Insulin", quantity: 10, totalPrice: 1799.00, referenceFrom: "Dr. Rahul Patane", date: "Jan 01, 2026" },
];

function CustomerTable() {
  //  Filter sathi state
  const [timeFilter, setTimeFilter] = useState("All Time");

  // Filter Logic
  const filteredData = useMemo(() => {
    return customerData.filter((customer) => {
      if (timeFilter === "All Time") return true;

      const itemDate = new Date(customer.date);
      const today = new Date();

      if (timeFilter === "This Month") {
        return itemDate.getMonth() === today.getMonth() && 
               itemDate.getFullYear() === today.getFullYear();
      } 
      
      if (timeFilter === "Last 7 Days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        return itemDate >= sevenDaysAgo && itemDate <= today;
      }

      return true;
    });
  }, [timeFilter]);

  // Table Columns
  const columns: Column<Customer>[] = [
    { key: "name", label: "Name" },
    { key: "medicines", label: "Medicines" },
    { key: "quantity", label: "Quantity" },
    { key: "totalPrice", label: "Total Price", render: (row) => `₹${row.totalPrice.toFixed(2)}` },
    { key: "referenceFrom", label: "Reference From" },
    { key: "date", label: "Date" },
  ];

  return (
    <Box sx={{ p: 4, bgcolor: "#f9fafb", minHeight: "100vh" }}>
      <Box sx={{ bgcolor: "#fff", p: 3, borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        
        {/* Header and Dropdown Row */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "600", color: "#111827" }}>
            Customers List
          </Typography>

          {/* Time Filter Dropdown */}
          <FormControl size="small">
            <Select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              sx={{ minWidth: 160, borderRadius: "8px", fontSize: "0.85rem", bgcolor: "#fff" }}
            >
              <MenuItem value="All Time">All Time</MenuItem>
              <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
              <MenuItem value="This Month">This Month</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        
        {/* Table Component */}
        <UniversalTable<Customer>
          data={filteredData}     
          columns={columns}          
          enableCheckbox={true}    
          showSearch={true}         
          showExport={true}         
          getRowId={(row) => row.id} 
        />
      </Box>
    </Box>
  );
}

export default CustomerTable;