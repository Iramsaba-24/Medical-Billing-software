 import { useForm, FormProvider } from 'react-hook-form';
import { Box, Button,   Paper, Typography, Stack } from '@mui/material';
import CheckboxGroup from '@/components/controlled/CheckboxGroup';
import TextInputField from '@/components/controlled/TextInputField';
 
//  Define Form Types for Type Safety
export interface InventoryFormValues {
  groupExpiry: string[];
  pricing: string[];
  lowStockThreshold: string;
  autoReorderQty: string;
  barcodeStorage: string[];
  returnsUpdate: string[];
  alertsVisibility: string[];
}
 
const InventorySettings = () => {
  const methods = useForm<InventoryFormValues>({
    defaultValues: {
      groupExpiry: [],
      pricing: [],
      lowStockThreshold: '',
      autoReorderQty: '',
      barcodeStorage: [],
      returnsUpdate: [],
      alertsVisibility: [],
    },
  });

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

 
  //  Save Function
  const { handleSubmit, reset } = methods;
  const onSubmit = (data: InventoryFormValues) => {
    console.log('Inventory Settings Saved ');
    console.log(data);
  };
 
 
  return (
     <Box sx={{  backgroundColor: '#f9f9f9' }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
      Inventory Settings
      </Typography>
 
      <FormProvider {...methods}>
         <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
           
            {/* Group & Expiry Control */}
             <Paper sx={paperStyle}>
              <Typography sx={headingStyle}>Group & Expiry Control</Typography>
              <CheckboxGroup
                name="groupExpiry"
                label=""
                options={[
                  { label: 'Group tracking (mandatory)', value: 'groupTracking' },
                  { label: 'Expiry date mandatory', value: 'expiryMandatory' },
                ]}
              />
            </Paper>
 
            {/* Pricing on Purchase */}
            <Paper sx={{ p: 2, borderRadius: "5px", boxShadow: 4, mb: 1 }}>
              <Typography variant="subtitle1" sx={headingStyle}>Pricing on Purchase</Typography>
              <CheckboxGroup
                name="pricing"
                label=""
                options={[{ label: 'Allow MRP edit on purchase', value: 'mrpEdit' }]}
              />
            </Paper>
  
              <Paper sx={{ p: 2, borderRadius: "5px", boxShadow: 4, mb: 1 }}>
                 <Typography sx={headingStyle}>Stock Limits</Typography>

            {/* Row 1 */}
               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                   <Typography fontSize="14px" >Low Stock Threshold</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                   <TextInputField 
                          name="lowStockThreshold" 
                          label="" 
                          inputType="numbers" 
                          sx={{ width: '80px', '& .MuiInputBase-root': { height: '25px' }   }} 
                     />
                   <Typography fontSize="14px" sx={{mb: 3}}>Units</Typography>
                 </Box>
               </Box>

            {/* Row 2 */}
             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <Typography fontSize="14px" sx={{mb: 3}}>Auto Reorder Quantity</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                 <TextInputField 
                        name="autoReorderQty" 
                        label="" 
                        inputType="numbers" 
                        sx={{  width: '80px',  '& .MuiInputBase-root': { height: '25px' }  }} 
                   />
               <Typography fontSize="14px" sx={{mb: 3}}>Units</Typography>
               </Box>
             </Box>
         </Paper>

            {/* Barcode & Storage */}
            <Paper sx={{ p: 2, borderRadius: "5px", boxShadow: 4, mb: 1 }}>
              <Typography variant="subtitle1" sx={headingStyle}>Barcode & Storage</Typography>
              <CheckboxGroup
                name="barcodeStorage"
                label=""
                options={[
                  { label: 'Enable barcode scanning', value: 'barcode' },
                  { label: 'Rack / Shelf management', value: 'rackShelf' },
                ]}
              />
            </Paper>
 
            {/*  Returns & Auto Update */}
            <Paper sx={{ p: 2, borderRadius: "5px", boxShadow: 4, mb: 1 }}>
              <Typography variant="subtitle1" sx={headingStyle}>Returns & Auto Update</Typography>
              <CheckboxGroup
                name="returnsUpdate"
                label=""
                options={[{ label: 'Auto-update stock on returns (Sales & Purchase)', value: 'autoUpdate' }]}
              />
            </Paper>
 
            {/*  Alerts & Visibility */}
            <Paper sx={{ p: 2, borderRadius: "5px", boxShadow: 4, mb: 1 }}>
              <Typography variant="subtitle1" sx={headingStyle}>Alerts & Visibility</Typography>
              <CheckboxGroup
                name="alertsVisibility"
                label=""
                options={[
                  { label: 'Show low-stock alerts on dashboard', value: 'alert1' },
                  { label: 'Show low-stock alerts on dashboard', value: 'alert2' },
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
        
 
          </Stack>
        </form>
      </FormProvider>
    </Box>
  );
};
 
export default InventorySettings;

 