import { Box, Paper, Typography, Button, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import TotalItems from "@/assets/TotalItems.svg";
import LowStock from "@/assets/warningsign.svg";
import TotalValue from "@/assets/TotalValue.svg";
import type { InventoryItem } from "@/containers/inventory/AddInventoryItem";
import InventoryList from "@/containers/inventory/InvetoryList";

export default function InventoryPage() {
  const navigate = useNavigate();

   const inventory: InventoryItem[] = JSON.parse(
  localStorage.getItem("inventory") || "[]"
 );

  const totalItems = inventory.length;

  const lowStockItems = inventory.filter(
  (item) => item.stockQty > 0 && item.stockQty < 10
  ).length;
  length;

  const totalValue = inventory.reduce(
    (sum, item) => sum + item.stockQty * item.pricePerUnit,
    0
  );

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
              Medicine Groups <Chip label="03" size="small" />
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
              onClick={() => navigate("/inventory/medicine-group")}
            >
              View Details
            </Button>
          </Box>

          {[
            ["Generic Medicines", "02"],
            ["Diabetes", "32"],
            ["Other", "01"],
          ].map(([name, count]) => (
            <Box
              key={name}
              display="flex"
              justifyContent="space-between"
              py={1}
              borderBottom="1px solid #eee"
            >
              <Typography fontSize={14}>{name}</Typography>
              <Typography fontSize={14}>{count}</Typography>
            </Box>
          ))}
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
            onClick={() => navigate("/inventory/medicine-group")}
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
            onClick={() => navigate("/inventory/add-medicine-group")}
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
            onClick={() => navigate(URL_PATH.InventoryList)}
          >
            View Inventory List
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
