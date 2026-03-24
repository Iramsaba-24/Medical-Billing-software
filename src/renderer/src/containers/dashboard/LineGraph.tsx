import React from "react";
import { Box, Typography } from "@mui/material";

interface SalesData {
  totalPrice: number;
  date: string;
}

const LineGraph: React.FC = () => {

const parseDate = (dateStr: string) => {
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;

  // handle dd/mm/yyyy (your case)
  const [day, month, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}`);
};

const isToday = (dateStr: string) => {
  const today = new Date();
  const d = parseDate(dateStr);

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
    const allSales = [...retailSales, ...distributorSales].filter((sale) =>
      isToday(sale.date)
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
    <Box display="flex" flexDirection="column" gap={4}>

      {/* Sales */}
      <Box>
        <Typography fontWeight={700}>
          ₹ {totalSales.toFixed(2)}
        </Typography>

        <Typography fontSize={12}>
          Today's Sales
        </Typography>

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

      {/* Purchase UI */}
      <Box>
        <Typography fontWeight={700}>
          ₹ {totalPurchase.toFixed(2)}
        </Typography>

        <Typography fontSize={12}>
          Purchase
        </Typography>

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