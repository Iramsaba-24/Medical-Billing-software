import { useState, useMemo, useEffect } from "react";
import { Box, Chip, Typography, Stack, Paper, Divider } from "@mui/material";
import { UniversalTable, Column } from "@/components/uncontrolled/UniversalTable";

import { useForm, FormProvider } from "react-hook-form";
import DropdownField from "@/components/controlled/DropdownField";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";

type InventoryItem = {
  srNo: number; 
  itemName: string;
  itemId: string;
  medicineGroup: string;
  stockQty: number;
  pricePerUnit: number;
  expiryDate: string;
  supplier: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
};

type FilterForm = {
  stockStatus: string;
  timeFilter: string;
};

type MedicineApi = {
  srNo: number; 
  medicineId: number;
  itemName: string;
  quantity: number;
  pricePerUnit: number;
  expiryDate: string;
  groupId: number;
  distributorId: number;
  gstPercentage: number;
  unit: string;
};

type GroupApi = {
  groupId: number;
  groupName: string;
};

type DistributorApi = {
  distributorId: number;
  companyName: string;
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

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: token ? `Bearer ${token}` : "" };

      const [medRes, groupRes, distRes] = await Promise.all([
        axios.get<{ data: MedicineApi[] }>(API_ENDPOINTS.MEDICINE, { headers })
          .catch(() => ({ data: { data: [] as MedicineApi[] } })),

        axios.get<{ data: GroupApi[] }>(API_ENDPOINTS.MEDICINE_GROUP, { headers })
          .catch(() => ({ data: { data: [] as GroupApi[] } })),

        axios.get<{ data: DistributorApi[] }>(API_ENDPOINTS.DISTRIBUTOR, { headers })
          .catch(() => ({ data: { data: [] as DistributorApi[] } })),
      ]);

      const medicines: MedicineApi[] =
        Array.isArray(medRes.data)
          ? medRes.data
          : medRes.data?.data || [];

      const groups: GroupApi[] =
        Array.isArray(groupRes.data)
          ? groupRes.data
          : groupRes.data?.data || [];

      const distributors: DistributorApi[] =
        Array.isArray(distRes.data)
          ? distRes.data
          : distRes.data?.data || [];

      const groupMap: Record<number, string> = {};
      groups.forEach((g) => {
        groupMap[g.groupId] = g.groupName;
      });

      const distributorMap: Record<number, string> = {};
      distributors.forEach((d) => {
        distributorMap[d.distributorId] = d.companyName;
      });

      const getStatus = (qty: number): "In Stock" | "Low Stock" | "Out of Stock" => {
        if (qty === 0) return "Out of Stock";
        if (qty < 20) return "Low Stock";
        return "In Stock";
      };

      const formatted: InventoryItem[] = medicines.map((item) => ({
        srNo: item.srNo, 
        itemName: item.itemName,
        itemId: String(item.medicineId),
        medicineGroup: groupMap[item.groupId] || "N/A",
        stockQty: item.quantity,
        pricePerUnit: item.pricePerUnit,
        expiryDate: item.expiryDate.split("T")[0],
        supplier: distributorMap[item.distributorId] || "N/A",
        status: getStatus(item.quantity),
      }));

      setInventoryData(formatted);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  useEffect(() => {
    fetchInventory();

    window.addEventListener("inventoryUpdated", fetchInventory);

    return () => {
      window.removeEventListener("inventoryUpdated", fetchInventory);
    };
  }, []);

  const filteredData = useMemo(() => {
    return inventoryData.filter((item) => {
      const qty = item.stockQty;

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
    { key: "srNo", label: "Sr.No" }, 

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
          <Typography sx={{ color: statusColor, fontWeight: 600 }}>
            {row.status}
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
          <DropdownField name="stockStatus" label="Stock Status" options={stockOptions} />
          <DropdownField name="timeFilter" label="Expiry Filter" options={timeOptions} />
        </Stack>

        <div style={{ width: "100%", overflowX: "auto" }}>
          <UniversalTable<InventoryItem>
            data={filteredData}
            columns={columns}
            showSearch
            showExport
            rowsPerPage={5}
            getRowId={(row, index) => `${row.itemId}-${index}`}
          />
        </div>
      </Paper>
    </FormProvider>
  );
}

export default InventoryTable;