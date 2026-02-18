import { Paper, Typography, Box } from '@mui/material';
import CheckboxGroup from '@/components/controlled/CheckboxGroup';
import DropdownField from '@/components/controlled/DropdownField';
 
const PurchaseGSTConfiguration = () => {
  const options = [   //checkbox options
    { label: 'Enable Reverse Charge (RCM)', value: 'rcm' },
    { label: 'Validate supplier GSTIN', value: 'validate_gstin' },
  ];
 
  const gst_settings = [
    { label: "Regular GST", value: "Regular GST" },
    { label: "CGST", value: "CGST" },
    { label: " IGST", value: "IGST" },
    { label: "UTGST", value: "UTGST" }
  ]
 
  return (
    <Paper sx={{ p: 2, borderRadius: "10px", boxShadow: 4, mb: 1 }}>
    <Typography
  sx={{
    fontWeight: 700,
    fontSize: { xs: "16px", sm: "18px" },
    color: "#212529",
    mb: 1,
  }}
>
        Purchase GST Configuration
      </Typography>
      {/* dropdown -default purchase GST mode */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, }}>
        <Typography sx={{ fontWeight: 500 }}>Default Purchase GST Mode</Typography>
 
 
        <DropdownField
          name="gst_settings"
          options={gst_settings}
          sx={{ width: 150, minWidth: 150, mt:{xs:3,md:1} }}
          isStatic={true}
        />
      </Box>
 
      <CheckboxGroup
        name="gst_settings"
        label=""
        options={options}
      />
    </Paper>
  );
};
 
export default PurchaseGSTConfiguration;