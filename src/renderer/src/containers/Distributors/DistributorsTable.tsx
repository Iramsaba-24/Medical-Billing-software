import { Box, Typography, Button, TextField, Paper } from "@mui/material";
import { UniversalTable, ACTION_KEY, Column } from "@/components/uncontrolled/UniversalTable"; 
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AppToast from "./AppToast";

import TotalDistributors from "@/assets/TotalDistributers.svg";
import TotalPurchase from "@/assets/warningsign.svg";
import NewDistributors from "@/assets/NewDistributors.svg";

type DistributorRow = {
  companyName: string;
  email: string;
  mobile: string;
  date: string;
  address: string;
  status: "Active" | "Inactive";
};

export default function DistributorsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const newUser = location.state?.userData?.[0];
  const [toastOpen, setToastOpen] = useState(false);

  const [rows, setRows] = useState<DistributorRow[]>(() => {
    const stored = localStorage.getItem("distributors");
    return stored ? JSON.parse(stored) : [];
  });

  const [search, setSearch] = useState("");
   
  useEffect(() => {
    localStorage.setItem("distributors", JSON.stringify(rows)); }, [rows]);

  useEffect(() => {
    if (!newUser) return;
    setRows((prev) => {
      const exists = prev.some((item) => item.email === newUser.email);
      if (exists) return prev;
      return [ ...prev,
        {
          companyName: newUser.companyName,
          email: newUser.email,
          mobile: newUser.mobile,
          date: newUser.date,
          address: newUser.address,
          status: "Active",
        },
      ];
    });
  }, [newUser]);
  
    // Removes a distributor from the list and shows a success toast.
   
  const handleDelete = (row: DistributorRow) => {
    setRows((prev) => prev.filter((item) => item.email !== row.email));
    setToastOpen(true);
  };

   
  const filteredRows = rows.filter((row) =>
    row.companyName.toLowerCase().includes(search.toLowerCase()) ||
    row.email.toLowerCase().includes(search.toLowerCase()) ||
    row.mobile.includes(search)
  );

  const distributorColumns: Column<DistributorRow>[] = [
    { key: "companyName", label: "Company Name" },
    { key: "email", label: "Email" },
    { key: "mobile", label: "Phone" },
    { key: "date", label: "Date" },
    { key: "address", label: "Address" },
    { key: "status", label: "Status" },
    { key: ACTION_KEY, label: "Action" },
  ];

  return (
    <Box p={2}>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "repeat(3, 1fr)" }}
        gap={2}
        mb={3}
      >
        {[
          { label: "Total Distributors", value: rows.length, img: TotalDistributors },
          { label: "Total Purchase", value: 0, img: TotalPurchase },
          { label: "New Distributors", value: `₹ ${rows.length}`, img: NewDistributors },
        ].map((card) => (
          <Paper 
            key={card.label} 
            sx={{
              p: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 2,
              cursor: "pointer",
              transition: "0.3s",
              "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
            }}
          >
            <Box>
              <Typography fontWeight={600} fontSize={18}>{card.value}</Typography>
              <Typography color="text.secondary">{card.label}</Typography>
            </Box>
            <Box component="img" src={card.img} sx={{ width: 70, height: 70 }} />
          </Paper>
        ))}
      </Box>

     
      <Box
        sx={{
          border: "1px solid #ddd",
          borderRadius: 2,
          p: 3,
          backgroundColor: "#fff",
          "&:hover": { borderColor: "#1E88FF" }
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography fontWeight={600}>Distributors List</Typography>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#238878", textTransform: "none", "&:hover": { bgcolor: "#1a665a" } }}
            onClick={() => navigate("/form")} 
          >
            + Add Distributors
          </Button>
        </Box>

        {/* SEARCH & FILTERS BAR */}
        <Box display="flex" justifyContent="flex-end" gap={2.5} mb={3}>
          <TextField
            size="small"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <TextField size="small" select defaultValue="thisMonth" SelectProps={{ native: true }}>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="allMonth">All Month</option>
          </TextField>
        </Box>

        {/* Configured for Distributor data */}
        <UniversalTable<DistributorRow>
          data={filteredRows}
          columns={distributorColumns}
          tableSize="medium"
          textAlign="left"
          showSearch={false} 
          showExport={true}
          enableCheckbox={true}
          getRowId={(row) => row.email}
          
          // Inline Status Dropdown Allows updating the status directly from the table row 
          dropdown={{
            key: "status",
            options: [
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ],
            onChange: (row, newValue) => {
              setRows((prev) => 
                prev.map((r) => 
                  r.email === row.email 
                    ? { ...r, status: newValue as DistributorRow["status"] } 
                    : r
                )
              );
            },
            sx: {
              width: 120,
              bgcolor: "transparent",
              color: "inherit",
              "& .MuiOutlinedInput-notchedOutline": { border: "none" }
            }
          }}

          // Single Row Actions Configuration 
          actions={{
            delete: (row: DistributorRow) => handleDelete(row),
          }}

          onDeleteSelected={(selectedRows: DistributorRow[]) => {
            const emailsToDelete = selectedRows.map(r => r.email);
            setRows(prev => prev.filter(r => !emailsToDelete.includes(r.email)));
            setToastOpen(true);
          }}
        />
      </Box>

      {/* SUCCESS NOTIFICATION TOAST */}
      <AppToast
        open={toastOpen}
        message="Data deleted successfully"
        onClose={() => setToastOpen(false)}
      />
    </Box>
  );
}