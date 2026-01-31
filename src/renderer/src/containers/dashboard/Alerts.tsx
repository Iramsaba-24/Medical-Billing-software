import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import WarningSign from "@/assets/warning-sign.svg";
import { InventoryItem } from "@/containers/inventory/InvetoryList";

const Alerts = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("inventory");

    if (!stored) {
      setInventory([]);
      return;
    }
    const parsed: InventoryItem[] = JSON.parse(stored).map(
      (item: InventoryItem) => ({
        ...item,
        stockQty: Number(item.stockQty),
      })
    );

    setInventory(parsed);
  }, []);

  const lowStock = inventory.filter(
    (item) => item.stockQty > 0 && item.stockQty <= 10
  );

  const outOfStock = inventory.filter(
    (item) => item.stockQty === 0
  );

  const reorderStock = inventory.filter(
    (item) => item.stockQty <= 10
  );

  return (  
    <Paper sx={{ py: 2, px: 4,  pb: 8,  mb: 4,
            maxHeight: 300,  overflowY: "auto"
        }}
        >
      <Typography
        fontSize={18}
        fontWeight={700}
        sx={{ mb: 2 }}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        Alerts
        <Box component="img" src={WarningSign} width={24} />
      </Typography>

      <hr />

      {/* Low Stock */}
      <Typography fontWeight={700} sx={{ mt: 2, mb: 1 }}>
        🔴 Low Stock Alerts ({lowStock.length})
      </Typography>

      {lowStock.length > 0 ? (
        lowStock.map((item) => (
          <Box key={item.itemId}>
            <Typography>
              {item.itemName} is running low — only {item.stockQty} left.
            </Typography>
          </Box>
        ))
      ) : (
        <Typography color="text.secondary">
          No low stock items.
        </Typography>
      )}

      <hr />

      {/* Out of Stock */}
      <Typography fontWeight={700} sx={{ mt: 2, mb: 1 }}>
        ⛔ Out of Stock ({outOfStock.length})
      </Typography>

      {outOfStock.length > 0 ? (
        outOfStock.map((item) => (
          <Box key={item.itemId}>
            <Typography>
              {item.itemName} is currently out of stock.
            </Typography>
          </Box>
        ))
      ) : (
        <Typography color="text.secondary">
          No out of stock items.
        </Typography>
      )}

      <hr />

      {/* Reorder */}
      <Typography fontWeight={700} sx={{ mt: 2, mb: 1 }}>
        🔁 Reorder Suggested ({reorderStock.length})
      </Typography>

      {reorderStock.length > 0 ? (
        reorderStock.map((item) => (
          <Box key={item.itemId}>
            <Typography>
              Based on current stock levels, {item.itemName} should be reordered.
            </Typography>
          </Box>
        ))
      ) : (
        <Typography color="text.secondary">
          No reorder alerts.
        </Typography>
      )}
    </Paper>
  );
};

export default Alerts;
