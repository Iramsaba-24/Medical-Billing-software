 import { Box, Typography, Paper } from "@mui/material";
import TotalDistributors from "@/assets/TotalDistributers.svg";
import TotalPurchase from "@/assets/warningsign.svg";
import NewDistributors from "@/assets/NewDistributors.svg";

interface DistributorCardsProps {
  totalCount: number;
}

  function DistributorCards({ totalCount }: DistributorCardsProps) {
  const cardData = [
    { label: "Total Distributors", value: totalCount, img: TotalDistributors },
    { label: "Total Purchase", value: 0, img: TotalPurchase },
    { label: "New Distributors", value: `₹ ${totalCount}`, img: NewDistributors },
  ];

  return (
    <Box>
      <Box>
        <Typography
          sx={{
            fontSize: { xs: 20, sm: 24, md: 28 },
            fontWeight: 700,
            color: '#111827',
            mt: {xs:1 , md:0.5},
            mb:0.5
          }}
        >
          Distributors 
        </Typography>   
      </Box>
    <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "repeat(3, 1fr)" }} gap={2} mb={3}>

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
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0px 10px 25px rgba(0,0,0,0.15)"
            }
          }}
        >
          <Box>
            <Typography fontWeight={600} fontSize={18}>{card.value}</Typography>
            <Typography color="text.secondary">{card.label}</Typography>
          </Box>
          <Box component="img" src={card.img} sx={{ width: 60, height: 60 }} />
        </Paper>
      ))}
    </Box>
    </Box>
  );
}
export default DistributorCards;