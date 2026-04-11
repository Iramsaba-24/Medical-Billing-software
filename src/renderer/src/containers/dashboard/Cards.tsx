import React, { useEffect, useState } from "react";
import { Box, Card, Typography, Divider } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import DropdownField from "@/components/controlled/DropdownField";
import { getMedicines, MedicineResponse } from "@/service/medicineService";
import { getMedicineGroups, MedicineGroupResponse } from "@/service/medicineGroupService";
import { getAllRetailInvoices, getRetailInvoiceItemsByInvoiceId, RetailInvoiceResponse } from "@/service/retailInvoiceService";

type InvoiceItem = {
  medicineId: number;
  quantity: number;
};
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
//date filter function for top selling medicine 
const filterInvoicesByDate = (
  invoices: RetailInvoiceResponse[],
  filter: FilterType
) => {
  const today = new Date();

  return invoices.filter((inv) => {
    const invDate = new Date(inv.invoiceDate);

    if (filter === "Today") {
      return invDate.toDateString() === today.toDateString();
    }

    if (filter === "6 Days") {
      const past = new Date();
      past.setDate(today.getDate() - 6);
      return invDate >= past && invDate <= today;
    }

    if (filter === "This Month") {
      return (
        invDate.getMonth() === today.getMonth() &&
        invDate.getFullYear() === today.getFullYear()
      );
    }

    return true;
  });
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

  const [inventory, setInventory] = useState<MedicineResponse[]>([]);
const [medicineGroups, setMedicineGroups] = useState<MedicineGroupResponse[]>([]);
const [topMedicine, setTopMedicine] = useState<string>("Loading...");
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
  return inventory.length.toString();
};
 
const totalMedicineGroups = (): string => {
  return medicineGroups.length.toString();
};


useEffect(() => {
  const fetchData = async () => {
    try {
      const [medicines, groups, invoices] = await Promise.all([
        getMedicines(),
        getMedicineGroups(),
        getAllRetailInvoices(),
      ]);

      setInventory(medicines);
      setMedicineGroups(groups);

      // top selling medicine filter
const salesMap: Record<number, number> = {};
const filteredInvoices = filterInvoicesByDate(invoices, filters[1]);

for (const inv of filteredInvoices) {        
  const items = await getRetailInvoiceItemsByInvoiceId(inv.retailInvoiceId);

        items.forEach((item: InvoiceItem) => {
          const medId = item.medicineId;
          const qty = item.quantity;

          salesMap[medId] = (salesMap[medId] || 0) + qty;
        });
      }

      // find max
      let topMedId = 0;
      let maxQty = 0;

      for (const id in salesMap) {
        if (salesMap[id] > maxQty) {
          maxQty = salesMap[id];
          topMedId = Number(id);
        }
      }

      // find name
const topMed = medicines.find((m: MedicineResponse) => m.medicineId === topMedId);      setTopMedicine(topMed ? topMed.itemName : "No Data");

    } catch (error) {
      console.error("Error fetching data:", error);
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
                <Typography  fontWeight={700} fontSize={{ xs: 18, sm: 22, md:24}} mb={2}>
                  {card.title === "Inventory"
                    ? totalMedicines()
                    : topMedicine}
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
 
 