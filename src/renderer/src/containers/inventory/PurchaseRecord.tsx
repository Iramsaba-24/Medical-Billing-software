import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { ACTION_KEY, Column, UniversalTable } from "@/components/uncontrolled/UniversalTable";
import { useEffect, useState } from "react";
import { showConfirmation, showSnackbar } from "@/components/uncontrolled/ToastMessage";

type ReorderHistoryItem = {
  itemId: string;
  itemName: string;
  qty: number;
  pricePerUnit: number;
  totalAmount: number;
  expiryDate: string;
  purchasedAt: string;
  gst: "12%";
};

const ReorderList = () => {
  const [data, setData] = useState<ReorderHistoryItem[]>([]);

  const [viewItem, setViewItem] = useState<ReorderHistoryItem | null>(null);

  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("reorderHistory") || "[]");
    setData(existing);
  }, []);

  // delete
  const handleDelete = (row: ReorderHistoryItem) => {
    const updated = data.filter((item) =>
        !(
          item.itemId === row.itemId &&
          item.purchasedAt === row.purchasedAt
        )
    );

    setData(updated);
    localStorage.setItem("reorderHistory", JSON.stringify(updated));
    showConfirmation("Delete record?", "Confirm").then((ok) => {
      if (ok) {
        setData(updated);
        showSnackbar("success", "Record deleted successfully");   
      }
    });
  };

  const columns: Column<ReorderHistoryItem>[] = [
    { key: "itemName", label: "Item" },
    { key: "qty", label: "Quantity" },
    { key: "pricePerUnit", label: "MRP",
      render: (row) => `₹ ${row.pricePerUnit}`,
    },
    { key: "gst", label: "GST (12%)",
      render: (row) =>
        `₹ ${(row.qty * row.pricePerUnit * 0.12).toFixed(2)}`,
    },
    { key: "totalAmount", label: "Total",
      render: (row) => `₹ ${row.totalAmount.toFixed(2)}`,
    },
    { key: "expiryDate", label: "Expiry Date" },
    { key: "purchasedAt", label: "Purchased On",
      render: (row) =>
        new Date(row.purchasedAt).toLocaleString(),
    },
    { key: ACTION_KEY, label: "Action" },
  ];

  return (
    <>
      {/* table */}
      <Box sx={{ boxShadow:4, p:{xs:1, md:4}, mt:4 }}>
        <Typography fontSize={20} mb={2}>
          Last Purchases
        </Typography>

        <UniversalTable
          data={data}
          columns={columns}
          rowsPerPage={5}
          textAlign="center"
          actions={{
            view: (row) => setViewItem(row), 
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
          <Typography fontSize={20} fontWeight={600} m={2}>
            Purchase Details
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} px={4}>
            <Box
              display="flex"
              flexDirection={{ xs: "column", md: "row" }}
              gap={{ xs: 2, md: 20 }}
              mb={4}
              px={4}
            >
              <Typography>
                <strong>Item</strong>
                <br />
                {viewItem?.itemName}
              </Typography>

              <Typography>
                <strong>Quantity</strong>
                <br />
                {viewItem?.qty}
              </Typography>

              <Typography>
                <strong>MRP</strong>
                <br />₹{viewItem?.pricePerUnit}
              </Typography>
            </Box>

            {/* purchase info */}
            <Box
              display="flex"
              flexDirection={{ xs:"column", md: "row" }}
              gap={{ xs:2, md:      20 }}
              mb={4}
              px={4}
            >
              <Typography>
                <strong>Total</strong>
                <br />₹{viewItem?.totalAmount}
              </Typography>

              <Typography>
                <strong>Purchased On</strong>
                <br />
                {viewItem &&
                  new Date(viewItem.purchasedAt).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            size="small"
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

export default ReorderList;
