
import { useEffect, useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import {
  UniversalTable,
  ACTION_KEY,
  type Column,
} from "@/components/uncontrolled/UniversalTable";
import { iconMap } from "@/utils/Icons";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";

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

const stockColumns: Column<StockRow>[] = [
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

const tableActions: Partial<
  Record<keyof typeof iconMap, (row: StockRow) => void>
> = {
  view: (row) => console.log("View", row),

  CheckIcon: (row) => {
    console.log("Approved:", row);


    setLowStockData((prev) =>
      prev.filter((item) => item.id !== row.id)
    );
  },
};


  const fetchMedicineData = async () => {
    try {
      const medicines: MedicineResponse[] = await getMedicines();

      // low stock medicines
      const lowStockMedicines = medicines
     .filter(
  (item) =>
    Number(item.totalStockTablets) <= Number(item.minimumQuantity)
)
        .map((item) => ({
          id: item.medicineId,
          supplier: item.distributorName || "-",
          medicineName: item.medicineName,
          strengthType: `${item.strength || ""} ${item.type || ""}`,
          quantity: item.totalStockTablets.toString(),
          [ACTION_KEY]: "",
        }));

      // latest purchase data
      const latestPurchases = medicines
        .slice(0, 5)
        .map((item) => ({
          id: item.medicineId,
          supplier: item.distributorName || "-",
          medicineName: item.medicineName,
          strengthType: `${item.strength || ""} ${item.type || ""}`,
          quantity: item.totalStockTablets.toString(),
          [ACTION_KEY]: "",
        }));

      setLowStockData(lowStockMedicines);
      setLastPurchaseData(latestPurchases);
    } catch (error) {
      console.error("Medicine fetch failed:", error);
    }
  };

  useEffect(() => {
    fetchMedicineData();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>
      
      {/* Low Stock */}
      <Paper sx={{ borderRadius: 2, p: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1.5}
        >
          <Typography fontWeight={700}>
            Low Stock List
          </Typography>

          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                borderColor: "#238878",
                color: "#238878",
              }}
            >
              New Order
            </Button>

            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                backgroundColor: "#238878",
              }}
              onClick={() => navigate(URL_PATH.ReorderForm)}
            >
              Reorder
            </Button>
          </Box>
        </Box>

        <UniversalTable
          data={lowStockData}
          columns={stockColumns}
          getRowId={(row) => row.id}
          actions={tableActions}
          tableSize="small"
          rowsPerPage={5}
        />
      </Paper>

      {/* Last Purchase */}
      <Paper sx={{ borderRadius: 2, p: 2 }}>
        <Typography fontWeight={700} mb={1.5}>
          Last Purchase
        </Typography>

        <UniversalTable
          data={lastPurchaseData}
          columns={stockColumns}
          getRowId={(row) => row.id}
          actions={tableActions}
          tableSize="small"
          rowsPerPage={5}
        />
      </Paper>
    </Box>
  );
}

export default ReorderList;