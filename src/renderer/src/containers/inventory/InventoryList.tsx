


import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  ACTION_KEY,
  Column,
  UniversalTable,
} from "@/components/uncontrolled/UniversalTable";
import { useEffect, useState } from "react";
import {
  showConfirmation,
  showSnackbar,
} from "@/components/uncontrolled/ToastMessage";
import EditInventoryItem from "@/containers/inventory/EditInventoryItem";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";
import axios from "axios";
import { deleteMedicine } from "@/service/medicineService";

export type InventoryItem = {
  itemName: string;
  medicineId: number;
  // batchNumber: number; 
  medicineGroup: string;
  groupId: number;
  unit: string;
  quantity: number;
  pricePerUnit: number;
  expiryDate: string;
  supplier: string;
  distributorId: number;
  hsnCode: string;
  gst: string;
};

type MedicineApi = {
  medicineId: number;
  medicineName: string;
  totalStockTablets: number;
  mrpPerStrip: number;
  gstPercent: number;
  expiryDate: string;

  groupId: number;
  distributorId: number;

  type: string;
  hsnCode?: string;
};

type GroupApi = {
  groupId: number;
  groupName: string;
};

type DistributorApi = {
  distributorId: number;
  companyName: string;
};

const InventoryList = () => {
  const [tableData, setTableData] = useState<InventoryItem[]>([]);
  const [viewItem, setViewItem] = useState<InventoryItem | null>(null);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: token ? `Bearer ${token}` : "" };

      const [medRes, groupRes, distRes] = await Promise.all([
        axios
          .get<{ data: MedicineApi[] }>(API_ENDPOINTS.MEDICINE, { headers })
          .catch((e) =>
            axios.isAxiosError(e) && e.response?.status === 404
              ? { data: { data: [] as MedicineApi[] } }
              : Promise.reject(e)
          ),

        axios
          .get<{ data: GroupApi[] }>(API_ENDPOINTS.MEDICINE_GROUP, {
            headers,
          })
          .catch((e) =>
            axios.isAxiosError(e) && e.response?.status === 404
              ? { data: { data: [] as GroupApi[] } }
              : Promise.reject(e)
          ),

        axios
          .get<{ data: DistributorApi[] }>(API_ENDPOINTS.DISTRIBUTOR, {
            headers,
          })
          .catch(() => ({
            data: { data: [] as DistributorApi[] },
          })),
      ]);

      const medicines = medRes.data?.data || [];
      const groups = groupRes.data?.data || [];
      const distributorsData = Array.isArray(distRes.data)
        ? distRes.data
        : distRes.data?.data || [];

      const groupMap: Record<number, string> = {};
      groups.forEach((g) => {
        groupMap[g.groupId] = g.groupName;
      });

      const distributorMap: Record<number, string> = {};
      distributorsData.forEach((d: DistributorApi) => {
        distributorMap[Number(d.distributorId)] = d.companyName;
      });

     const formatted: InventoryItem[] = medicines.map((item) => ({
  itemName: item.medicineName,
  medicineId: item.medicineId,

  medicineGroup: groupMap[item.groupId] || "N/A",
  groupId: item.groupId,

  unit: item.type || "N/A", 

  quantity: item.totalStockTablets, 

  pricePerUnit: item.mrpPerStrip, 

  expiryDate: item.expiryDate.split("T")[0],

  supplier: distributorMap[item.distributorId] || "N/A",
  distributorId: item.distributorId,

  gst: `${item.gstPercent}%`, 

  hsnCode: item.hsnCode || "-",
}));

      setTableData(formatted);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // DELETE
  const handleDelete = (item: InventoryItem) => {
    showConfirmation("Delete item?", "Confirm").then(async (ok) => {
      if (!ok) return;
      try {
        await deleteMedicine(item.medicineId);
        setTableData((prev) =>
          prev.filter((i) => i.medicineId !== item.medicineId)
        );
        showSnackbar("success", "Item deleted successfully");
      } catch (err) {
        showSnackbar("error", "Delete failed");
      }
    });
  };

  const getStatus = (qty: number) => {
    if (qty === 0) return "Out of Stock";
    if (qty <= 10) return "Low Stock";
    return "In Stock";
  };

  const getStatusColor = (qty: number) => {
    if (qty === 0) return "error.main";
    if (qty <= 10) return "warning.main";
    return "success.main";
  };

  //  UPDATED COLUMNS
  const columns: Column<InventoryItem>[] = [
    { key: "itemName", label: "Medicine Name" },
    { key: "medicineGroup", label: "Group" },
    { key: "quantity", label: "Stock" },
    {
      key: "pricePerUnit",
      label: "Price",
      render: (row) => `₹ ${row.pricePerUnit}`,
    },
    { key: "hsnCode", label: "HSN Number" },
    { key: "supplier", label: "Supplier" },
    { key: "expiryDate", label: "Expiry Date" },

    //  NEW COLUMN
    // { key: "batchNumber", label: "Batch Number" },

    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Typography fontWeight={500} color={getStatusColor(row.quantity)}>
          {getStatus(row.quantity)}
        </Typography>
      ),
    },
    { key: ACTION_KEY, label: "Action" },
  ];

  return (
    <>
      <Box sx={{ boxShadow: 3, p: 3, borderRadius: 2 }}>
        <Typography fontSize={20} fontWeight={600} mb={2}>
          Inventory List
        </Typography>

        <UniversalTable
          data={tableData}
          columns={columns}
          rowsPerPage={5}
          actions={{
            view: setViewItem,
            edit: setEditItem,
            delete: handleDelete,
          }}
        />
      </Box>

      {/* VIEW */}
      <Dialog open={!!viewItem} onClose={() => setViewItem(null)}>
        <DialogTitle>View Item</DialogTitle>
        <DialogContent>
          {viewItem && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography>Item: {viewItem.itemName}</Typography>
              {/* <Typography>Batch: {viewItem.batchNumber}</Typography> */}
              <Typography>Qty: {viewItem.quantity}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewItem(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <EditInventoryItem
        open={!!editItem}
        onClose={() => {
          setEditItem(null);
          fetchInventory();
        }}
        item={editItem}
      />
    </>
  );
};

export default InventoryList;