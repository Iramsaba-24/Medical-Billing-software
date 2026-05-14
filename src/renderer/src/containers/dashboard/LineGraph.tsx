import React, { useEffect, useState } from "react";
import { Box, Typography, Card, Divider } from "@mui/material";
import { getAllRetailInvoices, RetailInvoiceResponse } from "@/service/retailInvoiceService";
import { getMedicines, MedicineResponse } from "@/service/medicineService";
const LineGraph: React.FC = () => {
  const [totalSales, setTotalSales] = useState<number>(0);
  // const [totalPurchase] = useState<number>(0);
  const [totalPurchase, setTotalPurchase] = useState<number>(0);
 

  // helper function to check if date is today
const isToday = (dateStr: string): boolean => {
  const today = new Date().toISOString().split("T")[0];
  const d = new Date(dateStr).toISOString().split("T")[0];

  return d === today;
};

  useEffect(() => {
    const fetchTodaySales = async () => {
      try {
        const data: RetailInvoiceResponse[] = await getAllRetailInvoices();

        // filter today's invoices
        const todaySales = data.filter(
          (inv) =>
            inv.invoiceDate &&
            isToday(inv.invoiceDate) 
            // && inv.paymentStatus === "Paid"   
        );

        // calculate total
        const total = todaySales.reduce(
          (sum, item) => sum + (item.totalAmount || 0),
          0
        );

        setTotalSales(total);
      } catch (error) {
        console.error("Error fetching sales", error);
      }
    };

    fetchTodaySales();
  }, []);
  //for todays purchase
useEffect(() => {
  const fetchTodayPurchase = async () => {
    try {
      const medicines: MedicineResponse[] = await getMedicines();

      const todayMedicines = medicines.filter(
        (med) => med.purchaseDate && isToday(med.purchaseDate)
      );

      const total = todayMedicines.reduce((sum, med) => {
        const strips = med.numberOfStrips || 0;
        const pricePerStrip = med.purchasePricePerStrip || 0;
        return sum + strips * pricePerStrip;
      }, 0);

      setTotalPurchase(total);
    } catch (error) {
      console.error("Error fetching purchase", error);
    }
  };

  fetchTodayPurchase();
}, []);

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
      <Typography fontWeight={600} fontSize={{ xs: 14, sm: 18 }} mb={2}>
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

        {/* Purchase */}
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