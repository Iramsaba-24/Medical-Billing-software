// import { Box, Typography, Button } from "@mui/material";
// import {
//   Column,
//   UniversalTable,
// } from "@/components/uncontrolled/UniversalTable";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import ReorderDialog from "@/containers/inventory/ReorderDialog";
// import PurchaseRecord from "@/containers/inventory/PurchaseRecord";
// import { URL_PATH } from "@/constants/UrlPath";
// type InventoryItem = {
//   itemName: string;
//   medicineId: string;
//   quantity: number;
//   pricePerUnit: number;
//   gst: "12%";
// };
// const Reorder = 10;
// const ReorderList = () => {
//   const [items, setItems] = useState<InventoryItem[]>([]);
//   const [openItem, setOpenItem] = useState<InventoryItem | null>(null);

//   //  NEW LINE ADDED
//   const [refreshKey, setRefreshKey] = useState(0);
//   const navigate = useNavigate();
//   useEffect(() => {
//     const inventory = JSON.parse(localStorage.getItem("inventory") || "[]");
//     setItems(
//       inventory
//         .map((item: InventoryItem) => ({
//           ...item,
//           quantity: Number(item.quantity),
//         }))
//         .filter((item: InventoryItem) => item.quantity < Reorder),
//     );
//   }, []);
//   const handleReorderSubmit = (reorderQty: number) => {
//     if (!openItem) return;
//     const inventory = JSON.parse(localStorage.getItem("inventory") || "[]");

//     const updatedInventory = inventory.map((item: InventoryItem) =>
//       item.medicineId === openItem.medicineId
//         ? {
//             ...item,
//             quantity: Number(item.quantity) + Number(reorderQty),
//           }
//         : item,
//     );

//     localStorage.setItem("inventory", JSON.stringify(updatedInventory));
//     // IMPORTANT FIX
//     const history = JSON.parse(localStorage.getItem("reorderHistory") || "[]");

//     history.unshift({
//       medicineId: openItem.medicineId,
//       itemName: openItem.itemName,
//       quantity: reorderQty,
//       pricePerUnit: openItem.pricePerUnit,
//       totalAmount: reorderQty * openItem.pricePerUnit * 1.12,
//       gst: "12%",
//       expiryDate: "",
//       purchasedAt: new Date().toISOString(),
//     });

//     localStorage.setItem("reorderHistory", JSON.stringify(history));

//     setItems(
//       updatedInventory.filter((item: InventoryItem) => item.quantity < Reorder),
//     );

//     setOpenItem(null);

//     // NEW LINE ADDED
//     setRefreshKey((prev) => prev + 1);
//   };

//   const columns: Column<InventoryItem>[] = [
//     { key: "itemName", label: "Item" },
//     { key: "stockQty", label: "Stock" },
//     { key: "pricePerUnit", label: "MRP" },
//     {
//       key: "gst",
//       label: "GST",
//       render: (row) => `₹ ${(row.pricePerUnit * 0.12).toFixed(2)}`,
//     },
//     {
//       key: "total",
//       label: "Total",
//       render: (row) => `₹ ${(row.pricePerUnit * 1.12).toFixed(2)}`,
//     },
//     {
//       key: "reorder",
//       label: "Reorder",
//       render: (row) => (
//         <Button
//           size="small"
//           sx={{
//             backgroundColor: "#238878",
//             color: "#fff",
//             border: "2px solid #238878",
//             textTransform: "none",
//             "&:hover": {
//               backgroundColor: "#fff",
//               color: "#238878",
//             },
//           }}
//           onClick={() => setOpenItem(row)}
//         >
//           Reorder
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <>
//       <Box display="flex" justifyContent="flex-end" mb={2}>
//         <Button
//           variant="contained"
//           onClick={() => navigate(URL_PATH.Inventory)}
//           sx={{
//             backgroundColor: "#238878",
//             color: "#fff",
//             border: "2px solid #238878",
//             textTransform: "none",
//             "&:hover": {
//               backgroundColor: "#fff",
//               color: "#238878",
//             },
//           }}
//         >
//           Back to Home
//         </Button>
//       </Box>
//       <Box
//         sx={{
//           boxShadow: 4,
//           p: 4,
//         }}
//       >
//         <Typography fontSize={20} mb={2}>
//           Reorder List
//         </Typography>
//         <UniversalTable
//           data={items}
//           columns={columns}
//           rowsPerPage={5}
//           textAlign="center"
//         />
//         <ReorderDialog
//           open={!!openItem}
//           itemName={openItem?.itemName || ""}
//           onClose={() => setOpenItem(null)}
//           onSubmit={handleReorderSubmit}
//         />
//       </Box>

//       {/*  key PROP ADDED */}
//       <PurchaseRecord key={refreshKey} />
//     </>
//   );
// };
// export default ReorderList;




import { Box, Paper, Typography, Button, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import TotalItems from "@/assets/TotalItems.svg";
import LowStock from "@/assets/warningsign.svg";
import TotalValue from "@/assets/TotalValue.svg";
import InventoryList from "@/containers/inventory/InventoryList";
import GroupSummary from "@/containers/inventory/GroupSummary";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";
import { useState, useEffect } from "react";
import type { MedicineResponse } from "@/service/medicineService";

 
export default function InventoryPage() {
  const navigate = useNavigate();
 

const [stats, setStats] = useState({ totalItems: 0, lowStockItems: 0, totalValue: 0 });


useEffect(() => {
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_ENDPOINTS.MEDICINE, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      const medicines: MedicineResponse[] = res.data.data;

    
      console.log("isLowStock check:", medicines.map(m => ({
        name: m.itemName,
        isLowStock: m.isLowStock,
        finalPrice: m.finalPrice
      })));

      const totalItems = medicines.length;
      const lowStockItems = medicines.filter(m => m.quantity > 0 && m.quantity <= 10).length;
      const totalValue = medicines.reduce((sum, m) => sum + m.finalPrice, 0);

      setStats({ totalItems, lowStockItems, totalValue });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };
  fetchStats();
}, []);
return (
    <Box>
      <Box>
          <Typography
            sx={{
              fontSize: { xs: 20, sm: 24, md: 28 },  
              fontWeight: 700,
              color: '#111827',
              mt: {xs:1 , md:0.5},
              mb: 0.5,
            }}
          >
            Inventory
          </Typography>
          <Divider sx={{ mb: 3 }} />
      </Box>
 
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }}
        gap={2}
        mb={3}
      >
        {[
          { label: "Total Items", value: stats.totalItems, img: TotalItems },
{ label: "Low Stock Items", value: stats.lowStockItems, img: LowStock },
{ label: "Total Value (GST incl.)", value: `₹ ${stats.totalValue.toFixed(2)}`, img: TotalValue },
        ].map((card) => (
          <Paper
            key={card.label}
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 2,
              cursor: "pointer",
              transition: "0.3s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
          >
            <Box>
              <Typography fontWeight={600} fontSize={18}>
                {card.value}
              </Typography>
              <Typography color="text.secondary">
                {card.label}
              </Typography>
            </Box>
 
            <Box
              component="img"
              src={card.img}
              sx={{ width: 70, height: 70 }}
            />
          </Paper>
        ))}
      </Box>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "2fr 1fr" }}
        gap={3}
        mb={3}
      >
        <Paper sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography fontWeight={600}>
              Medicine Groups
            </Typography>
 
            <Button
              size="small"
              variant="contained"
              sx={{  
                px: 2.5,
                py: 1,
                minWidth: 100,
                backgroundColor: "#238878",
                color: "#fff",
                border: "2px solid #238878",
                fontSize: "0.95rem",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "#238878",
                  border: "2px solid #238878",
                }
             }}
              onClick={() => navigate(URL_PATH.MedicineGroup)}
            >
              View Details
            </Button>
          </Box>
 
             <GroupSummary />
 
        </Paper>
 
        <Box display="flex" flexDirection="column" gap={2}>
 
          <Button
            fullWidth
            sx={{
            px: 2.5,
            py: 1,
            minWidth: 100,
            backgroundColor: "#238878",
            color: "#fff",
            border: "2px solid #238878",
            fontSize: "0.95rem",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#fff",
              color: "#238878",
              border: "2px solid #238878",
            }
          }}
            onClick={() => navigate(URL_PATH.AddMedicineGroup)}
          >
            + Add New Group
          </Button>
 
          <Button
            fullWidth
            sx={{
            px: 2.5,
            py: 1,
            minWidth: 100,
            backgroundColor: "#238878",
            color: "#fff",
            border: "2px solid #238878",
            fontSize: "0.95rem",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#fff",
              color: "#238878",
              border: "2px solid #238878",
            }
          }}
            onClick={() => navigate(URL_PATH.AddInventoryItem)}
          >
            + Add New Medicine
          </Button>
 
         
 
           <Button
            fullWidth
           sx={{
            px: 2.5,
            py: 1,
            minWidth: 100,
            backgroundColor: "#238878",
            color: "#fff",
            border: "2px solid #238878",
            fontSize: "0.95rem",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#fff",
              color: "#238878",
              border: "2px solid #238878",
            }
          }}
            onClick={() => navigate(URL_PATH.Reorder)}
          >
            Reorder Medicines
          </Button>
        </Box>
      </Box>
 
      <InventoryList />
    </Box>
  );
}
