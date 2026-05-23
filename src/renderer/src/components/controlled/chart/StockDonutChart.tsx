import { Card, Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { FormProvider, useForm } from "react-hook-form";
import DropdownField from "@/components/controlled/DropdownField";
import React, { useState, useEffect } from "react";

import { DistributorResponse, getDistributors } from "@/service/distributorService";
import { 
  RetailInvoiceItemResponse, 
  RetailInvoiceResponse, 
  getAllRetailInvoices,
  getAllRetailInvoiceItems   
} from "@/service/retailInvoiceService";
import { getMedicines, MedicineResponse } from "@/service/medicineService";
function CenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
 
  return (
    <text
      x={left + width / 2}
      y={top + height / 2} 
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fontSize: width < 180 ? 12 : width < 260 ? 15 : 18,
        fontWeight: 700,
      }}
    >
      {children}
    </text>
  );
}
 
type FilterType = "Today" | "6 Days" | "This Month";
 
const filterOptions = [
  { label: "Today", value: "Today" },
  { label: "6 Days", value: "6 Days" },
  { label: "This Month", value: "This Month" },
];
 
const StockDonutChart = ({
  title,
  isOnlyDonutSelected = false,
}: {
  title: string;
  isOnlyDonutSelected?: boolean;
}) => {
  const [filter, setFilter] = useState<FilterType>("This Month");
  const methods = useForm({
    defaultValues: {
      filterSelect: "This Month",
    },
  });
  const handleFilterChange = (value: string) => {
    if (!value || !(value in chartDataMap)) return;
    setFilter(value as FilterType);
  };
const [suppliers, setSuppliers] = useState<DistributorResponse[]>([]);
const [invoices, setInvoices] = useState<RetailInvoiceResponse[]>([]);
const [medicines, setMedicines] = useState<MedicineResponse[]>([]);
const [invoiceItems, setInvoiceItems] = useState<RetailInvoiceItemResponse[]>([]);
// function for date filter dropdown
const isDateInFilter = (dateString: string, filter: FilterType): boolean => {
  const today = new Date();
  const date = new Date(dateString);

  if (filter === "Today") {
    return date.toDateString() === today.toDateString();
  }

  if (filter === "6 Days") {
    const past = new Date();
    past.setDate(today.getDate() - 6);
    return date >= past && date <= today;
  }

  if (filter === "This Month") {
    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  return true;
};

// filters
const filteredSuppliers = suppliers.filter((s) =>
  isDateInFilter(s.createdDate, filter)
);

const filteredSales = invoices.filter((inv) =>
  isDateInFilter(inv.invoiceDate, filter)
);
// Purchases 
const totalPurchases = medicines.reduce(
  (sum, m) => sum + (m.totalStockTablets || 0), 0
);

// Sales 
const filteredInvoiceIds = filteredSales.map(inv => inv.retailInvoiceId);

const totalSalesQty = invoiceItems
  .filter(item => filteredInvoiceIds.includes(item.retailInvoiceId))
  .reduce((sum, item) => sum + (item.quantity || 0), 0);

// No Sales
const noSales = Math.max(totalPurchases - totalSalesQty, 0);
// chartDataMap
const chartDataMap = {
  Today: [
    { label: "Purchases", value: totalPurchases, color: "#6EE700" },
    { label: "Suppliers", value: filteredSuppliers.length, color: "#8B5CF6" },
    { label: "Sales", value: totalSalesQty, color: "#00F5C8" },
    { label: "No Sales", value: noSales, color: "#FFD200" },
  ],
  "6 Days": [
    { label: "Purchases", value: totalPurchases, color: "#6EE700" },
    { label: "Suppliers", value: filteredSuppliers.length, color: "#8B5CF6" },
    { label: "Sales", value: totalSalesQty, color: "#00F5C8" },
    { label: "No Sales", value: noSales, color: "#FFD200" },
  ],
  "This Month": [
    { label: "Purchases", value: totalPurchases, color: "#6EE700" },
    { label: "Suppliers", value: filteredSuppliers.length, color: "#8B5CF6" },
    { label: "Sales", value: totalSalesQty, color: "#00F5C8" },
    { label: "No Sales", value: noSales, color: "#FFD200" },
  ],
};
// fetch data in donut chart
 useEffect(() => {
  const fetchData = async () => {
    try {
      const suppliersData = await getDistributors();
      const invoicesData = await getAllRetailInvoices();
      const medicinesData = await getMedicines();
      setSuppliers(suppliersData);
      setInvoices(invoicesData);
      setMedicines(medicinesData);
      const itemsData = await getAllRetailInvoiceItems();
setInvoiceItems(itemsData);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  fetchData();
}, []);

  const total =
  chartDataMap[filter]?.reduce((sum, d) => sum + d.value, 0) || 0;
const centerPercent = totalPurchases > 0
  ? Math.min(Math.round((totalSalesQty / totalPurchases) * 100), 100)
  : 0;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery("(max-width:360px)");
 
  const chartSize = isOnlyDonutSelected
    ? isSmallMobile
      ? 240
      : isMobile
      ? 290
      : 360
    : isSmallMobile
    ? 160
    : isMobile
    ? 180
    : 260;
 
  const innerRadius = isOnlyDonutSelected
    ? isSmallMobile
      ? 58
      : isMobile
      ? 72
      : 92
    : isSmallMobile
    ? 40
    : isMobile
    ? 45
    : 70;
 
  const outerRadius = isOnlyDonutSelected
    ? isSmallMobile
      ? 95
      : isMobile
      ? 118
      : 145
    : isSmallMobile
    ? 68
    : isMobile
    ? 75
    : 110;
 
  
  return (
    <Card
      variant="outlined"
      sx={{
        p: { xs: 1, sm: 2 },
        overflow: "hidden",
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
        borderRadius: 3,
        width: "100%",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={isOnlyDonutSelected ? 1.5 : 0.5}
        flexWrap="wrap"
        gap={1}
      >
        <Typography
          fontSize={{ xs: 16, md: 18 }}
          fontWeight={600}
          mb={{ xs: 1, md: 5 }}
        >
          {title}
        </Typography>
 
        <FormProvider {...methods}>
          <Box sx={{ width: { xs: "110%", sm: 150 }, mr: { sm: 1 } }}>
            <DropdownField
              name="filterSelect"
              options={filterOptions}
              onChangeCallback={handleFilterChange}
            />
          </Box>
        </FormProvider>
      </Box>
 
      {isOnlyDonutSelected ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            gap: { xs: 2.5, md: 5 },
            py: { xs: 1, md: 2 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: { xs: "100%", lg: "auto" },
            }}
          >
            <PieChart
              margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
              series={[
                {
                  data: chartDataMap[filter],
                  innerRadius,
                  outerRadius,
                  paddingAngle: 3,
                  cornerRadius: 5,
                },
              ]}
              width={chartSize}
              height={chartSize}
              hideLegend
            >
              <CenterLabel>{total}%</CenterLabel>
            </PieChart>
          </Box>
 
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr" },
              columnGap: 3.5,
              rowGap: 2,
              minWidth: { xs: "100%", md: 280 },
              maxWidth: { xs: "100%", md: 320 },
              justifyContent: "center",
            }}
          >
            {chartDataMap[filter].map((item) => (
              <Box
                key={item.label}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  whiteSpace: "nowrap",
                }}
              >
                <Box
                  sx={{
                    width: 11,
                    height: 11,
                    borderRadius: "50%",
                    backgroundColor: item.color,
                    flexShrink: 0,
                  }}
                />
                <Typography fontSize={13.5} color="text.secondary">
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <PieChart
            margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
            series={[
              {
                data: chartDataMap[filter],
                innerRadius,
                outerRadius,
                paddingAngle: 2,
                cornerRadius: 4,
              },
            ]}
            width={chartSize}
            height={chartSize}
          >
            <CenterLabel>{centerPercent}%</CenterLabel>
          </PieChart>
        </Box>
      )}
    </Card>
  );
};
 
export default StockDonutChart;