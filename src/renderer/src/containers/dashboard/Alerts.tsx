// import { Box, Paper, Typography } from "@mui/material";
// import { useEffect, useState } from "react";
// import WarningSign from "@/assets/warning-sign.svg";
// import { InventoryItem } from "@/containers/inventory/InventoryList";

// const Alerts = () => {
//   const [inventory, setInventory] = useState<InventoryItem[]>([]);

//   useEffect(() => {
//     const stored = localStorage.getItem("inventory");

//     if (!stored) {
//       setInventory([]);
//       return;
//     }
//     const parsed: InventoryItem[] = JSON.parse(stored).map(
//       (item: InventoryItem) => ({
//         ...item,
//         stockQty: Number(item.stockQty),
//       })
//     );

//     setInventory(parsed);
//   }, []);

//   const lowStock = inventory.filter(
//     (item) => item.stockQty > 10 && item.stockQty <= 20
//   );

//   const outOfStock = inventory.filter(
//     (item) => item.stockQty === 0
//   );

//   const reorderStock = inventory.filter(
//     (item) => item.stockQty <= 10
//   );

//   return (  
//     <Paper sx={{ py: 2, px: 4,  pb: 8,  mb: 4, maxHeight: 300, overflowY: "auto" }}>
//       <Typography
//         fontSize={18}
//         fontWeight={700}
//         sx={{ mb: 2 }}
//         display="flex"
//         alignItems="center"
//         justifyContent="space-between"
//       >
//         Alerts
//         <Box component="img" src={WarningSign} width={24} />
//       </Typography>

//       <hr />

//       {/* Low Stock */}
//       <Typography fontWeight={700} sx={{ mt: 2, mb: 1 }}>
//          Low Stock Alerts ({lowStock.length})
//       </Typography>

//       {lowStock.length > 0 ? (
//         lowStock.map((item) => (
//           <Box key={item.itemId}>
//             <Typography>
//               {item.itemName} is running low — only {item.stockQty} left.
//             </Typography>
//           </Box>
//         ))
//       ) : (
//         <Typography color="text.secondary">
//           No low stock items.
//         </Typography>
//       )}

//       <hr />

//       {/* Out of Stock */}
//       <Typography fontWeight={700} sx={{ mt: 2, mb: 1 }}>
//          Out of Stock ({outOfStock.length})
//       </Typography>

//       {outOfStock.length > 0 ? (
//         outOfStock.map((item) => (
//           <Box key={item.itemId}>
//             <Typography>
//               {item.itemName} is currently out of stock.
//             </Typography>
//           </Box>
//         ))
//       ) : (
//         <Typography color="text.secondary">
//           No out of stock items.
//         </Typography>
//       )}

//       <hr />

//       {/* Reorder */}
//       <Typography fontWeight={700} sx={{ mt: 2, mb: 1 }}>
//          Reorder Suggested ({reorderStock.length})
//       </Typography>

//       {reorderStock.length > 0 ? (
//         reorderStock.map((item) => (
//           <Box key={item.itemId}>
//             <Typography>
//               Based on current stock levels, {item.itemName} should be reordered.
//             </Typography>
//           </Box>
//         ))
//       ) : (
//         <Typography color="text.secondary">
//           No reorder alerts.
//         </Typography>
//       )}
//     </Paper>
//   );
// };

// export default Alerts;


// import { Box, Paper, Typography } from "@mui/material";
// import { useEffect, useState } from "react";
// import WarningSign from "@/assets/warning-sign.svg";
// import { InventoryItem } from "@/containers/inventory/InventoryList";
 
// type InventoryWithDate = Omit<InventoryItem, "expiryDate"> & { expiryDate: Date };
 
// const Alerts = () => {
//   const [inventory, setInventory] = useState<InventoryWithDate[]>([]);
//   const [expiryDays, setExpiryDays] = useState<number>(30);
//   const [showAllExpiry, setShowAllExpiry] = useState(false);
 
//   // load inventory from localStorage
//   useEffect(() => {
//     const storedInventory = localStorage.getItem("inventory");
 
//     if (!storedInventory) return;
 
//     const parsed: InventoryWithDate[] = JSON.parse(storedInventory).map(
//       (item: InventoryItem) => ({
//         ...item,
//         stockQty: Number(item.stockQty),
//         expiryDate: new Date(item.expiryDate),
//       })
//     );
 
//     setInventory(parsed);
//   }, []);
 
//   // load dashboard settings
//   useEffect(() => {
//     const settingsStr = localStorage.getItem("dashboardSettings");
 
//     if (!settingsStr) return;
 
//     const settings = JSON.parse(settingsStr);
 
//     if (!settings.expiryAlerts) return;
 
//     if (settings.expiryAlerts.includes("Show Expiry Alert on Dashboard")) {
//       setShowAllExpiry(true);
//       return;
//     }
 
//     if (settings.expiryAlerts.includes("90")) setExpiryDays(90);
//     else if (settings.expiryAlerts.includes("60")) setExpiryDays(60);
//     else if (settings.expiryAlerts.includes("30")) setExpiryDays(30);
//   }, []);
 
//   // stock alerts
//   const lowStock = inventory.filter((item) => item.stockQty > 10 && item.stockQty <= 20);
//   const outOfStock = inventory.filter((item) => item.stockQty === 0);
//   const reorderStock = inventory.filter((item) => item.stockQty <= 10);
 
//   const today = new Date();
 
//   const expiryAlerts = inventory.filter((item) => {
//     const diffDays =
//       (item.expiryDate.getTime() - today.getTime()) /
//       (1000 * 3600 * 24);
 
//     if (showAllExpiry) return true;
 
//     return diffDays >= 0 && diffDays <= expiryDays;
//   });
 
//   return (
//     <Paper sx={{ py: 2, px: 4, pb: 8, mb: 4, maxHeight: 400, overflowY: "auto" }}>
//       <Typography
//         fontSize={18}
//         fontWeight={700}
//         sx={{ mb: 2 }}
//         display="flex"
//         alignItems="center"
//         justifyContent="space-between"
//       >
//         Alerts
//         <Box component="img" src={WarningSign} width={24} />
//       </Typography>
 
//       <hr />
 
//       {/* Low Stock */}
//       <Typography fontWeight={700} sx={{ mt: 2, mb: 1 }}>
//         Low Stock Alerts ({lowStock.length})
//       </Typography>
 
//       {lowStock.length > 0 ? (
//         lowStock.map((item) => (
//           <Box key={item.itemId}>
//             <Typography>
//               {item.itemName} is running low — only {item.stockQty} left.
//             </Typography>
//           </Box>
//         ))
//       ) : (
//         <Typography color="text.secondary">No low stock items.</Typography>
//       )}
 
//       <hr />
 
//       {/* Out of Stock */}
//       <Typography fontWeight={700} sx={{ mt: 2, mb: 1 }}>
//         Out of Stock ({outOfStock.length})
//       </Typography>
 
//       {outOfStock.length > 0 ? (
//         outOfStock.map((item) => (
//           <Box key={item.itemId}>
//             <Typography>{item.itemName} is currently out of stock.</Typography>
//           </Box>
//         ))
//       ) : (
//         <Typography color="text.secondary">No out of stock items.</Typography>
//       )}
 
//       <hr />
 
//       {/* Reorder */}
//       <Typography fontWeight={700} sx={{ mt: 2, mb: 1 }}>
//         Reorder Suggested ({reorderStock.length})
//       </Typography>
 
//       {reorderStock.length > 0 ? (
//         reorderStock.map((item) => (
//           <Box key={item.itemId}>
//             <Typography>
//               Based on current stock levels, {item.itemName} should be reordered.
//             </Typography>
//           </Box>
//         ))
//       ) : (
//         <Typography color="text.secondary">No reorder alerts.</Typography>
//       )}
 
//       <hr />
 
//       {/* Expiry Alerts */}
//       <Typography fontWeight={700} sx={{ mt: 2, mb: 1 }}>
//         Expiry Alerts ({expiryAlerts.length})
//       </Typography>
 
//       {expiryAlerts.length > 0 ? (
//         expiryAlerts.map((item) => (
//           <Box key={item.itemId}>
//             <Typography>
//               {item.itemName} will expire on{" "}
//               {item.expiryDate.toLocaleDateString()}.
//             </Typography>
//           </Box>
//         ))
//       ) : (
//         <Typography color="text.secondary">
//           No items expiring within {expiryDays} days.
//         </Typography>
//       )}
//     </Paper>
//   );
// };
 
// export default Alerts;
 

// import { Box, Paper, Typography } from "@mui/material";
// import { useEffect, useState } from "react";
// import WarningSign from "@/assets/warning-sign.svg";
// import { InventoryItem } from "@/containers/inventory/InventoryList";
 
// type InventoryWithDate = Omit<InventoryItem, "expiryDate"> & {
//   expiryDate: Date;
// };
 
// const Alerts = () => {
//   const [inventory, setInventory] = useState<InventoryWithDate[]>([]);
//   const [expiryDays, setExpiryDays] = useState<number>(30);
//   const [showAllExpiry, setShowAllExpiry] = useState(false);
 
//   const [returnsUpdateCount, setReturnsUpdateCount] = useState(0);
//   const [lowStockAlertCount, setLowStockAlertCount] = useState(0);
//   const [reorderAlertCount, setReorderAlertCount] = useState(0);
 
// useEffect(() => {
//   const count = Number(localStorage.getItem("returnsUpdateCount")) || 0;
//   setReturnsUpdateCount(count);
//    const lowStock = Number(localStorage.getItem("lowStockAlertCount")) || 0;
//   const reorder = Number(localStorage.getItem("reorderAlertCount")) || 0;
 
//   setLowStockAlertCount(lowStock);
//   setReorderAlertCount(reorder);
// }, []);
 
//   //  NEW STATE (LOW STOCK LIMIT)
//   const [lowStockLimit, setLowStockLimit] = useState(30);
 
//   // load inventory
//   useEffect(() => {
//     const storedInventory = localStorage.getItem("inventory");
 
//     if (!storedInventory) return;
 
//     const parsed: InventoryWithDate[] = JSON.parse(storedInventory).map(
//       (item: InventoryItem) => ({
//         ...item,
//         stockQty: Number(item.stockQty),
//         expiryDate: new Date(item.expiryDate),
//       })
//     );
 
//     setInventory(parsed);
//   }, []);
 
//   useEffect(() => {
//     const settingsStr = localStorage.getItem("inventorySettings");
//     if (!settingsStr) return;
//     const settings = JSON.parse(settingsStr);
//     setLowStockLimit(Number(settings.lowStockThreshold) || 30);
//   }, []);
 
//   useEffect(() => {
//     const settingsStr = localStorage.getItem("dashboardSettings");
//     if (!settingsStr) return;
//     const settings = JSON.parse(settingsStr);
//     if (!settings.expiryAlerts) return;
//     if (settings.expiryAlerts.includes("Show Expiry Alert on Dashboard")) {
//       setShowAllExpiry(true);
//       return;
//     }
 
//     if (settings.expiryAlerts.includes("90")) setExpiryDays(90);
//     else if (settings.expiryAlerts.includes("60")) setExpiryDays(60);
//     else if (settings.expiryAlerts.includes("30")) setExpiryDays(30);
//   }, []);
 
//   const lowStock = inventory.filter((item) => item.stockQty <= lowStockLimit);
 
//   const reorderStock = inventory.filter((item) => item.stockQty <= 10);
 
//   const today = new Date();
 
//   const expiryAlerts = inventory.filter((item) => {
//     const diffDays =
//       (item.expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
 
//     if (showAllExpiry) return true;
 
//     return diffDays >= 0 && diffDays <= expiryDays;
//   });
 
//   return (
//     <Paper
//       sx={{ py: 2, px: 4, pb: 8, mb: 4, maxHeight: 400, overflowY: "auto" }}
//     >
//       <Typography
//         fontSize={18}
//         fontWeight={700}
//         sx={{ mb: 2 }}
//         display="flex"
//         alignItems="center"
//         justifyContent="space-between"
//       >
//         Alerts
//         <Box component="img" src={WarningSign} width={24} />
//       </Typography>
 
//       <hr />
 
//       {/* Low Stock */}
//     <Typography fontWeight={700} sx={{ mt: 2, mb: 1 }}>
//   Stock on returns (Sales & Purchase) ({returnsUpdateCount})
// </Typography>
 
// {lowStock.length > 0 &&
//   lowStock.map((item) => (
//     <Box key={item.itemId}>
//       <Typography>
//         {item.itemName} is running low — only {item.stockQty} left.
//       </Typography>
//     </Box>
//   ))}
 
// <hr />
     
//       {/* Low Stock */}
//       <Typography fontWeight={700} sx={{ mt: 2, mb: 1 }}>
//         Low Stock Alerts ({lowStockAlertCount})
//       </Typography>
 
//       {lowStock.length > 0 ? (
//         lowStock.map((item) => (
//           <Box key={item.itemId}>
//             <Typography>
//               {item.itemName} is running low — only {item.stockQty} left.
//             </Typography>
//           </Box>
//         ))
//       ) : (
//         <Typography color="text.secondary"></Typography>
//       )}
 
//       <hr />
 
//       {/* Reorder */}
//       <Typography fontWeight={700} sx={{ mt: 2, mb: 1 }}>
//        Reorder Suggested ({reorderAlertCount})
//       </Typography>
 
//       {reorderStock.length > 0 ? (
//         reorderStock.map((item) => (
//           <Box key={item.itemId}>
//             <Typography>
//               Based on current stock levels, {item.itemName} should be
//               reordered.
//             </Typography>
//           </Box>
//         ))
//       ) : (
//         <Typography color="text.secondary"></Typography>
//       )}
 
//       <hr />
 
//       {/* Expiry Alerts */}
//       <Typography fontWeight={700} sx={{ mt: 2, mb: 1 }}>
//         Expiry Alerts ({expiryAlerts.length})
//       </Typography>
 
//       {expiryAlerts.length > 0 ? (
//         expiryAlerts.map((item) => (
//           <Box key={item.itemId}>
//             <Typography>
//               {item.itemName} will expire on{" "}
//               {item.expiryDate.toLocaleDateString()}.
//             </Typography>
//           </Box>
//         ))
//       ) : (
//         <Typography color="text.secondary">
//           No items expiring within {expiryDays} days.
//         </Typography>
//       )}
//     </Paper>
//   );
// };
 
// export default Alerts;


import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import WarningSign from "@/assets/warning-sign.svg";
import { InventoryItem } from "@/containers/inventory/InventoryList";
 
type InventoryWithDate = Omit<InventoryItem, "expiryDate"> & {
  expiryDate: Date;
};
 
const Alerts = () => {
  const [inventory, setInventory] = useState<InventoryWithDate[]>([]);
 
  const [expiryDays, setExpiryDays] = useState<number>(30);
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
 
  useEffect(() => {
    const settingsStr = localStorage.getItem("inventorySettings");
    if (!settingsStr) return;
 
    const settings = JSON.parse(settingsStr);
 
    // Low stock threshold
    setLowStockLimit(Number(settings.lowStockThreshold) || 30);
 
    // Alerts visibility checkboxes
    if (settings.alertsVisibility?.includes("alert1")) {
      setShowLowStock(true);
    } else {
      setShowLowStock(false);
    }
 
    if (settings.alertsVisibility?.includes("alert2")) {
      setShowReorder(true);
    } else {
      setShowReorder(false);
    }
  }, []);
 
  useEffect(() => {
    const settingsStr = localStorage.getItem("dashboardSettings");
    if (!settingsStr) return;
 
    const settings = JSON.parse(settingsStr);
 
    if (settings.expiryAlerts?.includes("Show Expiry Alert on Dashboard")) {
      setShowAllExpiry(true);
      return;
    }
 
    if (settings.expiryAlerts?.includes("90")) setExpiryDays(90);
    else if (settings.expiryAlerts?.includes("60")) setExpiryDays(60);
    else if (settings.expiryAlerts?.includes("30")) setExpiryDays(30);
  }, []);
 
  const lowStock = inventory.filter(
    (item) => item.stockQty <= lowStockLimit
  );
 
  const reorderStock = inventory.filter(
    (item) => item.stockQty <= 10
  );
 
  const today = new Date();
 
  const expiryAlerts = inventory.filter((item) => {
    const diffDays =
      (item.expiryDate.getTime() - today.getTime()) /
      (1000 * 3600 * 24);
 
    if (showAllExpiry) return true;
 
    return diffDays >= 0 && diffDays <= expiryDays;
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
 
      {/*  REORDER  */}
      {showReorder && (
        <>
          <Typography fontWeight={700} sx={{ mt: 2, mb: 1 }}>
            Reorder Suggested ({reorderStock.length})
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
              {item.expiryDate.toLocaleDateString()}.
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
 
 
 
