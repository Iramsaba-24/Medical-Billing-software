// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
// } from "@mui/material";
// import { useEffect, useState } from "react";
// import { SalesData } from "./SalesTable";
// import { InventoryItem } from "@/containers/inventory/AddInventoryItem";
// import DropdownField from "@/components/controlled/DropdownField";
// import { useForm, FormProvider } from "react-hook-form";
// import DateTimeField from "@/components/controlled/DateTimeField";
// import dayjs from "dayjs";

// type Props = {
//   editingRow: SalesData | null;
//   onClose: () => void;
//   onSave: (data: SalesData) => void;
// };


// const EditSalesForm = ({ editingRow, onClose, onSave }: Props) => {
//   const methods = useForm();

//   const [formData, setFormData] = useState<SalesData | null>(null);
//   const [inventory, setInventory] = useState<InventoryItem[]>([]);

//   useEffect(() => {
//     if (editingRow) {
//       setFormData(editingRow);

//       methods.reset({
//         medicine: editingRow.medicine,
//         date: dayjs(editingRow.date).format("YYYY-MM-DD"),
//         time: dayjs(editingRow.time, "HH:mm").format("HH:mm"),
//       });
//     }
//   }, [editingRow, methods]);

//   useEffect(() => {
//     const stored = localStorage.getItem("inventory");
//     if (!stored) return;
//     setInventory(JSON.parse(stored));
//   }, []);

//   if (!formData) return null;
//   return (
//     <FormProvider {...methods}>
//       <Dialog
//         open={Boolean(editingRow)}
//         onClose={onClose}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>Edit Sales Record</DialogTitle>

//         <DialogContent
//           sx={{ display: "flex", flexDirection: "column", gap: 2 }}
//         >
//           <TextField
//             sx={{ mt: 1 }}
//             label="Customer Name"
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             InputProps={{ readOnly: true }}
//           />

//           <DropdownField
//             label="Medicine"
//             name="medicine"
//             options={inventory.map((item) => ({
//               label: item.itemName,
//               value: item.itemName,
//             }))}
//             required
//             onChangeCallback={(selectedValue) => {
//               const selectedItem = inventory.find(
//                 (item) => item.itemName === selectedValue,
//               );

//               if (!selectedItem) return;

//               setFormData((prev) => ({
//                 ...prev!,
//                 medicine: selectedValue,
//                 quantity: 1,
//                 totalPrice: selectedItem.pricePerUnit,
//               }));
//             }}
//           />

//           <TextField
//             label="Quantity"
//             type="number"
//             value={formData.quantity}
//             onChange={(e) => {
//               const qty = Number(e.target.value);

//               const selectedItem = inventory.find(
//                 (item) => item.itemName === formData.medicine,
//               );

//               if (!selectedItem) return;

//               setFormData({
//                 ...formData,
//                 quantity: qty,
//                 totalPrice: qty * selectedItem.pricePerUnit, 
//               });
//             }}
//           />

//           <TextField
//             label="Total Price"
//             type="number"
//             value={formData.totalPrice}
//             InputProps={{ readOnly: true }}
//           />

//           <DateTimeField name="date" label="Date" viewMode="date" required />

//           <DateTimeField name="time" label="Time" viewMode="time" required />
//         </DialogContent>

//         <DialogActions sx={{ gap: 2, px: 3, pb: 2 }}>
//           <Button
//             onClick={onClose}
//             sx={{
//               px: 4,
//               width: "18%",
//               textTransform: "none",
//               border: "2px solid #1b7f6b",
//               color: "#1b7f6b",
//               "&:hover": {
//                 backgroundColor: "#1b7f6b",
//                 color: "#fff",
//               },
//             }}
//           >
//             Cancel
//           </Button>

//           <Button
//             variant="contained"
//             onClick={() => {
//               onSave(formData);
//               onClose();
//             }}
//             sx={{
//               px: 4,
//               width: "18%",
//               textTransform: "none",
//               backgroundColor: "#1b7f6b",
//               "&:hover": {
//                 backgroundColor: "#fff",
//                 color: "#1b7f6b",
//                 border: "2px solid #1b7f6b",
//               },
//             }}
//           >
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </FormProvider>
//   );
// };

// export default EditSalesForm;
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  IconButton,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useEffect, useState } from "react";
import { SalesData } from "./SalesTable";
import {
  useForm,
  FormProvider,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import TextInputField from "@/components/controlled/TextInputField";
import DateTimeField from "@/components/controlled/DateTimeField";
import { getMedicines, MedicineResponse } from "@/service/medicineService";

type Props = {
  editingRow: SalesData | null;
  onClose: () => void;
  onSave: (data: SalesData) => void;
};

// ✅ FORM TYPES (service aligned)
type InvoiceItemForm = {
  medicineId: number;
  itemName: string;
  quantity: number;
  price: number;
};

type FormValues = {
  name: string;
  date: string;
  time: string;
  items: InvoiceItemForm[];
};

const EditSalesForm = ({ editingRow, onClose, onSave }: Props) => {
  const methods = useForm<FormValues>({
    defaultValues: {
      name: "",
      date: "",
      time: "",
      items: [{ medicineId: 0, itemName: "", quantity: 1, price: 0 }],
    },
  });

  const { control, handleSubmit, reset, setValue } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = useWatch({ control, name: "items" });

  const [medicines, setMedicines] = useState<MedicineResponse[]>([]);

  // ✅ Load medicines (for price calculation only)
  useEffect(() => {
    const load = async () => {
      const data = await getMedicines();
      setMedicines(data);
    };
    load();
  }, []);

  // ✅ Prefill data
  useEffect(() => {
    if (!editingRow) return;

    reset({
      name: editingRow.name,
      date: editingRow.date,
      time: editingRow.time,
      items:
        editingRow.items?.map((i) => {
          const med = medicines.find((m) => m.medicineId === i.medicineId);

          return {
            medicineId: i.medicineId,
            itemName: med?.itemName || "",
            quantity: i.quantity,
            price: i.price || 0,
          };
        }) || [{ medicineId: 0, itemName: "", quantity: 1, price: 0 }],
    });
  }, [editingRow, medicines, reset]);

  // ✅ Auto price calculation
  useEffect(() => {
    watchedItems?.forEach((item, index) => {
      const med = medicines.find((m) => m.itemName === item.itemName);

      if (!med) return;

      const total = (item.quantity || 0) * med.pricePerUnit;

      if (item.price !== total) {
        setValue(`items.${index}.price`, total);
        setValue(`items.${index}.medicineId`, med.medicineId);
      }
    });
  }, [watchedItems, medicines, setValue]);

  if (!editingRow) return null;

  return (
    <FormProvider {...methods}>
      <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Sales</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextInputField name="name" label="Customer Name" disabled />

            <DateTimeField name="date" label="Date" viewMode="date" />
            <DateTimeField name="time" label="Time" viewMode="time" />

            {/* ✅ ITEM SECTION (NO DROPDOWN) */}
            <Typography fontWeight={600}>Items</Typography>

            {fields.map((field, index) => (
              <Stack key={field.id} direction="row" spacing={2}>
                {/* ✅ Item Name (manual input) */}
                <TextInputField
                  name={`items.${index}.itemName`}
                  label="Item Name"
                  sx={{ width: 250 }}
                />

                <TextInputField
                  name={`items.${index}.quantity`}
                  label="Qty"
                  type="number"
                  sx={{ width: 100 }}
                />

                <TextInputField
                  name={`items.${index}.price`}
                  label="Price"
                  type="number"
                  inputProps={{ readOnly: true }}
                  sx={{ width: 150 }}
                />

                <IconButton
                  color="error"
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                >
                  <RemoveIcon />
                </IconButton>

                <IconButton
                  color="success"
                  onClick={() =>
                    append({
                      medicineId: 0,
                      itemName: "",
                      quantity: 1,
                      price: 0,
                    })
                  }
                >
                  <AddIcon />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>

          <Button
            variant="contained"
            onClick={handleSubmit((data) => {
              const totalPrice = data.items.reduce(
                (sum, i) => sum + i.price,
                0
              );

              onSave({
                ...editingRow,
                name: data.name,
                date: data.date,
                time: data.time,
                totalPrice,
                items: data.items.map((i) => ({
                  medicineId: i.medicineId,
                  quantity: i.quantity,
                  price: i.price,
                })),
              });

              onClose();
            })}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
};

export default EditSalesForm;