import {
  Paper,
  Button,
  Stack,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import DateTimeField from "@/components/controlled/DateTimeField";
import { useNavigate, useParams } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import DropdownField from "@/components/controlled/DropdownField";
import TextInputField from "@/components/controlled/TextInputField";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";



type InvoiceItem = {
  item: string;
  qty: number;
  price: number;
};

type StoredMedicine = {
  name: string;
  qty: string;
  amount: number;
};

type StoredInvoice = {
  invoice: string;
  name: string;
  date: string;
  price: number;
  status: "Paid" | "Pending" | "Overdue";
  medicines: StoredMedicine[];
};

type Customer = {
  name: string;
};

type InventoryItem = {
  itemName: string;
  pricePerUnit: number;
};

type DropdownOption = {
  label: string;
  value: string;
};

type InventoryOption = DropdownOption & {
  price: number;
};

type InvoiceFormData = {
  name: string;
  date: Dayjs;
  status: "Paid" | "Pending" | "Overdue";
  items: InvoiceItem[];
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
  const [inventoryOptions, setInventoryOptions] = useState<InventoryOption[]>(
    []
  );

  const statusOptions: DropdownOption[] = [
    { label: "Paid", value: "Paid" },
    { label: "Pending", value: "Pending" },
    { label: "Overdue", value: "Overdue" },
  ];

  // Load customers
  useEffect(() => {
    const stored = localStorage.getItem("medical_customers");
    if (!stored) return;

    const parsed: Customer[] = JSON.parse(stored);

    setCustomerOptions(
      parsed.map((c) => ({
        label: c.name,
        value: c.name,
      }))
    );
  }, []);


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

  // Load inventory
  useEffect(() => {
    const stored = localStorage.getItem("inventory");
    if (!stored) return;

    const parsed: InventoryItem[] = JSON.parse(stored);

    setInventoryOptions(
      parsed.map((i) => ({
        label: i.itemName,
        value: i.itemName,
        price: i.pricePerUnit,
      }))
    );
  }, []);

  // Load invoice
  useEffect(() => {
    const stored = localStorage.getItem("invoices");
    if (!stored || !invoiceNo) return;

    const invoices: StoredInvoice[] = JSON.parse(stored);

    const found = invoices.find((inv) => inv.invoice === invoiceNo);
    if (!found) return;

    const items: InvoiceItem[] = found.medicines.map((m) => ({
      item: m.name,
      qty: Number(m.qty),
      price: m.amount,
    }));

    reset({
      name: found.name,
      date: dayjs(found.date),
      status: found.status,
      items: items.length ? items : [{ item: "", qty: 1, price: 0 }],
    });
  }, [invoiceNo, reset]);

  const onSubmit = (data: InvoiceFormData) => {
    const stored = localStorage.getItem("invoices");
    const invoices: StoredInvoice[] = stored ? JSON.parse(stored) : [];

    const totalPrice = data.items.reduce(
      (sum, i) => sum + Number(i.price),
      0
    );

    const updated = invoices.map((inv) =>
      inv.invoice === invoiceNo
        ? {
          ...inv,
          name: data.name,
          date: dayjs(data.date).format("YYYY-MM-DD"),
          price: totalPrice,
          status: data.status,
          medicines: data.items.map((i) => ({
            name: i.item,
            qty: `${i.qty}`,
            amount: i.price,
          })),
        }
        : inv
    );

    localStorage.setItem("invoices", JSON.stringify(updated));

    navigate(URL_PATH.Invoices);
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
          />

          <DateTimeField
            name="date"
            label="Invoice Date"
            viewMode="date"
            useCurrentDate={false}
            dateRestriction="current-future-only"
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

                  const qty = Number(methods.getValues(`items.${index}.qty`)) || 1;
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
                type="numeric"

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

          <Button variant="contained"
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
            onClick={handleSubmit(onSubmit)}>
            Update Invoice
          </Button>
        </Stack>
      </Paper>
    </FormProvider>
  );
};

export default EditInvoice;