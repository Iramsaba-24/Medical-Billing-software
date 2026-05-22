import { useEffect, useState } from "react";
import {Box, Paper, Typography,} from "@mui/material";
import { deletePurchaseHistory, getPurchaseHistory } from "@/service/reorderService";
import {UniversalTable,ACTION_KEY,type Column,} from "@/components/uncontrolled/UniversalTable";
import { showConfirmation, showSnackbar } from "@/components/uncontrolled/ToastMessage";
 
type StockRow = {
  id: number;
  supplier: string;
  medicineName: string;
  strengthType: string;
  quantity: string;
    paidAmount: string;   
  unpaidAmount: string;
  [ACTION_KEY]: string;
};
 
// Last Purchase columns
const purchaseColumns: Column<StockRow>[] = [
  { key: "supplier", label: "Supplier" },
  { key: "medicineName", label: "Medicine Name" },
  { key: "strengthType", label: "Strength/Type" },
  { key: "quantity", label: "Quantity" },
    { key: "paidAmount", label: "Paid (₹)" },    
  { key: "unpaidAmount", label: "Unpaid (₹)" },
  { key: ACTION_KEY, label: "Action" },
];
 
function LastPurchaseList() {
 
  const [lastPurchaseData, setLastPurchaseData] = useState<StockRow[]>([]);
 
   const purchaseActions = {
    view: (row: StockRow) => console.log("View", row),
    delete: (row: StockRow) => handleDeletePurchase(row),
  };
 
   
const fetchLastPurchaseData = async () => {
  try {
    const data = await getPurchaseHistory();

    const mapped: StockRow[] = data.map((item, idx) => ({
      id: item.id ?? idx,
      supplier: item.companyName || "-",      
      medicineName: item.medicineName || "-",
      strengthType: item.strength || "-",
      quantity: item.qty?.toString() || "-",
      paidAmount: item.paidAmount?.toString() || "0",
      unpaidAmount: item.unPaidAmount?.toString() || "0",
      [ACTION_KEY]: "",
    }));

    setLastPurchaseData(mapped);
  } catch (error) {
    console.error("Last purchase fetch failed:", error);
  }
};
 
  useEffect(() => {
    fetchLastPurchaseData();
  }, []);


  const handleDeletePurchase = async (row: StockRow) => {
  const ok = await showConfirmation("Delete purchase history?", "Confirm");
  if (ok) {
    try {
      await deletePurchaseHistory(row.id);
      showSnackbar("success", "Purchase history deleted successfully");
      await fetchLastPurchaseData();
    } catch (error) {
      console.error("Delete failed:", error);
      showSnackbar("error", "Delete failed");
    }
  }
};
 
 
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
 