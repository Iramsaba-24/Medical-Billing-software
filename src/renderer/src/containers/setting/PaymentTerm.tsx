import { Paper, Typography, Box } from '@mui/material';
import RadioField from '@/components/controlled/RadioField';

const PaymentTerms = () => {
  const radioOptions = [
    { label: 'Cash', value: 'cash' },
    { label: 'Credit', value: 'credit' },
    { label: 'UPI', value: 'upi' },
  ];

  return (  
    // Payment Terms card style
<Paper sx={{ p: 2, borderRadius: "10px", boxShadow: 4, mb: 1 }}>   
      <Typography  fontWeight={600} mb={1}>
        Payment Terms
      </Typography>
        
      <RadioField
        name="payment_method"
        label=""
        options={radioOptions}
        sx={{
         width: '100%',
       '& .MuiFormControlLabel-root': {   //radio fields label styling
        width: '100%',
         m: 0,
        display: 'flex',
        justifyContent: 'space-between',  //text-left side , radio-right side
        flexDirection: 'row-reverse',  //radio on right side
        mb: 0.5
      }

        }}
      />
      {/* dropdown - credit days */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
        <Typography sx={{ fontSize: '16px' }}>Credit Days</Typography>
        <select 
          style={{  minWidth: '100px', padding: '4px 5px',borderRadius: '4px',
            border: '1px solid #767676',fontSize: '13px',color: '#767676'}}>       
          <option value="">Select</option>
          <option value="30">30 Days</option>
            <option value="60">60 Days</option>
            <option value="90">90 Days</option>
        </select>
      </Box>
    </Paper>
  );
};

export default PaymentTerms;