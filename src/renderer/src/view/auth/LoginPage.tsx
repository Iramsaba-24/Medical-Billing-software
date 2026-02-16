import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TextInputField from '@/components/controlled/TextInputField';
import BgImage from '@/assets/bgloginpage.svg';
import LogoImage from '@/assets/logoimg.svg';
import AppToast from '@/containers/Distributors/AppToast';
import { URL_PATH } from '@/constants/UrlPath';


type LoginFormInputs = {
  username: string;
  licenseKey: string;
};
const LoginPage = () => {
  const methods = useForm<LoginFormInputs>({
    defaultValues: {
      username: '',
      licenseKey: '',
    },
  });
  const navigate = useNavigate();
  const [toastOpen, setToastOpen] = useState(false);

  const onSubmit = (data: LoginFormInputs) => {
    console.log(data);
    setToastOpen(true);
     navigate(URL_PATH.Landing, {
      state: {
         username: data.username,
         licenseKey: data.licenseKey,
       }
    });
  };
      // textinput field styling(text box)
  const inputStyle = {
    // input box -container height, border radius, background color
    '& .MuiOutlinedInput-root': {
      height: { xs: 44, sm: 48 },
      borderRadius: '6px',
      backgroundColor: '#fff',
      // border color on focus
      '& fieldset': {
        borderColor: '#1b7f6b !important',
        borderWidth: '3px',
      },
    },
    // label text styling
    '& .MuiOutlinedInput-input': {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: { xs: '13px', sm: '14px' },
    },
  };
        // background styling
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${BgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        px: { xs: 2, sm: 0 },
      }}
    >
      <FormProvider {...methods}>
        <Box
          component="form"
          noValidate
          onSubmit={methods.handleSubmit(onSubmit)}
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: 450 },
            display: 'flex',
            flexDirection: 'column',  //inputboxes up-down
            alignItems: 'center',
            backgroundColor: 'transparent', //background img showing
            p: { xs: 3, sm: 4 },// form padding (textbox and button)
            borderRadius: 2,
          }}>
             {/* logo img */}
          <Box mb={1}>
            <img src={LogoImage} alt="Medi Logo" style={{ width: '160px', maxWidth: '100%' }}/></Box>
          
           {/* heading  */}
          <Typography
            variant="h4"
            mb={{ xs: 3, sm: 4 }}
            sx={{
              color: '#333',
              fontWeight: 400,
              fontFamily: '"Poppins", sans-serif',
              fontSize: { xs: '1.6rem', sm: '2rem' },
            }}>         
            Login
          </Typography>

                {/*Textinput field-username, licenseKey  */}
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 }, }}>          
            <TextInputField
              name="username"
              label="User Name / Email ID"
              sx={inputStyle}
              rules={{
                required: 'Username or Email is required',
                validate: (value: string) => {
       
                  const emailRegex = /^[a-z0-9]+@[a-z0-9]+\.[a-z]{2,}$/i;
                  const usernameRegex = /^[a-zA-Z0-9_.]{8,20}$/;
                  if (emailRegex.test(value) || usernameRegex.test(value)) {
                    return true;
                  }
                  return 'Enter a valid username or email';
                },
              }} />           
            <TextInputField
              name="licenseKey"
              label="License Key"
              sx={inputStyle}
              rules={{
                required: 'License Key is required',
                pattern: {
                  value: /^[A-Z0-9]{11}$/,
                  message: 'Invalid License Key',
                },
              }} />
          </Box>
              {/* login button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: { xs: 4, sm: 5 },
              fontWeight: '1000',
              fontSize: { xs: '1rem', sm: '1.05rem' },
              backgroundColor: '#1b7f6b',
              textTransform: 'none',
              border: '2px solid #1b7f6b',
              boxShadow:
                '0 0 0 1.5px #ffffff, 0 6px 14px rgba(0,0,0,0.25)',
              transition: 'all 0.25s ease',
              '&:hover': {
                backgroundColor: '#fff',
                color: '#1b7f6b',
              },
            }}>         
            Login
          </Button>
        </Box>
      </FormProvider>
      {/* toast msg */}
      <AppToast
        open={toastOpen}
        message="Login successful"
        severity="success"
        onClose={() => setToastOpen(false)}
      />
    </Box>
  );
};
export default LoginPage;
