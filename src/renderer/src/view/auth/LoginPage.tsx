import { useForm, FormProvider } from 'react-hook-form';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TextInputField from '@/components/controlled/TextInputField'; // Aapke existing component ka use
import { useState } from "react";
import AppToast from '@/containers/distributors/AppToast';
import BgImage from '@/assets/bg_login.png'; 
import LogoImage from '@/assets/medi_logo.png';

const LoginPage = () => {
  const methods = useForm({
    defaultValues: {
      username: '',
      licenseKey: '',
    },
  });

  const navigate = useNavigate();
  const [toastOpen, setToastOpen] = useState(false);

  const onSubmit = (data: any) => {
    console.log("Login Data:", data);
    setToastOpen(true);
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${BgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden'
      }}
    >
      <FormProvider {...methods}>
        <Box
          component="form"
          noValidate
          onSubmit={methods.handleSubmit(onSubmit)}
          sx={{
            width: '100%',
            maxWidth: 400,
            p: 4,
            textAlign: 'center',
            /* Glassmorphism Effect jo aapne bataya */
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0px 15px 35px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Logo Image */}
          <Box sx={{ mb: 3 }}>
            <img src={LogoImage} alt="Medi Logo" style={{ height: '60px' }} />
          </Box>

          <Typography variant="h5" mb={4} fontWeight="500" color="#333">
            Login
          </Typography>

          {/* User Name Field */}
          <Box sx={{ mb: 2 }}>
            <TextInputField
              name="username"
              label="User Name/Email ID"
              required
              inputType="all"
              rules={{ required: 'Username is required' }}
            />
          </Box>

          {/* License Key Field */}
          <Box sx={{ mb: 4 }}>
            <TextInputField
              name="licenseKey"
              label="License Key"
              required
              inputType="all"
              rules={{ required: 'License Key is required' }}
            />
          </Box>

          {/* Login Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#1b7f6b',
              color: '#fff',
              py: 1.5,
              fontSize: '1rem',
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#fff',
                color: '#1b7f6b',
                border: '1px solid #1b7f6b',
              },
            }}
          >
            Login
          </Button>
        </Box>
      </FormProvider>

      <AppToast
        open={toastOpen}
        message="Login Successful!"
        severity="success"
        onClose={() => setToastOpen(false)}
      />
    </Box>
  );
};

export default LoginPage;