import { useEffect, useState } from "react";
import {
  UniversalTable,
  ACTION_KEY,
  type Column,
} from "@/components/uncontrolled/UniversalTable";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";
import ApproveOrderDialog from "./ApproveOrderDialog";
import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
 
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
  [ACTION_KEY]: string;
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
 
 
  const columns: Column<NewOrderHistory>[] = [
  {
    key: "id",
    label: "Sr No",
    render: (row) => row.id,
  },
 
  {
    key: "distributorName",
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
  subRows={{
    key: "newMedicines",
    columns: [
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
    ],
  }}
  actions={{
  view: (order) =>
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
    }),
 
  CheckIcon: (order) => setSelectedOrder(order),
}}
/>
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
 
