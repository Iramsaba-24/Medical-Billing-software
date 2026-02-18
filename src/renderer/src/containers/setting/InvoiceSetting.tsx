import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { Paper, Typography, Box, Button } from "@mui/material";
import RadioField from "@/components/controlled/RadioField";
import CheckboxGroup from "@/components/controlled/CheckboxGroup";

const SettingSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Paper sx={paperStyle}>
    <Typography sx={headingStyle}>{title}</Typography>
    {children}
  </Paper>
);

const headingStyle = {
  fontWeight: 700,
  fontSize: "18px",
  color: "#212529",
  mb: 1,
};

const paperStyle = {
  p: { xs: 2, md: 4 },
  borderRadius: "5px",
  boxShadow: 3,
  mb: 1,
};

const InvoiceSettings = () => {
  const methods = useForm({
    defaultValues: {
      invoice_types: [],
      retail_series: "RET-0001",
      wholesale_series: "WHS-0001",
      gst_series: "GST-0001",
      invoice_settings: [],
      payment_method: "cash",
      allow_split_payment: [],
      product_linking: [],
      tax_mode: "inclusive_gst",
      tax_override: [],
      discount_rule: "item_level",
      discount_options: [],
      date_control: [],
      credit_control: [],
    },
  });

  const { handleSubmit, reset, register } = methods;

  const radioSx = {
    width: "100%",
    "& .MuiFormGroup-root": { width: "100%" },
    "& .MuiFormControlLabel-root": {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "row-reverse",
      ml: 0,
      mr: 0,
      mb: 0.5,
    },
  };

  const checkboxSx = {
    width: "100%",
    "& .MuiFormGroup-root": { width: "100%" },
    "& .MuiFormControlLabel-root": {
      width: "100%",
      display: "flex",
      justifyContent: "flex-start",
      ml: 0,
      mr: 0,
      mb: 0.5,

    },
  };

  const onSubmit = (data: FieldValues) => {
    console.log("Form Data:", data);
  };

  return (
    <Box sx={{ backgroundColor: "#f9f9f9" }}>
      <Typography variant="h6" mb={3} fontWeight={600}>
        Invoice Settings
      </Typography>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>

          <SettingSection title="Invoice Types">
            <CheckboxGroup
              name="invoice_types"
              label=""
              options={[
                { label: "Retail", value: "retail" },
                { label: "Wholesale", value: "wholesale" },
                { label: "GST Invoice", value: "gst" },
              ]}
              sx={checkboxSx}
            />
          </SettingSection>

          <SettingSection title="Invoice Numbering Series">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography fontSize="14px">Retail Series</Typography>
                <input {...register("retail_series")} style={{ width: "120px", padding: "4px" }} />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography fontSize="14px">Wholesales Series</Typography>
                <input {...register("wholesale_series")} style={{ width: "120px", padding: "4px" }} />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography fontSize="14px">GST Series</Typography>
                <input {...register("gst_series")} style={{ width: "120px", padding: "4px" }} />
              </Box>
            </Box>

            <CheckboxGroup
              name="invoice_settings"
              label=""
              options={[
                { label: "Auto-increment", value: "auto_increment" },
                { label: "Lock series after first use", value: "lock_series" },
              ]}
              sx={checkboxSx}
            />
          </SettingSection>

          <SettingSection title="Tax Mode">
            <RadioField
              name="tax_mode"
              label=""
              options={[
                { label: "Inclusive of GST", value: "inclusive_gst" },
                { label: "Exclusive of GST", value: "exclusive_gst" },
              ]}
              sx={radioSx}
            />

            <CheckboxGroup
              name="tax_override"
              label=""
              options={[
                { label: "Allow override per invoice", value: "override_per_invoice" },
              ]}
              sx={checkboxSx}
            />

          </SettingSection>

          <SettingSection title="Discount Rules">
            <RadioField
              name="discount_rule"
              label=""
              options={[
                { label: "Item-level discount", value: "item_level" },
                { label: "Bill-level discount", value: "bill_level" },
              ]}
              sx={radioSx}
            />

            <CheckboxGroup
              name="discount_options"
              label=""
              options={[
                { label: "Allow both (with priority rules)", value: "allow_both" },
              ]}
              sx={checkboxSx}
            />

          </SettingSection>

          <SettingSection title="Default Payment Mode">
            <RadioField
              name="payment_method"
              label=""
              options={[
                { label: "Cash", value: "cash" },
                { label: "Credit", value: "credit" },
                { label: "UPI", value: "upi" },
              ]}
              sx={radioSx}
            />

            <CheckboxGroup
              name="allow_split_payment"
              label=""
              options={[
                { label: "Allow split payment (Cash + UPI)", value: "split_payment" },
              ]}
              sx={checkboxSx}
            />

          </SettingSection>

          <SettingSection title="Print Options">
            <CheckboxGroup
              name="product_linking"
              label=""
              options={[
                { label: "Show logo on invoice", value: "show_logo" },
                { label: "Show GST break-up", value: "show_gst_breakup" },
                { label: "Show HSN code", value: "show_hsn_code" },
                { label: "Print duplicate copy", value: "print_duplicate_copy" },
              ]}
              sx={checkboxSx}
            />
          </SettingSection>

          <SettingSection title="Date Control">
            <CheckboxGroup
              name="date_control"
              label=""
              options={[
                { label: "Allow back dated invoices", value: "allow_back_dated" },
              ]}
              sx={checkboxSx}
            />
          </SettingSection>

          <SettingSection title="Cancel & Return Rules">
            <CheckboxGroup
              name="credit_control"
              label=""
              options={[
                { label: "Allow invoice cancellation", value: "allow_cancellation" },
                { label: "Allow sales return", value: "allow_sales_return" },
              ]}
              sx={checkboxSx}
            />
          </SettingSection>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 4 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => reset()}
              sx={{
                color: "#238878",
                border: "2px solid #238878",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#238878",
                  color: "#fff",
                  border: "2px solid #238878",
                },
              }}
            >
              Reset
            </Button>

            <Button
              type="submit"
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
            >
              Save
            </Button>
          </Box>

        </form>
      </FormProvider>
    </Box>
  );
};

export default InvoiceSettings;
