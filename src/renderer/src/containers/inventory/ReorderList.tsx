import { Box, Typography, Button } from "@mui/material";
import {
  Column,
  UniversalTable,
} from "@/components/uncontrolled/UniversalTable";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReorderDialog from "@/containers/inventory/ReorderDialog";
import PurchaseRecord from "@/containers/inventory/PurchaseRecord";
import { URL_PATH } from "@/constants/UrlPath";
type InventoryItem = {
  itemName: string;
  medicineId: string;
  quantity: number;
  pricePerUnit: number;
  gst: "12%";
};
const Reorder = 10;
const ReorderList = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [openItem, setOpenItem] = useState<InventoryItem | null>(null);

  //  NEW LINE ADDED
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const inventory = JSON.parse(localStorage.getItem("inventory") || "[]");
    setItems(
      inventory
        .map((item: InventoryItem) => ({
          ...item,
          quantity: Number(item.quantity),
        }))
        .filter((item: InventoryItem) => item.quantity < Reorder),
    );
  }, []);
  const handleReorderSubmit = (reorderQty: number) => {
    if (!openItem) return;
    const inventory = JSON.parse(localStorage.getItem("inventory") || "[]");

    const updatedInventory = inventory.map((item: InventoryItem) =>
      item.medicineId === openItem.medicineId
        ? {
            ...item,
            quantity: Number(item.quantity) + Number(reorderQty),
          }
        : item,
    );

    localStorage.setItem("inventory", JSON.stringify(updatedInventory));
    // IMPORTANT FIX
    const history = JSON.parse(localStorage.getItem("reorderHistory") || "[]");

    history.unshift({
      medicineId: openItem.medicineId,
      itemName: openItem.itemName,
      quantity: reorderQty,
      pricePerUnit: openItem.pricePerUnit,
      totalAmount: reorderQty * openItem.pricePerUnit * 1.12,
      gst: "12%",
      expiryDate: "",
      purchasedAt: new Date().toISOString(),
    });

    localStorage.setItem("reorderHistory", JSON.stringify(history));

    setItems(
      updatedInventory.filter((item: InventoryItem) => item.quantity < Reorder),
    );

    setOpenItem(null);

    // NEW LINE ADDED
    setRefreshKey((prev) => prev + 1);
  };

  const columns: Column<InventoryItem>[] = [
    { key: "itemName", label: "Item" },
    { key: "stockQty", label: "Stock" },
    { key: "pricePerUnit", label: "MRP" },
    {
      key: "gst",
      label: "GST",
      render: (row) => `₹ ${(row.pricePerUnit * 0.12).toFixed(2)}`,
    },
    {
      key: "total",
      label: "Total",
      render: (row) => `₹ ${(row.pricePerUnit * 1.12).toFixed(2)}`,
    },
    {
      key: "reorder",
      label: "Reorder",
      render: (row) => (
        <Button
          size="small"
          sx={{
            backgroundColor: "#238878",
            color: "#fff",
            border: "2px solid #238878",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#fff",
              color: "#238878",
            },
          }}
          onClick={() => setOpenItem(row)}
        >
          Reorder
        </Button>
      ),
    },
  ];

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          onClick={() => navigate(URL_PATH.Inventory)}
          sx={{
            backgroundColor: "#238878",
            color: "#fff",
            border: "2px solid #238878",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#fff",
              color: "#238878",
            },
          }}
        >
          Back to Home
        </Button>
      </Box>
      <Box
        sx={{
          boxShadow: 4,
          p: 4,
        }}
      >
        <Typography fontSize={20} mb={2}>
          Reorder List
        </Typography>
        <UniversalTable
          data={items}
          columns={columns}
          rowsPerPage={5}
          textAlign="center"
        />
        <ReorderDialog
          open={!!openItem}
          itemName={openItem?.itemName || ""}
          onClose={() => setOpenItem(null)}
          onSubmit={handleReorderSubmit}
        />
      </Box>

      {/*  key PROP ADDED */}
      <PurchaseRecord key={refreshKey} />
    </>
  );
};
export default ReorderList;

 









// import { Box, Typography, Button, Paper, IconButton } from "@mui/material";
// import { Add, Remove } from "@mui/icons-material";
// import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
// import { useState, useEffect } from "react";
// import DropdownField from "@/components/controlled/DropdownField";
// import EmailField from "@/components/controlled/EmailField";
// import { UniversalTable } from "@/components/uncontrolled/UniversalTable";
// import axios from "axios";
// import { API_ENDPOINTS } from "@/constants/ApiEndpoints";
// import { getMedicines } from "@/service/medicineService";
// import { createReorder, getLowStock, getLastPurchases, ReorderLevelsResponse, LowStockResponse } from "@/service/reorderService";

// // TYPES
// type ItemRow = {
//   id: number;
//   medicine: string;
//   medicineId?: number;
//   quantity: number | "";
// };

// type InventoryRow = {
//   id: number;
//   supplierName: string;
//   medicineName: string;
//   quantity: number;
// };

// type ReorderForm = {
//   distributor: string;
//   email: string;
//   items: {
//     medicineId: number;
//     quantity: number;
//   }[];
// };

// type OptionType = {
//   label: string;
//   value: string;
//   email?: string;
// };




// export default function InventoryDashboard() {
//   const methods = useForm<ReorderForm>();

//   const [rows, setRows] = useState<ItemRow[]>([
//     { id: Date.now(), medicine: "", quantity: "" },
//   ]);

//   const [lowStockData, setLowStockData] = useState<InventoryRow[]>([]);
//   const [lastPurchaseData, setLastPurchaseData] = useState<InventoryRow[]>([]);

//  const inventoryColumns = [
//   { key: "supplierName", label: "Supplier" },
//   { key: "medicineName", label: "Medicine Name" },
//   { key: "quantity", label: "Quantity" },
// ];

//   const [distributorOptions, setDistributorOptions] = useState<OptionType[]>([]);
//   const [medicineOptions, setMedicineOptions] = useState<OptionType[]>([]);

//   const addRow = () => {
//     setRows([...rows, { id: Date.now(), medicine: "", quantity: "" }]);
//   };

//   const removeRow = (id: number) => {
//     setRows(rows.filter((r) => r.id !== id));
//   };

//   const updateRow = (
//     id: number,
//     field: keyof ItemRow,
//     value: string | number
//   ) => {
//     setRows(
//       rows.map((r) =>
//         r.id === id ? { ...r, [field]: value } : r
//       )
//     );
//   };

//   const handleMedicineChange = (id: number, value: string) => {
//     const selected = medicineOptions.find((m: OptionType) => m.value === value);

//     setRows(
//       rows.map((r) =>
//         r.id === id
//           ? {
//               ...r,
//               medicine: value,
//               medicineId: selected ? Number(selected.value) : 0,
//             }
//           : r
//       )
//     );
//   };
// const selectedDistributor = methods.watch("distributor");

// const { setValue } = methods; 

// useEffect(() => {
//   const selected = distributorOptions.find(
//     (d) => d.value === selectedDistributor
//   );
//   if (selected?.email) {
//     setValue("email", selected.email);
//   }
// }, [selectedDistributor, distributorOptions, setValue]);


//  const onSubmit: SubmitHandler<ReorderForm> = async (data) => {
//   const items = rows
//     .filter((r) => r.medicineId && r.quantity)
//     .map((r) => ({
//       medicineId: r.medicineId as number,
//       quantity: Number(r.quantity),
//     }));

//   try {
//     await createReorder({
//       distributorId: Number(data.distributor),
//       email: data.email,
//       items: items,
//     });

//     alert("Reorder placed successfully");
//   } catch (err) {
//     console.error(err);
//   }
// };

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       // MEDICINES
//       const meds = await getMedicines();
//       setMedicineOptions(
//         meds.map((m: { itemName: string; medicineId: number }) => ({
//           label: m.itemName,
//           value: m.medicineId.toString(),
//         }))
//       );

//       //  DISTRIBUTORS
//       const distRes = await axios.get(API_ENDPOINTS.DISTRIBUTOR, {
//         headers: {
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//       });

//       setDistributorOptions(
//         distRes.data.map((d: {
//           companyName: string;
//           distributorId: number;
//           email: string;
//         }) => ({
//           label: d.companyName,
//           value: d.distributorId.toString(),
//           email: d.email,
//         }))
//       );

//       //  LOW STOCK
//   const lowStock = await getLowStock();
// const lowStockArray: InventoryRow[] = (lowStock?.data ?? [])
//   .map((item: LowStockResponse) => ({
//     id: item.medicineId,
//     supplierName: item.unit ?? "",
//     medicineName: item.itemName ?? "",
//     quantity: item.quantity ?? 0,
//   }));
// setLowStockData(lowStockArray);

//       //  LAST PURCHASE
//    const lastPurchase = await getLastPurchases();
// const lastPurchaseArray: InventoryRow[] = (lastPurchase?.data ?? [])
//   .map((item: ReorderLevelsResponse) => ({
//     id: item.reorderId,
//     supplierName: item.companyName ?? "",
//     medicineName: item.medicineName ?? "",
//     quantity: item.reorderQuantity ?? 0,
//   }));
// setLastPurchaseData(lastPurchaseArray);

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   fetchData();
// }, []);

//   return (
//     <FormProvider {...methods}>
//       <Box p={3} component="form" onSubmit={methods.handleSubmit(onSubmit)}>

//         <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
//           <Typography fontSize={16} fontWeight={600} mb={2}>
//             Reorder
//           </Typography>

//           <Box display="flex" gap={2} mb={2}>
//             <Typography sx={{ minWidth: 180 }}>
//               Distributor
//             </Typography>
//             <Box sx={{ width: 300 }}>
//               <DropdownField name="distributor" label="" options={distributorOptions} />
//             </Box>
//           </Box>

//           <Box display="flex" gap={2} mb={3}>
//             <Typography sx={{ minWidth: 180 }}>
//               Email
//             </Typography>
//             <Box sx={{ width: 300 }}>
//               <EmailField name="email" label="" />
//             </Box>
//           </Box>

//           <Box display="flex" justifyContent="space-between" mb={2}>
//             <Typography fontWeight={600}>Items</Typography>

//             <Button
//               startIcon={<Add />}
//               onClick={addRow}
//               sx={{
//                 color: "#238878",
//                 fontWeight: "bold",
//                 textTransform: "none",
//               }}
//             >
//               ADD
//             </Button>
//           </Box>

//           <Box display="grid" gridTemplateColumns="2fr 1fr 120px" mb={1}>
//             <Typography fontWeight={500}>Medicine</Typography>
//             <Typography fontWeight={500}>Qty</Typography>
//             <Typography />
//           </Box>

//           {rows.map((row) => (
//             <Box
//               key={row.id}
//               display="grid"
//               gridTemplateColumns="2fr 1fr 120px"
//               gap={2}
//               mb={2}
//               alignItems="center"
//             >
//               <DropdownField
//                 name={`medicine_${row.id}`}
//                 label=""
//                 options={medicineOptions}
//                 value={row.medicine}
//                 onChangeCallback={(val) =>
//                   handleMedicineChange(row.id, val)
//                 }
//               />

//               <Box sx={{ width: "100%" }}>
//                 <input
//                   type="number"
//                   value={row.quantity}
//                   onChange={(e) =>
//                     updateRow(
//                       row.id,
//                       "quantity",
//                       e.target.value === "" ? "" : Number(e.target.value)
//                     )
//                   }
//                   style={{
//                     width: "100%",
//                     height: "56px",
//                     border: "1px solid #ccc",
//                     borderRadius: "4px",
//                     padding: "0 14px",
//                     boxSizing: "border-box",
//                     fontSize: "14px",
//                     marginBottom: 25,
//                   }}
//                 />
//               </Box>

//               <Box display="flex" justifyContent="center">
//                 {rows.length > 1 && (
//                   <IconButton
//                     onClick={() => removeRow(row.id)}
//                     sx={{ color: "red" }}
//                   >
//                     <Remove />
//                   </IconButton>
//                 )}
//               </Box>
//             </Box>
//           ))}

//           <Box display="flex" justifyContent="flex-end">
//             <Button type="submit" sx={{ background: "#238878", color: "#fff" }}>
//               Reorder
//             </Button>
//           </Box>
//         </Paper>

//         <Box mb={4}>
//           <Typography fontSize={18} fontWeight={600} mb={2}>
//             Low Stock List
//           </Typography>

//           <UniversalTable
//            data={lowStockData || []}
//             columns={inventoryColumns}
//             getRowId={(row, index) => row.id ?? index}
//             actions={{}}
//           />
//         </Box>

//         <Box>
//           <Typography fontSize={18} fontWeight={600} mb={2}>
//             Last Purchase
//           </Typography>

//           <UniversalTable
//              data={lastPurchaseData || []}
//             columns={inventoryColumns}
//             getRowId={(row) => row.id}
//             actions={{}}
//           />
//         </Box>

//       </Box>
//     </FormProvider>
//   );
// }
