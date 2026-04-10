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



import { Box, Typography, Button, Paper } from "@mui/material";
import { UniversalTable, ACTION_KEY } from "@/components/uncontrolled/UniversalTable";
import DropdownField from "@/components/controlled/DropdownField";
import EmailField from "@/components/controlled/EmailField";
import TextInputField from "@/components/controlled/TextInputField";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";

// TYPES
type InventoryRow = {
  id: number;
  supplier: string;
  name: string;
  qty: string;
};

type ReorderForm = {
  distributor: string;
  email: string;
  medicine1: string;
  qty1: number;
  medicine2: string;
  qty2: number;
};

export default function InventoryDashboard() {
  const methods = useForm<ReorderForm>();

  // STATIC DATA
  const lowStockData: InventoryRow[] = [
    { id: 1, supplier: "PharmaCare Ltd.", name: "Paracetamol", qty: "05" },
    { id: 2, supplier: "MedEquip Inc.", name: "Cough Syrup", qty: "10" },
  ];

  const lastPurchaseData: InventoryRow[] = [
    { id: 1, supplier: "PharmaCare Ltd.", name: "Paracetamol", qty: "05" },
    { id: 2, supplier: "MedEquip Inc.", name: "Cough Syrup", qty: "10" },
  ];

  const distributorOptions = [
    { value: "dist1", label: "PharmaCare Ltd." },
    { value: "dist2", label: "MedEquip Inc." },
  ];

  const medicineOptions = [
    { value: "para", label: "Paracetamol" },
    { value: "cough", label: "Cough Syrup" },
  ];

  const inventoryColumns = [
    { key: "supplier", label: "Supplier" },
    { key: "name", label: "Medicine Name" },
    { key: "qty", label: "Quantity" },
    { key: ACTION_KEY, label: "Action" },
  ];

  // ACTION HANDLERS
  const handleView = (row: InventoryRow) => console.log("View", row);
  const handlePdf = (row: InventoryRow) => console.log("PDF", row);
  const handleDelete = (row: InventoryRow) => console.log("Delete", row);

  // SUBMIT
  const onSubmit: SubmitHandler<ReorderForm> = (data) => {
    console.log("Reorder submitted:", data);
  };

  // SAME WIDTH FOR ALL 4 FIELDS
  const fieldWidth = 600;

  return (
    <FormProvider {...methods}>
      <Box p={3} component="form" onSubmit={methods.handleSubmit(onSubmit)}>

        {/* REORDER FORM */}
        <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
          <Typography
            fontSize={16}
            fontWeight={600}
            mb={2}
            sx={{ color: "#238878", textDecoration: "underline", cursor: "pointer" }}
          >
            Reorder
          </Typography>

          {/* Distributor Row */}
          <Box display="flex" alignItems="center" mb={2} gap={2}>
            <Typography fontSize={14} sx={{ minWidth: 180 }}>
              Distributor / Company
            </Typography>
            <Box sx={{ width: 300 }}>
              <DropdownField
                name="distributor"
                label=""
                options={distributorOptions}
                required
                size="small"
              />
            </Box>
          </Box>

          {/* Email Row */}
          <Box display="flex" alignItems="center" mb={3} gap={2}>
            <Typography fontSize={14} sx={{ minWidth: 180 }}>
              Email Address
            </Typography>
            <Box sx={{ width: 300 }}>
              <EmailField name="email" label="" required size="small" />
            </Box>
          </Box>

          {/* Column Headers */}
          <Box display="flex" gap={2} mb={1}>
            <Box sx={{ width: fieldWidth }}>
              <Typography fontSize={13} fontWeight={500}>Medicine Name</Typography>
            </Box>
            <Box sx={{ width: fieldWidth }}>
              <Typography fontSize={13} fontWeight={500}>Qty.</Typography>
            </Box>
            <Box sx={{ width: 120 }} />
          </Box>

          {/* Medicine Rows */}
          <Box display="flex" flexDirection="column" gap={2} mb={2}>

            {/* Row 1 */}
            <Box display="flex" gap={2} alignItems="center">
              <Box sx={{ width: fieldWidth }}>
                <DropdownField
                  name="medicine1"
                  label=""
                  options={medicineOptions}
                  size="small"
                />
              </Box>

              <Box sx={{ width: fieldWidth }}>
                <TextInputField
                  name="qty1"
                  label=""
                  type="number"
                  size="small"
                />
              </Box>

              <Box sx={{ width: 120 }} />
            </Box>

            {/* Row 2 */}
            <Box display="flex" gap={2} alignItems="center">
              <Box sx={{ width: fieldWidth }}>
                <DropdownField
                  name="medicine2"
                  label=""
                  options={medicineOptions}
                  size="small"
                />
              </Box>

              <Box sx={{ width: fieldWidth }}>
                <TextInputField
                  name="qty2"
                  label=""
                  type="number"
                  size="small"
                />
              </Box>

              {/* BUTTON RIGHT SIDE */}
              {/* <Box sx={{ width: 120, display: "flex", justifyContent: "flex-end" }}> */}

              <Box  display="flex" justifyContent="flex-end" ml={9}>
                <Button
                  type="button"
                  sx={{
                    backgroundColor: "#238878",
                    color: "white",
                    textTransform: "none",
                    width: 120,
                     
                    "&:hover": { backgroundColor: "#1f6f62" },
                  }}
                >
                  + Add
                </Button>
              </Box>
            </Box>

          </Box>

          {/* Submit */}
          <Box display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              sx={{
                backgroundColor: "#238878",
                color: "white",
                textTransform: "none",
                width: 120,
                "&:hover": { backgroundColor: "#1f6f62" },
              }}
            >
              Reorder
            </Button>
          </Box>
        </Paper>

        {/* LOW STOCK */}
        <Box mb={4}>
          <Typography fontSize={18} fontWeight={600} mb={2}>
            Low Stock List
          </Typography>

          <UniversalTable<InventoryRow>
            data={lowStockData}
            columns={inventoryColumns}
            getRowId={(row) => row.id}
            rowsPerPage={5}
            tableSize="medium"
            actions={{ view: handleView, pdf: handlePdf, delete: handleDelete }}
            headerSx={{ bgcolor: "#444748ff", color: "#ffffff" }}
            paperSx={{ borderRadius: 3 }}
          />
        </Box>

        {/* LAST PURCHASE */}
        <Box>
          <Typography fontSize={18} fontWeight={600} mb={2}>
            Last Purchase
          </Typography>

          <UniversalTable<InventoryRow>
            data={lastPurchaseData}
            columns={inventoryColumns}
            getRowId={(row) => row.id}
            rowsPerPage={5}
            tableSize="medium"
            actions={{ view: handleView, pdf: handlePdf, delete: handleDelete }}
            headerSx={{ bgcolor: "#444748ff", color: "#ffffff" }}
            paperSx={{ borderRadius: 3 }}
          />
        </Box>

      </Box>
    </FormProvider>
  );
}

