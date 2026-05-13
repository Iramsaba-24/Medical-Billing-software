import { useEffect, useState } from "react";
import {
  Box, Paper, Typography, Table, TableBody, TableCell,
  TableHead, TableRow, IconButton,
} from "@mui/material";
import { Visibility, Check } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";
import ApproveOrderDialog from "./ApproveOrderDialog"; // adjust path

type NewMedicine = {
  id: number;
  medicineName: string;
  strength: string;
  qty: number;
};

type NewOrderHistory = {
  id: number;
  distributorName: string;
  distributorId: number;
  newMedicines: NewMedicine[];
};

function NewOrderList() {
  const navigate = useNavigate();
  const [newOrderData, setNewOrderData] = useState<NewOrderHistory[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<NewOrderHistory | null>(null);

  const fetchNewOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_ENDPOINTS.REORDER, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("=== REORDER API RESPONSE ===", JSON.stringify(res.data));

      const allData: NewOrderHistory[] = res.data || [];
      setNewOrderData(
        allData.filter((item) => item.newMedicines && item.newMedicines.length > 0)
      );
    } catch (error) {
      console.error("New order fetch failed:", error);
    }
  };

  useEffect(() => {
    fetchNewOrders();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>
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
                  sx={{ fontWeight: 700, bgcolor: "#444748ff", color: "#ffffff", whiteSpace: "nowrap" }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {newOrderData.length > 0 ? (
              newOrderData.map((order, index) =>
                order.newMedicines.map((med, i) => (
                  <TableRow key={`${order.id}-${i}`} hover sx={{ "&:hover": { bgcolor: "#e6f4ea" } }}>
                    {i === 0 && (
                      <TableCell rowSpan={order.newMedicines.length}>
                        <Typography fontSize={13}>{index + 1}</Typography>
                      </TableCell>
                    )}
                    {i === 0 && (
                      <TableCell rowSpan={order.newMedicines.length}>
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
                      <TableCell rowSpan={order.newMedicines.length}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <IconButton
                            size="small"
                            onClick={() =>
                              navigate(URL_PATH.ReorderEmail, {
                                state: {
                                  distributor: order.distributorName,
                                  email: "",
                                  medicines: order.newMedicines.map((m, idx) => ({
                                    medicineRowId: idx + 1,
                                    medicineName: m.medicineName,
                                    strengthType: m.strength,
                                    quantity: m.qty,
                                  })),
                                  isViewMode: true,
                                },
                              })
                            }
                            sx={{ color: "#1976d2" }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            onClick={() => setSelectedOrder(order)}
                            sx={{ color: "#2e7d32" }}
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

      <ApproveOrderDialog
        open={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </Box>
  );
}

export default NewOrderList;