// import {
//   Paper,
//   Button,
//   Stack,
//   Typography,
//   Box,
//   IconButton,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import RemoveIcon from "@mui/icons-material/Remove";
// import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
// import DateTimeField from "@/components/controlled/DateTimeField";
// import { useNavigate } from "react-router-dom";
// import { URL_PATH } from "@/constants/UrlPath";
// import DropdownField from "@/components/controlled/DropdownField";
// import dayjs from "dayjs";
// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import TextInputField from "@/components/controlled/TextInputField";

// type InvoiceItem = {
//   item: string;
//   qty: number;
//   price: number;
//   unitPrice:number;
// };
// type MedicineItem = {
//   name: string;
//   batch: string;
//   expiry: string;
//   qty: string;
//   amount: number;
// };

// type StoredInvoice = {
//   invoice: string;
//   name: string;
//   // name: string; 
//   date: string;
//   price: number;
//   status: "Paid" | "Pending" | "Overdue";
//   medicines: MedicineItem[];
// };

// type InvoiceFormData = {
//   name: string;
//   date: string;
//   status: "Paid" | "Pending" | "Overdue";
//   items: InvoiceItem[];
// };

// const CreateInvoice = () => {

//   type CustomerOption = {
//   label: string;
//   value: string;
// };

// // fetch data from local storage(custemoer list)
// const [customerOptions, setCustomerOptions] = useState<CustomerOption[]>([]);
// useEffect(() => {
//   const stored = localStorage.getItem("medical_customers");
//   if (!stored) return;

//   const parsed = JSON.parse(stored);

//   const formatted: CustomerOption[] = parsed.map((cust: { name: string }) => ({
//     label: cust.name,
//     value: cust.name,
//   }));

//   setCustomerOptions(formatted);
// }, []);

// type InventoryOption = {
//   label: string;
//   value: string;
//   price: number;
// };

// // fetch data from local storage(inventory list)
// const [inventoryOptions, setInventoryOptions] = useState<InventoryOption[]>([]);
// useEffect(() => {
//   const stored = localStorage.getItem("inventory");
//   if (!stored) return;

//   const parsed = JSON.parse(stored);

//   const formatted: InventoryOption[] = parsed.map(
//     (item: {
//       itemName: string;
//       pricePerUnit: number;
//     }) => ({
//       label: item.itemName,
//       value: item.itemName,
//       price: item.pricePerUnit,
//     })
//   );

//   setInventoryOptions(formatted);
// }, []);

//   const navigate = useNavigate();
// const location = useLocation() as { state?: StoredInvoice };
// const editingInvoice = location.state;

//   const methods = useForm<InvoiceFormData>({
//     defaultValues: {
//       name: "",
//       date: "",
//       status: "Pending",
//       items: [{ item: "", qty: 1, price: 0,unitPrice:0 }],
//     },
//   });
  
//   const { control, handleSubmit, reset } = methods;
// const { fields, append, remove,replace } = useFieldArray({
//   control,
//   name: "items",
// });


//   //use update the price according to quantity and unit price
//   const {setValue } = methods;
//   const watchedItems = useWatch({
//     control,
//     name: "items",
//   });
//   useEffect(() => {
//     watchedItems?.forEach((item, index) => {
//       const total = Number(item.qty || 0) * Number(item.unitPrice || 0);

//       if (item.price !== total) {
//         setValue(`items.${index}.price`, total);
//       }
//     });
//   }, [watchedItems, setValue]);

//   // dropdown for status
//   const statusOptions = [
//     { label: "Paid", value: "Paid" },
//     { label: "Pending", value: "Pending" },
//     { label: "Overdue", value: "Overdue" },
//   ];

//   const onSubmit = (data: InvoiceFormData) => {
//   const totalPrice = data.items.reduce(
//     (sum, item) => sum + item.price,0
//   );

//   const formattedDate = dayjs(data.date).format("YYYY-MM-DD");

//   const newInvoice = {
//     invoice: editingInvoice
//   ? editingInvoice.invoice
//   : `INV-${Date.now()}`,
//     name: data.name,
//     date: formattedDate,
//     price: totalPrice,
//     status: data.status,
//     medicines: data.items.map((item) => ({
//       name: item.item,
//       batch: "-",
//       expiry: "-",
//       qty: `${item.qty}`,
//       amount: item.price,
//     })),
//   };

//   const stored = localStorage.getItem("invoices");
//  const existingInvoices: StoredInvoice[] = stored
//   ? JSON.parse(stored)
//   : [];

//   let updatedInvoices;

// if (editingInvoice) {
//   // UPDATE
//   updatedInvoices = existingInvoices.map((inv) =>
//     inv.invoice === editingInvoice.invoice ? newInvoice : inv
//   );
// } else {
//   // CREATE
//   updatedInvoices = [newInvoice, ...existingInvoices];
// }

//   localStorage.setItem("invoices", JSON.stringify(updatedInvoices));

//  navigate(URL_PATH.Invoices, { replace: true });
// };
//   // prefill the form with existing invoice data for edit
// useEffect(() => {
//   if (editingInvoice) {

//     const mappedItems =
//       editingInvoice.medicines?.map((med) => {
//         const qty = Number(med.qty) || 1;
//         const price = Number(med.amount) || 0;

//         return {
//           item: med.name || "",
//           qty: qty,
//           unitPrice: price / qty,
//           price: price,
//         };
//       }) || [];

//     const itemsData = mappedItems.length
//       ? mappedItems
//       : [{ item: "", qty: 1, price: 0, unitPrice: 0 }];

//     //  update form fields
//     reset({
//       name: editingInvoice.name,
//       date: dayjs(editingInvoice.date).format("YYYY-MM-DD"),
//       status: editingInvoice.status,
//       items: itemsData,
//     });

//     //  update fieldArray UI
//     replace(itemsData);

//   }
// }, [editingInvoice]);



//   return (
//     <FormProvider {...methods}>
//       <Paper sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
//        <Typography variant="h6" mb={3}>
//   {editingInvoice ? "Edit Invoice" : "Create New Invoice"}
// </Typography>

//         <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//         <DropdownField
//           name="name"
//           label="name"
//           options={customerOptions}
//           placeholder=" Name"
//         />

//           <DateTimeField
//             name="date"
//             viewMode="date"
//             useCurrentDate={true}
//             label="Invoice Date"
//             required
//           />
//           <DropdownField
//             name="status"
//             label="Status"
//             options={statusOptions}
//             freeSolo={false}
//             sx={{ minWidth: 180 }}
//           />
//         </Stack>

//         <Box mt={4}>
//           <Typography fontWeight={600} mb={2}>
//             Invoice Items
//           </Typography>

//           {fields.map((field, index) => (
//           <Stack
//           key={field.id}
//           direction={{ xs: "column", sm: "row" }}
//           spacing={2}
//           alignItems={{ xs: "stretch", sm: "center" }}
//           mb={2}
//         >
//           {/* Dropdown */}
//           <DropdownField
//             name={`items.${index}.item`}
//             label="Item"
//             options={inventoryOptions}
//             fullWidth
//             freeSolo={false}
//             placeholder="Item Name"
//             onChangeCallback={(selected) => {
//               const selectedItem = inventoryOptions.find(
//                 (inv) => inv.value === selected
//               );

//               if (selectedItem) {
//                 methods.setValue(`items.${index}.unitPrice`, selectedItem.price)
//                 methods.setValue(`items.${index}.price`, selectedItem.price)
               
//               }
//             }}
//           />

//           {/* Bottom Row */}
//           <Stack
//             direction="row"
//             spacing={2}
//             alignItems="center"
//             sx={{
//               width: { xs: "100%", sm: "auto" },
//               justifyContent: { xs: "space-between", sm: "flex-start" },
//             }}
//           >
//             <TextInputField
//             type="numeric"
//               name={`items.${index}.qty`}
//               label="Qty"
//               sx={{ width: { xs: "30%", sm: 100 } }}
//             />

//             <TextInputField
//             type="numeric"
//               name={`items.${index}.price`}
//               label="Price"
//               sx={{ width: { xs: "40%", sm: 140 } }}
//               inputProps={{readOnly:true}}
//             />

//             <IconButton
//               color="error"
//               disabled={fields.length === 1}
//               onClick={() => remove(index)}
//             >
//               <RemoveIcon />
//             </IconButton>

//             <IconButton
//               color="success"
//               onClick={() => append({ item: "", qty: 1, price: 0, unitPrice: 0 })}
//             >
//               <AddIcon />
//             </IconButton>
//           </Stack>
//         </Stack>
//           ))}
//         </Box>

//         <Stack direction="row" justifyContent="space-between" mt={4}>
//           <Button
//             variant="outlined"
//             onClick={() => navigate(URL_PATH.Invoices)}
//             sx={{
//               backgroundColor: "#fff",
//               color: "#238878",
//               border: "2px solid #238878",

//               "&:hover": {
//                 backgroundColor: "#238878",
//                 color: "#fff",
//               },
//             }}
//           >
//             Cancel
//           </Button>
//          <Button
//   variant="contained"
//   onClick={handleSubmit(onSubmit)}
//   sx={{
//     backgroundColor: "#238878",
//     color: "#fff",
//     border: "2px solid #238878",
//     textTransform: "none",
//     "&:hover": {
//       backgroundColor: "#fff",
//       color: "#238878",
//       border: "2px solid #238878",
//     },
//   }}
// >
//   {editingInvoice ? "Update Invoice" : "Create Invoice"}
// </Button>

//         </Stack>
//       </Paper>
//     </FormProvider>
//   );
// };

// export default CreateInvoice;



