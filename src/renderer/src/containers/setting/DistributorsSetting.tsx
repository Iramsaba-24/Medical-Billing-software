import { useForm, FormProvider } from 'react-hook-form';
import { Paper, Typography, Box, Button } from '@mui/material';
import CheckboxGroup from '@/components/controlled/CheckboxGroup';
import RadioField from '@/components/controlled/RadioField';
import PaymentTerms from './PaymentTerm';
import PurchaseGSTConfiguration from './PurchaseGstConfiguration';

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

   const cardStyle = {
  p: { xs: 2, md: 4 },
  borderRadius: "5px",
  boxShadow: 3,
  mb: 1,
};

  const headingStyle = {
    fontWeight: 700,
    fontSize: "18px",
    color: "#212529",
    mb: 1,
  };
  const onSubmit = (data: DistributorFormValues) => {
    console.log(" Data:", data);
    alert("Data saved successfully!");
  };
  return (
    <Box sx={{ backgroundColor: '#f9f9f9' }}>
      <Typography variant="h6" mb={3} fontWeight={600}>
        Distributors Settings
      </Typography>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/*  Mandatory Supplier Details */}
          <Paper sx={cardStyle}>
            <Typography sx={headingStyle}>Mandatory Supplier Details</Typography>
            <CheckboxGroup
              name="supplier_details"
              label=""
              options={[
                { label: 'Distributor Name', value: 'name' },
                { label: 'GSTIN (Mandatory)', value: 'gstin' },
                { label: 'Mobile Number', value: 'mobile' },
                { label: 'Address', value: 'address' },
              ]}
            />
          </Paper>

          <PaymentTerms />
          <PurchaseGSTConfiguration />

          {/*  Product Linking */}
          <Paper sx={cardStyle}>
            <Typography sx={headingStyle}>Product Linking</Typography>
            <CheckboxGroup
              name="product_linking"
              label=""
              options={[{ label: 'Auto-link distributor to purchased products', value: 'auto_link' }]}
            />
          </Paper>

          {/*  Credit Control */}
          <Paper sx={cardStyle}>
            <Typography sx={headingStyle}>Credit Control</Typography>
            <CheckboxGroup
              name="credit_control"
              label=""
              options={[
                { label: 'Block purchase on overdue payment', value: 'block_purchase' },
                { label: 'Show warning before blocking', value: 'show_warning' },
              ]}
            />
          </Paper>

          {/*  Bank Details Storage */}
          <Paper sx={cardStyle}>
            <Typography sx={headingStyle}>Bank Details Storage</Typography>
            <CheckboxGroup
              name="bank_details"
              label=""
              options={[{ label: 'Distributor bank details', value: 'bank_details' }]}
            />
          </Paper>

          {/*  Reports Section */}
          <Paper sx={cardStyle}>
            <Typography sx={headingStyle}>Reports</Typography>
            <CheckboxGroup
              name="report_settings"
              label=""
              options={[{ label: 'Enable distributor-wise purchase reports', value: 'enable_reports' }]}
            />
            {/* report heading */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography sx={{ fontSize: 16, mb:{xs:3}} }>Export as</Typography>
              <RadioField
                name="export_format"
                label=""
                options={[
                  { label: 'PDF', value: 'pdf' },
                  { label: 'Excel', value: 'excel' },
                ]}
                row
                sx={{ '& .MuiFormGroup-root': { gap: 2 } }}
              />
            </Box>
          </Paper>

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