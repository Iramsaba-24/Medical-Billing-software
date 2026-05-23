
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";
import { UniversalTable, Column } from "@/components/uncontrolled/UniversalTable";
import { getMedicines, MedicineResponse } from "@/service/medicineService";

type MedicineRow = MedicineResponse & Record<string, unknown>;

const getStatus = (qty: number) => {
  if (qty === 0) return "Out of Stock";
  if (qty <= 10) return "Low Stock";
  return "In Stock";
};

const getStatusColor = (qty: number) => {
  if (qty === 0) return "error.main";
  if (qty <= 10) return "warning.main";
  return "success.main";
};

export default function MedicineGroupDetails() {
const { groupId, groupName } = useParams<{ groupId: string; groupName: string }>();
  const [items, setItems] = useState<MedicineRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!groupId) return;
        const all: MedicineRow[] = await getMedicines();
        const filtered = all.filter((m) => m.groupId === Number(groupId));
        setItems(filtered);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [groupId]);

  const columns: Column<MedicineRow>[] = [
    { key: "medicineName", label: "Item Name" },
    { key: "medicineId", label: "Item ID" },
    { key: "totalStockTablets", label: "Qty" },
    { key: "purchasePricePerStrip", label: "Purchase Price" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Typography fontWeight={500} color={getStatusColor(row.totalStockTablets as number)}>
          {getStatus(row.totalStockTablets as number)}
        </Typography>
      ),
    },
  ];

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>

      <UniversalTable
        data={items}
        columns={columns}
        tableSize="small"
        rowsPerPage={5}
        caption={groupName ? decodeURIComponent(groupName) : "Group Details"}

      />
    </Paper>
  );
}