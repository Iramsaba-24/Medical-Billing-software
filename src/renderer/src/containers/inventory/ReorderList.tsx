import { useEffect, useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import {
  UniversalTable,
  ACTION_KEY,
  type Column,
} from "@/components/uncontrolled/UniversalTable";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import { getExistingReorders } from "@/service/reorderService";
import LastPurchaseList from "@/containers/inventory/LastPurchaseList";
import ApproveOrderDialog from "@/containers/inventory/ApproveOrderDialog";
import NewOrderList from "@/containers/inventory/NewOrderList";
type ReorderMedicine = {
  medicineName: string;
  strength: string;
  companyName: string;
  qty: number;
};

type ReorderHistory = {
  id: number;
  createdAt: string;
  companyName: string;
  medicineName: string;
  strength: string;
  qty: number;
  existingMedicines: ReorderMedicine[];
};

function ReorderList() {
  const navigate = useNavigate();
  const [approveOrder, setApproveOrder] = useState<ReorderHistory | null>(null);

  const [reorderHistory, setReorderHistory] = useState<ReorderHistory[]>([]);

  const fetchReorderHistory = async () => {
    try {
      const data = await getExistingReorders();
      setReorderHistory(data);
    } catch (error) {
      console.error("Reorder history fetch failed:", error);
    }
  };
  const [refreshKey, setRefreshKey] = useState(0);

  const columns: Column<ReorderHistory>[] = [
    {
      key: "companyName",
      label: "Supplier",
    },
    {
      key: "medicineName",
      label: "Medicine Name",
    },
    {
      key: "strength",
      label: "Strength/Type",
    },
    {
      key: "qty",
      label: "Qty",
    },
    {
      key: ACTION_KEY,
      label: "Action",
    },
  ];

  useEffect(() => {
    fetchReorderHistory();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        p: { xs: 1, sm: 2 },
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Paper
          sx={{
            width: "100%",
            borderRadius: 2,
            p: { xs: 1, sm: 2 },
            overflowX: "auto",
            boxSizing: "border-box",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            flexDirection={{ xs: "column", sm: "row" }}
            gap={1}
            mb={1.5}
          >
            <Typography fontWeight={700} mb={1.5} fontSize={{ xs: 16, sm: 20 }}>
              {" "}
              Reorder List
            </Typography>
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                sx={{ textTransform: "none", backgroundColor: "#238878" }}
                onClick={() => navigate(URL_PATH.Inventory)}
              >
                Home
              </Button>
            </Box>
          </Box>
          <UniversalTable<ReorderHistory>
            data={reorderHistory}
            columns={columns}
            rowsPerPage={5}
            tableSize="small"
            textAlign="center"
            getRowId={(row) => row.id}
            actions={{
              view: (order) =>
                navigate(URL_PATH.ReorderEmail, {
                  state: {
                    distributor: order.companyName,
                    email: "",
                    medicines: [
                      {
                        medicineRowId: 1,
                        medicineName: order.medicineName,
                        strengthType: order.strength,
                        quantity: order.qty,
                      },
                      ...(order.existingMedicines ?? []).map((m, idx) => ({
                        medicineRowId: idx + 2,
                        medicineName: m.medicineName,
                        strengthType: m.strength,
                        quantity: m.qty,
                      })),
                    ],
                    isViewMode: true,
                  },
                }),
              CheckIcon: (order) => {
                setApproveOrder(order);
              },
            }}
          />
        </Paper>
        <ApproveOrderDialog
          open={!!approveOrder}
          onClose={() => setApproveOrder(null)}
          orderType="existing"
          onSuccess={(order, medicines) => {
            setRefreshKey((k) => k + 1);
            fetchReorderHistory();
            setApproveOrder(null);

            // Navigate to edit inventory with medicine data
            navigate(URL_PATH.AddInventoryItem, {
              state: {
                reorderEditMode: true,
                orderId: order.id,
                companyName: order.companyName,
                medicines: medicines.map((m) => ({
                  medicineName: m.medicineName,
                  strength: m.strength,
                  qty: m.qty,
                  amount: String(m.paidAmount + m.unPaidAmount),
                })),
              },
            });
          }}
          order={
            approveOrder
              ? {
                  id: approveOrder.id,
                  companyName: approveOrder.companyName || "",
                  newMedicines: [
                    {
                      id: approveOrder.id,
                      medicineName: approveOrder.medicineName,
                      strength: approveOrder.strength,
                      qty: approveOrder.qty,
                    },
                  ],
                }
              : null
          }
        />

        <NewOrderList />
        <LastPurchaseList key={refreshKey} />
      </Box>{" "}
    </Box>
  );
}

export default ReorderList;
