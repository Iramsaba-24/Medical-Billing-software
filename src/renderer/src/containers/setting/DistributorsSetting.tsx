import { useForm, FormProvider } from 'react-hook-form';
import { Typography, Box, Button } from '@mui/material';
import PaymentTerms from './PaymentTerm';
import PurchaseGSTConfiguration from './PurchaseGstConfiguration';
import { useEffect } from "react";
type DistributorFormValues = {
  supplier_details: string[];
  product_linking: string[];
  credit_control: string[];
  bank_details: string[];
  report_settings: string[];
  export_format: string;
  payment_method?: string;
  gst_settings?: string;
  creditDays: string,
}
const DistributorSettings = () => {
  const methods = useForm<DistributorFormValues>({
    defaultValues: {
      supplier_details: [],
      product_linking: [],
      credit_control: [],
      bank_details: [],
      report_settings: [],
      export_format: '',
      payment_method: '',
      creditDays: '30',
      gst_settings: 'Regular GST',
    }
  });
  const { handleSubmit, reset } = methods;

  const onSubmit = (data: DistributorFormValues) => {
    console.log(" Data:", data);
  localStorage.setItem(
    "distributorSettings",
    JSON.stringify(data)
  );

  alert("Data saved successfully!");
  };
  useEffect(() => {

  const storedSettings = localStorage.getItem("distributorSettings");

  if (storedSettings) {
    reset(JSON.parse(storedSettings));
  }

}, [reset]);
  return (
    <Box sx={{ backgroundColor: '#f9f9f9' }}>
      <Typography           
      sx={{
            fontSize: { xs: 20, sm: 22, md: 24 },  
            fontWeight: 700,
            color: '#111827',
            mt: {xs:1 , md:0.5},
            mb: 1,
          }}>
        Distributors Settings
      </Typography>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>

          <PaymentTerms />
          <PurchaseGSTConfiguration />
          {/*  Buttons- save reset*/}
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

export default DistributorSettings;