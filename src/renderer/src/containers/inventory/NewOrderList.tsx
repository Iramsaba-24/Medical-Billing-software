import { useEffect, useState } from "react";
import {Box,  Paper, Typography,Table, TableBody, TableCell, TableHead, TableRow, IconButton,} from "@mui/material";
import { Visibility, Check } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import { getMedicines, type MedicineResponse } from "@/service/medicineService";

type StockRow = {
  id: number;
  supplier: string;
  medicineName: string;
  strengthType: string;
  quantity: string;
};

function NewOrderList() {
  const navigate = useNavigate();
  const [newOrderData, setNewOrderData] = useState<StockRow[]>([]);

  const fetchMedicineData = async () => {
    try {
      const medicines: MedicineResponse[] = await getMedicines();

      const latestOrders = medicines.slice(0, 5).map((item) => ({
        id: item.medicineId,
        supplier: item.distributorName || "-",
        medicineName: item.medicineName,
        strengthType: item.strength || "-",
        quantity: item.totalStockTablets.toString(),
      }));

      setNewOrderData(latestOrders);
    } catch (error) {
      console.error("Medicine fetch failed:", error);
    }
  };

  useEffect(() => {
    fetchMedicineData();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>

      {/* New Order Table */}
      <Paper sx={{ borderRadius: 2, p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Typography fontWeight={700}>New Order List</Typography>
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
            {newOrderData.length > 0 ? (
              newOrderData.map((row, index) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{ "&:hover": { bgcolor: "#e6f4ea" } }}
                >
                  <TableCell><Typography fontSize={13}>{index + 1}</Typography></TableCell>
                  <TableCell><Typography fontSize={13}>{row.supplier}</Typography></TableCell>
                  <TableCell><Typography fontSize={13}>{row.medicineName}</Typography></TableCell>
                  <TableCell><Typography fontSize={13}>{row.strengthType}</Typography></TableCell>
                  <TableCell><Typography fontSize={13}>{row.quantity}</Typography></TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          navigate(URL_PATH.ReorderForm, {
                            state: { medicines: [row] },
                          })
                        }
                        sx={{ color: "#1976d2" }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() =>
                          setNewOrderData((prev) =>
                            prev.filter((item) => item.id !== row.id)
                          )
                        }
                        sx={{ color: "#2e7d32" }}
                      >
                        <Check fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography fontSize={13} color="text.secondary">
                    No new orders found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

    </Box>
  );
}

export default NewOrderList;