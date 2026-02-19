import { Box, Typography, Button } from "@mui/material";
import { Column, UniversalTable } from "@/components/uncontrolled/UniversalTable";
import { useEffect, useState } from "react";
import ReorderDialog from "@/containers/inventory/ReorderDialog";
import PurchaseRecord from "@/containers/inventory/PurchaseRecord";

type InventoryItem = {
  itemName: string;
  itemId: string;
  stockQty: number;
  pricePerUnit: number;
  expiryDate: string;
  gst: "12%";
  status: "In Stock" | "Low Stock" | "Out of Stock";
};

const Reorder = 10;

const ReorderList = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);

  const [openItem, setOpenItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    const inventory = JSON.parse(localStorage.getItem("inventory") || "[]");

    setItems(
      inventory
        .map((item: InventoryItem) => ({
          ...item,
          stockQty: Number(item.stockQty),
        }))
        .filter((item: InventoryItem) => item.stockQty < Reorder)
    );
  }, []);

  //  submit
  const handleReorderSubmit = (reorderQty: number, expiryDate: string) => {
    if (!openItem) return;

    const inventory = JSON.parse(localStorage.getItem("inventory") || "[]");

    // update stock quantity
      const updatedInventory = inventory.map((item: InventoryItem) =>
      item.itemId === openItem.itemId
        ? {
            ...item,
            stockQty: Number(item.stockQty) + Number(reorderQty),
          }
        : item
    );

    localStorage.setItem("inventory", JSON.stringify(updatedInventory));

    const history =
      JSON.parse(localStorage.getItem("reorderHistory") || "[]");

    // add new reorder record
    history.unshift({
      itemId: openItem.itemId,
      itemName: openItem.itemName,
      qty: reorderQty,
      pricePerUnit: openItem.pricePerUnit,
      totalAmount: reorderQty * openItem.pricePerUnit * 1.12,
      expiryDate,
      purchasedAt: new Date().toISOString(),
      gst: "12%",
    });

    localStorage.setItem("reorderHistory", JSON.stringify(history));

    // update reorder list
    setItems(
      updatedInventory.filter(
        (item: InventoryItem) => item.stockQty < Reorder
      )
    );

    setOpenItem(null);
  };

  const columns: Column<InventoryItem>[] = [
    { key: "itemName", label: "Item" },
    { key: "stockQty", label: "Stock" },
    { key: "pricePerUnit", label: "MRP" },
    { key: "gst", label: "GST (12%)",
      render: (row) => `₹ ${(row.pricePerUnit * 0.12).toFixed(2)}`,
    },
    { key: "total", label: "Total",
      render: (row) => `₹ ${(row.pricePerUnit * 1.12).toFixed(2)}`,
    },
    { key: "reorder", label: "Reorder",
      render: (row) => (
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
          onClick={() => setOpenItem(row)}
        >
          Reorder
        </Button>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ boxShadow: 4, p:{xs:1, md:4} }}>
        <Typography fontSize={20} mb={2}>
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

      <PurchaseRecord />
    </>
  );
};

export default ReorderList;
