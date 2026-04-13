// import { Box, Typography, Button } from "@mui/material";
// import {
//   Column,
//   UniversalTable,
// } from "@/components/uncontrolled/UniversalTable";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import ReorderDialog from "@/containers/inventory/ReorderDialog";
// import PurchaseRecord from "@/containers/inventory/PurchaseRecord";
// import { URL_PATH } from "@/constants/UrlPath";
// type InventoryItem = {
//   itemName: string;
//   medicineId: string;
//   quantity: number;
//   pricePerUnit: number;
//   gst: "12%";
// };
// const Reorder = 10;
// const ReorderList = () => {
//   const [items, setItems] = useState<InventoryItem[]>([]);
//   const [openItem, setOpenItem] = useState<InventoryItem | null>(null);

//   //  NEW LINE ADDED
//   const [refreshKey, setRefreshKey] = useState(0);
//   const navigate = useNavigate();
//   useEffect(() => {
//     const inventory = JSON.parse(localStorage.getItem("inventory") || "[]");
//     setItems(
//       inventory
//         .map((item: InventoryItem) => ({
//           ...item,
//           quantity: Number(item.quantity),
//         }))
//         .filter((item: InventoryItem) => item.quantity < Reorder),
//     );
//   }, []);
//   const handleReorderSubmit = (reorderQty: number) => {
//     if (!openItem) return;
//     const inventory = JSON.parse(localStorage.getItem("inventory") || "[]");

//     const updatedInventory = inventory.map((item: InventoryItem) =>
//       item.medicineId === openItem.medicineId
//         ? {
//             ...item,
//             quantity: Number(item.quantity) + Number(reorderQty),
//           }
//         : item,
//     );

//     localStorage.setItem("inventory", JSON.stringify(updatedInventory));
//     // IMPORTANT FIX
//     const history = JSON.parse(localStorage.getItem("reorderHistory") || "[]");

//     history.unshift({
//       medicineId: openItem.medicineId,
//       itemName: openItem.itemName,
//       quantity: reorderQty,
//       pricePerUnit: openItem.pricePerUnit,
//       totalAmount: reorderQty * openItem.pricePerUnit * 1.12,
//       gst: "12%",
//       expiryDate: "",
//       purchasedAt: new Date().toISOString(),
//     });

//     localStorage.setItem("reorderHistory", JSON.stringify(history));

//     setItems(
//       updatedInventory.filter((item: InventoryItem) => item.quantity < Reorder),
//     );

//     setOpenItem(null);

//     // NEW LINE ADDED
//     setRefreshKey((prev) => prev + 1);
//   };

//   const columns: Column<InventoryItem>[] = [
//     { key: "itemName", label: "Item" },
//     { key: "stockQty", label: "Stock" },
//     { key: "pricePerUnit", label: "MRP" },
//     {
//       key: "gst",
//       label: "GST",
//       render: (row) => `₹ ${(row.pricePerUnit * 0.12).toFixed(2)}`,
//     },
//     {
//       key: "total",
//       label: "Total",
//       render: (row) => `₹ ${(row.pricePerUnit * 1.12).toFixed(2)}`,
//     },
//     {
//       key: "reorder",
//       label: "Reorder",
//       render: (row) => (
//         <Button
//           size="small"
//           sx={{
//             backgroundColor: "#238878",
//             color: "#fff",
//             border: "2px solid #238878",
//             textTransform: "none",
//             "&:hover": {
//               backgroundColor: "#fff",
//               color: "#238878",
//             },
//           }}
//           onClick={() => setOpenItem(row)}
//         >
//           Reorder
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <>
//       <Box display="flex" justifyContent="flex-end" mb={2}>
//         <Button
//           variant="contained"
//           onClick={() => navigate(URL_PATH.Inventory)}
//           sx={{
//             backgroundColor: "#238878",
//             color: "#fff",
//             border: "2px solid #238878",
//             textTransform: "none",
//             "&:hover": {
//               backgroundColor: "#fff",
//               color: "#238878",
//             },
//           }}
//         >
//           Back to Home
//         </Button>
//       </Box>
//       <Box
//         sx={{
//           boxShadow: 4,
//           p: 4,
//         }}
//       >
//         <Typography fontSize={20} mb={2}>
//           Reorder List
//         </Typography>
//         <UniversalTable
//           data={items}
//           columns={columns}
//           rowsPerPage={5}
//           textAlign="center"
//         />
//         <ReorderDialog
//           open={!!openItem}
//           itemName={openItem?.itemName || ""}
//           onClose={() => setOpenItem(null)}
//           onSubmit={handleReorderSubmit}
//         />
//       </Box>

//       {/*  key PROP ADDED */}
//       <PurchaseRecord key={refreshKey} />
//     </>
//   );
// };
// export default ReorderList;

 








// ✅ FULL UPDATED CODE (NO `any` USED ANYWHERE)

import { Box, Typography, Button, Paper, IconButton } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import DropdownField from "@/components/controlled/DropdownField";
import EmailField from "@/components/controlled/EmailField";
import { UniversalTable, ACTION_KEY } from "@/components/uncontrolled/UniversalTable";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";
import { getMedicines } from "@/service/medicineService";
import { createReorder, getLowStock, getLastPurchases } from "@/service/reorderService";

// TYPES
type ItemRow = {
  id: number;
  medicine: string;
  medicineId?: number;
  strength: string;
  quantity: number | "";
};

type InventoryRow = {
  id: number;
  supplierName: string;
  medicineName: string;
  strength: string;
  quantity: number;
  status?: string;
};

type ReorderForm = {
  distributor: string;
  email: string;
};

type OptionType = {
  label: string;
  value: string;
  email?: string;
};

// API TYPES (STRICT)
type MedicineAPI = {
  itemName: string;
  medicineId: number;
};

type DistributorAPI = {
  companyName: string;
  distributorId: number;
  email: string;
};

type LowStockAPI = {
  medicineId: number;
  unit: string;
  itemName: string;
  quantity: number;
  strength?: string;
};

type LastPurchaseAPI = {
  reorderId: number;
  companyName: string;
  medicineName: string;
  reorderQuantity: number;
  strength?: string;
};

export default function InventoryDashboard() {
  const methods = useForm<ReorderForm>();

  const [rows, setRows] = useState<ItemRow[]>([
    { id: Date.now(), medicine: "", strength: "", quantity: "" },
  ]);

  const [lowStockData, setLowStockData] = useState<InventoryRow[]>([]);
  const [lastPurchaseData, setLastPurchaseData] = useState<InventoryRow[]>([]);

  const [distributorOptions, setDistributorOptions] = useState<OptionType[]>([]);
  const [medicineOptions, setMedicineOptions] = useState<OptionType[]>([]);

  const addRow = () => {
    setRows([...rows, { id: Date.now(), medicine: "", strength: "", quantity: "" }]);
  };

  const removeRow = (id: number) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  const updateRow = (id: number, field: keyof ItemRow, value: string | number) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handleMedicineChange = (id: number, value: string) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, medicine: value, medicineId: Number(value) } : r)));
  };

  const selectedDistributor = methods.watch("distributor");
  const { setValue } = methods;

  useEffect(() => {
    const selected = distributorOptions.find((d) => d.value === selectedDistributor);
    if (selected?.email) setValue("email", selected.email);
  }, [selectedDistributor, distributorOptions, setValue]);

  const onSubmit: SubmitHandler<ReorderForm> = async (data) => {
    const items = rows
      .filter((r) => r.medicineId && r.quantity)
      .map((r) => ({
        medicineId: r.medicineId as number,
        quantity: Number(r.quantity),
      }));

    await createReorder({
      distributorId: Number(data.distributor),
      email: data.email,
      items,
    });

    alert("Reorder placed successfully");
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      const meds: MedicineAPI[] = await getMedicines();
      setMedicineOptions(
        meds.map((m) => ({ label: m.itemName, value: m.medicineId.toString() }))
      );

      const distRes = await axios.get<DistributorAPI[]>(API_ENDPOINTS.DISTRIBUTOR, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      setDistributorOptions(
        distRes.data.map((d) => ({
          label: d.companyName,
          value: d.distributorId.toString(),
          email: d.email,
        }))
      );

      const lowStockRes = await getLowStock();
      const lowStock: LowStockAPI[] = lowStockRes?.data ?? [];

      setLowStockData(
        lowStock.map((item) => ({
          id: item.medicineId,
          supplierName: item.unit,
          medicineName: item.itemName,
          strength: item.strength ?? "Standard",
          quantity: item.quantity,
          status: "Pending",
        }))
      );

      const lastPurchaseRes = await getLastPurchases();
      const lastPurchase: LastPurchaseAPI[] = lastPurchaseRes?.data ?? [];

      setLastPurchaseData(
        lastPurchase.map((item) => ({
          id: item.reorderId,
          supplierName: item.companyName,
          medicineName: item.medicineName,
          strength: item.strength ?? "Standard",
          quantity: item.reorderQuantity,
        }))
      );
    };

    fetchData();
  }, []);

  const lowStockColumns = [
    { key: "supplierName", label: "Supplier" },
    { key: "medicineName", label: "Medicine Name" },
    { key: "strength", label: "Strength/Type" },
    { key: "quantity", label: "Quantity" },
    { key: "status", label: "Status" },
  ];

  const lastPurchaseColumns = [
    { key: "supplierName", label: "Supplier" },
    { key: "medicineName", label: "Medicine Name" },
    { key: "strength", label: "Strength/Type" },
    { key: "quantity", label: "Quantity" },
    { key: ACTION_KEY, label: "Action" },
  ];

  return (
    <FormProvider {...methods}>
      <Box p={3} component="form" onSubmit={methods.handleSubmit(onSubmit)}>

        <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
          <Typography fontWeight={600} mb={2}>Reorder</Typography>

          <DropdownField name="distributor" label="Distributor" options={distributorOptions} />
          <EmailField name="email" label="Email" />

          <Box display="grid" gridTemplateColumns="2fr 1fr 1fr 100px" mt={3} mb={1}>
            <Typography>Medicine</Typography>
            <Typography>Strength/Type</Typography>
            <Typography>Qty</Typography>
            <Typography />
          </Box>

          {rows.map((row) => (
            <Box key={row.id} display="grid" gridTemplateColumns="2fr 1fr 1fr 100px" gap={2} mb={2}>

              <DropdownField
                name={`medicine_${row.id}`}
                options={medicineOptions}
                value={row.medicine}
                onChangeCallback={(val) => handleMedicineChange(row.id, val)}
              />

              <input
                value={row.strength}
                onChange={(e) => updateRow(row.id, "strength", e.target.value)}
              />

              <input
                type="number"
                value={row.quantity}
                onChange={(e) => updateRow(row.id, "quantity", Number(e.target.value))}
              />

              <IconButton onClick={() => removeRow(row.id)}>
                <Remove />
              </IconButton>
            </Box>
          ))}

          <Button startIcon={<Add />} onClick={addRow}>Add Row</Button>

          <Box mt={2} textAlign="right">
            <Button type="submit" variant="contained">Reorder</Button>
          </Box>
        </Paper>

        <UniversalTable data={lowStockData} columns={lowStockColumns} />

        <UniversalTable
          data={lastPurchaseData}
          columns={lastPurchaseColumns}
          actions={{ delete: (row: InventoryRow) => console.log(row) }}
        />

      </Box>
    </FormProvider>
  );
}
