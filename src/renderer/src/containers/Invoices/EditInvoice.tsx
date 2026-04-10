import {Paper,Button,Stack,Typography,Box,IconButton,} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import DateTimeField from "@/components/controlled/DateTimeField";
import { useNavigate, useParams } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import DropdownField from "@/components/controlled/DropdownField";
import TextInputField from "@/components/controlled/TextInputField";
import { getMedicines, MedicineResponse } from "@/service/medicineService";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { getAllCustomers } from "@/service/customerService";
import { updateRetailInvoice, getRetailInvoiceById, createSingleRetailInvoiceItem } from "@/service/retailInvoiceService";
import { deleteRetailInvoiceItemsByInvoiceId, getRetailInvoiceItemsByInvoiceId  } from "@/service/retailInvoiceService";
import { useEffect, useState } from "react";
 
dayjs.extend(customParseFormat);
 
type InvoiceItem = {
  item: string;
  qty: number;
  price: number;
};
 
type DropdownOption = {
  label: string;
  value: string;
};
 
type InventoryOption = DropdownOption & {
 label: string;
  value: string;
  id: number;
  price: number;
};
 
type InvoiceFormData = {
  name: string;
  date: Dayjs;
  status: "Paid" | "Pending" | "Overdue";
  items: InvoiceItem[];
};
 
type RetailInvoiceItemResponse = {
  medicineId: number;
 
  quantity: number;
  amount: number;
  price: number;
};
 
const EditInvoice = () => {
  const navigate = useNavigate();
  const { invoiceNo } = useParams<{ invoiceNo: string }>();
 
  const methods = useForm<InvoiceFormData>({
    defaultValues: {
      name: "",
      date: dayjs(),
      status: "Pending",
      items: [{ item: "", qty: 1, price: 0 }],
    },
  });
 
  const { control, handleSubmit, reset, setValue } = methods;
 
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
 
  const watchedItems = useWatch({
    control,
    name: "items",
  });
 
  const [customerOptions, setCustomerOptions] = useState<DropdownOption[]>([]);
  const [inventoryOptions, setInventoryOptions] = useState<InventoryOption[]>([]);
 
  const statusOptions: DropdownOption[] = [
    { label: "Paid", value: "Paid" },
    { label: "Pending", value: "Pending" },
    { label: "Overdue", value: "Overdue" },
  ];
 
  // Load Customers
useEffect(() => {
  const fetchCustomers = async () => {
    try {
      const data = await getAllCustomers();
      setCustomerOptions(
        data.map((c) => ({
          label: c.name,
          value: c.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching customers", error);
    }
  };
  fetchCustomers();
}, []);
 
  // Load Inventory
  useEffect(() => {
    watchedItems?.forEach((item, index) => {
      const selectedItem = inventoryOptions.find(
        (i) => i.value === item.item
      );
 
      if (!selectedItem) return;
 
      const qty = Number(item.qty) || 0;
      const total = qty * selectedItem.price;
 
      if (item.price !== total) {
        setValue(`items.${index}.price`, total);
      }
    });
  }, [watchedItems, inventoryOptions, setValue]);
 
 
 
useEffect(() => {
  const fetchMedicines = async () => {
    const data: MedicineResponse[] = await getMedicines();
 
    setInventoryOptions(
  data.map((i: MedicineResponse) => ({
    label: i.itemName,
    value: i.itemName,
    id: i.medicineId,
    price: i.pricePerUnit,
  }))
);
  };
 
  fetchMedicines();
}, []);
  // Load invoice
 
useEffect(() => {
  if (!invoiceNo) return;
  if (inventoryOptions.length === 0) return;
 
  const fetchInvoice = async () => {
    try {
      const invoice = await getRetailInvoiceById(Number(invoiceNo));
      const items: RetailInvoiceItemResponse[] = await getRetailInvoiceItemsByInvoiceId(Number(invoiceNo));
 
     const mappedItems = items.map((i: RetailInvoiceItemResponse) => {
  const med = inventoryOptions.find(m => m.id === i.medicineId);
 
  return {
    item: med?.value || "",
    qty: i.quantity,
    price: i.price,
  };
});
 
      reset({
        name: invoice.customerName,
        date: dayjs(invoice.invoiceDate),
        status: invoice.paymentStatus,
        items: mappedItems.length > 0
          ? mappedItems
          : [{ item: "", qty: 1, price: 0 }],
      });
 
    } catch (error) {
      console.error("Error fetching invoice", error);
    }
  };
 
  fetchInvoice();
}, [invoiceNo, reset, inventoryOptions]);
 
 
const onSubmit = async (data: InvoiceFormData) => {
  try {
    const invoice = await getRetailInvoiceById(Number(invoiceNo));
 
   const newTotal = data.items.reduce(
  (sum, item) => sum + Number(item.price),
  0
);
 
    // invoice update
    await updateRetailInvoice(Number(invoiceNo), {
      userId: invoice.userId,
      customerId: invoice.customerId,
      invoiceType: invoice.invoiceType,
      invoiceDate: invoice.invoiceDate,
      totalAmount: newTotal,
      totalGST: invoice.totalGST,
      totalDiscount: invoice.totalDiscount,
      medipointsEarned: invoice.medipointsEarned,
      paymentStatus: data.status,
    });
 
   
    await deleteRetailInvoiceItemsByInvoiceId(Number(invoiceNo));
 
 
    for (const item of data.items) {
      const selectedItem = inventoryOptions.find(i => i.value === item.item);
      if (!selectedItem) continue;
 
      await createSingleRetailInvoiceItem({
        retailInvoiceId: Number(invoiceNo),
       medicineId: selectedItem?.id || 0,
        quantity: Number(item.qty),
         price: selectedItem?.price || 0,
        gstPercent: 0,
        discount: 0,
      });
    }
 
    navigate(URL_PATH.Invoices);
  } catch (error) {
    console.error("Error updating invoice", error);
  }
};
 
  return (
    <FormProvider {...methods}>
      <Paper sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
        <Typography variant="h6" mb={3}>
          Edit Invoice
        </Typography>
 
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <DropdownField
            name="name"
            label="Customer"
            options={customerOptions}
            fullWidth
             freeSolo={true}
 
  disabled
          />
 
          <DateTimeField
  name="date"
  label="Invoice Date"
  viewMode="date"
  useCurrentDate={true}
  disabled
/>
 
          <DropdownField
            name="status"
            label="Status"
            options={statusOptions}
            fullWidth
          />
        </Stack>
 
        <Box mt={4}>
          <Typography fontWeight={600} mb={2}>
            Invoice Items
          </Typography>
 
          {fields.map((field, index) => (
            <Stack key={field.id} direction="row" spacing={2} mb={2}>
              <DropdownField
                name={`items.${index}.item`}
                label="Item"
                options={inventoryOptions}
                sx={{ width: 500 }}
                onChangeCallback={(val: string) => {
                  const selectedItem = inventoryOptions.find(
                    (i) => i.value === val
                  );
 
                  if (!selectedItem) return;
 
                  const qty =
                    Number(methods.getValues(`items.${index}.qty`)) || 1;
 
                  const total = qty * selectedItem.price;
 
                  setValue(`items.${index}.price`, total);
                }}
              />
 
              <TextInputField
                name={`items.${index}.qty`}
                label="Qty"
                type="number"
                sx={{ width: 100 }}
              />
 
              <TextInputField
                name={`items.${index}.price`}
                label="Price"
                type="number"
                inputProps={{ readOnly: true }}
                sx={{ width: 140 }}
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
                onClick={() => append({ item: "", qty: 1, price: 0 })}
              >
                <AddIcon />
              </IconButton>
            </Stack>
          ))}
        </Box>
 
        <Stack direction="row" justifyContent="space-between" mt={4}>
          <Button
            variant="outlined"
            onClick={() => navigate(URL_PATH.Invoices)}
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
          >
            Cancel
          </Button>
 
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
            onClick={handleSubmit(onSubmit)}
          >
            Update Invoice
          </Button>
        </Stack>
      </Paper>
    </FormProvider>
  );
};
 
export default EditInvoice;
 
 
 