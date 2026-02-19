 import { useState, useMemo } from "react";
import {  Typography, MenuItem, Select, FormControl, Stack, Paper, Divider } from "@mui/material";
import { UniversalTable, Column } from "@/components/uncontrolled/UniversalTable";

// Define what information each Customer should have
type Customer = {
  id: number;
  name: string;
  medicines: string;
  quantity: number;
  totalPrice: number;
  referenceFrom: string;
  date: string; 
};

// Dummy data for the customer list
const customerData: Customer[] = [
  { id: 1, name: "Kishor Kedar", medicines: "Medicine Two", quantity: 1, totalPrice: 152.00, referenceFrom: "Dr. Shyam Raut", date: "Jan 05, 2026" },
  { id: 2, name: "Rohit Raut", medicines: "Paracetamol", quantity: 5, totalPrice: 57.00, referenceFrom: "Dr. Kritika Kulkarni", date: "Jan 05, 2026" },
  { id: 3, name: "Smita Rao", medicines: "Honitus", quantity: 1, totalPrice: 125.00, referenceFrom: "Others", date: "Jan 04, 2026" },
  { id: 4, name: "Shilpa Rathod", medicines: "Eladi", quantity: 1, totalPrice: 160.00, referenceFrom: "Dr. Aman Sheikh", date: "Jan 03, 2026" },
  { id: 5, name: "Kanta Jain", medicines: "Insulin", quantity: 10, totalPrice: 1799.00, referenceFrom: "Dr. Rahul Patane", date: "Jan 01, 2026" },
];

function CustomerTable() {
  // State to track which time range is selected (e.g., "All Time" or "This Month")
  const [timeFilter, setTimeFilter] = useState("All Time");

  // Logic to filter the data based on the selected time range
  const filteredData = useMemo(() => {
    return customerData.filter((customer) => {
      // If "All Time" is selected, show everything
      if (timeFilter === "All Time") return true;

      const itemDate = new Date(customer.date);
      const today = new Date();

      // Show only customers from the current month
      if (timeFilter === "This Month") {
        return itemDate.getMonth() === today.getMonth() && itemDate.getFullYear() === today.getFullYear();
      } 

      // Show only customers from the last 7 days
      if (timeFilter === "Last 7 Days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        return itemDate >= sevenDaysAgo && itemDate <= today;
      }
      return true;
    });
  }, [timeFilter]);

  // Define table headings and which data goes into which column
  const columns: Column<Customer>[] = [
    { key: "name", label: "Name" },
    { key: "medicines", label: "Medicines" },
    { key: "quantity", label: "Quantity" },
    // Format the price to show the currency symbol (₹)
    { key: "totalPrice", label: "Total Price", render: (row) => `₹${row.totalPrice.toFixed(2)}` },
    { key: "referenceFrom", label: "Reference From" },
    { key: "date", label: "Date" },
  ];

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      {/* Page Title */}
      {/* <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
        Customers List
      </Typography> */}
              <Typography fontSize={{ xs: 18, md: 20 }} mb={2} fontWeight={600}>
          Customer List
        </Typography>
      <Divider sx={{ mb: 3 }} />
      
      {/* Dropdown menu for selecting time filters */}
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <FormControl size="small">
          <Select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            sx={{ minWidth: 160, borderRadius: "8px", fontSize: "0.85rem" }}
          >
            <MenuItem value="All Time">All Time</MenuItem>
            <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
            <MenuItem value="This Month">This Month</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* reusable table component  */}
      <UniversalTable<Customer>
        data={filteredData}     
        columns={columns}          
        enableCheckbox={true}    
        showSearch={true}         
        showExport={true}         
        getRowId={(row) => row.id} 
      />
    </Paper>
  );
}
export default CustomerTable;