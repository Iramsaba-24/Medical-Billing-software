import { useState, useMemo, useEffect } from "react";
import { CustomerData } from "@/view/CustomerMaster";
import {
  UniversalTable,
  Column,
} from "@/components/uncontrolled/UniversalTable";
import { Box, Button, Typography, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import {
  showToast,
  showConfirmation,
} from "@/components/uncontrolled/ToastMessage.tsx";

interface CustomerListProps {
  data: CustomerData[];
  onView: (data: CustomerData) => void;
  onEdit: (data: CustomerData) => void;
  onDelete: (data: CustomerData) => void;
}

export const CustomerListPage = ({
  data,
  onView,
  onEdit,
}: CustomerListProps) => {
  const navigate = useNavigate();
  const [searchTerm] = useState("");
  const [customers, setCustomers] = useState<CustomerData[]>([]);

  useEffect(() => {
    const storedCustomers = localStorage.getItem("customers");

    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers));
    } else {
      setCustomers(data);
      localStorage.setItem("customers", JSON.stringify(data));
    }
  }, [data]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return customers;
    const lowerSearch = searchTerm.toLowerCase();
    return customers.filter(
      (item) =>
        item.name?.toLowerCase().includes(lowerSearch) ||
        item.mobile?.toLowerCase().includes(lowerSearch)
    );
  }, [customers, searchTerm]);

  const columns: readonly Column<CustomerData>[] = [
    { label: "Name", key: "name" },
    { label: "Mobile", key: "mobile" },
    { label: "Doctor", key: "doctor" },
    { label: "Date", key: "date" },
    { label: "Actions", key: "actionbutton" },
  ];

  const handleDelete = async (customer: CustomerData) => {
    const confirmed = await showConfirmation(
      "Are you sure you want to delete this customer?",
      "Confirm Delete"
    );

    if (!confirmed) return;

    const storedCustomers: CustomerData[] = JSON.parse(
      localStorage.getItem("customers") || "[]"
    );

    const updatedCustomers = storedCustomers.filter(
      (item) => item.mobile !== customer.mobile
    );

    localStorage.setItem("customers", JSON.stringify(updatedCustomers));
    setCustomers(updatedCustomers);

    showToast("success", "Customer deleted successfully");
  };

  return (
    <Box sx={{ bgcolor: "#f8f9fa" }}>
      <Box sx={{ mb: 2 }}>
        <Typography
          sx={{
            fontSize: { xs: 22, md: 28 },
            fontWeight: 700,
            color: "#111827",
          }}
        >
          Customers
        </Typography>
      </Box>

      <Box
        sx={{
          bgcolor: "#fff",
          p: { xs: 1, md: 2 },
          borderRadius: "12px",
          border: "1px solid #e0e0e0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            mb: 2,
          }}
        >
          <Typography fontSize={{ xs: 18, md: 20 }} fontWeight={600}>
            Customers List
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate(URL_PATH.AddCustomerForm)}
            startIcon={<AddIcon />}
            sx={{
              textTransform: "none",
              bgcolor: "#238878",
              width: { xs: "100%", sm: "auto" },
              "&:hover": {
                backgroundColor: "#fff",
                color: "#238878",
                border: "2px solid #238878",
              },
            }}
          >
            Add Customer
          </Button>
        </Box>

        <Divider sx={{ mb: 1 }} />

        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <UniversalTable<CustomerData & Record<string, unknown>>
            columns={columns}
            data={filteredData}
            showExport={true}
            showSearch={true}
            getRowId={(row) => row.mobile}
            actions={{
              view: (customer) => onView(customer),
              edit: (customer) => onEdit(customer),
              delete: (customer) => handleDelete(customer),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CustomerListPage;
