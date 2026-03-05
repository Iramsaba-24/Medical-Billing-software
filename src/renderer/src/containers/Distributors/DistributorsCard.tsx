

import { Box, Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import TotalDistributors from "@/assets/TotalDistributers.svg";
import TotalPurchase from "@/assets/warningsign.svg";
import NewDistributors from "@/assets/NewDistributors.svg";

type InvoiceItem = {
  id: number;
  company: string;
  supplier: string;
  item: string;
  quantity: number;
  mrp: number;
  total: number;
};

function DistributorCards() {
  const [totalDistributors, setTotalDistributors] = useState(0);
  const [totalPurchase, setTotalPurchase] = useState(0);
  const [supplierTotals, setSupplierTotals] = useState<Record<string, number>>({});

  useEffect(() => {
    
    //  Get Distributors Count
    
    const storedDistributors = localStorage.getItem("distributors");
    const distributors = storedDistributors ? JSON.parse(storedDistributors) : [];
    setTotalDistributors(distributors.length);

    
    //  Get Retail Invoice Data
   
    const storedInvoices = localStorage.getItem("retailInvoices");
    const invoices: InvoiceItem[] = storedInvoices ? JSON.parse(storedInvoices) : [];

    
    // Calculate Total Purchase
    
    const grandTotal = invoices.reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );

    setTotalPurchase(grandTotal);

    
    // Supplier-wise Total
    
    const grouped = invoices.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.supplier]) {
        acc[item.supplier] = 0;
      }
      acc[item.supplier] += item.total;
      return acc;
    }, {});

    setSupplierTotals(grouped);
  }, []);

  const cardData = [
    { label: "Total Distributors", value: totalDistributors, img: TotalDistributors },
    { label: "Total Purchase", value: `₹ ${totalPurchase}`, img: TotalPurchase },
    { label: "New Distributors", value: totalDistributors, img: NewDistributors },
  ];

  return (
    <Box>
      {/* Heading */}
      <Typography
        sx={{
          fontSize: { xs: 20, sm: 24, md: 28 },
          fontWeight: 700,
          color: "#111827",
          mb: 2,
        }}
      >
        Distributors Dashboard
      </Typography>

      {/* Cards */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "repeat(3, 1fr)" }}
        gap={2}
        mb={4}
      >
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
                boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
              },
            }}
          >
            <Box>
              <Typography fontWeight={600} fontSize={20}>
                {card.value}
              </Typography>
              <Typography color="text.secondary">
                {card.label}
              </Typography>
            </Box>
            <Box component="img" src={card.img} sx={{ width: 60, height: 60 }} />
          </Paper>
        ))}
      </Box>

      {/* Supplier-wise Total Purchase */}
      <Typography fontWeight={600} fontSize={20} mb={2}>
        Supplier Wise Total Purchase
      </Typography>

      <Box display="grid" gap={2}>
        {Object.entries(supplierTotals).map(([supplier, total]) => (
          <Paper key={supplier} sx={{ p: 2, borderRadius: 2 }}>
            <Typography fontWeight={600}>{supplier}</Typography>
            <Typography color="text.secondary">
              ₹ {total}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}

export default DistributorCards;