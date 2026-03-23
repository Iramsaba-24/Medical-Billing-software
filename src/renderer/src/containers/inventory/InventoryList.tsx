 import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
 
export type InventoryItem = {
  itemName: string;
  itemId: string;
  medicineGroup: string;
  stockQty: number;
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
        stockQty: Number(item.stockQty),
      })
    );
 
    setTableData(parsed);
  }, []);
 
  // DELETE
  const handleDelete = (item: InventoryItem) => {
    showConfirmation("Delete item?", "Confirm").then((ok) => {
      if (!ok) return;
 
      const updated = tableData.filter(
        (i) => i.itemId !== item.itemId
      );
 
      setTableData(updated);
      localStorage.setItem("inventory", JSON.stringify(updated));
 
      //  notify Alerts
      window.dispatchEvent(new Event("inventoryUpdated"));
 
      showSnackbar("success", "Item deleted successfully");
    });
  };
 
  // SAVE EDIT
  const handleSaveEdit = () => {
    if (!editItem) return;
 
    const updated = tableData.map((item) =>
      item.itemId === editItem.itemId ? editItem : item
    );
 
    setTableData(updated);
    localStorage.setItem("inventory", JSON.stringify(updated));
 
    // notify Alerts
    window.dispatchEvent(new Event("inventoryUpdated"));
 
    showSnackbar("success", "Item updated successfully");
    setEditItem(null);
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
    { key: "stockQty", label: "Stock" },
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
        <Typography fontWeight={500} color={getStatusColor(row.stockQty)}>
          {getStatus(row.stockQty)}
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
            <>
              <Typography>{viewItem.itemName}</Typography>
              <Typography>{viewItem.expiryDate}</Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
 
      {/* EDIT */}
      <Dialog open={!!editItem} onClose={() => setEditItem(null)}>
        <DialogTitle>Edit Item</DialogTitle>
 
        <DialogContent>
          {editItem && (
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Item Name"
                value={editItem.itemName}
                onChange={(e) =>
                  setEditItem({
                    ...editItem,
                    itemName: e.target.value,
                  })
                }
              />
 
              <TextField
                label="Stock"
                type="number"
                value={editItem.stockQty}
                onChange={(e) =>
                  setEditItem({
                    ...editItem,
                    stockQty: Number(e.target.value),
                  })
                }
              />
            </Box>
          )}
        </DialogContent>
 
        <DialogActions>
          <Button onClick={() => setEditItem(null)}>Cancel</Button>
          <Button onClick={handleSaveEdit}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
 
export default InventoryList;
 
 
 
 