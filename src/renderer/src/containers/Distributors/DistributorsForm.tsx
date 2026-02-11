import { useForm, FormProvider } from 'react-hook-form';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TextInputField from '@/components/controlled/TextInputField';
import EmailField from '@/components/controlled/EmailField';
import MobileField from '@/components/controlled/MobileField';
import DateTimeField from '@/components/controlled/DateTimeField';
import { useState } from "react";
import AppToast from "@/containers/distributors/AppToast";
import { URL_PATH } from '@/constants/UrlPath';
import BankDetailsForm from './BankDetailForm';

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

  const onSubmit = (data: DistributorFormInput) => {
    //  get data to  local storage
    const stored = localStorage.getItem("distributors");
    const currentData = stored ? JSON.parse(stored) : [];
      //new entry object
     const newEntry = { 
      ...data, 
      status: "Active" 
    };
      // update and save local storage  
      const updatedData = [...currentData, newEntry];
      localStorage.setItem("distributors", JSON.stringify(updatedData));
      
      setToastOpen(true);
    setTimeout(() => {
      navigate(URL_PATH.DistributorsPage);
    }, 1500);
  };

  return (
    <Box p={3} sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <FormProvider {...methods}>
        <form noValidate onSubmit={methods.handleSubmit(onSubmit)}> 
             {/* like card  form styling */}
          <Paper
            sx={{
              maxWidth: 800,
              mx: 'auto',
              p: 4,
              backgroundColor: '#fff',
              borderRadius: '10px',
              boxShadow: 3,
              mb: 3
            }}
          >
            {/* Heading */}
            <Typography variant="h6" mb={3} fontWeight={600}>
              Add Distributor
            </Typography>
              {/* Textinputfields */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 2 }}>
            <TextInputField name="companyName" label="Company Name" inputType="all" rows={1} required/>
              <TextInputField name="ownerName" label="Owner Name" inputType="all" rows={1} />  
              <MobileField name="mobile" label="Phone" required />
              <EmailField name="email" label="Email" required />
              <DateTimeField name="date" label="Date" viewMode="date" />
              <TextInputField name="registrationNumber" label="Registration Number" required />
              <TextInputField name="website" label="Website (Optional)" inputType='all' rows={1} required={false} /> 
              <TextInputField
                name="gstIn"
                label="GSTIN"
                rules={{
                  pattern: {
                    value: /^[0-9]{2}[A-Z0-9]{13}$/,
                    message: 'Enter valid GSTIN',
                  },
                }}
              /> 
            </Box>
            <Box sx={{ mt: 2 }}>
              <TextInputField   name="address" label="Address"  inputType="all"  rows={3} />
            </Box>
          </Paper>
            {/* bank form stling */}
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
              {/* button - save and cancle */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 6, mr:40}}>
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