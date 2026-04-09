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



// import { Box, Typography, Button, IconButton, Paper } from "@mui/material";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import DeleteIcon from "@mui/icons-material/Delete";

// export default function InventoryDashboard() {
//   // ------------------ STATIC SAMPLE DATA -------------------
//   const lowStockData = [
//     { id: 1, name: "Tablet A", qty: 2, price: "₹50", supplier: "Zydus" },
//     { id: 2, name: "Tablet B", qty: 5, price: "₹80", supplier: "Cipla" },
//   ];

//   const purchaseData = [
//     { id: 1, name: "Tablet C", qty: 10, date: "2024-02-10", supplier: "Sun Pharma" },
//     { id: 2, name: "Tablet D", qty: 20, date: "2024-01-22", supplier: "Dr Reddy" },
//   ];

//   // ------------------ ACTION FUNCTIONS -------------------
//   const handleView = (item) => {
//     alert("Viewing → " + item.name);
//   };

//   const handleDelete = (item) => {
//     alert("Deleting → " + item.name);
//   };

//   const handlePdf = (item) => {
//     alert("PDF Download → " + item.name);
//   };

//   return (
//     <Box p={3}>
//       {/* ------------------ REORDER SECTION ------------------ */}
//       <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
//         <Typography fontSize={20} fontWeight={700} mb={2}>
//           Reorder
//         </Typography>

//         {/* Distributor Row */}
//         <Box mb={3}>
//           <Typography fontWeight={600}>Distributor Name</Typography>
//           <Typography>ABC Pharma</Typography>
//         </Box>

//         <Box mb={3}>
//           <Typography fontWeight={600}>Email</Typography>
//           <Typography>abcpharma@gmail.com</Typography>
//         </Box>

//         {/* Medicine Table */}
//         <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
//           <Box display="flex" justifyContent="space-between" mb={1}>
//             <Typography fontWeight={600}>Medicine</Typography>
//             <Typography fontWeight={600}>Qty</Typography>
//             <Typography fontWeight={600}>Price</Typography>
//           </Box>

//           {/* Row 1 */}
//           <Box display="flex" justifyContent="space-between" mt={1}>
//             <Typography>Paracetamol</Typography>
//             <Typography>20</Typography>
//             <Typography>₹100</Typography>
//           </Box>

//           {/* Row 2 */}
//           <Box display="flex" justifyContent="space-between" mt={1}>
//             <Typography>Citrazine</Typography>
//             <Typography>15</Typography>
//             <Typography>₹75</Typography>
//           </Box>
//         </Paper>

//         <Button variant="contained" sx={{ background: "#238878", textTransform: "none" }}>
//           Reorder
//         </Button>
//       </Paper>

//       {/* ------------------ LOW STOCK LIST ------------------ */}
//       <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
//         <Typography fontSize={20} fontWeight={700} mb={2}>
//           Low Stock List
//         </Typography>

//         {lowStockData.map((item) => (
//           <Paper
//             key={item.id}
//             sx={{ p: 2, borderRadius: 2, mb: 2, display: "flex", justifyContent: "space-between" }}
//           >
//             <Box>
//               <Typography fontWeight={600}>{item.name}</Typography>
//               <Typography>Qty: {item.qty}</Typography>
//               <Typography>Supplier: {item.supplier}</Typography>
//             </Box>

//             <Box>
//               <IconButton onClick={() => handleView(item)}>
//                 <VisibilityIcon />
//               </IconButton>

//               <IconButton onClick={() => handlePdf(item)}>
//                 <PictureAsPdfIcon />
//               </IconButton>

//               <IconButton onClick={() => handleDelete(item)} color="error">
//                 <DeleteIcon />
//               </IconButton>
//             </Box>
//           </Paper>
//         ))}
//       </Paper>

//       {/* ------------------ LAST PURCHASE ------------------ */}
//       <Paper sx={{ p: 3, borderRadius: 3 }}>
//         <Typography fontSize={20} fontWeight={700} mb={2}>
//           Last Purchase
//         </Typography>

//         {purchaseData.map((item) => (
//           <Paper
//             key={item.id}
//             sx={{ p: 2, borderRadius: 2, mb: 2, display: "flex", justifyContent: "space-between" }}
//           >
//             <Box>
//               <Typography fontWeight={600}>{item.name}</Typography>
//               <Typography>Qty: {item.qty}</Typography>
//               <Typography>Date: {item.date}</Typography>
//             </Box>

//             <Box>
//               <IconButton onClick={() => handleView(item)}>
//                 <VisibilityIcon />
//               </IconButton>

//               <IconButton onClick={() => handlePdf(item)}>
//                 <PictureAsPdfIcon />
//               </IconButton>

//               <IconButton onClick={() => handleDelete(item)} color="error">
//                 <DeleteIcon />
//               </IconButton>
//             </Box>
//           </Paper>
//         ))}
//       </Paper>
//     </Box>
//   );
// }




// import { Box, Typography, Button, IconButton, Paper, TextField, MenuItem } from "@mui/material";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import DeleteIcon from "@mui/icons-material/Delete";

// export default function InventoryDashboard() {
//   // SAMPLE STATIC DATA (Replace with API)
//   const lowStockData = [
//     { id: 1, supplier: "PharmaCare Ltd.", name: "Paracetamol", qty: "05" },
//     { id: 2, supplier: "MedEquip Inc.", name: "Cough Syrup", qty: "10" },
//   ];

//   const lastPurchaseData = [
//     { id: 1, supplier: "PharmaCare Ltd.", name: "Paracetamol", qty: "05" },
//     { id: 2, supplier: "MedEquip Inc.", name: "Cough Syrup", qty: "10" },
//   ];

//   return (
//     <Box p={3}>

//       {/* ========================================================= */}
//       {/*                       REORDER FORM                        */}
//       {/* ========================================================= */}

//       <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
//         <Typography fontSize={18} fontWeight={600} mb={2}>
//           Reorder
//         </Typography>

//         {/* Distributor Row */}
//         <Box display="flex" gap={2} mb={2}>
//           <Box flex={1}>
//             <Typography fontWeight={500}>Distributor / Company</Typography>
//             <TextField fullWidth size="small" select>
//               <MenuItem value="dist1">PharmaCare Ltd.</MenuItem>
//               <MenuItem value="dist2">MedEquip Inc.</MenuItem>
//             </TextField>
//           </Box>

//           <Box flex={1}>
//             <Typography fontWeight={500}>Email Address</Typography>
//             <TextField fullWidth size="small" />
//           </Box>
//         </Box>

//         {/* Medicine Rows */}
//         <Box display="flex" flexDirection="column" gap={2} mb={2}>
//           {[1, 2].map((row) => (
//             <Box key={row} display="flex" gap={2}>
//               <TextField fullWidth size="small" select label="Medicine Name">
//                 <MenuItem value="para">Paracetamol</MenuItem>
//                 <MenuItem value="cough">Cough Syrup</MenuItem>
//               </TextField>

//               {/* Strength हटवलेले */}
              
//               <TextField fullWidth size="small" label="Qty." />
//             </Box>
//           ))}
//         </Box>

//         <Button
//           sx={{
//             backgroundColor: "#238878",
//             color: "white",
//             textTransform: "none",
//             width: 120,
//             "&:hover": { backgroundColor: "#1f6f62" },
//           }}
//         >
//           Reorder
//         </Button>
//       </Paper>

//       {/* ========================================================= */}
//       {/*                      LOW STOCK SECTION                     */}
//       {/* ========================================================= */}

//       <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
//         <Typography fontSize={18} fontWeight={600} mb={2}>
//           Low Stock List
//         </Typography>

//         {/* Header */}
//         <Box display="flex" fontWeight={600} mb={1}>
//           <Box width="25%">Supplier</Box>
//           <Box width="25%">Medicine Name</Box>
//           <Box width="25%">Quantity</Box>
//           <Box width="25%">Action</Box>
//         </Box>

//         {/* Rows */}
//         {lowStockData.map((item) => (
//           <Box
//             key={item.id}
//             display="flex"
//             alignItems="center"
//             py={1.5}
//             borderBottom="1px solid #eee"
//           >
//             <Box width="25%">{item.supplier}</Box>
//             <Box width="25%">{item.name}</Box>
//             <Box width="25%">{item.qty}</Box>

//             <Box width="25%">
//               <IconButton>
//                 <VisibilityIcon />
//               </IconButton>

//               <IconButton>
//                 <PictureAsPdfIcon color="error" />
//               </IconButton>

//               <IconButton color="error">
//                 <DeleteIcon />
//               </IconButton>
//             </Box>
//           </Box>
//         ))}
//       </Paper>

//       {/* ========================================================= */}
//       {/*                     LAST PURCHASE SECTION                  */}
//       {/* ========================================================= */}

//       <Paper sx={{ p: 3, borderRadius: 3 }}>
//         <Typography fontSize={18} fontWeight={600} mb={2}>
//           Last Purchase
//         </Typography>

//         {/* Header */}
//         <Box display="flex" fontWeight={600} mb={1}>
//           <Box width="25%">Supplier</Box>
//           <Box width="25%">Medicine Name</Box>
//           <Box width="25%">Quantity</Box>
//           <Box width="25%">Action</Box>
//         </Box>

//         {/* Rows */}
//         {lastPurchaseData.map((item) => (
//           <Box
//             key={item.id}
//             display="flex"
//             alignItems="center"
//             py={1.5}
//             borderBottom="1px solid #eee"
//           >
//             <Box width="25%">{item.supplier}</Box>
//             <Box width="25%">{item.name}</Box>
//             <Box width="25%">{item.qty}</Box>

//             <Box width="25%">
//               <IconButton>
//                 <VisibilityIcon />
//               </IconButton>

//               <IconButton>
//                 <PictureAsPdfIcon color="error" />
//               </IconButton>

//               <IconButton color="error">
//                 <DeleteIcon />
//               </IconButton>
//             </Box>
//           </Box>
//         ))}
//       </Paper>
//     </Box>
//   );
// }


// import { Box, Typography, Button, IconButton, Paper, TextField, MenuItem } from "@mui/material";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import DeleteIcon from "@mui/icons-material/Delete";

// export default function InventoryDashboard() {
//   // SAMPLE STATIC DATA (Replace with API)
//   const lowStockData = [
//     { id: 1, supplier: "PharmaCare Ltd.", name: "Paracetamol", qty: "05" },
//     { id: 2, supplier: "MedEquip Inc.", name: "Cough Syrup", qty: "10" },
//   ];

//   const lastPurchaseData = [
//     { id: 1, supplier: "PharmaCare Ltd.", name: "Paracetamol", qty: "05" },
//     { id: 2, supplier: "MedEquip Inc.", name: "Cough Syrup", qty: "10" },
//   ];

//   return (
//     <Box p={3}>

//       {/* ========================================================= */}
//       {/*                       REORDER FORM                        */}
//       {/* ========================================================= */}

//       <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
//         <Typography fontSize={16} fontWeight={600} mb={2}>
//           Reorder
//         </Typography>

//         {/* Distributor Row */}
//         <Box display="flex" gap={4} mb={2}>
//           <Box flex={1}>
//             <Typography fontSize={14} mb={0.5}>Distributor / Company</Typography>
//             <TextField fullWidth size="small" select>
//               <MenuItem value="dist1">PharmaCare Ltd.</MenuItem>
//               <MenuItem value="dist2">MedEquip Inc.</MenuItem>
//             </TextField>
//           </Box>

//           <Box flex={1}>
//             <Typography fontSize={14} mb={0.5}>Email Address</Typography>
//             <TextField fullWidth size="small" />
//           </Box>
//         </Box>

//         {/* Medicine Rows EXACT LIKE SCREENSHOT */}
//         <Box display="flex" flexDirection="column" gap={2} mb={2}>
//           {[1, 2].map((row) => (
//             <Box key={row} display="flex" gap={2}>
              
//               {/* Medicine Name */}
//               <TextField
//                 fullWidth
//                 size="small"
//                 select
//                 label="Medicine Name"
//               >
//                 <MenuItem value="para">Paracetamol</MenuItem>
//                 <MenuItem value="cough">Cough Syrup</MenuItem>
//               </TextField>

//               {/* Qty */}
//               <TextField
//                 fullWidth
//                 size="small"
//                 label="Qty."
//               />

//               {/* Add Button (only on row 1) */}
//               {row === 1 && (
//                 <Button
//                   sx={{
//                     backgroundColor: "#238878",
//                     color: "white",
//                     textTransform: "none",
//                     px: 3,
//                     "&:hover": { backgroundColor: "#1f6f62" },
//                   }}
//                 >
//                   + Add
//                 </Button>
//               )}
//             </Box>
//           ))}
//         </Box>

//         {/* Reorder Button */}
//         <Button
//           sx={{
//             backgroundColor: "#238878",
//             color: "white",
//             textTransform: "none",
//             width: 120,
//             "&:hover": { backgroundColor: "#1f6f62" },
//           }}
//         >
//           Reorder
//         </Button>
//       </Paper>

//       {/* ========================================================= */}
//       {/*                      LOW STOCK SECTION                     */}
//       {/* ========================================================= */}

//       <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
//         <Typography fontSize={18} fontWeight={600} mb={2}>
//           Low Stock List
//         </Typography>

//         {/* Header */}
//         <Box display="flex" fontWeight={600} mb={1}>
//           <Box width="25%">Supplier</Box>
//           <Box width="25%">Medicine Name</Box>
//           <Box width="25%">Quantity</Box>
//           <Box width="25%">Action</Box>
//         </Box>

//         {/* Rows */}
//         {lowStockData.map((item) => (
//           <Box
//             key={item.id}
//             display="flex"
//             alignItems="center"
//             py={1.5}
//             borderBottom="1px solid #eee"
//           >
//             <Box width="25%">{item.supplier}</Box>
//             <Box width="25%">{item.name}</Box>
//             <Box width="25%">{item.qty}</Box>

//             <Box width="25%">
//               <IconButton><VisibilityIcon /></IconButton>
//               <IconButton><PictureAsPdfIcon color="error" /></IconButton>
//               <IconButton color="error"><DeleteIcon /></IconButton>
//             </Box>
//           </Box>
//         ))}
//       </Paper>

//       {/* ========================================================= */}
//       {/*                     LAST PURCHASE SECTION                  */}
//       {/* ========================================================= */}

//       <Paper sx={{ p: 3, borderRadius: 3 }}>
//         <Typography fontSize={18} fontWeight={600} mb={2}>
//           Last Purchase
//         </Typography>

//         {/* Header */}
//         <Box display="flex" fontWeight={600} mb={1}>
//           <Box width="25%">Supplier</Box>
//           <Box width="25%">Medicine Name</Box>
//           <Box width="25%">Quantity</Box>
//           <Box width="25%">Action</Box>
//         </Box>

//         {/* Rows */}
//         {lastPurchaseData.map((item) => (
//           <Box
//             key={item.id}
//             display="flex"
//             alignItems="center"
//             py={1.5}
//             borderBottom="1px solid #eee"
//           >
//             <Box width="25%">{item.supplier}</Box>
//             <Box width="25%">{item.name}</Box>
//             <Box width="25%">{item.qty}</Box>

//             <Box width="25%">
//               <IconButton><VisibilityIcon /></IconButton>
//               <IconButton><PictureAsPdfIcon color="error" /></IconButton>
//               <IconButton color="error"><DeleteIcon /></IconButton>
//             </Box>
//           </Box>
//         ))}
//       </Paper>
//     </Box>
//   );
// }


// import { Box, Typography, Button, IconButton, Paper, TextField, MenuItem } from "@mui/material";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import DeleteIcon from "@mui/icons-material/Delete";

// export default function InventoryDashboard() {
//   // SAMPLE STATIC DATA (Replace with API)
//   const lowStockData = [
//     { id: 1, supplier: "PharmaCare Ltd.", name: "Paracetamol", qty: "05" },
//     { id: 2, supplier: "MedEquip Inc.", name: "Cough Syrup", qty: "10" },
//   ];

//   const lastPurchaseData = [
//     { id: 1, supplier: "PharmaCare Ltd.", name: "Paracetamol", qty: "05" },
//     { id: 2, supplier: "MedEquip Inc.", name: "Cough Syrup", qty: "10" },
//   ];

//   return (
//     <Box p={3}>

//       {/* ========================================================= */}
//       {/*                       REORDER FORM                        */}
//       {/* ========================================================= */}

//       <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
//         <Typography fontSize={16} fontWeight={600} mb={2}>
//           Reorder
//         </Typography>

//         {/* Distributor Row */}
//         <Box display="flex" gap={4} mb={2}>
//           <Box flex={1}>
//             <Typography fontSize={14} mb={0.5}>Distributor / Company</Typography>
//             <TextField fullWidth size="small" select>
//               <MenuItem value="dist1">PharmaCare Ltd.</MenuItem>
//               <MenuItem value="dist2">MedEquip Inc.</MenuItem>
//             </TextField>
//           </Box>

//           <Box flex={1}>
//             <Typography fontSize={14} mb={0.5}>Email Address</Typography>
//             <TextField fullWidth size="small" />
//           </Box>
//         </Box>

//         {/* Medicine Rows — Strength/Type removed */}
//         <Box display="flex" flexDirection="column" gap={2} mb={2}>
//           {[1, 2].map((row) => (
//             <Box key={row} display="flex" gap={2} alignItems="center">

//               {/* Medicine Name */}
//               <TextField
//                 fullWidth
//                 size="small"
//                 select
//                 label="Medicine Name"
//               >
//                 <MenuItem value="para">Paracetamol</MenuItem>
//                 <MenuItem value="cough">Cough Syrup</MenuItem>
//               </TextField>

//               {/* Qty */}
//               <TextField
//                 fullWidth
//                 size="small"
//                 label="Qty."
//               />

//               {/* Add Button (only on last row) */}
//               {row === 2 && (
//                 <Button
//                   sx={{
//                     backgroundColor: "#238878",
//                     color: "white",
//                     textTransform: "none",
//                     px: 3,
//                     whiteSpace: "nowrap",
//                     "&:hover": { backgroundColor: "#1f6f62" },
//                   }}
//                 >
//                   + Add
//                 </Button>
//               )}
//             </Box>
//           ))}
//         </Box>

//         {/* Reorder Button */}
//         <Box display="flex" justifyContent="flex-end">
//           <Button
//             sx={{
//               backgroundColor: "#238878",
//               color: "white",
//               textTransform: "none",
//               width: 120,
//               "&:hover": { backgroundColor: "#1f6f62" },
//             }}
//           >
//             Reorder
//           </Button>
//         </Box>
//       </Paper>

//       {/* ========================================================= */}
//       {/*                      LOW STOCK SECTION                     */}
//       {/* ========================================================= */}

//       <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
//         <Typography fontSize={18} fontWeight={600} mb={2}>
//           Low Stock List
//         </Typography>

//         {/* Header */}
//         <Box display="flex" fontWeight={600} mb={1}>
//           <Box width="25%">Supplier</Box>
//           <Box width="25%">Medicine Name</Box>
//           <Box width="25%">Quantity</Box>
//           <Box width="25%">Action</Box>
//         </Box>

//         {/* Rows */}
//         {lowStockData.map((item) => (
//           <Box
//             key={item.id}
//             display="flex"
//             alignItems="center"
//             py={1.5}
//             borderBottom="1px solid #eee"
//           >
//             <Box width="25%">{item.supplier}</Box>
//             <Box width="25%">{item.name}</Box>
//             <Box width="25%">{item.qty}</Box>

//             <Box width="25%">
//               <IconButton><VisibilityIcon /></IconButton>
//               <IconButton><PictureAsPdfIcon color="error" /></IconButton>
//               <IconButton color="error"><DeleteIcon /></IconButton>
//             </Box>
//           </Box>
//         ))}
//       </Paper>

//       {/* ========================================================= */}
//       {/*                     LAST PURCHASE SECTION                  */}
//       {/* ========================================================= */}

//       <Paper sx={{ p: 3, borderRadius: 3 }}>
//         <Typography fontSize={18} fontWeight={600} mb={2}>
//           Last Purchase
//         </Typography>

//         {/* Header */}
//         <Box display="flex" fontWeight={600} mb={1}>
//           <Box width="25%">Supplier</Box>
//           <Box width="25%">Medicine Name</Box>
//           <Box width="25%">Quantity</Box>
//           <Box width="25%">Action</Box>
//         </Box>

//         {/* Rows */}
//         {lastPurchaseData.map((item) => (
//           <Box
//             key={item.id}
//             display="flex"
//             alignItems="center"
//             py={1.5}
//             borderBottom="1px solid #eee"
//           >
//             <Box width="25%">{item.supplier}</Box>
//             <Box width="25%">{item.name}</Box>
//             <Box width="25%">{item.qty}</Box>

//             <Box width="25%">
//               <IconButton><VisibilityIcon /></IconButton>
//               <IconButton><PictureAsPdfIcon color="error" /></IconButton>
//               <IconButton color="error"><DeleteIcon /></IconButton>
//             </Box>
//           </Box>
//         ))}
//       </Paper>
//     </Box>
//   );
// }


import { Box, Typography, Button, IconButton, Paper, TextField, MenuItem } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DeleteIcon from "@mui/icons-material/Delete";

export default function InventoryDashboard() {
  // SAMPLE STATIC DATA (Replace with API)
  const lowStockData = [
    { id: 1, supplier: "PharmaCare Ltd.", name: "Paracetamol", strength: "500mg", qty: "05" },
    { id: 2, supplier: "MedEquip Inc.", name: "Cough Syrup", strength: "Standard", qty: "10" },
  ];

  const lastPurchaseData = [
    { id: 1, supplier: "PharmaCare Ltd.", name: "Paracetamol", strength: "500mg", qty: "05" },
    { id: 2, supplier: "MedEquip Inc.", name: "Cough Syrup", strength: "Standard", qty: "10" },
  ];

  return (
    <Box p={3}>

      {/* ========================================================= */}
      {/*                       REORDER FORM                        */}
      {/* ========================================================= */}

      <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Typography
          fontSize={16}
          fontWeight={600}
          mb={2}
          sx={{ color: "#238878", textDecoration: "underline", cursor: "pointer" }}
        >
          Reorder
        </Typography>

        {/* Distributor Row — label left, field right (same row) */}
        <Box display="flex" alignItems="center" mb={2} gap={2}>
          <Typography fontSize={14} sx={{ minWidth: 180 }}>
            Distributor / Company
          </Typography>
          <TextField size="small" select sx={{ width: 220 }}>
            <MenuItem value="dist1">PharmaCare Ltd.</MenuItem>
            <MenuItem value="dist2">MedEquip Inc.</MenuItem>
          </TextField>
        </Box>

        {/* Email Row — label left, field right (same row) */}
        <Box display="flex" alignItems="center" mb={3} gap={2}>
          <Typography fontSize={14} sx={{ minWidth: 180 }}>
            Email Address
          </Typography>
          <TextField size="small" sx={{ width: 280 }} />
        </Box>

        {/* Column Headers */}
        <Box display="flex" gap={2} mb={1}>
          <Box sx={{ flex: 2 }}>
            <Typography fontSize={13} fontWeight={500}>Medicine Name</Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography fontSize={13} fontWeight={500}>Qty.</Typography>
          </Box>
          <Box sx={{ width: 80 }} /> {/* spacer for Add button column */}
        </Box>

        {/* Medicine Rows */}
        <Box display="flex" flexDirection="column" gap={2} mb={2}>
          {/* Row 1 */}
          <Box display="flex" gap={2} alignItems="center">
            <TextField fullWidth size="small" select sx={{ flex: 2 }}>
              <MenuItem value="para">Paracetamol</MenuItem>
              <MenuItem value="cough">Cough Syrup</MenuItem>
            </TextField>
            <TextField size="small" sx={{ flex: 1 }} />
            <Box sx={{ width: 80 }} /> {/* empty spacer to align with row 2 */}
          </Box>

          {/* Row 2 */}
          <Box display="flex" gap={2} alignItems="center">
            <TextField fullWidth size="small" select sx={{ flex: 2 }}>
              <MenuItem value="para">Paracetamol</MenuItem>
              <MenuItem value="cough">Cough Syrup</MenuItem>
            </TextField>
            <TextField size="small" sx={{ flex: 1 }} />
            <Button
              sx={{
                backgroundColor: "#238878",
                color: "white",
                textTransform: "none",
                px: 2,
                width: 80,
                whiteSpace: "nowrap",
                "&:hover": { backgroundColor: "#1f6f62" },
              }}
            >
              + Add
            </Button>
          </Box>
        </Box>

        {/* Reorder Button */}
        <Box display="flex" justifyContent="flex-end">
          <Button
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

      {/* ========================================================= */}
      {/*                      LOW STOCK SECTION                     */}
      {/* ========================================================= */}

      <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Typography fontSize={18} fontWeight={600} mb={2}>
          Low Stock List
        </Typography>

        {/* Header */}
        <Box display="flex" fontWeight={600} mb={1}>
          <Box width="25%">Supplier</Box>
          <Box width="25%">Medicine Name</Box>
          <Box width="25%">Quantity</Box>
          <Box width="25%">Action</Box>
        </Box>

        {/* Rows */}
        {lowStockData.map((item) => (
          <Box
            key={item.id}
            display="flex"
            alignItems="center"
            py={1.5}
            borderBottom="1px solid #eee"
          >
            <Box width="25%">{item.supplier}</Box>
            <Box width="25%">{item.name}</Box>
            <Box width="25%">{item.qty}</Box>
            <Box width="25%">
              <IconButton><VisibilityIcon /></IconButton>
              <IconButton><PictureAsPdfIcon color="error" /></IconButton>
              <IconButton color="error"><DeleteIcon /></IconButton>
            </Box>
          </Box>
        ))}
      </Paper>

      {/* ========================================================= */}
      {/*                     LAST PURCHASE SECTION                  */}
      {/* ========================================================= */}

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography fontSize={18} fontWeight={600} mb={2}>
          Last Purchase
        </Typography>

        {/* Header */}
        <Box display="flex" fontWeight={600} mb={1}>
          <Box width="25%">Supplier</Box>
          <Box width="25%">Medicine Name</Box>
          <Box width="25%">Quantity</Box>
          <Box width="25%">Action</Box>
        </Box>

        {/* Rows */}
        {lastPurchaseData.map((item) => (
          <Box
            key={item.id}
            display="flex"
            alignItems="center"
            py={1.5}
            borderBottom="1px solid #eee"
          >
            <Box width="25%">{item.supplier}</Box>
            <Box width="25%">{item.name}</Box>
            <Box width="25%">{item.qty}</Box>
            <Box width="25%">
              <IconButton><VisibilityIcon /></IconButton>
              <IconButton><PictureAsPdfIcon color="error" /></IconButton>
              <IconButton color="error"><DeleteIcon /></IconButton>
            </Box>
          </Box>
        ))}
      </Paper>
    </Box>
  );
}