import { useForm, FormProvider } from 'react-hook-form';
import { Paper, Typography, Box, Button } from '@mui/material';
import CheckboxGroup from '@/components/controlled/CheckboxGroup';

type ReportFormValues = {
  export_format: string[];
  price_visibility: string[];
}

const ReportSettings = () => {
  const methods = useForm<ReportFormValues>({
    defaultValues: {
      export_format: [],
      price_visibility: [],
    }
  });
  
  const headingStyle = {
  fontWeight: 700,
  fontSize: "18px",
  color: "#212529",
  mb: 1,
};


  const { handleSubmit, reset } = methods;
  const onSubmit = (data: ReportFormValues) => {
    console.log(" Data:", data);
  }

  return (
    <Box sx={{  backgroundColor: '#f9f9f9' }}>
      <Typography variant="h6" mb={3} fontWeight={600}>
        Reports Settings
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
        {/*  Exports format */}
        <Paper sx={{p: { xs: 2, md: 4 }, borderRadius: "5px", boxShadow: 3, mb: 1 }}>
          <Typography sx={headingStyle}>Exports Format</Typography>
          <CheckboxGroup
            name="export_format"
            label=""
            options={[
              { label: 'PDF', value: 'pdf' },
              { label: 'Excel', value: 'excel' },
              { label: 'Include Company logo in PDF', value: 'include_company_logo_in_pdf' },
            ]}
          />
        </Paper>
        {/* price Visibility Control */}
        <Paper sx={{ p: 2, borderRadius: "5px", boxShadow: 3, mb: 1 }}>
          <Typography sx={headingStyle}>Price Visibility Control</Typography>
          <CheckboxGroup
            name="price_visibility"
            label=""
            options={[
              { label: 'Hide Cost Price from staff', value: 'hide_cost_price' },
              { label: 'Sale Reports', value: 'sale_reports' },
              { label: 'Stock Reports', value: 'stock_reports' },
            ]}
          />
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
export default ReportSettings;
