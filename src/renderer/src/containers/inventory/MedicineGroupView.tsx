import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";
import { UniversalTable, Column } from "@/components/uncontrolled/UniversalTable";
import { getMedicines } from "@/service/medicineService";



type InventoryItem = {
  itemName: string;
  medicineId: number;
  medicineGroup: string;
  groupId: number;
  quantity: number;
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
const { groupName } = useParams<{ groupName: string }>();
  const [items, setItems] = useState<InventoryItem[]>([]);


useEffect(() => {
  const fetchData = async () => {
    try {
      if (!groupName) return;
      const all: InventoryItem[] = await getMedicines();
      const filtered = all.filter((m: InventoryItem) => m.groupId === Number(groupName));
      setItems(filtered);
    } catch (err) {
      console.error(err);
    }
  };
  fetchData();
}, [groupName]);

  const columns: Column<InventoryItem>[] = [
    { key: "itemName", label: "Item Name" },
    { key: "medicineId", label: "Item ID" },
    { key: "quantity", label: "Stock Qty" },
    { key: "pricePerUnit", label: "Price" },
    { key: "status", label: "Status",
       render: (row) => (
        <Typography fontWeight={500} color={getStatusColor(row.quantity)}>
          {getStatus(row.quantity)}
        </Typography>
      ),
    },
  ];

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
    <Typography fontSize={20} fontWeight={600} mb={2}>
      {groupName}
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