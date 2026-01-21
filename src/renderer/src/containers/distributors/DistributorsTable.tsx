import {
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  Select,
  MenuItem,
} from "@mui/material";
import revenueImg from "@/assets/TotalRevenue.png";
import pendingImg from "@/assets/PendingAmount.png";
import invoiceImg from "@/assets/TotalInvoices.png";
import ReusableTable, { TableColumn } from "@/components/uncontrolled/ReusableTable";
import ReuseIcon from "@/components/controlled/ReuseIcon";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AppToast from '@/containers/distributors/AppToast';


/* Card hover style */
const cardHover = {
  cursor: "pointer",
  transition: "all 0.25s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0px 10px 25px rgba(0,0,0,0.12)",
    border: "1px solid #2563EB",
  },
};

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

  const [rows, setRows] = useState<DistributorRow[]>([]);
  const [toastOpen, setToastOpen] = useState(false);


  /* DELETE HANDLER */
  const handleDelete = (row: DistributorRow) => {
  const isConfirmed = window.confirm(`Are you sure you want to delete this data`);
    if (isConfirmed) {
  setRows((prev) => prev.filter((item) => item !== row));
  setToastOpen(true);
}
  }

  /* TABLE COLUMNS */
  const distributorColumns: TableColumn<DistributorRow>[] = [
    {
      key: "checkbox",
      label: "",
      render: () => <Checkbox size="small" />,
    },
    { key: "companyName", label: "Company Name" },
    { key: "email", label: "Email" },
    { key: "mobile", label: "Phone" },
    { key: "date", label: "Date" },
    { key: "address", label: "Address" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Select
          size="small"
          value={row.status}
          sx={{
            fontSize: 13,
            height: 28,
            color: row.status === "Active" ? "green" : "red",
            ".MuiOutlinedInput-notchedOutline": { border: "none" },
          }}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </Select>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <ReuseIcon
          name="DeleteOutline"
          color="error"
          size="small"
          onClick={() => handleDelete(row)}
          sx={{
            "&:hover": {
              backgroundColor: "#fdecea",
            },
          }}
        />
      ),
    },
  ];

  /* ADD NEW USER (DUPLICATE FIX) */
  useEffect(() => {
    if (newUser) {
      setRows((prev) => {
        const alreadyExists = prev.some(
          (item) =>
            item.email === newUser.email &&
            item.mobile === newUser.mobile
        );

        if (alreadyExists) return prev;

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
    }
  }, [newUser]);

  /* CARDS DATA */
  const cardsData = [
    {
      label: "Total Distributors",
      value: rows.length,
      img: revenueImg,
    },
    {
      label: "Total Purchase",
      value: "₹ 25,567",
      img: pendingImg,
    },
    {
      label: "New Distributors",
      value: rows.length,
      img: invoiceImg,
    },
  ];

  return (
    <Box p={{ xs: 1, sm: 2 }}>
      {/* CARDS */}
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          sm: "1fr 1fr",
          md: "1fr 1fr 1fr",
        }}
        gap={3}
        mb={4}
      >
        {cardsData.map((item, i) => (
          <Box
            key={i}
            p={3}
            bgcolor="#fff"
            borderRadius={2}
            boxShadow={1}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={cardHover}
          >
            <Box>
              <Typography fontWeight={600}>{item.value}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
            </Box>
            <Box component="img" src={item.img} width={50} />
          </Box>
        ))}
      </Box>

      {/* TABLE */}
      <Box
        sx={{
          border: "1px solid #ddd",
          borderRadius: 2,
          p: { xs: 2, sm: 3 },
          backgroundColor: "#fff",
          "&:hover": { border: "2px solid #1E88FF" },
          "& .MuiTableRow-root:hover": {
            backgroundColor: "#E3F2FD",
            cursor: "pointer",
          },
          "& .MuiTablePagination-root": { display: "none" },
        }}
      >
        {/* HEADER */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography fontWeight={600}>Distributors List</Typography>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#238878", textTransform: "none" }}
            onClick={() => navigate("/form")}
          >
            + Add Customer
          </Button>
        </Box>

        {/* SEARCH */}
        <Box display="flex" justifyContent="flex-end" gap={2.5} mb={3}>
          <TextField size="small" placeholder="Search" />
          <TextField size="small" select defaultValue="thisMonth" SelectProps={{ native: true }}>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="allMonth">All Month</option>
          </TextField>
        </Box>

        {/* TABLE */}
        <ReusableTable
          data={rows}
          columns={distributorColumns}
          rowsPerPage={5}
          showSearch={false}
          showExport={false}
          tableSize="medium"
          textAlignment="left"
        />

        {/* FOOTER */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography fontSize={12} color="text.secondary">
            Showing 1 of {rows.length} Entries
          </Typography>
        </Box>
      </Box>
      <AppToast
  open={toastOpen}
  message="Data deleted successfully"
  severity="success"  
  onClose={() => setToastOpen(false)}
/>

    </Box>
  );
}
