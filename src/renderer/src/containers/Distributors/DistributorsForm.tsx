import { useForm, FormProvider } from 'react-hook-form';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TextInputField from '@/components/controlled/TextInputField';
import EmailField from '@/components/controlled/EmailField';
import MobileField from '@/components/controlled/MobileField';
import DateTimeField from '@/components/controlled/DateTimeField';
import { useState } from "react";
import AppToast from "@/containers/Distributors/AppToast";
import { URL_PATH } from '@/constants/UrlPath';

interface DistributorFormInput {
  companyName: string;
  mobile: string;
  email: string;
  date: string;
  address: string;
}

const DistributorsForm = () => {
  const methods = useForm<DistributorFormInput>({
    defaultValues: {
      companyName: '',
      mobile: '',
      email: '',
      date: '',
      address: '',
    },
  });

  const navigate = useNavigate();
  const [toastOpen, setToastOpen] = useState(false);

  const onSubmit = (data: DistributorFormInput) => {
    const stored = localStorage.getItem("distributors");
    const currentData = stored ? JSON.parse(stored) : [];
    
    const newEntry = { 
      ...data, 
      status: "Active" 
    };
    
    const updatedData = [...currentData, newEntry];
    localStorage.setItem("distributors", JSON.stringify(updatedData));
    
    setToastOpen(true);

    setTimeout(() => {
      navigate(URL_PATH.DistributorsPage);
    }, 1500);
  };

  return (
    <Box p={3}>
      <FormProvider {...methods}>
        <Box
          component="form"
          noValidate
          onSubmit={methods.handleSubmit(onSubmit)}
          sx={{
            maxWidth: 800,
            mx: 'auto',
            p: 4,
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" mb={3} fontWeight={600}>
            Add Distributor
          </Typography>

          <TextInputField
            name="companyName"
            label="Company Name"
            required
            rules={{ required: 'Required' }}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 2 }}>
            <MobileField name="mobile" label="Phone" required />
            <EmailField name="email" label="Email" required />
          </Box>

          <Box sx={{ mt: 2, width: { xs: '100%', sm: '50%' } }}>
            <DateTimeField name="date" label="Date" viewMode="date" />
          </Box>

          <Box sx={{ mt: 2 }}>
            <TextInputField
              name="address"
              label="Address"
              multiline
              rows={3}
              rules={{ required: 'Required' }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button 
                variant="outlined" 
                onClick={() => navigate(URL_PATH.DistributorsPage)}
                sx={{ textTransform: 'none' }}
            >
                Cancel
            </Button>
            <Button 
                type="submit" 
                variant="contained" 
                sx={{ backgroundColor: '#1b7f6b', textTransform: 'none' }}
            >
                Save
            </Button>
          </Box>
        </Box>
      </FormProvider>

      <AppToast
        open={toastOpen}
        message="Data saved successfully"
        onClose={() => setToastOpen(false)}
      />
    </Box>
  );
};

export default DistributorsForm;