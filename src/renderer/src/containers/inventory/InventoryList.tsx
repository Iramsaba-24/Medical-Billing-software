import {Box,Button,Typography,Dialog,DialogTitle,DialogContent,DialogActions} from "@mui/material";
import {ACTION_KEY,Column,UniversalTable,} from "@/components/uncontrolled/UniversalTable";
import { useEffect, useState } from "react";
import {showConfirmation,showSnackbar,} from "@/components/uncontrolled/ToastMessage";
import EditInventoryItem from "@/containers/inventory/EditInventoryItem";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";
import axios from "axios";
import { deleteMedicine } from "@/service/medicineService";

export type InventoryItem = {
  itemName: string;
  medicineId: number;
  medicineGroup: string;
  groupId: number;
  unit: string;        // ← हे add करा
  quantity: number;
  pricePerUnit: number;

  expiryDate: string;

  supplier: string;
  distributorId: number;

  gst: string;
};


type MedicineApi = {
  medicineId: number;
  itemName: string;
  quantity: number;
  pricePerUnit: number;
  expiryDate: string;
  groupId: number;
  distributorId: number;
  gstPercentage: number;
  unit: string;        // ← हे add करा
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

    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
    };

    const [medRes, groupRes, distRes] = await Promise.all([
      axios.get<{ data: MedicineApi[] }>(API_ENDPOINTS.MEDICINE, { headers }),
      axios.get<{ data: GroupApi[] }>(API_ENDPOINTS.MEDICINE_GROUP, { headers }),
      axios.get<{ data: DistributorApi[] }>(API_ENDPOINTS.DISTRIBUTOR, { headers }),
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
      itemName: item.itemName,
      medicineId: item.medicineId,
      medicineGroup: groupMap[item.groupId] || "N/A",
      groupId: item.groupId,
      unit: item.unit || "N/A",
      quantity: item.quantity,
      pricePerUnit: item.pricePerUnit,
      expiryDate: item.expiryDate.split("T")[0],
      supplier: distributorMap[item.distributorId] || "N/A",
      distributorId: item.distributorId,
      gst: `${item.gstPercentage}%`,
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
      setTableData(prev => prev.filter((i) => i.medicineId !== item.medicineId));
      showSnackbar("success", "Item deleted successfully");
    } catch (err) {
      if (err instanceof Error) {
        showSnackbar("error", err.message);
      } else {
        showSnackbar("error", "Delete failed");
      }
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

  const columns: Column<InventoryItem>[] = [
    { key: "itemName", label: "Item" },
    { key: "medicineGroup", label: "Group" },
    { key: "quantity", label: "Stock" },
    {
      key: "pricePerUnit",
      label: "Price",
      render: (row) => `₹ ${row.pricePerUnit}`,
    },
    { key: "supplier", label: "Supplier" },
    { key: "expiryDate", label: "Expiry Date" },
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
      {/* VIEW DIALOG */}
      <Dialog
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>View Item</DialogTitle>

        <DialogContent>
          {viewItem && (
            <Box px={3} py={2} display="flex" flexDirection="column" gap={3}>
              {/* Row 1 */}
              <Box
                display="flex"
                flexDirection="row"
                gap={0}
                alignItems="flex-start"
              >
                <Box width={160}>
                  <Typography fontWeight={600}>Item Name</Typography>
                  <Typography>{viewItem.itemName}</Typography>
                </Box>
                <Box width={130}>
                  <Typography fontWeight={600}>Item ID</Typography>
                  <Typography>{viewItem.medicineId}</Typography>
                </Box>
                <Box>
                  <Typography fontWeight={600}>Expiry Date</Typography>
                  <Typography>{viewItem.expiryDate}</Typography>
                </Box>
              </Box>

              {/* Row 2 */}
              <Box
                display="flex"
                flexDirection="row"
                gap={0}
                alignItems="flex-start"
              >
                <Box width={160}>
                  <Typography fontWeight={600}>Quantity</Typography>
                  <Typography>{viewItem.quantity}</Typography>
                </Box>
                <Box width={130}>
                  <Typography fontWeight={600}>GST</Typography>
                  <Typography>12%</Typography>
                </Box>
                <Box>
                  <Typography fontWeight={600}>Supplier</Typography>
                  <Typography>{viewItem.supplier}</Typography>
                </Box>
              </Box>

              {/* Status */}
              <Box>
                <Typography fontWeight={600}>Status</Typography>
                <Typography sx={{ color: getStatusColor(viewItem.quantity) }}>
                  {getStatus(viewItem.quantity)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setViewItem(null)}
            variant="contained"
            sx={{
              backgroundColor: "#238878",
              color: "#fff",
              textTransform: "none",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <EditInventoryItem
        open={!!editItem}
        onClose={() => {
    setEditItem(null);
    fetchInventory();
  }}
        item={editItem}
        // tableData={tableData}
        // setTableData={setTableData}
      />
    </>
  );
};

export default InventoryList;