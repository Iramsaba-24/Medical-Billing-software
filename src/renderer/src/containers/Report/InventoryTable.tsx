
import { useState, useMemo, useEffect } from "react";
import { Box, Chip, Typography, Stack, Paper, Divider } from "@mui/material";
import { UniversalTable, Column } from "@/components/uncontrolled/UniversalTable";

import { useForm, FormProvider } from "react-hook-form";
import DropdownField from "@/components/controlled/DropdownField"; 

//  TYPES

type InventoryItem = {
  itemName: string;
  itemId: string;
  medicineGroup: string;
  stockQty: number;
  pricePerUnit: number;
  expiryDate: string;
  supplier: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
};

// ADDED (Form type for filters)
type FilterForm = {
  stockStatus: string;
  timeFilter: string;
};

function InventoryTable() {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);

  // REMOVED useState filters
  // const [stockStatus, setStockStatus] = useState("All");
  // const [timeFilter, setTimeFilter] = useState("All Time");

  //  ADDED React Hook Form
  const methods = useForm<FilterForm>({
    defaultValues: {
      stockStatus: "All",
      timeFilter: "All Time",
    },
  });

  const { watch } = methods;

  //  ADDED (watch filter values)
  const stockStatus = watch("stockStatus");
  const timeFilter = watch("timeFilter");

  // LOAD INVENTORY 

  useEffect(() => {
    const loadInventory = () => {
      const storedInventory: InventoryItem[] = JSON.parse(
        localStorage.getItem("inventory") || "[]"
      );
      setInventoryData(storedInventory);
    };

    loadInventory();

    window.addEventListener("inventoryUpdated", loadInventory);

    return () => {
      window.removeEventListener("inventoryUpdated", loadInventory);
    };
  }, []);

  // FILTER LOGIC 

  const filteredData = useMemo(() => {
    return inventoryData.filter((item) => {
      const matchesStock =
        stockStatus === "All" || item.status === stockStatus;

      const itemDate = new Date(item.expiryDate);
      const today = new Date();
      let matchesTime = true;

      if (timeFilter === "This Month") {
        matchesTime =
          itemDate.getMonth() === today.getMonth() &&
          itemDate.getFullYear() === today.getFullYear();
      } else if (timeFilter === "6 Days") {
        const sixDaysLater = new Date();
        sixDaysLater.setDate(today.getDate() + 6);
        matchesTime = itemDate >= today && itemDate <= sixDaysLater;
      }

      return matchesStock && matchesTime;
    });
  }, [inventoryData, stockStatus, timeFilter]);

  // DROPDOWN OPTIONS 

  // ADDED
  const stockOptions = [
    { label: "All Stock", value: "All" },
    { label: "Low Stock", value: "Low Stock" },
    { label: "In Stock", value: "In Stock" },
    { label: "Out of Stock", value: "Out of Stock" },
  ];

  //  ADDED
  const timeOptions = [
    { label: "All Time", value: "All Time" },
    { label: "Next 6 Days", value: "6 Days" },
    { label: "This Month", value: "This Month" },
  ];

  //  TABLE COLUMNS (UNCHANGED) 

  const columns: Column<InventoryItem>[] = [
    {
      key: "itemName",
      label: "Item",
      render: (row) => (
        <Box>
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 500 }}>
            {row.itemName}
          </Typography>
          <Typography sx={{ fontSize: "0.7rem", color: "#9e9e9e" }}>
            ID: {row.itemId}
          </Typography>
        </Box>
      ),
    },
    {
      key: "medicineGroup",
      label: "Medicine Group",
      render: (row) => (
        <Chip
          label={row.medicineGroup}
          size="small"
          sx={{ bgcolor: "#d1fae5", color: "#065f46", fontWeight: 600 }}
        />
      ),
    },
    {
      key: "stockQty",
      label: "Stock",
      render: (row) => (
        <Box>
          <Typography sx={{ fontSize: "0.9rem" }}>
            {row.stockQty}
          </Typography>
          <Typography sx={{ fontSize: "0.7rem", color: "#9e9e9e" }}>
            Price/unit: ₹{row.pricePerUnit}
          </Typography>
        </Box>
      ),
    },
    { key: "supplier", label: "Supplier" },
    { key: "expiryDate", label: "Expiry Date" },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const statusColor =
          row.status === "Out of Stock"
            ? "#ef4444"
            : row.status === "Low Stock"
            ? "#f97316"
            : "#16a34a";
        return (
          <Typography
            sx={{
              color: statusColor,
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            {row.status}
          </Typography>
        );
      },
    },
  ];

  return (
    // ADDED (Required for DropdownField)
    <FormProvider {...methods}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          Inventory Stock Report
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* REPLACED Select with DropdownField */}
        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mb: 2 }}>

          {/* Stock Filter */}
          <DropdownField
            name="stockStatus"
            label="Stock Status"
            options={stockOptions}
            isStatic     // behaves like Select
            freeSolo={false}
            floatLabel
            
          />

          {/* Time Filter */}
          <DropdownField
            name="timeFilter"
            label="Expiry Filter"
            options={timeOptions}
            isStatic
            freeSolo={false}
            floatLabel
            
          />

        </Stack>

        <UniversalTable<InventoryItem>
          data={filteredData}
          columns={columns}
          showSearch
          showExport
          enableCheckbox
          rowsPerPage={5}
          getRowId={(row) => row.itemId}
        />
      </Paper>
    </FormProvider>
  );
}

export default InventoryTable;

