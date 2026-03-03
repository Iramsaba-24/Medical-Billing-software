import {Box,Button,Typography,Dialog,DialogTitle,DialogContent,DialogActions,TextField,
} from "@mui/material";
import { ACTION_KEY, Column, UniversalTable,
} from "@/components/uncontrolled/UniversalTable";
import { useEffect, useState } from "react";
import {
  showConfirmation,
  showSnackbar,
} from "@/components/uncontrolled/ToastMessage";
import { URL_PATH } from "@/constants/UrlPath";
import { useNavigate } from "react-router-dom";


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
  const navigate = useNavigate();

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
    showSnackbar("success", "Item updated successfully");
    setEditItem(null);
  };

  // STATUS
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
    {key: "status", label: "Status",
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
    <Box display="flex" justifyContent="flex-end" mb={2}>
      <Button
        variant="contained"
        onClick={() => navigate(URL_PATH.Inventory)}
        sx={{
          mr: 5,   
          backgroundColor: "#238878",
          color: "#fff",
          textTransform: "none",
          border: "2px solid #238878",
          "&:hover": {
            backgroundColor: "#fff",
            color: "#238878",
            border: "2px solid #238878",
          },
        }}
      >
         Back to Home
      </Button>
    </Box>
    <Box display="flex" justifyContent="flex-end" mb={2}>
          </Box>
      <Box
        sx={{
          boxShadow: { xs: 1, md: 4 },
          p: { xs: 1, md: 4 },
          borderRadius: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" mb={4}>
          <Typography
    fontSize={{ xs: 18, md: 20 }}
    fontWeight={600}
  >
    Inventory List
  </Typography>
  
  
        </Box>

        <UniversalTable
          data={tableData}
          columns={columns}
          tableSize="small"
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
          flexDirection={{ xs: "column", md: "row" }}
          gap={{ xs: 2, md: 6 }}
        >
          <Box>
            <Typography fontWeight={600}>Item Name</Typography>
            <Typography>{viewItem.itemName}</Typography>
          </Box>

          <Box>
            <Typography fontWeight={600}>Item ID</Typography>
            <Typography>{viewItem.itemId}</Typography>
          </Box>

          <Box>
            <Typography fontWeight={600}>Expiry Date</Typography>
            <Typography>{viewItem.expiryDate}</Typography>
          </Box>
        </Box>

        {/* Row 2 */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          gap={{ xs: 2, md: 6 }}
        >
          <Box>
            <Typography fontWeight={600}>Quantity</Typography>
            <Typography>{viewItem.stockQty}</Typography>
          </Box>

          <Box>
            <Typography fontWeight={600}>GST</Typography>
            <Typography>12%</Typography>
          </Box>

          <Box>
            <Typography fontWeight={600}>Supplier</Typography>
            <Typography>{viewItem.supplier}</Typography>
          </Box>
        </Box>

        {/* Row 3 */}
        <Box>
          <Typography fontWeight={600}>Status</Typography>

          <Typography
            sx={{
              color: getStatusColor(viewItem.stockQty),
            }}
          >
            {getStatus(viewItem.stockQty)}
          </Typography>

        </Box>

      </Box>
    )}
  </DialogContent>

  <DialogActions
    sx={{
      justifyContent: "flex-end", pr: 3}}
  >
    <Button
      onClick={() => setViewItem(null)}
      variant="contained"
      sx={{
        backgroundColor: "#238878",
        color: "#fff",
        border: "2px solid #238878",
        textTransform: "none",
        "&:hover": {
          backgroundColor: "#fff",
          color: "#238878",
          border: "2px solid #238878",
        },
      }}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>
      {/* EDIT DIALOG */}
      <Dialog
        open={!!editItem}
        onClose={() => setEditItem(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Item</DialogTitle>

        <DialogContent>
          {editItem && (
            <Box display="flex" flexDirection="column" gap={2} mt={2}>
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
                label="Stock Quantity"
                type="number"
                value={editItem.stockQty}
                onChange={(e) =>
                  setEditItem({
                    ...editItem,
                    stockQty: Number(e.target.value),
                  })
                }
              />

              <TextField
                label="Price"
                type="number"
                value={editItem.pricePerUnit}
                onChange={(e) =>
                  setEditItem({
                    ...editItem,
                    pricePerUnit: Number(e.target.value),
                  })
                }
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setEditItem(null)}
            variant="contained"
            sx={{
              backgroundColor: "#238878",
              color: "#fff",
              border: "2px solid #238878",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#fff",
                color: "#238878",
                border: "2px solid #238878",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            sx={{
              backgroundColor: "#238878",
              color: "#fff",
              border: "2px solid #238878",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#fff",
                color: "#238878",
                border: "2px solid #238878",
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InventoryList;