import { Box, Typography, Button } from "@mui/material";
import { Column, UniversalTable } from "@/components/uncontrolled/UniversalTable";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReorderDialog from "@/containers/inventory/ReorderDialog";
import PurchaseRecord from "@/containers/inventory/PurchaseRecord";
import { URL_PATH } from "@/constants/UrlPath";

type InventoryItem = {
  itemName: string;
  itemId: string;
  stockQty: number;
  pricePerUnit: number;
  gst: "12%";
};

const Reorder = 10;

const ReorderList = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [openItem, setOpenItem] = useState<InventoryItem | null>(null);
 

  const [refreshKey, setRefreshKey] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const inventory =
      JSON.parse(localStorage.getItem("inventory") || "[]");

    setItems(
      inventory
        .map((item: InventoryItem) => ({
          ...item,
          stockQty: Number(item.stockQty),
        }))
        .filter((item: InventoryItem) => item.stockQty < Reorder)
    );
  }, []);

  const handleReorderSubmit = (reorderQty: number) => {
    if (!openItem) return;

    const inventory =
      JSON.parse(localStorage.getItem("inventory") || "[]");

    const updatedInventory =
      inventory.map((item: InventoryItem) =>
        item.itemId === openItem.itemId
          ? {
              ...item,
              stockQty:
                Number(item.stockQty) + Number(reorderQty),
            }
          : item
      );

    localStorage.setItem(
      "inventory",
      JSON.stringify(updatedInventory)
    );

    
    const history =
      JSON.parse(localStorage.getItem("reorderHistory") || "[]");

    history.unshift({
      itemId: openItem.itemId,
      itemName: openItem.itemName,
      qty: reorderQty,
      pricePerUnit: openItem.pricePerUnit,
      totalAmount: reorderQty * openItem.pricePerUnit * 1.12,
      gst: "12%",
      expiryDate: "",
      purchasedAt:new Date().toISOString(),
    });

    localStorage.setItem(
      "reorderHistory",
      JSON.stringify(history)
    );

    setItems(
      updatedInventory.filter(
        (item: InventoryItem) => item.stockQty < Reorder
      )
    );

    setOpenItem(null);

    setRefreshKey(prev => prev + 1);
  };

  const columns: Column<InventoryItem>[] = [
    { key: "itemName", label: "Item" },
    { key: "stockQty", label: "Stock" },
    { key: "pricePerUnit", label: "MRP" },
    {
      key: "gst",
      label: "GST",
      render: (row) =>
        `₹ ${(row.pricePerUnit * 0.12).toFixed(2)}`,
    },
    {
      key: "total",
      label: "Total",
      render: (row) =>
        `₹ ${(row.pricePerUnit * 1.12).toFixed(2)}`,
    },
    {
      key: "reorder",
      label: "Reorder",
      render: (row) => (
        <Button
          size="small"
          sx={{
            backgroundColor: "#238878",
            color: "#fff",
            border: "2px solid #238878",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#fff",
              color: "#238878",
            },
          }}
          onClick={() => setOpenItem(row)}
        >
          Reorder
        </Button>
      ),
    },
  ];

  return (
    <>
      <Box
        display="flex"
        justifyContent="flex-end"
        mb={2}
      >
        <Button
          variant="contained"
          onClick={() =>
            navigate(URL_PATH.Inventory)
          }
          sx={{
            backgroundColor: "#238878",
            color: "#fff",
            border: "2px solid #238878",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#fff",
              color: "#238878",
            },
          }}
        >
          Back to Home
        </Button>
      </Box>
      <Box
        sx={{
          boxShadow: 4,
          p: 4,
        }}
      >
        <Typography
          fontSize={20}
          mb={2}
        >
          Reorder List
        </Typography>
        <UniversalTable
          data={items}
          columns={columns}
          rowsPerPage={5}
          textAlign="center"
        />
        <ReorderDialog
          open={!!openItem}
          itemName={openItem?.itemName || ""}
          onClose={() => setOpenItem(null)}
          onSubmit={handleReorderSubmit}
        />
      </Box>
 
      {/*  key PROP ADDED */}
      <PurchaseRecord key={refreshKey} />
    </>
  );
};

export default ReorderList;
