import React from "react";
import { Box, Typography } from "@mui/material";
 
type FilterType = "Today" | "6 Days" | "This Month";
 
interface SalesData {
  totalPrice: number;
  date: string;
}
 
interface PurchaseData {
  totalPrice: number;
  date: string;
}
 
const LineGraph: React.FC<{ filter: FilterType }> = ({ filter }) => {
 
  const getFilteredSalesData = (): SalesData[] => {
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
 
  const getData = () => {
    const sales = getFilteredSalesData();
 
    const totalSales = sales.reduce((sum, s) => sum + s.totalPrice, 0);
 
    const storedPurchase = localStorage.getItem("purchaseData");
    let totalPurchase = 0;
 
    if (storedPurchase) {
      const purchases: PurchaseData[] = JSON.parse(storedPurchase);
      totalPurchase = purchases.reduce((sum, p) => sum + p.totalPrice, 0);
    }
 
    return { totalSales, totalPurchase };
  };
 
  const { totalSales, totalPurchase } = getData();
 
  // dynamic percentage
  const max = Math.max(totalSales, totalPurchase, 1);
 
  const salesPercent = (totalSales / max) * 100;
  const purchasePercent = (totalPurchase / max) * 100;
 
  return (
    <Box display="flex" flexDirection="column" gap={4}>
 
      {/* Sales */}
      <Box>
        <Typography fontWeight={700}>₹ {totalSales.toFixed(2)}</Typography>
        <Typography fontSize={12}>Sales</Typography>
 
        <Box sx={{ mt: 1, height: 10, borderRadius: 5, background: "#E5E7EB" }}>
          <Box
            sx={{
              width: `${salesPercent}%`,
              height: "100%",
              borderRadius: 5,
              background: "#238878",
            }}
          />
        </Box>
      </Box>
 
      {/* Purchase */}
      <Box>
        <Typography fontWeight={700}>₹ {totalPurchase.toFixed(2)}</Typography>
        <Typography fontSize={12}>Purchase</Typography>
 
        <Box sx={{ mt: 1, height: 10, borderRadius: 5, background: "#E5E7EB" }}>
          <Box
            sx={{
              width: `${purchasePercent}%`,
              height: "100%",
              borderRadius: 5,
              background: "#238878",
            }}
          />
        </Box>
      </Box>
 
    </Box>
  );
};
 
export default LineGraph;
 