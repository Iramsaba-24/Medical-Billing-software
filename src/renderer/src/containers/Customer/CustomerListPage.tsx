import { useState, useMemo } from "react";
import { CustomerData } from "@/view/CustomerMaster";
import {
  UniversalTable,
  Column,
} from "@/components/uncontrolled/UniversalTable";
import { Box, Button, Typography, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// Define the properties required by the Customer List page
interface CustomerListProps {
  data: CustomerData[];
  onAdd: () => void;
  onView: (data: CustomerData) => void;
  onEdit: (data: CustomerData) => void;
  onDelete: (data: CustomerData) => void;
}

export const CustomerListPage = ({
  data,
  onAdd,
  onView,
  onEdit,
  onDelete,
}: CustomerListProps) => {
  const [searchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(
      (item) =>
        item.name?.toLowerCase().includes(lowerSearch) ||
        item.mobile?.toLowerCase().includes(lowerSearch)
    );
  }, [data, searchTerm]);

  const columns: readonly Column<CustomerData>[] = [
    { label: "Name", key: "name" },
    { label: "Mobile", key: "mobile" },
    { label: "Medicines", key: "medicines" },
    { label: "Qty", key: "totalQty" },
    { label: "Total", key: "totalPrice" },
    { label: "Doctor", key: "doctor" },
    { label: "Date", key: "date" },
    { label: "Actions", key: "actionbutton" },
  ];

  return (
    <Box sx={{ bgcolor: "#f8f9fa" }}>
      {/* Page Heading */}
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
        {/* Customers List Title + Add Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography fontSize={{ xs: 18, md: 20 }} fontWeight={600}>
            Customers List
          </Typography>

          <Button
            variant="contained"
            onClick={onAdd}
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
            actions={{
              view: onView,
              edit: onEdit,
              delete: onDelete,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CustomerListPage;
