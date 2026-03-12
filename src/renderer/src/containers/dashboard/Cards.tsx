import React, { useState } from "react";
import { Box, Card, Typography, Divider } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import DropdownField from "@/components/controlled/DropdownField";
import { InventoryItem } from "@/containers/inventory/AddInventoryItem";

type FilterType = "Today" | "6 Days" | "This Month";
interface PurchaseData {
  totalPrice: number;
  date: string;
}
interface CardInfo {
  title: string;
  data: Partial<
    Record<
      FilterType,
      {
        leftValue?: string;
        leftLabel?: string;
        rightValue?: string;
        rightLabel?: string;
      }
    >
  >;
}
interface Medicine {
  name: string;
  qty: number;
}

interface Invoice {
  medicines: Medicine[];
}

const cardsConfig: CardInfo[] = [
  {
    title: "Inventory",
    data: {
      Today: {
        leftLabel: "Total Medicines",
        rightLabel: "Medicine Groups",
      },
      "6 Days": {
        leftLabel: "Total Medicines",
        rightLabel: "Medicine Groups",
      },
      "This Month": {
        leftLabel: "Total Medicines",
        rightLabel: "Medicine Groups",
      },
    },
  },
  {
    title: "Top Selling Medicine",
    data: {
      Today: {
        leftLabel: "Top Medicine",
      },
      "6 Days": {
        leftLabel: "Top Medicine",
      },
      "This Month": {
        leftLabel: "Top Medicine",
      },
    },
  },
  {
    title: "Daily Report",
    data: {
      Today: {
        leftLabel: "Today's Sale",
        rightLabel: "Today's Purchase",
      },
      "6 Days": {
        leftLabel: "Sales (6 Days)",
        rightLabel: "Purchase (6 Days)",
      },
      "This Month": {
        leftLabel: "Monthly Sales",
        rightLabel: "Monthly Purchase",
      },
    },
  },
];

const filterOptions = [
  { label: "Today", value: "Today" },
  { label: "6 Days", value: "6 Days" },
  { label: "This Month", value: "This Month" },
];

const getGridArea = (title: string) => {
  switch (title) {
    case "Inventory":
      return "inventory";
    case "Top Selling Medicine":
      return "top";
    case "Daily Report":
      return "daily";
    default:
      return "auto";
  }
};
interface SalesData {
  id: number;
  name: string;
  medicine: string;
  quantity: number;
  totalPrice: number;
  date: string;
  time: string;
}

const Cards: React.FC = () => {

  // filter for the dropdown
  const getFilteredSalesData = (filter: FilterType): SalesData[] => {
  const stored = localStorage.getItem("invoices");
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

  // jar purchase data vegla localStorage madhe asel tar
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
const getTopSellingMedicine = (): string => {
  const stored = localStorage.getItem("invoices");
  if (!stored) return "No Data";

  const invoices: Invoice[] = JSON.parse(stored);

  const counts: Record<string, number> = {};

  invoices.forEach((sale) => {
    sale.medicines?.forEach((med) => {
      const name = med.name;

      counts[name] = (counts[name] || 0) + (med.qty || 1);
    });
  });

  let topMedicine = "";
  let highest = 0;

  Object.entries(counts).forEach(([name, qty]) => {
    if (qty > highest) {
      highest = qty;
      topMedicine = name;
    }
  });

  return topMedicine || "No Data";
};

  const [filters, setFilters] = useState<Record<number, FilterType>>({
    0: "This Month",
    1: "This Month",
    2: "This Month",
  });

  const methodsArray = [
    useForm({ defaultValues: { filter: "This Month" } }),
    useForm({ defaultValues: { filter: "This Month" } }),
    useForm({ defaultValues: { filter: "This Month" } }),
  ];

  const handleFilterChange = (index: number) => (value: string) => {
    setFilters((prev) => ({
      ...prev,
      [index]: value as FilterType,
    }));
  };

  // fetch total medicines from local storage
  const totalMedicines = (): string => {
  const data = localStorage.getItem("inventory");
  if (!data) {
    return "0";
  }
  const parsedData: InventoryItem[] = JSON.parse(data);
  return parsedData.length.toString();
  };

  //fetch total medicine group from local storage
  const totalMedicineGroups =() : string =>
  {
    const data = localStorage.getItem("medicineGroups")
    if(!data){
      return "0"
    }
    const parsedData = JSON.parse(data);
    return parsedData.length.toString();
  }
  return (
    <Box width="100%">
      <Box
        sx={{
          display: "grid",
          gridTemplateAreas: {
            xs: `
              "inventory"
              "top"
              "daily"
            `,
            md: `
              "inventory daily"
              "top daily"
            `,
          },
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 2,
        }}
      >
        {cardsConfig.map((card, index) => {
          const filter = filters[index];
          const info = card.data[filter];
          const methods = methodsArray[index];

          return (
            <Card
              key={index}
              
              sx={{
                gridArea: getGridArea(card.title),
                p: 3,
                borderRadius: 2,
                border: "1px solid #E5E7EB",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  //boxShadow: 6,
                   boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                },
              }}
            >
              {/* Header */}
              <Box display="flex" justifyContent="space-between" mb={2} gap={2}>
                <Typography fontWeight={600} fontSize={{xs:16, md:18}}>{card.title}</Typography>

                <FormProvider {...methods}>
                  <Box width={200} height={50}>
                    <DropdownField
                      name="filter"
                      options={filterOptions}
                      onChangeCallback={handleFilterChange(index)}
                    />
                  </Box>
                </FormProvider>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Content */}
              {card.title === "Daily Report" ? (
                <Box display="flex" flexDirection="column" gap={2}>

                  {/* Sales */}
                  <Box>
                    <Typography fontWeight={700}>
                      {getDailyReportData(filter).sales}  
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                      {info?.leftLabel}
                    </Typography>
                    <Box
                      sx={{
                        mt: 1,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "#E5E7EB",
                      }}
                    >
                      <Box
                        sx={{
                          width: "45%",
                          height: "100%",
                          borderRadius: 5,
                          backgroundColor: "#238878",
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Purchase */}
                  <Box>
                    <Typography fontWeight={700}>
                      {getDailyReportData(filter).purchase}                    
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                      {info?.rightLabel}
                    </Typography>
                    <Box
                      sx={{
                        mt: 1,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "#E5E7EB",
                      }}
                    >
                      <Box
                        sx={{
                          width: "60%",
                          height: "100%",
                          borderRadius: 5,
                          backgroundColor: "#238878",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box display="flex" justifyContent="space-between">
                  <Box >
                    <Typography fontSize={24} fontWeight={800}>
                      {card.title === "Inventory"
                        ? totalMedicines()//function to get total medicines count from local storage
                        : card.title === "Top Selling Medicine"
                        ? getTopSellingMedicine() //function to get top selling medicine from local storage
                        : info?.leftValue}
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                      {info?.leftLabel}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography fontSize={24} fontWeight={700}>
                      {/* {info?.rightValue} */}
                      {card.title === "Inventory"
                        ? totalMedicineGroups() //function to get total medicine groups count from local storage
                        : info?.rightValue}
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                      {info?.rightLabel}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Card>
          );
          
        })}
      </Box>
    </Box>
  );
};

export default Cards;