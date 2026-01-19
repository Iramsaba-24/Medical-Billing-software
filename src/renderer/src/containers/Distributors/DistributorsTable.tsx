import { Box, Typography, Button, TextField, Checkbox, Select, MenuItem, Paper } from "@mui/material";
import revenueImg from "@/assets/TotalRevenue.png";
import pendingImg from "@/assets/PendingAmount.png";
import invoiceImg from "@/assets/TotalInvoices.png";
import ReusableTable, { TableColumn } from "@/components/uncontrolled/ReusableTable";
import ReuseIcon from "@/components/controlled/ReuseIcon";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AppToast from "@/containers/Distributors/AppToast";

/* Row Type */
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
  
  /* State */
  const [rows, setRows] = useState<DistributorRow[]>(() => {
    const stored = localStorage.getItem("distributors");
    return stored ? JSON.parse(stored) : [];
  });

  const [search, setSearch] = useState("");

  /* Persist to localStorage */
  useEffect(() => {
    localStorage.setItem("distributors", JSON.stringify(rows));
  }, [rows]);

  /* Add new user  */
  useEffect(() => {
    if (!newUser) return;

    setRows((prev) => {
      const exists = prev.some((item) => item.email === newUser.email);
      if (exists) return prev;

      return [
        ...prev,
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

  /* Delete row */
  const handleDelete = (row: DistributorRow) => {
  setRows((prev) => prev.filter((item) => item !== row));
  setToastOpen(true);
};

  /* Filtered rows for search */
  const filteredRows = rows.filter((row) =>
    row.companyName.toLowerCase().includes(search.toLowerCase()) ||
    row.email.toLowerCase().includes(search.toLowerCase()) ||
    row.mobile.includes(search)
  );

  /* TABLE COLUMNS */
  const distributorColumns: TableColumn<DistributorRow>[] = [
    { key: "checkbox", label: "", render: () => <Checkbox size="small" /> },
    { key: "companyName", label: "Company Name" },
    { key: "email", label: "Email" },
    { key: "mobile", label: "Phone" },
    { key: "date", label: "Date" },
    { key: "address", label: "Address" },
    { key: "status", label: "Status", render: (row) => (
        <Select size="small" value={row.status} onChange={(e) => {
            const newStatus = e.target.value as "Active" | "Inactive";
            setRows((prev) => prev.map((r) => r.email === row.email ? { ...r, status: newStatus } : r ) ); }}
            sx={{fontSize: 13, height: 28, color: row.status === "Active" ? "green" : "red", ".MuiOutlinedInput-notchedOutline": { border: "none" }, }} >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </Select>
      ),
    },
    { key: "action", label: "Action",
      render: (row) => (
        <ReuseIcon
          name="DeleteOutline"
          color="error"
          size="small"
          onClick={() => handleDelete(row)}
          sx={{ "&:hover": { backgroundColor: "#fdecea" }, }}
        />
      ),
    },
  ];
  return (
    <Box p={2}>
      {/* CARDS */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "repeat(3, 1fr)", md: "repeat(3, 1fr)" }}
        gap={2}
        mb={3}
      >
        {[
          { label: "Total Distributors", value: rows.length, img: revenueImg },
          { label: "Total Purchase", value: 0, img: pendingImg },
          { label: "New Distributors", value: `₹ ${rows.length}`, img: invoiceImg }, ].map((card) => (
          <Paper key={card.label} sx={{
              p: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 2,
              cursor: "pointer",
              transition: "0.3s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
          >
            <Box>
              <Typography fontWeight={600} fontSize={18}>
                {card.value}
              </Typography>
              <Typography color="text.secondary">{card.label}</Typography>
            </Box>
 
            <Box
              component="img"
              src={card.img}
              sx={{ width: 70, height: 70 }}
            />
          </Paper>
        ))}
      </Box>

      {/* TABLE */}
      <Box
        sx={{
          border: "1px solid #ddd",
          borderRadius: 2,
          p: 3,
          backgroundColor: "#fff",
          "&:hover": { border: "2px solid #1E88FF" },
          "& .MuiTableRow-root:hover": { backgroundColor: "#E3F2FD", cursor: "pointer" },
          "& .MuiTablePagination-root": { display: "none" },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography fontWeight={600}>Distributors List</Typography>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#238878", textTransform: "none" }}
            onClick={() => navigate("/form")}
          >
            + Add Distributors
          </Button>
        </Box>

        {/* SEARCH */}
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

        {/* TABLE */}
        <ReusableTable
          data={filteredRows}
          columns={distributorColumns}
          showSearch={false}
          showExport={false}
          tableSize="medium"
          textAlignment="left"
          
        />
      </Box>
      <AppToast
  open={toastOpen}
  message="Data deleted successfully"
  onClose={() => setToastOpen(false)}
/>
    </Box>
  );
}
