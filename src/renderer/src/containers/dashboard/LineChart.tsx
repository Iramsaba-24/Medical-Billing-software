
import React from "react";
import { Box, Typography, Divider, Card } from "@mui/material";

type FilterType = "Today" | "6 Days" | "This Month";

interface SalesData {
  id: number;
  name: string;
  medicine: string;
  quantity: number;
  totalPrice: number;
  date: string;
  time: string;
}

interface PurchaseData {
  totalPrice: number;
  date: string;
}

const LineChart: React.FC<{ filter: FilterType }> = ({ filter }) => {

  const getFilteredSalesData = (filter: FilterType): SalesData[] => {
    const stored = localStorage.getItem("currentInvoice");
    if (!stored) return [];

    const sales: SalesData[] = JSON.parse(stored);
    const today = new Date();

    return sales.filter((sale) => {
      const date = new Date(sale.date);

      switch (filter) {
        case "Today":
          return date.toDateString() === today.toDateString();

        case "6 Days": {
          const sixDaysAgo = new Date();
          sixDaysAgo.setDate(today.getDate() - 6);
          return date >= sixDaysAgo && date <= today;
        }

        case "This Month":
          return (
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
          );

        default:
          return true;
      }
    });
  };

  const getDailyReportData = (filter: FilterType) => {
    const filteredSales = getFilteredSalesData(filter);

    const totalSales = filteredSales.reduce(
      (sum, sale) => sum + sale.totalPrice,
      0
    );

    const storedPurchase = localStorage.getItem("purchaseData");
    let totalPurchase = 0;

    if (storedPurchase) {
      const purchases: PurchaseData[] = JSON.parse(storedPurchase);

      totalPurchase = purchases.reduce(
        (sum: number, p: PurchaseData) => sum + p.totalPrice,
        0
      );
    }

    return {
      sales: `₹ ${totalSales.toFixed(2)}`,
      purchase: `₹ ${totalPurchase.toFixed(2)}`,
    };
  };

  const data = getDailyReportData(filter);

  return (
    <Card
      sx={{
        gridArea: "daily",
        p: 3,
        borderRadius: 2,
        border: "1px solid #E5E7EB",
        transition: "0.3s",
      }}
    >
      <Typography fontWeight={600}>Daily Report</Typography>
      <Divider sx={{ my: 2 }} />

      <Box display="flex" flexDirection="column" gap={2}>
        <Box>
          <Typography fontWeight={700}>{data.sales}</Typography>
          <Typography fontSize={12}>Monthly Sales</Typography>
        </Box>

        <Box>
          <Typography fontWeight={700}>{data.purchase}</Typography>
          <Typography fontSize={12}>Monthly Purchase</Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default LineChart;