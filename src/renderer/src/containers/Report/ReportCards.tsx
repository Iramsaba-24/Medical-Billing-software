

import { Box, Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react";

import TotalSalesReport from "@/assets/TotalSalesReport.svg";
import TotalPurchaseReport from "@/assets/TotalPurchaseReport.svg";
import ProfitReport from "@/assets/ProfitReport.svg";

type CustomerItem = {
  qty: number;
  price: number;
};

type CustomerStorage = {
  itemsList?: CustomerItem[];
};

type RetailInvoiceItem = {
  total?: number;
};

function ReportCards() {
  const [totalSales, setTotalSales] = useState<number>(0);
  const [totalPurchase, setTotalPurchase] = useState<number>(0);

  const calculateTotals = () => {
    
    //  SALES (From medical_customers)
   
    const customerData: CustomerStorage[] = JSON.parse(
      localStorage.getItem("medical_customers") || "[]"
    );

    const sales = customerData.reduce((sum, customer) => {
      const customerTotal =
        customer.itemsList?.reduce(
          (itemSum, item) =>
            itemSum +
            (Number(item.qty) || 0) *
            (Number(item.price) || 0),
          0
        ) || 0;

      return sum + customerTotal;
    }, 0);

    setTotalSales(sales);

   
    //  PURCHASE (From retailInvoices)
   
    const retailInvoices: RetailInvoiceItem[] = JSON.parse(
      localStorage.getItem("retailInvoices") || "[]"
    );

    const purchase = retailInvoices.reduce(
      (sum, invoice) => sum + (Number(invoice.total) || 0),
      0
    );

    setTotalPurchase(purchase);
  };

  useEffect(() => {
    calculateTotals();

    // Auto refresh when data updates
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
      {cards.map((card) => (
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
            <Typography variant="body2">
              {card.label}
            </Typography>
          </Box>

          <Box component="img" src={card.img} width={55} />
        </Paper>
      ))}
    </Box>
  );
}

export default ReportCards;