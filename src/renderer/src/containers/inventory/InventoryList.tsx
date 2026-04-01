import {Box,Button,Typography,Dialog,DialogTitle,DialogContent,DialogActions} from "@mui/material";
import {ACTION_KEY,Column,UniversalTable,} from "@/components/uncontrolled/UniversalTable";
import { useEffect, useState } from "react";
import {showConfirmation,showSnackbar,} from "@/components/uncontrolled/ToastMessage";
import EditInventoryItem from "@/containers/inventory/EditInventoryItem";

export type InventoryItem = {
  itemName: string;
  medicineId: number;
  medicineGroup: string;
  quantity: number;
  pricePerUnit: number;
  gst: "12%";
  expiryDate: string;
  supplier: string;
};

const InventoryList = () => {
  const [tableData, setTableData] = useState<InventoryItem[]>([]);
  const [viewItem, setViewItem] = useState<InventoryItem | null>(null);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("inventory");
    if (!stored) return setTableData([]);

    const parsed: InventoryItem[] = JSON.parse(stored).map(
      (item: InventoryItem) => ({
        ...item,
        quantity: Number(item.quantity),
      }),
    );
    setTableData(parsed);
  }, []);

  // DELETE
  const handleDelete = (item: InventoryItem) => {
    showConfirmation("Delete item?", "Confirm").then((ok) => {
      if (!ok) return;

      const updated = tableData.filter((i) => i.medicineId !== item.medicineId);

      setTableData(updated);
      localStorage.setItem("inventory", JSON.stringify(updated));

      window.dispatchEvent(new Event("inventoryUpdated"));

      showSnackbar("success", "Item deleted successfully");
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
        onClose={() => setEditItem(null)}
        item={editItem}
        tableData={tableData}
        setTableData={setTableData}
      />
    </>
  );
};

export default InventoryList;
