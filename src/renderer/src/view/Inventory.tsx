import { Box, Paper, Typography, Button, Chip } from "@mui/material";
import {
  UniversalTable,
  Column,
} from "@/components/uncontrolled/UniversalTable";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";

import TotalItems from "@/assets/TotalItems.svg";
import LowStack from "@/assets/warningsign.svg";
import TotalValue from "@/assets/TotalValue.svg";

type InventoryItem = {
  id: number;
  item: string;
  category: "Medicine" | "Supplies";
  stock: string;
  price: number;
  supplier: string;
  expiryDate: string;
  status: "In Stock";
};

const inventoryData: InventoryItem[] = [
  {
    id: 1,
    item: "Paracetamol 500mg",
    category: "Medicine",
    stock: "450 Tablets",
    price: 2,
    supplier: "MediSupply Co.",
    expiryDate: "15/08/2026",
    status: "In Stock",
  },
  {
    id: 2,
    item: "Amoxicillin",
    category: "Medicine",
    stock: "120 Capsules",
    price: 15,
    supplier: "PharmaCare Ltd.",
    expiryDate: "20/12/2026",
    status: "In Stock",
  },
  {
    id: 3,
    item: "Insulin Injection",
    category: "Medicine",
    stock: "85 Vials",
    price: 250,
    supplier: "MediSupply Co.",
    expiryDate: "30/06/2026",
    status: "In Stock",
  },
  {
    id: 4,
    item: "Surgical Gloves",
    category: "Supplies",
    stock: "1500 Pairs",
    price: 5,
    supplier: "MedEquip Inc.",
    expiryDate: "01/03/2027",
    status: "In Stock",
  },
  {
    id: 5,
    item: "Syringes (5ml)",
    category: "Supplies",
    stock: "850 Units",
    price: 3,
    supplier: "MedEquip Inc.",
    expiryDate: "15/01/2027",
    status: "In Stock",
  },
];

const columns: Column<InventoryItem>[] = [
  { key: "item", label: "Item" },
  {
    key: "category",
    label: "Category",
    render: (row) => (
      <Chip
        label={row.category}
        size="small"
        sx={{
          bgcolor: row.category === "Medicine" ? "#DCFCE7" : "#E0F2FE",
          color: row.category === "Medicine" ? "#166534" : "#075985",
          fontWeight: 600,
        }}
      />
    ),
  },
  { key: "stock", label: "Stock" },
  {
    key: "price",
    label: "Price",
    render: (row) => `₹ ${row.price}`,
  },
  { key: "supplier", label: "Supplier" },
  { key: "expiryDate", label: "Expiry Date" },
  {
    key: "status",
    label: "Status",
    render: () => (
      <Typography fontSize={13} fontWeight={600} color="success.main">
        In Stock
      </Typography>
    ),
  },
];

export default function InventoryPage() {
  const navigate = useNavigate();

  const totalItems = inventoryData.length;
  const totalValue = inventoryData.reduce((sum, item) => sum + item.price, 0);

  return (
    <Box>
      <Typography fontSize={20} fontWeight={600} mb={2}>
        Inventory
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }}
        gap={2}
        mb={3}
      >
        {[
          { label: "Total Items", value: totalItems, img: TotalItems },
          { label: "Low Stock Items", value: 0, img: LowStack },
          { label: "Total Value", value: `₹ ${totalValue}`, img: TotalValue },
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

      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "2fr 1fr" }}
        gap={3}
        mb={3}
      >
        <Paper sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography component="div" fontWeight={600}>
              Medicine Groups
              <Chip label="03" size="small" />
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate("/inventory/medicine-group")}
              sx={{
                minWidth: 100,
                backgroundColor: "#238878",
                color: "#fff",
                border: "2px solid #238878",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "0.95rem",
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(35, 136, 120, 0.25)",
                transition: "all 0.25s ease",
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "#238878",
                  border: "2px solid #238878",
                  boxShadow: "0 6px 18px rgba(35, 136, 120, 0.35)",
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  transform: "scale(0.98)",
                },
              }}
            >
              View Details
            </Button>
          </Box>

          {[
            ["Generic Medicines", "02"],
            ["Diabetes", "32"],
            ["Other", "01"],
          ].map(([name, count]) => (
            <Box
              key={name}
              display="flex"
              justifyContent="space-between"
              py={1}
              borderBottom="1px solid #eee"
            >
              <Typography fontSize={14}>{name}</Typography>
              <Typography fontSize={14}>{count}</Typography>
            </Box>
          ))}
        </Paper>

        <Box display="flex" flexDirection="column" gap={2}>
          <Button
            fullWidth
            sx={{
              px: 2.5,
              py: 1,
              minWidth: 100,
              backgroundColor: "#238878",
              color: "#fff",
              border: "2px solid #238878",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "0.95rem",
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(35, 136, 120, 0.25)",
              transition: "all 0.25s ease",
              "&:hover": {
                backgroundColor: "#fff",
                color: "#238878",
                border: "2px solid #238878",
                boxShadow: "0 6px 18px rgba(35, 136, 120, 0.35)",
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "scale(0.98)",
              },
            }}
            onClick={() => navigate("/inventory/medicine-group")}
          >
            + Add New Medicine
          </Button>

          <Button
            fullWidth
            sx={{
              px: 2.5,
              py: 1,
              minWidth: 100,
              backgroundColor: "#238878",
              color: "#fff",
              border: "2px solid #238878",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "0.95rem",
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(35, 136, 120, 0.25)",
              transition: "all 0.25s ease",
              "&:hover": {
                backgroundColor: "#fff",
                color: "#238878",
                border: "2px solid #238878",
                boxShadow: "0 6px 18px rgba(35, 136, 120, 0.35)",
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "scale(0.98)",
              },
            }}
            onClick={() => navigate("/inventory/add-medicine-group")}
          >
            + Add New Group
          </Button>

          <Button
            fullWidth
            sx={{
              px: 2.5,
              py: 1,
              minWidth: 100,
              backgroundColor: "#238878",
              color: "#fff",
              border: "2px solid #238878",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "0.95rem",
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(35, 136, 120, 0.25)",
              transition: "all 0.25s ease",
              "&:hover": {
                backgroundColor: "#fff",
                color: "#238878",
                border: "2px solid #238878",
                boxShadow: "0 6px 18px rgba(35, 136, 120, 0.35)",
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "scale(0.98)",
              },
            }}
            onClick={() => navigate(URL_PATH.InventoryList)}
          >
            View Inventory List
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Typography fontWeight={600} mb={2}>
          Inventory List
        </Typography>

        <UniversalTable<InventoryItem>
          data={inventoryData}
          columns={columns}
          enableCheckbox
          showSearch
          rowsPerPage={5}
          getRowId={(row) => row.id}
          caption={undefined}
        />
      </Paper>
    </Box>
  );
}
