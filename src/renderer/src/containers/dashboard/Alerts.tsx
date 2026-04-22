import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import WarningSign from "@/assets/warning-sign.svg";
import {getMedicines, MedicineResponse } from "@/service/medicineService";
 
type MedicineWithDate = Omit<MedicineResponse, "expiryDate"> & {
  expiryDate: Date;
};
 
const Alerts = () => {
const [inventory, setInventory] = useState<MedicineWithDate[]>([]); 
 const [expiryDays, setExpiryDays] = useState<number>(90);
 const [showAllExpiry, setShowAllExpiry] = useState(false);
 const [showLowStock, setShowLowStock] = useState(false);
 const [showReorder, setShowReorder] = useState(false);
 const [lowStockLimit, setLowStockLimit] = useState(30);
//  fetch medicines from database
 useEffect(() => {
  const fetchMedicines = async () => {
    try {
      const data: MedicineResponse[] = await getMedicines();

      const parsed: MedicineWithDate[] = data.map((item) => ({
        ...item,
        expiryDate: new Date(item.expiryDate),
      }));

      setInventory(parsed);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  fetchMedicines();
}, []);
 //  inventory settings (low stock / reorder)
 useEffect(() => {
   const settingsStr = localStorage.getItem("inventorySettings");
   if (!settingsStr) return;
 
   const settings = JSON.parse(settingsStr);
 
   setLowStockLimit(Number(settings.lowStockThreshold) || 30);
 
   setShowLowStock(settings.alertsVisibility?.includes("alert1"));
   setShowReorder(settings.alertsVisibility?.includes("alert2"));
 }, []);
 
 //  dashboard settings (expiry alerts)
 useEffect(() => {
   const settingsStr = localStorage.getItem("dashboardSettings");
   if (!settingsStr) return;
 
   const settings = JSON.parse(settingsStr);
 
   //  correct value check
   if (settings.expiryAlerts?.includes("showExpiryOnDashboard")) {
     setShowAllExpiry(true);
     return;
   }
 
   // multiple selection support (30/60/90)
   const selectedDays = settings.expiryAlerts
     ?.filter((v: string) => ["30", "60", "90"].includes(v))
     .map(Number);
 
   if (selectedDays?.length) {
     setExpiryDays(Math.max(...selectedDays));
   }
 }, []);
 
 // FILTERS
 const lowStock = inventory.filter(
   (item) => item.totalStockTablets <= lowStockLimit
 );
 
 const reorderStock = inventory.filter(
   (item) => item.totalStockTablets <= 10
 );
 
 const today = new Date();

 const expiryAlerts = inventory.filter((item) => {
 const diffDays =
   (item.expiryDate.getTime() - today.getTime()) /
   (1000 * 3600 * 24);
 
 // show all if no filter
 if (showAllExpiry || expiryDays === 0) return true;
 
 return diffDays >= 0 && diffDays <= expiryDays;
});
 
 //  expiry countdown function
 const getExpiryText = (date: Date) => {
   const diffDays = Math.ceil(
     (date.getTime() - today.getTime()) / (1000 * 3600 * 24)
   );
 
   if (diffDays < 0) return "Expired";
   if (diffDays === 0) return "Expires today";
   if (diffDays === 1) return "Expires in 1 day";
 
   return `Expires in ${diffDays} days`;
 };
 
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
 
     {/* lowStock */}
     {showLowStock && (
       <>
         <Typography fontWeight={700} sx={{ mt: 2, mb: 1 }}>
           Low Stock Alerts ({lowStock.length})
         </Typography>
         {lowStock.length > 0 ? (
           lowStock.map((item) => (
             <Box key={item.medicineId}>
               <Typography>
                 {item.medicineName} is running low — only {item.totalStockTablets} left.
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
 
     {/* reorder */}
     {showReorder && (
       <>
         <Typography fontWeight={700} sx={{ mt: 2, mb: 1 }}>
           Reorder Suggested ({reorderStock.length})
         </Typography>
 
         {reorderStock.length > 0 ? (
           reorderStock.map((item) => (
             <Box key={item.medicineId}>
               <Typography>
                 {item.medicineName} should be reordered.
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
 
     {/* expiry */}
     <Typography fontWeight={700} sx={{ mt: 2, mb: 1 }}>
       Expiry Alerts ({expiryAlerts.length})
     </Typography>
 
     {expiryAlerts.length > 0 ? (
       expiryAlerts.map((item) => (
         <Box key={item.medicineId}>
           <Typography>
             {item.medicineName} will expire on{" "}
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
 
 
 