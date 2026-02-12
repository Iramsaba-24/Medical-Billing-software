import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { ACTION_KEY, Column, UniversalTable } from "@/components/uncontrolled/UniversalTable";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export type InventoryItem = {
  itemName: string;
  itemId: string;
  category: string;
  stockQty: number;
  pricePerUnit: number;
  gst: "12%";
  expiryDate: string;
  supplier: string;
};

const InventoryList = () => {
  const [tableData, setTableData] = useState<InventoryItem[]>([]); 
  const [viewItem, setViewItem] = useState<InventoryItem | null>(null); 

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

  // delete
  const handleDelete = (item: InventoryItem) => {
    const updated = tableData.filter((i) => i.itemId !== item.itemId);
    setTableData(updated);
    localStorage.setItem("inventory", JSON.stringify(updated));
  };

  // status based on quantity
  const getStatus = (qty: number) => {
    if (qty === 0) return "Out of Stock";
    if (qty <= 10) return "Low Stock";
    return "In Stock";
  };

  // status color
  const getStatusColor = (qty: number) => {
    if (qty === 0) return "error.main";
    if (qty <= 10) return "warning.main";
    return "success.main";
  };
  
  const columns: Column<InventoryItem>[] = [
    { key: "itemName", label: "Item" },
    { key: "category", label: "Category" },
    { key: "stockQty", label: "Stock" },
    { key: "pricePerUnit", label: "Price",
      render: (row) => `₹ ${row.pricePerUnit}`, 
    },
    { key: "supplier", label: "Supplier" },
    { key: "expiryDate", label: "Expiry Date" },
    { key: "status", label: "Status",
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
      <Box sx={{ boxShadow: {xs:1, md:4}, p: {xs:1, md:4}, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" mb={4}>
          <Typography sx={{fontSize: { xs:"16", md:"20" }, }}>Inventory List</Typography>

          {/* add inventory button */}
          <Button
            variant="contained"
            sx={{
              px: 4,
              py: 1,
              width: { xs:"50%", md:"20%" },             
              textTransform: "none",
              backgroundColor: "#1b7f6b",
            }}
            onClick={() => navigate("/inventory/add-inventory-item")}
          >
            + Add Inventory Item
          </Button>
        </Box>

        {/* table */}
        <UniversalTable
          data={tableData}
          columns={columns}
          tableSize="small"
          rowsPerPage={5}
          actions={{
            view: setViewItem, 
            delete: handleDelete, 
          }}
        />
      </Box>

      {/* view dialog box */}
      <Dialog
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography p={2} fontSize={20} fontWeight={600}>
            {viewItem?.itemName} 
          </Typography>
        </DialogTitle>

        <DialogContent>
          {/* Item details */}
          <Box display="flex"
            flexDirection={{ xs:"column", md:"row" }}
            gap={{ xs:2, md:20 }}
            mb={4}
            px={4}>
            <Typography><strong>Item ID</strong><br /> {viewItem?.itemId}</Typography>
            <Typography><strong>Category</strong> <br /> {viewItem?.category}</Typography>
            <Typography><strong>Expiry Date</strong> <br /> {viewItem?.expiryDate}</Typography>
          </Box>

          <Box display="flex"
            flexDirection={{ xs:"column", md:"row" }}
            gap={{ xs:2, md:20 }}
            mb={2}
            px={4}>
            <Typography>
              <strong>Quantity</strong> <br />{viewItem?.stockQty}
            </Typography>
            <Typography>
              <strong>GST</strong> <br />12%
            </Typography>
            <Typography>
              <strong>Supplier</strong> <br />{viewItem?.supplier}
            </Typography>
          </Box>

          <Typography px={4}>
            <strong>Status</strong>
            <Typography
              sx={{ color: getStatusColor(viewItem?.stockQty ?? 0) }}
            >
              {viewItem && getStatus(viewItem.stockQty)}
            </Typography>
          </Typography>
        </DialogContent>

        {/* Close button */}
        <DialogActions>
          <Button
            sx={{
              px: 2.5,
              minWidth: 100,
              backgroundColor: "#238878",
              color: "#fff",
              border: "2px solid #238878",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#fff",
                color: "#238878",
              },
            }}
            onClick={() => setViewItem(null)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InventoryList;
