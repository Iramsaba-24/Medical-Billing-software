import React from "react";
import { Box, Typography, Card, Divider } from "@mui/material";
 
interface SalesData {
  totalPrice: number;
  date: string;
}
 
const LineGraph: React.FC = () => {
 
  // const parseDate = (dateStr: string) => {
  //   const d = new Date(dateStr);
  //   if (!isNaN(d.getTime())) return d;
 
  //   // handle dd/mm/yyyy (your case)
  //   const [day, month, year] = dateStr.split("/");
  //   return new Date(`${year}-${month}-${day}`);
  // };
 
  // const isToday = (dateStr: string) => {
  //   const today = new Date();
  //   const d = parseDate(dateStr);
 
  //   return d.toDateString() === today.toDateString();
  // };
 
  const parseDate = (dateStr: string) => {
  if (!dateStr) return null; 

  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;

  const [day, month, year] = dateStr.split("/");
  if (!day || !month || !year) return null; 
  return new Date(`${year}-${month}-${day}`);
};

const isToday = (dateStr: string) => {
  if (!dateStr) return false; 

  const today = new Date();
  const d = parseDate(dateStr);

  if (!d) return false; 
  return d.toDateString() === today.toDateString();
};

  const getData = () => {
    const storedRetail = localStorage.getItem("currentInvoice");
    const storedDistributor = localStorage.getItem("currentNewInvoiceList");
 
    let retailSales: SalesData[] = [];
    let distributorSales: SalesData[] = [];
 
    if (storedRetail) {
      retailSales = JSON.parse(storedRetail);
    }
 
    if (storedDistributor) {
      distributorSales = JSON.parse(storedDistributor);
    }
 
    // Combine + filter only TODAY
    // const allSales = [...retailSales, ...distributorSales].filter((sale) =>
    //   isToday(sale.date)
    // );
    const allSales = [...retailSales, ...distributorSales].filter((sale) =>
  sale?.date && isToday(sale.date)
);
 
    const totalSales = allSales.reduce(
      (sum, s) => sum + (s.totalPrice || 0),
      0
    );
 
    return {
      totalSales,
      totalPurchase: 0,
    };
  };
 
  const { totalSales, totalPurchase } = getData();
 
  const max = Math.max(totalSales, totalPurchase, 1);
 
  const salesPercent = (totalSales / max) * 100;
  const purchasePercent = (totalPurchase / max) * 100;
 
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid #E5E7EB",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        backgroundColor: "#fff",
      }}
    >
      <Typography  fontWeight={600} fontSize={{ xs: 14, sm: 18 }} mb={2}>
        Daily Report
      </Typography>
 
      <Divider sx={{ mb: 4, borderColor: "#9CA3AF" }} />
 
      <Box display="flex" flexDirection="column" gap={6}>
 
        {/* Sales */}
        <Box>
          <Typography fontWeight={700} fontSize={18}>
            ₹ {totalSales.toFixed(2)}
          </Typography>
 
          <Typography fontSize={15} mt={1}>
            Today&apos;s Sale
          </Typography>
 
          <Box
            sx={{
              mt: 3,
              height: 18,
              borderRadius: 999,
              background: "#D1D5DB",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${salesPercent}%`,
                height: "100%",
                borderRadius: 999,
                background: "#238878",
              }}
            />
          </Box>
        </Box>
 
        {/* Purchase UI */}
        <Box>
          <Typography fontWeight={700} fontSize={18}>
            ₹ {totalPurchase.toFixed(2)}
          </Typography>
 
          <Typography fontSize={15} mt={1}>
            Today&apos;s Purchase
          </Typography>
 
          <Box
            sx={{
              mt: 3,
              height: 18,
              borderRadius: 999,
              background: "#D1D5DB",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${purchasePercent}%`,
                height: "100%",
                borderRadius: 999,
                background: "#238878",
              }}
            />
          </Box>
        </Box>
 
      </Box>
    </Card>
  );
};
 
export default LineGraph;
 