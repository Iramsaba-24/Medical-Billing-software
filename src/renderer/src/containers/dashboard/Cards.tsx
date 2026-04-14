import React, { useEffect, useState } from "react";
import { Box, Card, Typography, Divider } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import DropdownField from "@/components/controlled/DropdownField";
import {getDashboardInventory,getTopSellingMedicine,DashboardInventoryResponse,DashboardTopSellingResponse,} from "@/service/dashboardService";

type FilterType = "Today" | "6 Days" | "This Month";
 const filterOptions = [
  { label: "Today", value: "Today" },
  { label: "6 Days", value: "6 Days" },
  { label: "This Month", value: "This Month" },
];
interface CardInfo {
  title: string;
  data: Partial<
    Record<
      FilterType,
      {
        leftLabel?: string;
        rightLabel?: string;
      }
    >
  >;
}
 
const cardsConfig: CardInfo[] = [
  {
    title: "Inventory",
    data: {
      Today: { leftLabel: "Total Medicines", rightLabel: "Medicine Groups" },
      "6 Days": { leftLabel: "Total Medicines", rightLabel: "Medicine Groups" },
      "This Month": { leftLabel: "Total Medicines", rightLabel: "Medicine Groups" },
    },
  },
  {
    title: "Top Selling Medicine",
    data: {
      Today: { leftLabel: "Top Medicine" },
      "6 Days": { leftLabel: "Top Medicine" },
      "This Month": { leftLabel: "Top Medicine" },
    },
  },
];

const durationMap: Record<FilterType, string> = {
  Today: "today",
  "6 Days": "last6Days",
  "This Month": "monthly",
};
const getGridArea = (title: string) => {
  switch (title) {
    case "Inventory":
      return "inventory";
    case "Top Selling Medicine":
      return "top";
    default:
      return "auto";
  }
};
 
const Cards: React.FC = () => {

    const [inventoryData, setInventoryData] =
    useState<DashboardInventoryResponse | null>(null);

  const [topMedicine, setTopMedicine] =
    useState<DashboardTopSellingResponse | null>(null);

  const [filters, setFilters] = useState<Record<number, FilterType>>({
    0: "This Month",
    1: "This Month",
  });
 
  const methodsArray = [
    useForm({ defaultValues: { filter: "This Month" } }),
    useForm({ defaultValues: { filter: "This Month" } }),
  ];
 
  const handleFilterChange = (index: number) => (value: string) => {
    setFilters((prev) => ({
      ...prev,
      [index]: value as FilterType,
    }));
  };
 
const totalMedicines = (): string => {
  return (inventoryData?.medicineCount ?? 0).toString();
};

const totalMedicineGroups = (): string => {
  return (inventoryData?.medicineGroupCount ?? 0).toString();
};
 useEffect(() => {
    const fetchData = async () => {
      try {
        const duration = durationMap[filters[0]];

        const [inventoryRes, topRes] = await Promise.all([
          getDashboardInventory(duration),
          getTopSellingMedicine(duration),
        ]);

        setInventoryData(inventoryRes);
        setTopMedicine(topRes);
      } catch (error) {
        console.error("Dashboard Cards Error:", error);
      }
    };

    fetchData();
  }, [filters]);
 
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateAreas: {
          xs: `
            "inventory"
            "top"
          `,
          md: `
            "inventory"
            "top"
          `,
        },
        gridTemplateColumns: {
          xs: "1fr",
          md: "1fr",
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
                boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
              },
            }}
          >
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography fontSize={{ xs: 16, md: 18 }}           mb={{ xs: 1, md: 5 }}
                fontWeight={600}>{card.title}</Typography>

              <FormProvider {...methods}>
                <Box width={150}>
                  <DropdownField
                    name="filter"
                    options={filterOptions}
                    onChangeCallback={handleFilterChange(index)}
                  />
                </Box>
              </FormProvider>
            </Box>
 
            <Divider sx={{ mb: 2 }} />
 
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography  fontWeight={700} fontSize={{ xs: 18, sm: 22, md:24}} mb={2}>
                  {card.title === "Inventory"
                    ? totalMedicines()
                    : topMedicine?.medicineName ?? "No Data"}
                </Typography>
                <Typography fontSize={12} color="text.secondary">
                  {info?.leftLabel}
                </Typography>
              </Box>
 
              {card.title === "Inventory" && (
                <Box>
                  <Typography  fontWeight={700} fontSize={{ xs: 18, sm: 22, md:24}} mb={2}>
                    {totalMedicineGroups()}
                  </Typography>
                  <Typography fontSize={12} color="text.secondary">
                    {info?.rightLabel}
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        );
      })}
    </Box>
  );
};
 
export default Cards;
 
 