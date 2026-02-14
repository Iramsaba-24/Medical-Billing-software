import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { Paper, Typography, Box, Button } from "@mui/material";
import RadioField from "@/components/controlled/RadioField";
import CheckboxGroup from "@/components/controlled/CheckboxGroup";

// Reusable UI component for each settings block.

const SettingSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Paper sx={{ p: 2, borderRadius: "5px", boxShadow: 2, mb: 2 }}>
    <Typography sx={{ fontWeight: 600, mb: 1, fontSize: "0.95rem" }}>
      {title}
    </Typography>
    {children}
  </Paper>
);

const InvoiceSettings = () => {
  // Initialize form with default values
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

  // Extract functions register is essential for inputs to reset correctly.
  const { handleSubmit, reset, register } = methods;

  // Styling for form components
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
    <Box sx={{ backgroundColor: "#f9f9f9", p: 2 }}>
      <Typography variant="h6" mb={3} fontWeight={600}>
        Invoice Settings
      </Typography>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/*  Invoice Types Section */}
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

          {/*  Numbering Series Section (with register fixed) */}
          <SettingSection title="Invoice Numbering Series">
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography fontSize="14px">Retail Series</Typography>
                <input
                  {...register("retail_series")}
                  style={{ width: "120px", padding: "4px" }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography fontSize="14px">Wholesales Series</Typography>
                <input
                  {...register("wholesale_series")}
                  style={{ width: "120px", padding: "4px" }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography fontSize="14px">GST Series</Typography>
                <input
                  {...register("gst_series")}
                  style={{ width: "120px", padding: "4px" }}
                />
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

          {/*  Tax Mode Section */}
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
            <Box sx={{ mt: 1 }}>
              <CheckboxGroup
                name="tax_override"
                label=""
                options={[
                  {
                    label: "Allow override per invoice",
                    value: "override_per_invoice",
                  },
                ]}
              />
            </Box>
          </SettingSection>

          {/*  Discount Rules Section */}
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
            <Box sx={{ mt: 1 }}>
              <CheckboxGroup
                name="discount_options"
                label=""
                options={[
                  {
                    label: "Allow both (with priority rules)",
                    value: "allow_both",
                  },
                ]}
              />
            </Box>
          </SettingSection>

          {/*  Payment Mode Section */}
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
            <Box sx={{ mt: 1 }}>
              <CheckboxGroup
                name="allow_split_payment"
                label=""
                options={[
                  {
                    label: "Allow split payment (Cash + UPI)",
                    value: "split_payment",
                  },
                ]}
              />
            </Box>
          </SettingSection>

          {/*  Print Options Section */}
          <SettingSection title="Print Options">
            <CheckboxGroup
              name="product_linking"
              label=""
              options={[
                { label: "Show logo on invoice", value: "show_logo" },
                { label: "Show GST break-up", value: "show_gst_breakup" },
                { label: "Show HSN code", value: "show_hsn_code" },
                {
                  label: "Print duplicate copy",
                  value: "print_duplicate_copy",
                },
              ]}
              sx={checkboxSx}
            />
          </SettingSection>

          {/*  Date Control Section */}
          <SettingSection title="Date Control">
            <CheckboxGroup
              name="date_control"
              label=""
              options={[
                {
                  label: "Allow back dated invoices",
                  value: "allow_back_dated",
                },
              ]}
              sx={checkboxSx}
            />
          </SettingSection>

          {/*  Cancel & Return Rules Section */}
          <SettingSection title="Cancel & Return Rules">
            <CheckboxGroup
              name="credit_control"
              label=""
              options={[
                {
                  label: "Allow invoice cancellation",
                  value: "allow_cancellation",
                },
                { label: "Allow sales return", value: "allow_sales_return" },
              ]}
              sx={checkboxSx}
            />
          </SettingSection>

          {/* Action Buttons */}
         <Box sx={{ display: 'flex', justifyContent: 'center', mt:4 , gap: 4 }}>
            <Button
              variant="outlined"
              onClick={() => reset()}
              sx={{ px: 4, mr: 2, color: "#2d8b7a", borderColor: "#2d8b7a" }}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#238878",
                color: "#fff",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "#238878",
                  border: "2px solid #238878",
                },
              }}
            >
              Save Settings
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
};

export default InvoiceSettings;
