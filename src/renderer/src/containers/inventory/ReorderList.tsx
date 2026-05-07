import { useEffect, useState } from "react";
import {
  Box, Button, Paper, Typography,
  Table, TableBody, TableCell, TableHead, TableRow, IconButton,
} from "@mui/material";
import { Visibility, Check } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";
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
};

// Last Purchase columns
const purchaseColumns: Column<StockRow>[] = [
  { key: "supplier", label: "Supplier" },
  { key: "medicineName", label: "Medicine Name" },
  { key: "strengthType", label: "Strength/Type" },
  { key: "quantity", label: "Quantity" },
  { key: ACTION_KEY, label: "Action" },
];

function ReorderList() {
  const navigate = useNavigate();

  const [lowStockData, setLowStockData] = useState<StockRow[]>([]);
  const [lastPurchaseData, setLastPurchaseData] = useState<StockRow[]>([]);
  const [reorderHistory, setReorderHistory] = useState<ReorderHistory[]>([]);

  const purchaseActions = {
    view: (row: StockRow) => console.log("View", row),
  };

 

  const fetchMedicineData = async () => {
    try {
      const medicines: MedicineResponse[] = await getMedicines();

      const lowStockMedicines = medicines
        .filter((item) => Number(item.totalStockTablets) <= Number(item.minimumQuantity))
        .map((item) => ({
          id: item.medicineId,
          supplier: item.distributorName || "-",
          medicineName: item.medicineName,
          strengthType: item.strength || "-",
          quantity: item.totalStockTablets.toString(),
          [ACTION_KEY]: "",
        }));

      const latestPurchases = medicines.slice(0, 5).map((item) => ({
        id: item.medicineId,
        supplier: item.distributorName || "-",
        medicineName: item.medicineName,
        strengthType: item.strength || "-",
        quantity: item.totalStockTablets.toString(),
        [ACTION_KEY]: "",
      }));

      setLowStockData(lowStockMedicines);
      setLastPurchaseData(latestPurchases);
    } catch (error) {
      console.error("Medicine fetch failed:", error);
    }
  };

  const fetchReorderHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_ENDPOINTS.REORDER, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReorderHistory(res.data || []);
    } catch (error) {
      console.error("Reorder history fetch failed:", error);
    }
  };

  useEffect(() => {
    fetchMedicineData();
    fetchReorderHistory();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>

      {/* Low Stock */}
      <Paper sx={{ borderRadius: 2, p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Typography fontWeight={700}>Low Stock List</Typography>
          <Box display="flex" gap={1}>
           
            <Button
              variant="contained"
              sx={{ textTransform: "none", backgroundColor: "#238878" }}
              onClick={() => navigate(URL_PATH.Inventory)}>
              Home
            </Button>
          </Box>
        </Box>

        {/* Custom Table */}
        <Table size="small">
          <TableHead>
  <TableRow>
    {[
      "Sr No",
      "Supplier",
      "Medicine Name",
      "Strength/Type",
      "Qty",
      "Action",
    ].map((head) => (
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
 sx={{
  "&:hover": { bgcolor: "#e6f4ea" },
}}
>
          {/* Sr No */}
          {i === 0 && (
            <TableCell rowSpan={order.existingMedicines.length}>
              <Typography fontSize={13}>
                {index + 1}
              </Typography>
            </TableCell>
          )}

          {/* Supplier */}
          {i === 0 && (
            <TableCell rowSpan={order.existingMedicines.length}>
              <Typography fontSize={13}>
                {order.distributorName}
              </Typography>
            </TableCell>
          )}

          {/* Medicine */}
          <TableCell>
            <Typography fontSize={13}>
              {med.medicineName}
            </Typography>
          </TableCell>

          {/* Strength */}
          <TableCell>
            <Typography fontSize={13}>
              {med.strength || "-"}
            </Typography>
          </TableCell>

          {/* Qty */}
          <TableCell>
            <Typography fontSize={13}>
              {med.qty}
            </Typography>
          </TableCell>

          {/* Action */}
          {i === 0 && (
            <TableCell rowSpan={order.existingMedicines.length}>
              <Box display="flex" gap={1}>
                <IconButton size="small" color="primary">
                  <Visibility fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  color="success"
                  onClick={() =>
                    setReorderHistory((prev) =>
                      prev.filter((o) => o.id !== order.id)
                    )
                  }
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
      
             
              lowStockData.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell><Typography fontSize={13}>{index + 1}</Typography></TableCell>
                  <TableCell><Typography fontSize={13}>{row.supplier}</Typography></TableCell>
                  <TableCell><Typography fontSize={13}>{row.medicineName}</Typography></TableCell>
                  <TableCell><Typography fontSize={13}>{row.strengthType}</Typography></TableCell>
                  <TableCell><Typography fontSize={13}>{row.quantity}</Typography></TableCell>
               <TableCell>
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    gap={1}
  >
    {/* Reorder */}
    <IconButton
      size="small"
      onClick={() =>
        navigate(URL_PATH.ReorderForm, {
          state: {
            medicines: [row],
          },
        })
      }
      sx={{
        color: "#1976d2",
      }}
    >
      <Visibility fontSize="small" />
    </IconButton>

    {/* Complete */}
    <IconButton
      size="small"
      onClick={() =>
        setLowStockData((prev) =>
          prev.filter((item) => item.id !== row.id)
        )
      }
      sx={{
        color: "#2e7d32",
      }}
    >
      <Check fontSize="small" />
    </IconButton>
  </Box>
</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Last Purchase */}
      <Paper sx={{ borderRadius: 2, p: 2 }}>
        <Typography fontWeight={700} mb={1.5}>Last Purchase</Typography>
        <UniversalTable
          data={lastPurchaseData}
          columns={purchaseColumns}
          getRowId={(row) => row.id}
          actions={purchaseActions}
          tableSize="small"
          rowsPerPage={5}
        />
      </Paper>

    </Box>
  );
}

export default ReorderList;