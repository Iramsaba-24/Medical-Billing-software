import {Box,Button,Typography,Dialog,DialogTitle,DialogContent,DialogActions} from "@mui/material";
import {ACTION_KEY,Column,UniversalTable,} from "@/components/uncontrolled/UniversalTable";
import { useEffect, useState } from "react";
import {showConfirmation,showSnackbar,} from "@/components/uncontrolled/ToastMessage";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";
import axios from "axios";
import { deleteMedicine } from "@/service/medicineService";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
export type InventoryItem = {
  srNo: number
  medicineName: string;
  medicineId: number;
  medicineGroup: string;
  groupId: number;
  type: string;        
  totalStockTablets: number;
  pricePerUnit: number;

  expiryDate: string;

  companyName: string;
  distributorId: number;
  hsnCode: string;
  gstPercent: string;
};


type MedicineApi = {
  srNo: number;
  medicineId: number;
  medicineName: string;       
  totalStockTablets: number;
  mrpPerStrip: number;
  expiryDate: string;
  mrpPerTablet: number;
  groupId: number;
  distributorId: number;
  gstPercent: number;
  type: string; 
  hsnCode?: string;       
}

type GroupApi = {
  groupId: number;
  groupName: string;
};

type DistributorApi = {
  distributorId: number;
  ownerName: string;
};


const InventoryList = () => {
  const [tableData, setTableData] = useState<InventoryItem[]>([]);
  const [viewItem, setViewItem] = useState<InventoryItem | null>(null);
  // const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const navigate = useNavigate();

const fetchInventory = async () => {
  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: token ? `Bearer ${token}` : "" };

    const [medRes, groupRes, distRes] = await Promise.all([
      axios.get<{ data: MedicineApi[] }>(API_ENDPOINTS.MEDICINE, { headers })
        .catch(e => axios.isAxiosError(e) && e.response?.status === 404 
          ? { data: { data: [] as MedicineApi[] } } 
          : Promise.reject(e)),

      axios.get<{ data: GroupApi[] }>(API_ENDPOINTS.MEDICINE_GROUP, { headers })
        .catch(e => axios.isAxiosError(e) && e.response?.status === 404 
          ? { data: { data: [] as GroupApi[] } } 
          : Promise.reject(e)),

     axios.get<{ data: DistributorApi[] }>(API_ENDPOINTS.DISTRIBUTOR, { headers })
  .catch(() => ({ data: { data: [] as DistributorApi[] } })),
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
      distributorMap[Number(d.distributorId)] = d.ownerName;
    });

    const formatted: InventoryItem[] = medicines.map((item) => ({
      srNo: item.srNo,
      medicineName: item.medicineName,
      medicineId: item.medicineId,
      medicineGroup: groupMap[item.groupId] || "N/A",
      groupId: item.groupId,
      type: item.type || "N/A",
      totalStockTablets: item.totalStockTablets,
pricePerUnit: item.mrpPerTablet,
      expiryDate: item.expiryDate.split("T")[0],
      companyName: distributorMap[item.distributorId] || "N/A",
      distributorId: item.distributorId,
      gstPercent: `${item.gstPercent}%`,
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
      setTableData(prev => prev.filter((i) => i.medicineId !== item.medicineId));
      window.dispatchEvent(new Event("inventoryUpdated"));
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
  {key:"srNo", label:"Sr.No" },
  { key: "medicineName", label: "Item" },
  { key: "medicineGroup", label: "Group" },
  { key: "totalStockTablets", label: "Stock" },
  {
    key: "pricePerUnit",
    label: "MRP",
    render: (row) => `₹ ${row.pricePerUnit}`,
  },
  { key: "hsnCode", label: "HSN Number" },
  { key: "companyName", label: "Supplier" },
  { key: "expiryDate", label: "Expiry Date" },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <Typography color={getStatusColor(row.totalStockTablets)}>
        {getStatus(row.totalStockTablets)}
      </Typography>
    ),
  },
  { key: ACTION_KEY, label: "Action" },
];

//edit function
// InventoryList.tsx मध्ये हे function add करा
const handleEdit = async (item: InventoryItem) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${API_ENDPOINTS.MEDICINE}/${item.medicineId}`,
      { headers: { Authorization: token ? `Bearer ${token}` : "" } }
    );
    const fullMedicine = res.data.data; // full MedicineResponse
    navigate(URL_PATH.AddInventoryItem, { state: fullMedicine });
  } catch (error) {
    console.error("Error fetching medicine details:", error);
    showSnackbar("error", "Failed to load medicine details");
  }
};

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
// edit: (item) =>
//   navigate(URL_PATH.AddInventoryItem, {
//     state: item,
//   }),
edit: handleEdit,

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
                  <Typography>{viewItem.medicineName}</Typography>
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
                  <Typography>{viewItem.totalStockTablets}</Typography>
                </Box>
                <Box width={130}>
                  <Typography fontWeight={600}>GST</Typography>
                  <Typography>12%</Typography>
                </Box>
                <Box>
                  <Typography fontWeight={600}>Supplier</Typography>
                  <Typography>{viewItem.companyName}</Typography>
                </Box>
              </Box>

              {/* Status */}
              <Box>
                <Typography fontWeight={600}>Status</Typography>
                <Typography sx={{ color: getStatusColor(viewItem.totalStockTablets) }}>
                  {getStatus(viewItem.totalStockTablets)}
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
    </>
  );
};

export default InventoryList;