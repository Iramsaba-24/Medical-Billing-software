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
      
      <TextInputField  name="bankName"  label="Bank Name" inputType="alphabet"  required  />       
       <TextInputField
        name="accountNumber"
        label="Account Number" 
        inputType="numbers"
        required
        maxLength={11}
      />    
        <TextInputField name="accountHolderName"  label="A/C Holder's Name" inputType='alphabet'  required  />
        <TextInputField name="branch" label="Branch" inputType='alphabet'  required />
        
        <TextInputField
          name="ifsc" 
          label="IFSC Code" 
          required
          maxLength={11}
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
         inputType="alphanumeric"
         placeholder='abc@oksbi'
         rows={1}
          required
         rules={{
        pattern: {
          value: /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/,
          message: 'Invalid UPI ID',
            },         
  }}/>
      </Box>
    </Box>  
  );
};

export default BankDetailsForm;