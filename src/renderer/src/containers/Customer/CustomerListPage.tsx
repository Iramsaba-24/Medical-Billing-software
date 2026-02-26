 import { useState, useMemo } from "react";
import { CustomerData } from "@/view/CustomerMaster";
import { UniversalTable, Column } from "@/components/uncontrolled/UniversalTable";
import { Box, Button, TextField, InputAdornment, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

// Define the properties required by the Customer List page
interface CustomerListProps {
  data: CustomerData[];
  onAdd: () => void;
  onView: (data: CustomerData) => void;
  onEdit: (data: CustomerData) => void;
  onDelete: (data: CustomerData) => void;
}

export const CustomerListPage = ({ data, onAdd, onView, onEdit, onDelete }: CustomerListProps) => {
  // State to store what the user types in the search box
  const [searchTerm, setSearchTerm] = useState("");

  // Logic to filter the customer list based on Name or Mobile number
  const filteredData = useMemo(() => {
    if (!searchTerm) return data; 
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter((item) =>
      item.name?.toLowerCase().includes(lowerSearch) ||
      item.mobile?.toLowerCase().includes(lowerSearch)
    );
  }, [data, searchTerm]); 

  //  Setting up labels and data keys
  const columns: readonly Column<CustomerData>[] = [
    { label: "Name", key: "name" },
    { label: "Mobile", key: "mobile" },
    { label: "Medicines", key: "medicines" },
    { label: "Qty", key: "totalQty" },
    { label: "Total", key: "totalPrice" },
    { label: "Doctor", key: "doctor" },
    { label: "Date", key: "date" },
    { label: "Actions", key: "actionbutton" } 
  ];

  return (
    <Box sx={{ bgcolor: "#f8f9fa" }}>
      
      {/* Search Bar and Add Customer Button Section */}
      <Box sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" }, 
        justifyContent: "space-between",
        gap: 2,
        mb: 3,
        bgcolor: "#fff",
        p: 2,
        borderRadius: "12px",
        border: "1px solid #e0e0e0"
      }}>
        {/* Search Input Field with Search Icon */}
        <TextField
          placeholder="Search name or mobile..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: { xs: "100%", sm: "60%" } }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
          }}
        />
        
        {/* Add Customer Button */}
        <Button
          variant="contained"
          onClick={onAdd}
          startIcon={<AddIcon />}
          sx={{
            bgcolor: "#248a76",
            fontWeight: "bold",
            width: { xs: "100%", sm: "auto" },
            border: "1px solid #248a76",
            "&:hover": { bgcolor: "#fff", color: "#248a76" }
          }}
        >
          Add Customer
        </Button>
      </Box>

      {/* Main Container for the Customer Table */}
      <Box sx={{ bgcolor: "#fff", p: { xs: 1, md: 2 }, borderRadius: "8px", border: "1px solid #e0e0e0" }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>Customers List</Typography>
        
        {/* Box with overflowX "auto"  */}
        <Box sx={{ width: "100%", overflowX: "auto" }}>
           <UniversalTable<CustomerData>
             columns={columns as unknown as Column<CustomerData>[]}
             data={filteredData}  
             actions={{
               view: onView,
               edit: onEdit,
               delete: onDelete
             }}
           />
        </Box>
      </Box>
    </Box>
  );
};

export default CustomerListPage;