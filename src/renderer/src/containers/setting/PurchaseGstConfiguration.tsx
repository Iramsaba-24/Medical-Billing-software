import { Paper, Typography, Box } from '@mui/material';
import CheckboxGroup from '@/components/controlled/CheckboxGroup';

const PurchaseGSTConfiguration = () => {
  const options = [   //checkbox options
    { label: 'Enable Reverse Charge (RCM)', value: 'rcm' },
    { label: 'Validate supplier GSTIN', value: 'validate_gstin' },
  ];

  return (
    <Paper sx={{ p: 2, borderRadius: "10px", boxShadow: 4,  mb: 1 }}>
      <Typography  fontWeight={600} mb={2}>
        Purchase GST Configuration
      </Typography>
           {/* dropdown -default purchase GST mode */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ fontWeight: 500 }}>Default Purchase GST Mode</Typography>
          <select 
          style={{ 
            minWidth: '100px', 
            padding: '4px 5px', 
            borderRadius: '4px', 
            border: '1px solid #767676',
            fontSize: '13px',
            color: '#767676'
          }}
        >
          <option value="">Regular GST</option>
          <option value="CGST">CGST</option>
            <option value="IGST">IGST</option>
            <option value="UTGST">UTGST</option>
        </select>
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