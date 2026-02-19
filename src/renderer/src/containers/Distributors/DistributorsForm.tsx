 import { useForm, FormProvider } from 'react-hook-form';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TextInputField from '@/components/controlled/TextInputField';
import EmailField from '@/components/controlled/EmailField';
import MobileField from '@/components/controlled/MobileField';
import DateTimeField from '@/components/controlled/DateTimeField';
import { useState } from "react";
import AppToast from '@/containers/distributors/AppToast';
import { URL_PATH } from '@/constants/UrlPath';
import BankDetailsForm from '@/containers/Distributors/BankDetailForm';

// Define the structure of the data 
type DistributorFormInput = {
  companyName: string;
  ownerName?: string;
  mobile: string;
  email: string;
  date: string;
  registrationNumber: string;
  website: string;
  gstIn: string;
  address: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branch: string;
  ifsc: string;
  upiId: string;
}


const DistributorsForm = () => {
  // Initialize the form with default empty values
  const methods = useForm<DistributorFormInput>({
    defaultValues: {
      companyName: '',
      ownerName: '',
      mobile: '',
      email: '',
      date: '',
      registrationNumber: '',
      website: '',
      gstIn: '',
      address: '',
      bankName: '',
      accountNumber: '',
      accountHolderName: '',
      branch: '',
      ifsc: '',
      upiId: ''
    },
  });

  const navigate = useNavigate(); 
  const [toastOpen, setToastOpen] = useState(false); 

  // Function  runs when the form  submitted successfully
  const onSubmit = (data: DistributorFormInput) => {

    
    const stored = localStorage.getItem("distributors");
    const currentData = stored ? JSON.parse(stored) : [];
    
    //  Prepare new entry with a unique ID and default status
    const newEntry = { 
      ...data, 
      id: Date.now().toString(), 
      status: "Active" 
    };
    
    //  Add new entry to the list and save it back to storage
    const updatedData = [...currentData, newEntry];
    localStorage.setItem("distributors", JSON.stringify(updatedData));
    
    
    setToastOpen(true);
    setTimeout(() => {
      navigate(URL_PATH.DistributorsPage);
    }, 1500);
  };

  return (
    <Box p={2} sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
     
      <FormProvider {...methods}>
        <form noValidate onSubmit={methods.handleSubmit(onSubmit)}> 
          
          {/* Distributor Details */}
          <Paper
            sx={{
              maxWidth: 800,
              mx: 'auto',
              p: 6,
              backgroundColor: '#fff',
              borderRadius: '10px',
              boxShadow: 3,
              mb: 3
            }}
          >
            <Typography variant="h6" mb={3} fontWeight={600}>
              Add Distributor
            </Typography>
             
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 2 }}>
            <TextInputField name="companyName" label="Company Name" inputType="textarea" rows={1} required/>
              <TextInputField name="ownerName" label="Owner Name" inputType="alphabet" rows={1} />  
              <MobileField name="mobile" label="Phone" required />
              <EmailField name="email" label="Email" required />
              <DateTimeField name="date" label="Date" viewMode="date" />
              <TextInputField name="registrationNumber" label="Registration Number" inputType='alphanumeric' required maxLength={14} />
              <TextInputField 
               name="website"
               label="Website (Optional)"
               inputType='textarea'
               rows={1} 
               rules={{
              pattern: {
                value: /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6})(\/[\w.-]*)*\/?$/i,
                message: 'Invalid website URL',
              },
            }} /> 
              <TextInputField
                name="gstIn"
                label="GSTIN"
                placeholder=' e.g 27AAAAA0000A1ZS'
                maxLength={15}
                rows={1}
                rules={{
                  pattern: {
                    value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                    message: 'Enter valid GSTIN',
                  },
                }}
              /> 
            </Box>

            <Box sx={{ mt: 2 }}>
              <TextInputField   name="address" label="Address"  inputType="textarea"  rows={2} />
            </Box>
          </Paper>

          {/*  Bank Details */}
          <Paper
            sx={{
              maxWidth: 800,
              mx: 'auto',
              p: 4,
              backgroundColor: '#fff',
              borderRadius: '10px',
              boxShadow: 3,
            }}
          >
            <BankDetailsForm />
          </Paper>
              {/* button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 6, }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate(URL_PATH.DistributorsPage)} 
              sx={{
                color: "#238878",
                border: "2px solid #238878",
                textTransform: "none",
                "&:hover": { backgroundColor: "#238878", color: "#fff", border: "2px solid #238878" },
              }}>           
              Cancel
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

      <AppToast
        open={toastOpen}
        message="Data saved successfully"
        severity='success'
        onClose={() => setToastOpen(false)}
      />
    </Box>
  );
};

export default DistributorsForm;