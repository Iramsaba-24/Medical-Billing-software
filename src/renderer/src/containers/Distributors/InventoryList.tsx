import { Box,  Chip, Typography } from "@mui/material";
import {
  UniversalTable,
  Column,
} from "@/components/uncontrolled/UniversalTable";

//  import SendIcon from '@mui/icons-material/Send';
import ShareMenu from "./ShareMenu";

type InventoryItem = {
  id: number;
  item: string;
  category: "Medicine" | "Supplies";
  stock: string;
  price: number;
  supplier: string;
  expiryDate: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
};

const inventoryData: InventoryItem[] = [
  {
    id: 1,
    item: "Paracetamol 500mg",
    category: "Medicine",
    stock: "450 Tablets",
    price: 2,
    supplier: "MediSupply Co.",
    expiryDate: "08/15/2026",
    status: "In Stock",
  },
  {
    id: 2,
    item: "Antibiotics (Amoxicillin)",
    category: "Medicine",
    stock: "120 Capsules",
    price: 15,
    supplier: "PharmaCare Ltd.",
    expiryDate: "12/20/2026",
    status: "In Stock",
  },
  {
    id: 3,
    item: "Insulin Injection",
    category: "Medicine",
    stock: "85 Vials",
    price: 250,
    supplier: "MediSupply Co.",
    expiryDate: "06/30/2026",
    status: "Low Stock",
  },
  {
    id: 4,
    item: "Surgical Gloves",
    category: "Supplies",
    stock: "1500 Pairs",
    price: 5,
    supplier: "MedEquip Inc.",
    expiryDate: "03/01/2027",
    status: "In Stock",
  },
  {
    id: 5,
    item: "Syringes (5ml)",
    category: "Supplies",
    stock: "850 Units",
    price: 3,
    supplier: "MedEquip Inc.",
    expiryDate: "01/15/2027",
    status: "In Stock",
  },
];

const columns: Column<InventoryItem>[] = [
  {
    key: "item",
    label: "Item",
  },
  {
    key: "category",
    label: "Category",
    render: (row) => (
      <Chip
        label={row.category}
        size="small"
        sx={{
          bgcolor: row.category === "Medicine" ? "#d1fae5" : "#e0f2fe",
          color: "#065f46",
          fontWeight: 600,
        }}
      />
    ),
  },
  {
    key: "stock",
    label: "Stock",
  },
  {
    key: "price",
    label: "Price",
    render: (row) => `₹ ${row.price}`,
  },
  {
    key: "supplier",
    label: "Supplier",
  },
  {
    key: "expiryDate",
    label: "Expiry Date",
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <Typography
        fontWeight={600}
        sx={{
          color:
            row.status === "In Stock"
              ? "success.main"
              : row.status === "Low Stock"
              ? "warning.main"
              : "error.main",
        }}
      >
        {row.status}
      </Typography>
    ),
  },
  // {
  //   key: "id",
  //   label: "Actions",
  //   render: (row) => (
  //     // <IconButton 
  //     //   onClick={() => console.log("Share:", row)}
  //     //   sx={{ color: "gray" }}
  //     // >
  //     //   <SendIcon sx={{ fontSize: 20, transform: "rotate(-30deg)" }} />
  //     // </IconButton>
  //   ),
  // },
  {
    key: "id",
    label: "Actions",
    render: (row) => (
      /* FAKT ITHE SHARE ACTION CALL KARA */
       <ShareMenu itemName={row.item} />
    ),
  },
];

    
export default function InventoryList() {
    
    
  return (
    <Box sx={{ boxShadow: 2, padding: 2, borderRadius: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography sx={{ fontSize: 20 }}>Inventory Purchase Details</Typography>
        
      </Box>
      <UniversalTable<InventoryItem>
        data={inventoryData}
        columns={columns}
        // caption="Inventory List"
        showSearch
        showExport
        enableCheckbox
        rowsPerPage={5}
        getRowId={(row) => row.id}
        onDeleteSelected={(rows) => {
          console.log("Deleted rows:", rows);
        }}
      />
    </Box>
  );
}
