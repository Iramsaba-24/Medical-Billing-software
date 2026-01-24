 import { useForm, FormProvider } from 'react-hook-form';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TextInputField from '@/components/controlled/TextInputField';
import EmailField from '@/components/controlled/EmailField';
import MobileField from '@/components/controlled/MobileField';
import DateTimeField from '@/components/controlled/DateTimeField';
import { useState } from "react";
import AppToast from "@/containers/Distributors/AppToast";

const DistributorsForm = () => {
  // Initialize React Hook Form methods with default values
  const methods = useForm({
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

  return (
    <Box p={{ xs: 1, sm: 2 }}>
      <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }} gap={3} mb={4}></Box>
      
      {/* FormProvider allows nested components to access react-hook-form methods */}
      <FormProvider {...methods}>
        <Box
          component="form"
          noValidate
          // Form submission handler
          onSubmit={methods.handleSubmit((data) => {
            console.log("Submitted Data:", data);
            setToastOpen(true);

            
            setTimeout(() => {
              navigate("/table", { state: { userData: [data] } });
            }, 2000);
          })}
          sx={{
            maxWidth: 900,
            mx: 'auto',
            pt: 2,
            px: 3,
            pb: 5,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            borderRadius: '10px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(6px)',
            boxShadow: `
              0px 4px 12px rgba(0, 0, 0, 0.08),
              0px 12px 24px rgba(0, 0, 0, 0.05)
            `,
            transition: 'all 0.3s ease',
          }}
        >
          {/* Form Header */}
          <Typography variant="h6" mb={3}>
            Add Distributor
          </Typography>

          <Box
            sx={{
              height: '1px',
              backgroundColor: 'rgba(0, 0, 0, 0.12)',
              mb: 3,
            }}
          />

          {/* Input field for Company Name with validation rules */}
          <TextInputField
            name="companyName"
            label="Company Name"
            required
            inputType="all"
            rules={{
              required: 'Company Name is required',
            }}
          />

          {/* Responsive Grid for Phone and Email fields */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 2 }}>
            <MobileField name="mobile" label="Phone" required />
            <EmailField name="email" label="Email" required />
          </Box>

          {/* Date Picker Section */}
          <Box sx={{ mt: 2, width: '50%' }}>
            <DateTimeField name="date" label="Date" viewMode="date" />
          </Box>

          {/* Multiline Input for Address */}
          <Box sx={{ mt: 2 }}>
            <TextInputField
              name="address"
              label="Address"
              inputType="all"
              multiline
              rows={4}
              rules={{
                required: 'Address is required',
              }}
              sx={{
                '& .MuiInputBase-root': {
                  height: '100px',
                  alignItems: 'flex-start',
                },
              }}
            />
          </Box>

          {/* Cancel and Save */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 4,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}  
              sx={{
                borderColor: '#1b7f6b',
                color: '#1b7f6b',
                '&:hover': {
                  backgroundColor: '#1b7f6b',
                  color: '#fff',
                  borderColor: '#1b7f6b',
                },
              }}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#1b7f6b',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#fff',
                  color: '#1b7f6b',
                  border: '1px solid #1b7f6b',
                },
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </FormProvider>

      {/* Global Toast component to show success notification */}
      <AppToast
        open={toastOpen}
        message="Data saved successfully"
        onClose={() => setToastOpen(false)}
      />
    </Box>
  );
};

export default DistributorsForm;