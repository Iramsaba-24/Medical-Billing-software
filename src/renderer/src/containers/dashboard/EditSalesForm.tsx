// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Stack,
//   IconButton,
//   Typography,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import RemoveIcon from "@mui/icons-material/Remove";
// import { useEffect, useState } from "react";
// import { SalesData } from "./SalesTable";
// import {
//   useForm,
//   FormProvider,
//   useFieldArray,
//   useWatch,
// } from "react-hook-form";
// import TextInputField from "@/components/controlled/TextInputField";
// import DateTimeField from "@/components/controlled/DateTimeField";
// import { getMedicines, MedicineResponse } from "@/service/medicineService";
// import DropdownField from "@/components/controlled/DropdownField";

// type Props = {
//   editingRow: SalesData | null;
//   onClose: () => void;
//   onSave: (data: SalesData) => void;
// };

// // form type
// type InvoiceItemForm = {
//   medicineId: number;
//   itemName: string;
//   quantity: number;
//   price: number;
// };

// type FormValues = {
//   name: string;
//   date: string;
//   time: string;
//   items: InvoiceItemForm[];
// };

// const EditSalesForm = ({ editingRow, onClose, onSave }: Props) => {
//   const methods = useForm<FormValues>({
//     defaultValues: {
//       name: "",
//       date: "",
//       time: "",
//       items: [{ medicineId: 0, itemName: "", quantity: 1, price: 0 }],
//     },
//   });

//   const { control, handleSubmit, reset, setValue } = methods;

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "items",
//   });

//   const watchedItems = useWatch({ control, name: "items" });

//   const [medicines, setMedicines] = useState<MedicineResponse[]>([]);

//   //  Load medicines for dropdown
//   useEffect(() => {
//     const load = async () => {
//       const data = await getMedicines();
//       setMedicines(data);
//     };
//     load();
//   }, []);

//   //  Prefill data
//   useEffect(() => {
//     if (!editingRow) return;

//     reset({
//       name: editingRow.name,
//       date: editingRow.date,
//       time: editingRow.time,
//       items:
//         editingRow.items?.map((i) => {
//           const med = medicines.find((m) => m.medicineId === i.medicineId);

//           return {
//             medicineId: i.medicineId,
//             itemName: med?.itemName || "",
//             quantity: i.quantity,
//             price: i.price || 0,
//           };
//         }) || [{ medicineId: 0, itemName: "", quantity: 1, price: 0 }],
//     });
//   }, [editingRow, medicines, reset]);

//   //  Auto price calculation
//   useEffect(() => {
//     watchedItems?.forEach((item, index) => {
//       const med = medicines.find((m) => m.itemName === item.itemName);

//       if (!med) return;

//       const total = (item.quantity || 0) * med.pricePerUnit;

//       if (item.price !== total) {
// setValue(`items.${index}.price`, total);
// setValue(`items.${index}.medicineId`, med.medicineId);
//       }
//     });
//   }, [watchedItems, medicines, setValue]);

//   if (!editingRow) return null;

//   return (
//     <FormProvider {...methods}>
//       <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
//         <DialogTitle>Edit Sales</DialogTitle>

//         <DialogContent>
//           <Stack spacing={2} mt={1}>
//             <TextInputField name="name" label="Customer Name" disabled  />

//             <DateTimeField name="date" label="Date" viewMode="date" />
//             <DateTimeField name="time" label="Time" viewMode="time" />

//             {/* item section drop down */}
//             <Typography fontWeight={600}>Items</Typography>

//             {fields.map((field, index) => (
//               <Stack key={field.id} direction="row" spacing={2}>
                
//                 <DropdownField
//   name={`items.${index}.itemName`}
//   label="Item"
//   options={medicines.map((m) => ({
//     label: m.itemName,
//     value: m.itemName,
//   }))}
//   sx={{ width: 250 }}
//   onChangeCallback={(val: string) => {
//     const selected = medicines.find((m) => m.itemName === val);
//     if (!selected) return;

//     const qty =
//       Number(methods.getValues(`items.${index}.quantity`)) || 1;

//     const total = qty * selected.pricePerUnit;

//     setValue(`items.${index}.price`, total);
//     setValue(`items.${index}.medicineId`, selected.medicineId);
//   }}
// />

//                 <TextInputField
//                   name={`items.${index}.quantity`}
//                   label="Qty"
//                   type="number"
//                   sx={{ width: 100 }}
//                 />

//                 <TextInputField
//                   name={`items.${index}.price`}
//                   label="Price"
//                   type="number"
//                   inputProps={{ readOnly: true }}
//                   sx={{ width: 150 }}
//                 />

//                 <IconButton
//                   color="error"
//                   disabled={fields.length === 1}
//                   onClick={() => remove(index)}
//                 >
//                   <RemoveIcon />
//                 </IconButton>

//                 <IconButton
//                   color="success"
//                   onClick={() =>
//                     append({
//                       medicineId: 0,
//                       itemName: "",
//                       quantity: 1,
//                       price: 0,
//                     })
//                   }
//                 >
//                   <AddIcon />
//                 </IconButton>
//               </Stack>
//             ))}
//           </Stack>
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={onClose}
//            variant="outlined"
//            sx={{
//               backgroundColor: "#238878",
//               color: "#fff",
//               border: "2px solid #238878",
//               textTransform: "none",
//               "&:hover": {
//                 backgroundColor: "#fff",
//                 color: "#238878",
//                 border: "2px solid #238878",
//               },
//             }}
//           >Cancel</Button>

//           <Button
//             variant="contained"
//              sx={{
//               backgroundColor: "#238878",
//               color: "#fff",
//               border: "2px solid #238878",
//               textTransform: "none",
//               "&:hover": {
//                 backgroundColor: "#fff",
//                 color: "#238878",
//                 border: "2px solid #238878",
//               },
//             }}
//             onClick={handleSubmit((data) => {
//               const totalPrice = data.items.reduce(
//                 (sum, i) => sum + i.price,
//                 0
//               );

//               onSave({
//                 ...editingRow,
//                 name: data.name,
//                 date: data.date,
//                 time: data.time,
//                 totalPrice,
//                 items: data.items.map((i) => ({
//                   medicineId: i.medicineId,
//                   quantity: i.quantity,
//                   price: i.price,
//                 })),
//               });

//               onClose();
//             })}
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
import DropdownField from "@/components/controlled/DropdownField";

type Props = {
  editingRow: SalesData | null;
  onClose: () => void;
  onSave: (data: SalesData) => void;
};

// form type
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

  //  Load medicines for dropdown
  useEffect(() => {
    const load = async () => {
      const data = await getMedicines();
      setMedicines(data);
    };
    load();
  }, []);

  //  Prefill data
  useEffect(() => {
    if (!editingRow) return;

    reset({
     name: editingRow.name,
      date: editingRow.date,
      //time: editingRow.time,
      time: editingRow.time || "00:00", // ✅ FIX
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

  //  Auto price calculation
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

            <TextInputField 
            name="name" 
            label="Customer Name" 
            inputType="all"  
             //inputProps={{ readOnly: true }} 
              required={false}  disabled />

            <DateTimeField name="date" label="Date" viewMode="date"  dateRestriction="past-current-future"   />
            <DateTimeField name="time" label="Time" viewMode="time"   dateRestriction="past-current-future"    />

            {/* item section drop down */}
            <Typography fontWeight={600}>Items</Typography>

            {fields.map((field, index) => (
              <Stack key={field.id} direction="row" spacing={2}>
                
                <DropdownField
  name={`items.${index}.itemName`}
  label="Item"
  options={medicines.map((m) => ({
    label: m.itemName,
    value: m.itemName,
  }))}
  sx={{ width: 250 }}
  onChangeCallback={(val: string) => {
    const selected = medicines.find((m) => m.itemName === val);
    if (!selected) return;

    const qty =
      Number(methods.getValues(`items.${index}.quantity`)) || 1;

    const total = qty * selected.pricePerUnit;

    setValue(`items.${index}.price`, total);
    setValue(`items.${index}.medicineId`, selected.medicineId);
  }}
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
          <Button onClick={onClose}
           variant="outlined"
           sx={{
              backgroundColor: "#238878",
              color: "#fff",
              border: "2px solid #238878",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#fff",
                color: "#238878",
                border: "2px solid #238878",
              },
            }}
          >Cancel</Button>

          <Button
            variant="contained"
             sx={{
              backgroundColor: "#238878",
              color: "#fff",
              border: "2px solid #238878",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#fff",
                color: "#238878",
                border: "2px solid #238878",
              },
            }}
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





