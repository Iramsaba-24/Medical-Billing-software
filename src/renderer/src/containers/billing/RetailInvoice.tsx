

import { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import {
  FormProvider,
  useForm,
  useFieldArray,
} from "react-hook-form";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import EmailField from "@/components/controlled/EmailField";
import MobileField from "@/components/controlled/MobileField";
import TextInputField from "@/components/controlled/TextInputField";
import DropdownField from "@/components/controlled/DropdownField";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";

/* STYLES */
const TEAL_COLOR = "#2D8B7A";
const BORDER_COLOR = "#D1D5DB";

const containerStyle = {
  p: { xs: 2 },
  backgroundColor: "#fff",
  borderRadius: "12px",
  border: `1px solid ${BORDER_COLOR}`,
  mb: 2,
};

type ItemRow = {
  name: string;
  qty: number;
  mrp: number;
  discount: number;
};

type FormData = {
  company: string;
  supplier: string;
  mobile: string;
  email: string;
  address: string;
  gst: string;
  items: ItemRow[];
};

const POS2 = () => {
  const methods = useForm<FormData>({
    defaultValues: {
      gst: "5",
      items: [{ name: "", qty: 1, mrp: 0, discount: 0 }],
    },
  });

  const { handleSubmit, watch, control } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items") || [];
  const gst = Number(watch("gst") || 0);

  /* CALCULATIONS */
  const getRowAmount = (row: ItemRow) => {
    const priceAfterDiscount = row.mrp - row.discount;
    if (priceAfterDiscount <= 0) return 0;
    return row.qty * priceAfterDiscount;
  };

  const subTotal = items.reduce((sum, row) => sum + getRowAmount(row), 0);
  const gstAmount = (subTotal * gst) / 100;
  const finalTotal = subTotal + gstAmount;

  const onSubmit = (data: FormData) => {
    if (data.items.some((r) => !r.name.trim() || r.qty <= 0 || r.mrp <= 0)) {
      alert("Please complete all item details");
      return;
    }
    alert("Payment Successful!");
    console.log(data);
  };

  const companyOptions = [
    { label: "MediSupply Co", value: "MediSupply Co" },
    { label: "PharmaCare Pvt. Ltd.", value: "PharmaCare Pvt. Ltd." },
    { label: "MedPlus Ltd.", value: "MedPlus Ltd." },
  ];

  const [activeTab, setActiveTab] = useState<"new" | "retail">("new");
  const navigate = useNavigate();

  
  return (
    <FormProvider {...methods}>
      {/* TOP BUTTONS */}
      <Box display="flex">
        <Button
          onClick={() => {
            setActiveTab("new");
            if (location.pathname !== URL_PATH.Billing) navigate(URL_PATH.Billing);
          }}
          sx={{
            textTransform: "none",
            width: { xs: "50%", md: "10%" },
            height: "38px",
            fontWeight: 500,
            borderRadius: "0px 18px 0px 0px",
            backgroundColor: activeTab === "new" ? "#238878" : "#fff",
            color: activeTab === "new" ? "#fff" : "#000",
            border: activeTab === "new" ? "none" : "1px solid #ccc",
          }}
        >
          New Invoice
        </Button>

        <Button
          onClick={() => {
            setActiveTab("retail");
            if (location.pathname !== URL_PATH.RetailInvoice)
              navigate(URL_PATH.RetailInvoice);
          }}
          sx={{
            textTransform: "none",
            width: { xs: "50%", md: "10%" },
            height: "38px",
            fontWeight: 500,
            borderRadius: "0px 18px 0px 0px",
            backgroundColor: activeTab === "retail" ? "#238878" : "#fff",
            color: activeTab === "retail" ? "#fff" : "#000",
            border: activeTab === "retail" ? "none" : "1px solid #ccc",
          }}
        >
          Retail Invoice
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* TOP FORM */}
          <Box sx={containerStyle}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <DropdownField
                  name="company"
                  label="Company"
                  placeholder="Company"
                  required
                  options={companyOptions}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextInputField name="supplier" label="Supplier" required />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <MobileField name="mobile" label="Mobile Number" required />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <EmailField name="email" label="Email" required />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextInputField
                  name="address"
                  label="Address"
                  inputType="textarea"
                  rows={3}
                />
              </Grid>
            </Grid>
          </Box>

          {/* ITEMS */}
          <Box sx={containerStyle}>
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h6">Item Name</Typography>
              <Button
                type="button"
                startIcon={<AddIcon />}
                onClick={() => append({ name: "", qty: 1, mrp: 0, discount: 0 })}
                sx={{ textTransform: "none", color: TEAL_COLOR }}
              >
                Add Item
              </Button>
            </Box>

            {fields.map((field, index) => (
              <Grid container spacing={2} mb={2} key={field.id}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextInputField
                    name={`items.${index}.name`}
                    label="Item"
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                  <TextInputField
                    name={`items.${index}.qty`}
                    label="QTY"
                    type="number"
                    required
                    inputProps={{ min: 1 }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                  <TextInputField
                    name={`items.${index}.mrp`}
                    label="MRP"
                    type="number"
                    required
                    inputProps={{ min: 0, step: "0.01" }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                  <TextInputField
                    name={`items.${index}.discount`}
                    label="DISCOUNT"
                    type="number"
                    inputProps={{ min: 0, step: "0.01" }}
                  />
                </Grid>

             
                <Grid size={{ xs: 12, md: 2 }}>
                  <TextField
                    
                    fullWidth
                    label="Amount"
                    disabled
                    value={getRowAmount(items[index]).toFixed(2)}
                  />
                </Grid>

                <Grid textAlign={{ xs: "right", md: "center" }} size={{ xs: 12, md: 1 }}>
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    sx={{ minWidth: 0, color: TEAL_COLOR }}
                    disabled={fields.length === 1}
                  >
                    <RemoveIcon />
                  </Button>
                </Grid>
              </Grid>
            ))}

            {/* GST + TOTAL */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 3 }}>
                <DropdownField
                  name="gst"
                  label="GST (%)"
                  placeholder="GST (%)"
                  options={[
                    { label: "5%", value: "5" },
                    { label: "12%", value: "12" },
                    { label: "18%", value: "18" },
                  ]}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }} ml="auto">
                <Box
                  sx={{
                    height: 56,
                    backgroundColor: "#E6F4F1",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: TEAL_COLOR,
                  }}
                >
                  Total: ₹ {finalTotal.toFixed(2)}
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* ACTIONS */}
          <Box
            display="flex"
            gap={2}
            mt={3}
            sx={{
              justifyContent: { xs: "center", md: "flex-end" },
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              type="submit"
              sx={{
                bgcolor: TEAL_COLOR,
                color: "#fff",
                "&:hover": { bgcolor: "#fff", color: TEAL_COLOR },
                px: 4,
              }}
              onClick={() => navigate(URL_PATH.PaymentMethod)}
            >
              Pay
            </Button>

            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              type="button"
              onClick={() => window.print()}
              sx={{
                bgcolor: TEAL_COLOR,
                color: "#fff",
                "&:hover": { bgcolor: "#fff", color: TEAL_COLOR },
                px: 4,
              }}
            >
              Print
            </Button>
          </Box>
        </form>
      </Paper>
    </FormProvider>
  );
};

export default POS2;












