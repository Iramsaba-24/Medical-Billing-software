import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";
import { UniversalTable, Column } from "@/components/uncontrolled/UniversalTable";

type InventoryItem = {
  itemName: string;
  itemId: string;
  medicineGroup: string;
  stockQty: number;
  pricePerUnit: number;
  expiryDate: string;
  supplier: string;
  status: string;
};

  // status based on quantity
  const getStatus = (qty: number) => {
    if (qty === 0) return "Out of Stock";
    if (qty <= 10) return "Low Stock";
    return "In Stock";
  };

  // status color
  const getStatusColor = (qty: number) => {
    if (qty === 0) return "error.main";
    if (qty <= 10) return "warning.main";
    return "success.main";
  };

export default function MedicineGroupDetails() {
  const { groupName } = useParams();
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const inventory: InventoryItem[] =
      JSON.parse(localStorage.getItem("inventory") || "[]");

    const filtered = inventory.filter(
      (item) => item.medicineGroup === groupName
    );

    setItems(filtered);
  }, [groupName]);

  const columns: Column<InventoryItem>[] = [
    { key: "itemName", label: "Item Name" },
    { key: "itemId", label: "Item ID" },
    { key: "stockQty", label: "Stock Qty" },
    { key: "pricePerUnit", label: "Price" },
    { key: "status", label: "Status",
       render: (row) => (
        <Typography fontWeight={500} color={getStatusColor(row.stockQty)}>
          {getStatus(row.stockQty)}
        </Typography>
      ),
    },
  ];

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
    <Typography fontSize={20} fontWeight={600} mb={2}>
      {groupName} {}
    </Typography>


      <UniversalTable
        data={items}
        columns={columns}
        tableSize="small"
        rowsPerPage={5}
      />
    </Paper>
  );
}
