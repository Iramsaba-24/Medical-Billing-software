import { useEffect, useState } from "react";
import {
  Box, Paper, Typography,
} from "@mui/material";
import { getMedicines, type MedicineResponse } from "@/service/medicineService";
import {
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
   
  const fetchMedicineData = async () => {
    try {
      const medicines: MedicineResponse[] = await getMedicines();
 
      const latestPurchases = medicines.slice(0, 5).map((item) => ({
        id: item.medicineId,
        supplier: item.distributorName || "-",
        medicineName: item.medicineName,
        strengthType: item.strength || "-",
        quantity: item.totalStockTablets.toString(),
        [ACTION_KEY]: "",
      }));
 
      setLastPurchaseData(latestPurchases);
    } catch (error) {
      console.error("Medicine fetch failed:", error);
    }
  };
 
  useEffect(() => {
    fetchMedicineData();
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
 