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
import TextInputField from "@/components/controlled/TextInputField";
import NumericField from "@/components/controlled/NumericField";
import DateTimeField from "@/components/controlled/DateTimeField";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import DropdownField from "@/components/controlled/DropdownField";
import dayjs from "dayjs";

type InvoiceItem = {
  item: string;
  qty: number;
  price: number;
};

type InvoiceFormData = {
  patient: string;
  date: string;
  status: "Paid" | "Pending" | "Overdue";
  items: InvoiceItem[];
};

const CreateInvoice = () => {
  const navigate = useNavigate();

  const methods = useForm<InvoiceFormData>({
    defaultValues: {
      patient: "",
      date: "",
      status: "Pending",
      items: [{ item: "", qty: 1, price: 0 }],
    },
  });

  const { control, handleSubmit } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const statusOptions = [
    { label: "Paid", value: "Paid" },
    { label: "Pending", value: "Pending" },
    { label: "Overdue", value: "Overdue" },
  ];

  const onSubmit = (data: InvoiceFormData) => {
    const totalPrice = data.items.reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    );

    const formattedDate = dayjs(data.date).format("DD-MM-YYYY");

    const newInvoice = {
      invoice: `INV-${Date.now()}`,
      patient: data.patient,
      date: formattedDate,
      price: totalPrice,
      status: data.status,
      medicines: data.items.map((item) => ({
        name: item.item,
        batch: "-",
        expiry: "-",
        qty: `${item.qty}`,
        amount: item.price,
      })),
    };

    navigate(URL_PATH.Invoices, {
      state: newInvoice,
    });
  };

  return (
    <FormProvider {...methods}>
      <Paper sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
        <Typography variant="h6" mb={3}>
          Create New Invoice
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextInputField
            name="patient"
            label="Patient Name"
            required
            fullWidth
          />
          <DateTimeField
            name="date"
            viewMode="date"
            useCurrentDate={true}
            label="Invoice Date"
            required
          />
          <DropdownField
            name="status"
            label="Status"
            options={statusOptions}
            freeSolo={false}
            sx={{ minWidth: 180 }}
          />
        </Stack>

        <Box mt={4}>
          <Typography fontWeight={600} mb={2}>
            Invoice Items
          </Typography>

          {fields.map((field, index) => (
            <Stack
              key={field.id}
              direction="row"
              spacing={2}
              alignItems="center"
              mb={2}
            >
              <TextInputField
                name={`items.${index}.item`}
                label="Item"
                fullWidth
              />
              <NumericField
                name={`items.${index}.qty`}
                label="Qty"
                sx={{ width: 100 }}
              />
              <NumericField
                name={`items.${index}.price`}
                label="Price"
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
            onClick={() => navigate("/Invoice")}
            sx={{
              backgroundColor: "#fff",
              color: "#238878",
              border: "2px solid #238878",

              "&:hover": {
                backgroundColor: "#238878",
                color: "#fff",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
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
            Create Invoice
          </Button>
        </Stack>
      </Paper>
    </FormProvider>
  );
};

export default CreateInvoice;
