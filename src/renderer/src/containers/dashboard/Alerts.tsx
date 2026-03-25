
import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import WarningSign from "@/assets/warning-sign.svg";
import { InventoryItem } from "@/containers/inventory/InventoryList";

type InventoryWithDate = Omit<InventoryItem, "expiryDate"> & {
  expiryDate: Date;
};

const Alerts = () => {
  const [inventory, setInventory] = useState<InventoryWithDate[]>([]);

  const [expiryDays, setExpiryDays] = useState<number>(90);
  const [showAllExpiry, setShowAllExpiry] = useState(false);
  const [showLowStock, setShowLowStock] = useState(false);
  const [showReorder, setShowReorder] = useState(false);
  const [lowStockLimit, setLowStockLimit] = useState(30);

  

  useEffect(() => {
    const storedInventory = localStorage.getItem("inventory");
    if (!storedInventory) return;

    const parsed: InventoryWithDate[] = JSON.parse(storedInventory).map(
      (item: InventoryItem) => ({
        ...item,
        stockQty: Number(item.stockQty),
        expiryDate: new Date(item.expiryDate),
      })
    );

    setInventory(parsed);
  }, []);

  //  INVENTORY SETTINGS (low stock / reorder)
  useEffect(() => {
    const settingsStr = localStorage.getItem("inventorySettings");
    if (!settingsStr) return;

    // const settings = JSON.parse(settingsStr);

    const settings = settingsStr ? JSON.parse(settingsStr) : {};

    setLowStockLimit(Number(settings.lowStockThreshold) || 30);

    setShowLowStock(settings.alertsVisibility?.includes("alert1"));
    setShowReorder(settings.alertsVisibility?.includes("alert2"));
  }, []);

  //  DASHBOARD SETTINGS 
  useEffect(() => {
  const settingsStr = localStorage.getItem("dashboardSettings");
  if (!settingsStr) return;

  const settings = JSON.parse(settingsStr);

  const expirySelections: string[] = settings.expiryAlerts || [];

  // Show all
  //if (expirySelections.includes("showAll")) {
  if (expirySelections.includes("showExpiryOnDashboard")) {
    setShowAllExpiry(true);
    setExpiryDays(0);
    return;
  }

  //  Selected days logic
  const selectedDays = expirySelections
    .filter((v) => ["30", "60", "90"].includes(v))
    .map(Number);

  if (selectedDays.length > 0) {
    setShowAllExpiry(false);
    setExpiryDays(Math.max(...selectedDays));
  } else {
    setShowAllExpiry(false);
    setExpiryDays(90);
  }
}, []);
  // FILTERS
  const lowStock = inventory.filter(
    (item) => item.stockQty <= lowStockLimit
  );

  const reorderStock = inventory.filter(
    (item) => item.stockQty <= 10
  );

  const today = new Date();

  

  //  EXPIRY COUNTDOWN FUNCTION
  const getExpiryText = (date: Date) => {
    const diffDays = Math.ceil(
      (date.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );

    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Expires today";
    if (diffDays === 1) return "Expires in 1 day";

    return `Expires in ${diffDays} days`;
  };const expiryAlerts = inventory.filter((item) => {
  const diffDays =
    (item.expiryDate.getTime() - today.getTime()) /
    (1000 * 3600 * 24);

  if (diffDays < 0) return false;

  if (showAllExpiry) return true;

  return diffDays <= expiryDays;
});

  return (
    <Paper sx={{ py: 2, px: 4, pb: 8, mb: 4, maxHeight: 400, overflowY: "auto" }}>
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

      {/* LOW STOCK */}
      {showLowStock && (
        <>
          <Typography fontWeight={700} sx={{ mt: 2, mb: 1 }}>
            Low Stock Alerts ({lowStock.length})
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
        </>
      )}

      {/* REORDER */}
      {showReorder && (
        <>
          <Typography fontWeight={700} sx={{ mt: 2, mb: 1 }}>
            Reorder Suggested ({reorderStock.length})
          </Typography>

          {reorderStock.length > 0 ? (
            reorderStock.map((item) => (
              <Box key={item.itemId}>
                <Typography>
                  {item.itemName} should be reordered.
                </Typography>
              </Box>
            ))
          ) : (
            <Typography color="text.secondary">
              No reorder alerts.
            </Typography>
          )}

          <hr />
        </>
      )}

      {/* EXPIRY */}
      <Typography fontWeight={700} sx={{ mt: 2, mb: 1 }}>
        Expiry Alerts ({expiryAlerts.length})
      </Typography>

      {expiryAlerts.length > 0 ? (
        expiryAlerts.map((item) => (
          <Box key={item.itemId}>
            <Typography>
              {item.itemName} will expire on{" "}
              {item.expiryDate.toLocaleDateString()} —{" "}
              <strong>{getExpiryText(item.expiryDate)}</strong>
            </Typography>
          </Box>
        ))
      ) : (
        <Typography color="text.secondary">
          No items expiring within {expiryDays} days.
        </Typography>
      )}
    </Paper>
  );
};

export default Alerts;
 
 