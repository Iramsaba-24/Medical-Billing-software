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
const [medicineList, setMedicineList] = useState<MedicineResponse[]>([]); 

useEffect(() => {
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_ENDPOINTS.MEDICINE, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      const medicines: MedicineResponse[] = res.data.data;


     console.log("medicine values:", JSON.stringify(medicines.map(m => ({
  name: m.medicineName,
  mrpPerTablet: m.mrpPerTablet,
  totalStockTablets: m.totalStockTablets,
  stockValue: m.stockValue,
}))));

console.log("isLowStock check:", JSON.stringify(medicines.map(m => ({
  name: m.medicineName,
  isLowStock: m.isLowStock,
}))));



const totalItems = medicines.length;

const lowStockItems = medicines.filter(m => 
  m.totalStockTablets < (m.minimumQuantity > 0 ? m.minimumQuantity : 10)
).length;

const totalValue = medicines.reduce(
  (sum, m) => sum + (m.mrpPerTablet * m.totalStockTablets), 0
);


setMedicineList(medicines);
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
{ label: "Total Value ", value: `₹ ${stats.totalValue.toFixed(2)}`, img: TotalValue },
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
 
         
 <Box display="flex" gap={2}>
  
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
    onClick={() => {
      const lowStockMedicines = medicineList
        .filter((m) => m.totalStockTablets <= m.minimumQuantity)
        .map((m) => ({
          id: m.medicineId,
          supplier: m.distributorName || "-",
          medicineName: m.medicineName,
          strengthType: m.strength || "-",
          quantity: m.totalStockTablets.toString(),
        }));

      navigate(URL_PATH.ReorderForm, {
        state: { medicines: lowStockMedicines },
      });
    }}
  >
    Reorder
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
    onClick={() => navigate(URL_PATH.NewOrder)}
  >
    New Order
  </Button>

</Box>
        </Box>
      </Box>
 
      <InventoryList />
    </Box>
  );
}