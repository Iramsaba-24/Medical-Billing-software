 import { Box, Typography, Paper } from "@mui/material";

import TotalSalesReport from '@/assets/TotalSalesReport.svg';
import TotalPurchaseReport from "@/assets/TotalPurchaseReport.svg";
import ProfitReport from '@/assets/ProfitReport.svg';

function ReportCards() {
  
  //  Data for the cards to be displayed
  const cardData = [
    {label: "Total Sales Report", value: "₹ 8,55,755",  img: TotalSalesReport, },
    {label: "Total Purchase", value: "₹ 10,75,123", img: TotalPurchaseReport, },
    {label: "Profit", value: "₹ 3,10,456",  img: ProfitReport, },
  ];

  return (
    
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "1fr", sm: "repeat(3, 1fr)" }}
      gap={3} 
      mb={4}  
    >
      {/* Mapping through the cardData array to create each card */}
      {cardData.map((card) => (
        <Paper
          key={card.label}
          elevation={1}
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between", 
            alignItems: "center",
            borderRadius: "12px", 
            backgroundColor: "#fff",
            border: "2px solid transparent", 
            transition: "all 0.3s ease", 
            cursor: "pointer",
            "&:hover": {
              transform: "translateY(-5px)", 
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)", 
              borderColor: "#1E88FF", 
            },
          }}
        >
          {/* Left Side: Text information */}
          <Box>
            <Typography  variant="h6"  sx={{ fontWeight: 700, fontSize: "1.25rem", color: "#1a1a1a" }} >
               {card.value}
            </Typography>
            <Typography  variant="body2"  sx={{ color: "#666", fontWeight: 500, mt: 0.5 }} >
              {card.label}
            </Typography>
          </Box>

          {/* Right Side: Icon/Image */}
          <Box
            component="img"
            src={card.img}
            sx={{  width: 55,  height: 55,  objectFit: "contain",
            }}
          />
        </Paper>
      ))}
    </Box>
  );
}
export default ReportCards;