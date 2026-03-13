import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { Paper, Typography, Box, Button } from "@mui/material";
import RadioField from "@/components/controlled/RadioField";
import CheckboxGroup from "@/components/controlled/CheckboxGroup";
import { useEffect } from "react";

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

  

useEffect(() => {
  const savedSettings = localStorage.getItem("invoiceSettings");
  if (savedSettings) {
    methods.reset(JSON.parse(savedSettings));
  }
}, [methods]);

  const { handleSubmit, reset } = methods;

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
          <Box mb={2}> 
          <Typography
          sx={{
            fontSize: { xs: 20, sm: 22, md: 24 },  
            fontWeight: 700,
            color: '#111827',
            mt: {xs:1 , md:0.5},
          }}
        >
          Invoice Settings
        </Typography>
          </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>

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
