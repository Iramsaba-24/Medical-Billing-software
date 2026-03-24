import { useForm, FormProvider } from 'react-hook-form';
import { Paper, Typography, Box, Button } from '@mui/material';
import CheckboxGroup from '@/components/controlled/CheckboxGroup';
import { showToast } from '@/components/uncontrolled/ToastMessage';
import { useEffect } from "react";
type ReportFormValues = {
  card_visibility_control: string[];
  other_visibility_control: string[];
};

const DEFAULT_VALUES: ReportFormValues = {
  card_visibility_control: [
    "Total Sales Report",
    "Total Purchase",
    "Profit"
  ],
  other_visibility_control: [
    "Sales Report",
    "Invoice Report Table",
    "Inventory Stock Report",
    "Distributor List",
    "Customer List"
  ],
};


const ReportSettings = () => {
  const methods = useForm<ReportFormValues>({
  defaultValues: DEFAULT_VALUES
  });
  
  const headingStyle = {
  fontWeight: 700,
  fontSize: "18px",
  color: "#212529",
  mb: 1,
};
  const checkboxStyle = {
  "& .MuiCheckbox-root": {
    color: "default.main",
    "&.Mui-checked": {
      color: "#238878",
    },
  },
};

  const { handleSubmit, reset } = methods;
  const onSubmit = (data: ReportFormValues) => {
    localStorage.setItem("report_settings", JSON.stringify(data));
    showToast("success", "Settings updated successfully");
  }
  useEffect(() => {
  const savedSettings = localStorage.getItem("report_settings");

  if (savedSettings) {
    const parsed = JSON.parse(savedSettings);
    reset(parsed);
  }
}, [reset]);

  return (
    
    <Box sx={{  backgroundColor: '#f9f9f9' }}>
          <Box mb={2}> 
          <Typography
          sx={{
            fontSize: { xs: 20, sm: 22, md: 24 },  
            fontWeight: 700,
            color: '#111827',
            mt: {xs:1 , md:0.5},
          }}
        >
          Report Settings
        </Typography>
          </Box>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* card visibility control */}
        <Paper sx={{p: { xs: 2, md: 4 }, borderRadius: "5px", boxShadow: 3, mb: 1 }}>
          <Typography sx={headingStyle}>Card Visibility Control</Typography>
          <CheckboxGroup
            sx={checkboxStyle}
            name="card_visibility_control"
            label=""
            options={[
              { label: 'Total Sales Report', value: 'Total Sales Report' },
              { label: 'Total Purchase', value: 'Total Purchase' },
              { label: 'Profit', value: 'Profit' },
            ]}
          />
        </Paper>
        {/* Other Visibility Control */}
        <Paper sx={{p: { xs: 2, md: 4 }, borderRadius: "5px", boxShadow: 3, mb: 1 }}>
          <Typography sx={headingStyle}>Other Visibility Control</Typography>
          <CheckboxGroup
            sx={checkboxStyle}
            name="other_visibility_control"
            label=""
            options={[
              { label: 'Sales Report', value: 'Sales Report' },
              { label: 'Invoice Report Table', value: 'Invoice Report Table' },
              { label: 'Inventory Stock Report', value: 'Inventory Stock Report' },
              {label:"Distributor List", value:"Distributor List"},
              {label:"Customer List", value:"Customer List"},
            ]}
          />
        </Paper>
        {/*  Buttons- save reset*/}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 4 }}>
<Button
  variant="outlined"
  onClick={() => {
    reset(DEFAULT_VALUES);
    localStorage.setItem("report_settings", JSON.stringify(DEFAULT_VALUES));
    showToast("success", "Settings reset to default");
  }}
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
                "&:hover": { backgroundColor: "#fff", color: "#238878", border: "2px solid #238878" },
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
