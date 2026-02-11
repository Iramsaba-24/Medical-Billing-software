import { Box, Typography, Divider } from '@mui/material';
import TextInputField from '@/components/controlled/TextInputField';

const BankDetailsForm = () => {
  return (
    <Box>
      <Typography fontWeight={600} mb={1}>
        Bank Details
      </Typography>
       {/* for line */}
      <Divider sx={{ mb: 3 }} />

           {/* input fields */}
      <Box
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, }} >
      
      <TextInputField  name="bankName"  label="Bank Name"  required  />       
       <TextInputField
        name="accountNumber"
        label="Account Number" 
        required
        rules={{
        maxLength: {
        value: 11,
        message: "Maximum 11 digits allowed"
       },
       pattern: {
        value: /^[0-9]+$/,
        message: "Only numbers are allowed"
       }
      }}
      />    
        <TextInputField name="accountHolderName"  label="A/C Holder's Name"  required  />
        <TextInputField name="branch" label="Branch"  required />
        
        <TextInputField
          name="ifsc" 
          label="IFSC Code" 
          required
          rules={{
          pattern: {
          value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
          message: 'Invalid IFSC Code',
            },
          }} 
        />    
        <TextInputField
         name="upiId"
         label="UPI ID"
         inputType="all"
         rows={1}
          required
         rules={{
        pattern: {
          value: /^[a-zA-Z0-9.\-_]+@[a-zA-Z0-9]+$/,
          message: 'Invalid UPI ID',
            },         
  }}/>
      </Box>
    </Box>  
  );
};

export default BankDetailsForm;