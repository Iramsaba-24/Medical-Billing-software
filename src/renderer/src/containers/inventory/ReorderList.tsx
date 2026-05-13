import { useEffect, useState } from "react";
import {
  Box, Button, Paper, Typography,
  Table, TableBody, TableCell, TableHead, TableRow, IconButton,Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import { Visibility, Check } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";
import NewOrderList from "@/containers/inventory/NewOrderList";
import LastPurchaseList from "@/containers/inventory/LastPurchaseList";
import {
  ACTION_KEY,
} from "@/components/uncontrolled/UniversalTable";

import {
  getMedicines,
  type MedicineResponse,
} from "@/service/medicineService";

type StockRow = {
  id: number;
  supplier: string;
  medicineName: string;
  strengthType: string;
  quantity: string;
  [ACTION_KEY]: string;
};
//ReorderHistory types
type ReorderMedicine = {
  medicineName: string;
  strength: string;
  companyName: string;
  qty: number;
};

type ReorderHistory = {
  id: number;
  distributorName: string;
  createdAt: string;
  existingMedicines: ReorderMedicine[];
  orderType: "reorder" | "neworder"; 
};

function ReorderList() {
  const navigate = useNavigate();
  const [lastPurchaseData, setLastPurchaseData] = useState<StockRow[]>([]);
  const [reorderHistory, setReorderHistory] = useState<ReorderHistory[]>([]);
  const [viewOrder, setViewOrder] = useState<ReorderHistory | null>(null);
const fetchReorderHistory = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(API_ENDPOINTS.REORDER, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const allData: ReorderHistory[] = res.data || [];

    // existingMedicines filter for reorder
    const filtered = allData.filter(
      (item) => item.existingMedicines && item.existingMedicines.length > 0
    );

    setReorderHistory(filtered);
  } catch (error) {
    console.error("Reorder history fetch failed:", error);
  }
};

  // useEffect(() => {
  //   fetchReorderHistory(); 
  // }, []);
const fetchMedicineData = async () => {
  try {
    // const medicines = await getMedicines();
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
  fetchReorderHistory();
  fetchMedicineData();
}, []);
const handleCloseDialog = () => {
  if (viewOrder) {
    const newRows: StockRow[] = viewOrder.existingMedicines.map(
      (med, index) => ({
        id: Date.now() + index,
        supplier: viewOrder.distributorName,
        medicineName: med.medicineName,
        strengthType: med.strength || "-",
        quantity: med.qty.toString(),
        [ACTION_KEY]: "",
      })
    );

    setLastPurchaseData((prev) => [...newRows, ...prev]);
  }

  setViewOrder(null);
};
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>

      <Paper sx={{ borderRadius: 2, p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Typography fontWeight={700}>Reorder List</Typography>
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              sx={{ textTransform: "none", backgroundColor: "#238878" }}
              onClick={() => navigate(URL_PATH.Inventory)}>
              Home
            </Button>
          </Box>
        </Box>

        <Table size="small">
          <TableHead>
            <TableRow>
              {["Sr No", "Supplier", "Medicine Name", "Strength/Type", "Qty", "Action"].map((head) => (
                <TableCell
                  key={head}
                  sx={{
                    fontWeight: 700,
                    bgcolor: "#444748ff",
                    color: "#ffffff",
                    whiteSpace: "nowrap",
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {reorderHistory.length > 0 ? (
              reorderHistory.map((order, index) =>
                order.existingMedicines.map((med, i) => (
                  <TableRow
                    key={`${order.id}-${i}`}
                    hover
                    sx={{ "&:hover": { bgcolor: "#e6f4ea" } }}
                  >
                    {i === 0 && (
                      <TableCell rowSpan={order.existingMedicines.length}>
                        <Typography fontSize={13}>{index + 1}</Typography>
                      </TableCell>
                    )}
                    {i === 0 && (
                      <TableCell rowSpan={order.existingMedicines.length}>
                        <Typography fontSize={13}>{order.distributorName}</Typography>
                      </TableCell>
                    )}
                    <TableCell>
                      <Typography fontSize={13}>{med.medicineName}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontSize={13}>{med.strength || "-"}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontSize={13}>{med.qty}</Typography>
                    </TableCell>
                    {i === 0 && (
                      <TableCell rowSpan={order.existingMedicines.length}>
                        <Box display="flex" gap={1}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              navigate(URL_PATH.ReorderEmail, {
                                state: {
                                  distributor: order.distributorName,
                                  email: "",
                                  medicines: order.existingMedicines.map((med, index) => ({
                                    medicineRowId: index + 1,
                                    medicineName: med.medicineName,
                                    strengthType: med.strength,
                                    quantity: med.qty,
                                  })),
                                  isViewMode: true,
                                },
                              })
                            }
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
<IconButton
  size="small"
  color="success"
  onClick={() => setViewOrder(order)}
>
  <Check fontSize="small" />
</IconButton>
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )
            ) : (
              // if there is no reorder history
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography fontSize={13} color="text.secondary">
                    No reorder data found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <NewOrderList />
      {/* <LastPurchaseList /> */}
      <LastPurchaseList lastPurchaseData={lastPurchaseData} />
      {/* View Dialog */}
<Dialog
  open={!!viewOrder}
  onClose={() => setViewOrder(null)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>Reorder Details</DialogTitle>
  <DialogContent>
    {viewOrder && (
      <Box px={2} py={1} display="flex" flexDirection="column" gap={2}>
        
        <Box display="flex" gap={4}>
          <Box>
            <Typography fontWeight={600}>Supplier</Typography>
            <Typography>{viewOrder.distributorName}</Typography>
          </Box>
        </Box>

        <Typography fontWeight={600} mt={1}>Medicines:</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Sr No</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Medicine Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Strength/Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Qty</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {viewOrder.existingMedicines.map((med, i) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{med.medicineName}</TableCell>
                <TableCell>{med.strength || "-"}</TableCell>
                <TableCell>{med.qty}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </Box>
    )}
  </DialogContent>
  <DialogActions>
    <Button
      // onClick={() => setViewOrder(null)}
      onClick={handleCloseDialog}
      variant="contained"
      sx={{ backgroundColor: "#238878", textTransform: "none" }}
    >
      Ok
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
}

export default ReorderList;