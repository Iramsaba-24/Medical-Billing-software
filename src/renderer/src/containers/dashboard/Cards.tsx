import React, { useState } from "react";
import { Box, Card, Typography, Divider } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import DropdownField from "@/components/controlled/DropdownField";
import { InventoryItem } from "@/containers/inventory/AddInventoryItem";

type FilterType = "Today" | "6 Days" | "This Month";

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

const cardsConfig: CardInfo[] = [
  {
    title: "Inventory",
    data: {
      Today: {
        leftValue: "290",
        leftLabel: "Total no of Medicines",
        rightValue: "22",
        rightLabel: "Medicines Group",
      },
      "6 Days": {
        leftValue: "295",
        leftLabel: "Total no of Medicines",
        rightValue: "23",
        rightLabel: "Medicines Group",
      },
      "This Month": {
        leftValue: "298",
        leftLabel: "Total no of Medicines",
        rightValue: "24",
        rightLabel: "Medicines Group",
      },
    },
  },
  {
    title: "Top Selling Medicine",
    data: {
      Today: {
        leftValue: "Paracetamol 500mg",
        leftLabel: "Frequently bought Item",
      },
      "6 Days": {
        leftValue: "Vitamin C",
        leftLabel: "Frequently bought Item",
      },
      "This Month": {
        leftValue: "Paracetamol 500mg",
        leftLabel: "Frequently bought Item",
      },
    },
  },
  {
    title: "Daily Report",
    data: {
      Today: {
        leftValue: "₹ 3,125",
        leftLabel: "Today's Sale",
        rightValue: "₹ 6,123",
        rightLabel: "Today's Purchase",
      },
      "6 Days": {
        leftValue: "₹ 18,450",
        leftLabel: "Sales (6 Days)",
        rightValue: "₹ 25,300",
        rightLabel: "Purchase (6 Days)",
      },
      "This Month": {
        leftValue: "₹ 78,560",
        leftLabel: "Monthly Sales",
        rightValue: "₹ 92,340",
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
  const getTopSellingMedicine = (): string => {
  const stored = localStorage.getItem("salesData");
  if (!stored) return "No Sales";

  const sales: SalesData[] = JSON.parse(stored);

  const counts: Record<string, number> = {};

  sales.forEach((sale) => {
    const medicineList = sale.medicine.split(",");

    medicineList.forEach((item) => {
      const name = item.trim();
      counts[name] = (counts[name] || 0) + sale.quantity;
    });
  });

  let highestMedicine = "";
  let highestCount = 0;

  Object.entries(counts).forEach(([medicine, qty]) => {
    if (qty > highestCount) {
      highestCount = qty;
      highestMedicine = medicine;
    }
  });

  return highestMedicine || "No Data";
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
                     // isStatic={true}
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
                      {info?.leftValue}
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
                      {info?.rightValue}
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
                    {/* <Typography fontSize={24} fontWeight={800}>
                      {card.title === "Inventory"
                        ? totalMedicines()  
                        : info?.leftValue}
                    </Typography> */}
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
