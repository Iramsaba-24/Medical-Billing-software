import { Paper, Typography, Box } from '@mui/material';
import RadioField from '@/components/controlled/RadioField';
import DropdownField from '@/components/controlled/DropdownField';

const PaymentTerms = () => {
  const radioOptions = [
    { label: 'Cash', value: 'cash' },
    { label: 'Credit', value: 'credit' },
    { label: 'UPI', value: 'upi' },
  ];
  const headingStyle = {
    fontWeight: 700,
    fontSize: "18px",
    color: "#212529",
    mb: 1,
  };
  
  const creditDays = [
    { label: "30 Months", value: "30" },
    { label: "60 Months", value: "60" },
    { label: "90 Months", value: "90" }
  ]

  return (
    // Payment Terms card style
    <Paper sx={{ p: 2, borderRadius: "10px", boxShadow: 4, mb: 1 }}>
      <Typography sx={headingStyle}>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
        <Typography sx={{ fontSize: '16px' }}>Credit Days</Typography>

        <DropdownField
          name="creditDays"
          options={creditDays}
          sx={{ width: 150, minWidth: 150 }}
          isStatic={true}
        />
      </Box>
    </Paper>
  );
};

export default PaymentTerms;