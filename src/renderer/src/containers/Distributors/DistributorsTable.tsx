import { Box, Typography, Button, TextField, MenuItem, Select } from "@mui/material";
import { UniversalTable, ACTION_KEY, Column } from "@/components/uncontrolled/UniversalTable"; 
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AppToast from "@/containers/Distributors/AppToast";
import { URL_PATH } from "@/constants/UrlPath";

type DistributorRow = {
  companyName: string;
  email: string;
  mobile: string;
  date: string;
  address: string;
  status: "Active" | "Inactive";
};

function DistributorsTable() {
  const navigate = useNavigate();
  const [toastOpen, setToastOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<DistributorRow[]>([]);

  // Load data from LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem("distributors");
    if (stored) setRows(JSON.parse(stored));
  }, []);

  // Function to change status
  const handleStatusChange = (email: string, newStatus: "Active" | "Inactive") => {
    const updatedRows = rows.map((row) => 
      row.email === email ? { ...row, status: newStatus } : row
    );
    setRows(updatedRows);
    localStorage.setItem("distributors", JSON.stringify(updatedRows));
  };

  const handleDelete = (row: DistributorRow) => {
    const updatedRows = rows.filter((item) => item.email !== row.email);
    setRows(updatedRows);
    localStorage.setItem("distributors", JSON.stringify(updatedRows));
    setToastOpen(true);
  };

  const filteredRows = rows.filter((row) =>
    row.companyName.toLowerCase().includes(search.toLowerCase()) ||
    row.email.toLowerCase().includes(search.toLowerCase())
  );

  const distributorColumns: Column<DistributorRow>[] = [
    { key: "companyName", label: "Company Name" },
    { key: "email", label: "Email" },
    { key: "mobile", label: "Phone" },
    { key: "date", label: "Date" },
    { 
      key: "status", 
      label: "Status",
      // Render dropdown here
      render: (row) => (
        <Select
          size="small"
          value={row.status}
          onChange={(e) => handleStatusChange(row.email, e.target.value as "Active" | "Inactive")}
          sx={{ height: 30, fontSize: "14px" }}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </Select>
      )
    },
    { key: ACTION_KEY, label: "Action" },
  ];

  return (
    <Box sx={{ border: "1px solid #ddd", borderRadius: 2, p: 3, backgroundColor: "#fff" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography fontWeight={600}>Distributors List</Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#238878", textTransform: "none" }}
          onClick={() => navigate(URL_PATH.DistributorsForm)}
        >
          + Add Distributor
        </Button>
      </Box>

      <Box display="flex" justifyContent="flex-end" mb={3}>
        <TextField 
          size="small" 
          placeholder="Search" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
      </Box>

      <UniversalTable<DistributorRow>
        data={filteredRows}
        columns={distributorColumns}
        getRowId={(row) => row.email}
        actions={{ delete: (row) => handleDelete(row) }}
      />

      <AppToast open={toastOpen} message="Deleted successfully" onClose={() => setToastOpen(false)} />
    </Box>
  );
}

export default DistributorsTable;