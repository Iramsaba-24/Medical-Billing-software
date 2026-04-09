import { Box, Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import TotalSalesReport from "@/assets/TotalSalesReport.svg";
import TotalPurchaseReport from "@/assets/TotalPurchaseReport.svg";
import ProfitReport from "@/assets/ProfitReport.svg";

type RetailInvoiceItem = {
  total?: number;
};

function ReportCards() {
  const [totalSales, setTotalSales] = useState<number>(0);
  const [totalPurchase, setTotalPurchase] = useState<number>(0);

  const settings = JSON.parse(localStorage.getItem("report_settings") || "{}");
  const visibleCards: string[] = settings?.card_visibility_control || [];

  const calculateTotals = () => {
    const syncedSales = localStorage.getItem("global_total_sales");

    if (syncedSales !== null) {
      setTotalSales(Number(JSON.parse(syncedSales)));
    } else {
      setTotalSales(0);
    }

    
    const syncedPurchase = localStorage.getItem("global_total_purchase");

    if (syncedPurchase !== null) {
      setTotalPurchase(Number(JSON.parse(syncedPurchase)));
    } else {
      const retailInvoices: RetailInvoiceItem[] = JSON.parse(
        localStorage.getItem("retailInvoices") || "[]"
      );

      const purchase = retailInvoices.reduce(
        (sum, invoice) => sum + (Number(invoice.total) || 0),
        0
      );

      setTotalPurchase(purchase);
    }
  };

  useEffect(() => {
    calculateTotals();

    window.addEventListener("reportUpdated", calculateTotals);

    return () => {
      window.removeEventListener("reportUpdated", calculateTotals);
    };
  }, []);

  const profit = totalSales - totalPurchase;

  const cards = [
    {
      label: "Total Sales Report",
      value: `₹ ${totalSales.toLocaleString()}`,
      img: TotalSalesReport,
    },
    {
      label: "Total Purchase",
      value: `₹ ${totalPurchase.toLocaleString()}`,
      img: TotalPurchaseReport,
    },
    {
      label: "Profit",
      value: `₹ ${profit.toLocaleString()}`,
      img: ProfitReport,
    },
  ];

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "1fr", sm: "repeat(3, 1fr)" }}
      gap={3}
      mb={4}
    >
      {cards
        .filter((card) => visibleCards.includes(card.label))
        .map((card) => (
          <Paper
            key={card.label}
            sx={{
              p: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {card.value}
              </Typography>
              <Typography variant="body2">{card.label}</Typography>
            </Box>
            <Box component="img" src={card.img} width={55} />
          </Paper>
        ))}
    </Box>
  );
}

export default ReportCards;