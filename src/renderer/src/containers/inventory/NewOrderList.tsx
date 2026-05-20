import { useEffect, useState } from "react";
import {UniversalTable,ACTION_KEY,type Column,} from "@/components/uncontrolled/UniversalTable";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import { getNewReorders } from "@/service/reorderService";
import ApproveOrderDialog from "./ApproveOrderDialog";
import { Box, Paper, Typography } from "@mui/material";
 
type NewMedicine = {
  id: number;
  medicineName: string;
  strength: string;
  qty: number;
};
 
type NewOrderHistory = {
  id: number;
  companyName: string;
  newMedicines: NewMedicine[];
  medicineName: string;
  strength: string;
  qty: number;
};
 
function NewOrderList() {
  const navigate = useNavigate();
  const [newOrderData, setNewOrderData] = useState<NewOrderHistory[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<NewOrderHistory | null>(
    null,
  );
  const fetchNewOrders = async () => {
    try {
      const data = await getNewReorders();
      console.log("NEW ORDER DATA:", JSON.stringify(data, null, 2));
const flatData = data
  .filter((item) => item.newMedicines && item.newMedicines.length > 0)
  .flatMap((item) =>
    item.newMedicines.map((m) => ({
      id: m.id,
      companyName: item.companyName,
      newMedicines: item.newMedicines,
      medicineName: m.medicineName,
      strength: m.strength,
      qty: m.qty,
    }))
  );
setNewOrderData(flatData);
    } catch (error) {
      console.error("New order fetch failed:", error);
    }
  };
 
 
  const columns: Column<NewOrderHistory>[] = [
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
    fetchNewOrders();
  }, []);
 
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        p: { xs: 1, sm: 2 },
      }}
    >
      <Paper
        sx={{
          borderRadius: 2,
          p: { xs: 1, sm: 2 },
          overflowX: "auto",
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
          <Typography fontWeight={700}>New Order List</Typography>
        </Box>
 
        <UniversalTable<NewOrderHistory, NewMedicine>
          data={newOrderData}
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
                  medicines: order.newMedicines.map((m, idx) => ({
                    medicineRowId: idx + 1,
                    medicineName: m.medicineName,
                    strengthType: m.strength,
                    quantity: m.qty,
                  })),
                  isViewMode: true,
                },
              }),
 
            CheckIcon: (order) => setSelectedOrder(order),
          }}
        />
      </Paper>
      <ApproveOrderDialog
        open={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        orderType="new"
        onSuccess={(order, medicines) => {
          navigate(URL_PATH.AddInventoryItem, {
            state: {
              approveMode: true,
              osubrderId: order.id,
              distributorName: order.companyName,
              medicines: medicines.map((m) => ({
                medicineName: m.medicineName,
                strength: m.strength,
                qty: m.qty,
                amount: String(m.paidAmount + m.unPaidAmount),
              })),
            },
          });
        }}
      />
    </Box>
  );
}
export default NewOrderList;
 
 