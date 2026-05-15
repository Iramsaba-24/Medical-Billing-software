import { useEffect, useState } from "react";
import {
  Box, Paper, Typography,
} from "@mui/material";
import { getLastPurchases } from "@/service/reorderService";import {
  UniversalTable,
  ACTION_KEY,
  type Column,
} from "@/components/uncontrolled/UniversalTable";
 
type StockRow = {
  id: number;
  supplier: string;
  medicineName: string;
  strengthType: string;
  quantity: string;
  [ACTION_KEY]: string;
};
 
// Last Purchase columns
const purchaseColumns: Column<StockRow>[] = [
  { key: "supplier", label: "Supplier" },
  { key: "medicineName", label: "Medicine Name" },
  { key: "strengthType", label: "Strength/Type" },
  { key: "quantity", label: "Quantity" },
  { key: ACTION_KEY, label: "Action" },
];
 
function LastPurchaseList() {
//   const navigate = useNavigate();
 
  const [lastPurchaseData, setLastPurchaseData] = useState<StockRow[]>([]);
 
  const purchaseActions = {
    view: (row: StockRow) => console.log("View", row),
  };
   
const fetchLastPurchaseData = async () => {
  try {
    const data = await getLastPurchases();
    console.log("RAW DATA:", data);
    console.log("TYPE:", typeof data);

    const mapped: StockRow[] = [];

    data.forEach((order) => {
      order.existingMedicines
        .filter((med) => med.medicineName)
        .forEach((med, idx) => {
          mapped.push({
            id: order.id * 100 + idx,
            supplier: order.distributorName || "-",
            medicineName: med.medicineName,
            strengthType: med.strength || "-",
            quantity: med.qty?.toString() || "-",
            [ACTION_KEY]: "",
          });
        });
    });

    setLastPurchaseData(mapped);
  } catch (error) {
    console.error("Last purchase fetch failed:", error);
  }
};
 
  useEffect(() => {
    fetchLastPurchaseData();
  }, []);
 
  return (
   <Box
  sx={{
    display: "flex",
    flexDirection: "column",
    gap: 3,
   p: { xs: 0.5, sm: 2 },
  }}
>
 
      {/* Last Purchase */}
    <Paper
  sx={{
    borderRadius: 2,
    p: { xs: 1, sm: 2 },
    overflowX: "auto",
    boxShadow: 4,
  }}
>
        <Typography
  fontWeight={700}
  mb={1.5}
  fontSize={{ xs: 16, sm: 20 }}
>Last Purchase</Typography>
       <UniversalTable
  data={lastPurchaseData}
  columns={purchaseColumns}
  getRowId={(row) => row.id}
  actions={purchaseActions}
  tableSize="small"
  rowsPerPage={5}
  textAlign="center"
/>
      </Paper>
 
    </Box>
  );
}
export default LastPurchaseList;
 