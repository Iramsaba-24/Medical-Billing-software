

import { useState, useMemo, useEffect } from "react";
import { Box, Chip, Typography, Stack, Paper, Divider } from "@mui/material";
import { UniversalTable, Column } from "@/components/uncontrolled/UniversalTable";

import { useForm, FormProvider } from "react-hook-form";
import DropdownField from "@/components/controlled/DropdownField";

type InventoryItem = {
  itemName: string;
  itemId: string;
  medicineGroup: string;
  stockQty: number | string; // allow string (safety)
  pricePerUnit: number;
  expiryDate: string;
  supplier: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
};

type FilterForm = {
  stockStatus: string;
  timeFilter: string;
};

function InventoryTable() {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);

  const methods = useForm<FilterForm>({
    defaultValues: {
      stockStatus: "All",
      timeFilter: "All Time",
    },
  });

  const { watch } = methods;
  const stockStatus = watch("stockStatus");
  const timeFilter = watch("timeFilter");

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

  //  FILTER FIXED (number force conversion)
  const filteredData = useMemo(() => {
    return inventoryData.filter((item) => {
      const qty = Number(item.stockQty);

      const matchesStock = (() => {
        if (stockStatus === "All") return true;
        if (stockStatus === "Out of Stock") return qty === 0;
        if (stockStatus === "Low Stock") return qty > 0 && qty < 20;
        if (stockStatus === "In Stock") return qty >= 20;
        return true;
      })();

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

  //  DELETE FUNCTION
  const handleDeleteSelected = (rowsToDelete: InventoryItem[]) => {
    const updatedInventory = inventoryData.filter(
      (item) =>
        !rowsToDelete.some((row) => row.itemId === item.itemId)
    );

    setInventoryData(updatedInventory);

    localStorage.setItem(
      "inventory",
      JSON.stringify(updatedInventory)
    );

    window.dispatchEvent(new Event("inventoryUpdated"));
  };

  const stockOptions = [
    { label: "All Stock", value: "All" },
    { label: "Low Stock", value: "Low Stock" },
    { label: "In Stock", value: "In Stock" },
    { label: "Out of Stock", value: "Out of Stock" },
  ];

  const timeOptions = [
    { label: "All Time", value: "All Time" },
    { label: "Next 6 Days", value: "6 Days" },
    { label: "This Month", value: "This Month" },
  ];

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

    // STATUS FIXED COMPLETELY
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const qty = Number(row.stockQty);

        const calculatedStatus =
          qty === 0
            ? "Out of Stock"
            : qty < 20
            ? "Low Stock"
            : "In Stock";

        const statusColor =
          calculatedStatus === "Out of Stock"
            ? "#ef4444"
            : calculatedStatus === "Low Stock"
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
            {calculatedStatus}
          </Typography>
        );
      },
    },
  ];

  return (
    <FormProvider {...methods}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          Inventory Stock Report
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mb: 2 }}>
          <DropdownField
            name="stockStatus"
            label="Stock Status"
            options={stockOptions}
            freeSolo={false}
          />

          <DropdownField
            name="timeFilter"
            label="Expiry Filter"
            options={timeOptions}
            freeSolo={false}
          />
        </Stack>


        <div style={{ width: "100%", maxWidth: "100%", overflowX: "auto" }}>

        
        <UniversalTable<InventoryItem>
          data={filteredData}
          columns={columns}
          showSearch
          showExport
          enableCheckbox
          rowsPerPage={5}
          getRowId={(row, index) => `${row.itemId}-${index}`}

          //getRowId={(row) => row.itemId}
  
          onDeleteSelected={handleDeleteSelected}
        />
        </div>
      </Paper>
    </FormProvider>
  );
}

export default InventoryTable;