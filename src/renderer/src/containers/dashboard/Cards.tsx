
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
    default:
      return "auto";
  }
};

const Cards: React.FC = () => {
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
    const data = localStorage.getItem("inventory");
    if (!data) return "0";
    const parsedData: InventoryItem[] = JSON.parse(data);
    return parsedData.length.toString();
  };

  const totalMedicineGroups = (): string => {
    const data = localStorage.getItem("medicineGroups");
    if (!data) return "0";
    const parsedData = JSON.parse(data);
    return parsedData.length.toString();
  };

  const getSelectedTopMedicine = (): string => {
    const stored = localStorage.getItem("topSellingMedicine");
    return stored || "No Medicine Selected";
  };

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
              <Typography fontWeight={600}>{card.title}</Typography>

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
                <Typography fontSize={24} fontWeight={800}>
                  {card.title === "Inventory"
                    ? totalMedicines()
                    : getSelectedTopMedicine()}
                </Typography>
                <Typography fontSize={12} color="text.secondary">
                  {info?.leftLabel}
                </Typography>
              </Box>

              {card.title === "Inventory" && (
                <Box>
                  <Typography fontSize={24} fontWeight={700}>
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
