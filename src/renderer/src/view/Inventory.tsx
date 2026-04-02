// import { Box, Paper, Typography, Button, Divider } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { URL_PATH } from "@/constants/UrlPath";
// import TotalItems from "@/assets/TotalItems.svg";
// import LowStock from "@/assets/warningsign.svg";
// import TotalValue from "@/assets/TotalValue.svg";
// import type { InventoryItem } from "@/containers/inventory/AddInventoryItem";
// import InventoryList from "@/containers/inventory/InventoryList";
// import GroupSummary from "@/containers/inventory/GroupSummary";
 
// export default function InventoryPage() {
//   const navigate = useNavigate();
 
//    const inventory: InventoryItem[] = JSON.parse(
//   localStorage.getItem("inventory") || "[]"
//  );
 
//   const totalItems = inventory.length;
 
//   const lowStockItems = inventory.filter(
//   (item) => item.stockQty > 0 && item.stockQty < 10
//   ).length;
//   length;
 
//   const totalValue = inventory.reduce(
//     (sum, item) => sum + item.stockQty * item.pricePerUnit,
//     0
//   );
 
// return (
//     <Box>
//       <Box>
//           <Typography
//             sx={{
//               fontSize: { xs: 20, sm: 24, md: 28 },  
//               fontWeight: 700,
//               color: '#111827',
//               mt: {xs:1 , md:0.5},
//               mb: 0.5,
//             }}
//           >
//             Inventory
//           </Typography>
//           <Divider sx={{ mb: 3 }} />
//       </Box>
 
//       <Box
//         display="grid"
//         gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }}
//         gap={2}
//         mb={3}
//       >
//         {[
//           { label: "Total Items", value: totalItems, img: TotalItems },
//           { label: "Low Stock Items", value: lowStockItems, img: LowStock },
//           { label: "Total Value", value: `₹ ${totalValue}`, img: TotalValue },
//         ].map((card) => (
//           <Paper
//             key={card.label}
//             sx={{
//               p: 2,
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               borderRadius: 2,
//               cursor: "pointer",
//               transition: "0.3s",
//               "&:hover": {
//                 transform: "translateY(-4px)",
//                 boxShadow: 6,
//               },
//             }}
//           >
//             <Box>
//               <Typography fontWeight={600} fontSize={18}>
//                 {card.value}
//               </Typography>
//               <Typography color="text.secondary">
//                 {card.label}
//               </Typography>
//             </Box>
 
//             <Box
//               component="img"
//               src={card.img}
//               sx={{ width: 70, height: 70 }}
//             />
//           </Paper>
//         ))}
//       </Box>
//       <Box
//         display="grid"
//         gridTemplateColumns={{ xs: "1fr", md: "2fr 1fr" }}
//         gap={3}
//         mb={3}
//       >
//         <Paper sx={{ p: 2 }}>
//           <Box display="flex" justifyContent="space-between" mb={2}>
//             <Typography fontWeight={600}>
//               Medicine Groups
//             </Typography>
 
//             <Button
//               size="small"
//               variant="contained"
//               sx={{  
//                 px: 2.5,
//                 py: 1,
//                 minWidth: 100,
//                 backgroundColor: "#238878",
//                 color: "#fff",
//                 border: "2px solid #238878",
//                 fontSize: "0.95rem",
//                 textTransform: "none",
//                 "&:hover": {
//                   backgroundColor: "#fff",
//                   color: "#238878",
//                   border: "2px solid #238878",
//                 }
//              }}
//               onClick={() => navigate(URL_PATH.MedicineGroup)}
//             >
//               View Details
//             </Button>
//           </Box>
 
//              <GroupSummary />
 
//         </Paper>
 
//         <Box display="flex" flexDirection="column" gap={2}>
 
//           <Button
//             fullWidth
//             sx={{
//             px: 2.5,
//             py: 1,
//             minWidth: 100,
//             backgroundColor: "#238878",
//             color: "#fff",
//             border: "2px solid #238878",
//             fontSize: "0.95rem",
//             textTransform: "none",
//             "&:hover": {
//               backgroundColor: "#fff",
//               color: "#238878",
//               border: "2px solid #238878",
//             }
//           }}
//             onClick={() => navigate(URL_PATH.AddMedicineGroup)}
//           >
//             + Add New Group
//           </Button>
 
//           <Button
//             fullWidth
//             sx={{
//             px: 2.5,
//             py: 1,
//             minWidth: 100,
//             backgroundColor: "#238878",
//             color: "#fff",
//             border: "2px solid #238878",
//             fontSize: "0.95rem",
//             textTransform: "none",
//             "&:hover": {
//               backgroundColor: "#fff",
//               color: "#238878",
//               border: "2px solid #238878",
//             }
//           }}
//             onClick={() => navigate(URL_PATH.AddInventoryItem)}
//           >
//             + Add New Medicine
//           </Button>
 
         
 
//            <Button
//             fullWidth
//            sx={{
//             px: 2.5,
//             py: 1,
//             minWidth: 100,
//             backgroundColor: "#238878",
//             color: "#fff",
//             border: "2px solid #238878",
//             fontSize: "0.95rem",
//             textTransform: "none",
//             "&:hover": {
//               backgroundColor: "#fff",
//               color: "#238878",
//               border: "2px solid #238878",
//             }
//           }}
//             onClick={() => navigate(URL_PATH.Reorder)}
//           >
//             Reorder Medicines
//           </Button>
//         </Box>
//       </Box>
 
//       <InventoryList />
//     </Box>
//   );
// }
import { Box, Paper, Typography, Button, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import TotalItems from "@/assets/TotalItems.svg";
import LowStock from "@/assets/warningsign.svg";
import TotalValue from "@/assets/TotalValue.svg";
import type { InventoryItem } from "@/containers/inventory/AddInventoryItem";
import InventoryList from "@/containers/inventory/InventoryList";
import GroupSummary from "@/containers/inventory/GroupSummary";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";
import { useState, useEffect } from "react";
 
export default function InventoryPage() {
  const navigate = useNavigate();
 
   
 const [inventory, setInventory] = useState<InventoryItem[]>([]);
 
  const totalItems = inventory.length;

const lowStockItems = inventory.filter(
  (item) => item.quantity > 0 && item.quantity < 10
).length;

const totalValue = inventory.reduce(
  (sum, item) => sum + item.quantity * item.pricePerUnit,
  0
);


  useEffect(() => {
  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(API_ENDPOINTS.MEDICINE, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      console.log("DASHBOARD DATA:", res.data);

      const formatted: InventoryItem[] = res.data.data.map((item: {
        medicineId: number;
        itemName: string;
        quantity: number;
        pricePerUnit: number;
        expiryDate: string;
      }) => ({
        itemName: item.itemName,
        medicineId: item.medicineId,
        medicineGroup: "N/A",
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit,
        expiryDate: item.expiryDate,
        supplier: "N/A",
      }));

      setInventory(formatted);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  fetchInventory();
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
          { label: "Total Items", value: totalItems, img: TotalItems },
          { label: "Low Stock Items", value: lowStockItems, img: LowStock },
          { label: "Total Value", value: `₹ ${totalValue}`, img: TotalValue },
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