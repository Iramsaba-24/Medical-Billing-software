import { Box, Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react";

import TotalSalesReport from "@/assets/TotalSalesReport.svg";
import TotalPurchaseReport from "@/assets/TotalPurchaseReport.svg";
import ProfitReport from "@/assets/ProfitReport.svg";

import {
  getAllRetailInvoices,
  getRetailInvoiceItemsByInvoiceId,
} from "@/service/retailInvoiceService";

import {
  getDistributors,
  DistributorResponse,
} from "@/service/distributorService";

type RetailInvoice = {
  retailInvoiceId: number;
  customerId: number;
  invoiceDate: string;
};

type RetailInvoiceItem = {
  medicineId: number;
  quantity: number;
  price: number;
};

type DistributorWithPurchase = DistributorResponse & {
  totalPurchase?: number;
};

function ReportCards() {
  const [totalSales, setTotalSales] = useState<number>(0);
  const [totalPurchase, setTotalPurchase] = useState<number>(0);

  const calculateSales = async () => {
    try {
      const invoices: RetailInvoice[] = await getAllRetailInvoices();

      let sales = 0;

      for (const inv of invoices) {
        const items: RetailInvoiceItem[] =
          await getRetailInvoiceItemsByInvoiceId(inv.retailInvoiceId);

        for (const item of items) {
          sales += (item.price || 0) * (item.quantity || 0);
        }
      }

      setTotalSales(sales);
    } catch (error) {
      console.error("Error calculating sales:", error);
      setTotalSales(0);
    }
  };

  const calculatePurchase = async () => {
    try {
      const distributors: DistributorWithPurchase[] = await getDistributors();

      const purchaseValue =
        distributors?.[0]?.totalPurchase ?? 0;

      setTotalPurchase(purchaseValue);
    } catch (error) {
      console.error("Error fetching purchase:", error);
      setTotalPurchase(0);
    }
  };

  useEffect(() => {
    calculateSales();
    calculatePurchase();
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
            <Typography variant="body2">{card.label}</Typography>
          </Box>

          <Box component="img" src={card.img} width={55} />
        </Paper>
      ))}
    </Box>
  );
}

export default ReportCards;