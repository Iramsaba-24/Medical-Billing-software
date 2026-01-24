 import { Box, Typography, Paper } from "@mui/material";
import TotalDistributors from "@/assets/TotalDistributers.svg";
import TotalPurchase from "@/assets/warningsign.svg";
import NewDistributors from "@/assets/NewDistributors.svg";


interface DistributorCardsProps {
  totalCount: number;
}

export default function DistributorCards({ totalCount }: DistributorCardsProps) {
 
  const cardData = [
    { label: "Total Distributors", value: totalCount, img: TotalDistributors },
    { label: "Total Purchase", value: 0, img: TotalPurchase },
    { label: "New Distributors", value: `₹ ${totalCount}`, img: NewDistributors },
  ];

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "1fr", sm: "repeat(3, 1fr)" }}
      gap={2}
      mb={3}
    >
     {/* Mapping through cardData array to render each card dynamically  */}
      {cardData.map((card) => (
        <Paper
          key={card.label}
          sx={{
            p: 3, 
            display: "flex",
            justifyContent: "space-between", 
            alignItems: "center",
            borderRadius: 2,
            cursor: "pointer",
            transition: "0.3s", 
            "&:hover": { 
              transform: "translateY(-4px)", 
              boxShadow: 6 
            },
          }}
        >
          {/* Left Side */}
          <Box>
            <Typography fontWeight={600} fontSize={18}>
              {card.value}
            </Typography>
            <Typography color="text.secondary">
              {card.label}
            </Typography>
          </Box>

          {/* Right Side */}
          <Box 
            component="img" 
            src={card.img} 
            alt={card.label}
            sx={{ width: 70, height: 70 }} 
          />
        </Paper>
      ))}
    </Box>
  );
}