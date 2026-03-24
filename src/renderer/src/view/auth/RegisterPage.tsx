import { useForm, FormProvider } from "react-hook-form";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TextInputField from "@/components/controlled/TextInputField";
import BgImage from "@/assets/bgloginpage.svg";
import LogoImage from "@/assets/logoimg.svg";
import { URL_PATH } from "@/constants/UrlPath";

type RegisterFormInputs = {
  fullName: string;
  email: string;
  mobile: string;
  company: string;
  city: string;
  state: string;
};

const RegisterPage = () => {
  const methods = useForm<RegisterFormInputs>({
    defaultValues: {
      fullName: "",
      email: "",
      mobile: "",
      company: "",
      city: "",
      state: "",
    },
    mode: "onChange",
  });

  const navigate = useNavigate();
  const { formState: { errors } } = methods;

  const inputStyle = (fieldName: keyof RegisterFormInputs) => ({
    "& .MuiOutlinedInput-root": {
      height: { xs: 44, sm: 48 },
      borderRadius: "6px",
      backgroundColor: "#fff",
      "& fieldset": {
        borderColor: errors[fieldName] ? "#d32f2f !important" : "#1b7f6b !important",
        borderWidth: "3px",
      },
      "&:hover fieldset": {
        borderColor: errors[fieldName] ? "#d32f2f !important" : "#1b7f6b !important",
      },
      "&.Mui-focused fieldset": {
        borderColor: errors[fieldName] ? "#d32f2f !important" : "#1b7f6b !important",
      },
    },
    "& .MuiOutlinedInput-input": {
      fontSize: { xs: "13px", sm: "14px" },
    },
  });

  const onSubmit = (data: RegisterFormInputs) => {
    console.log(data);
    navigate(URL_PATH.LOGIN);
  };

  return (
    <Box
      sx={{
        minHeight: "98vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${BgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        px: { xs: 2, sm: 0 },
      }}
    >
      <FormProvider {...methods}>
        <Box
          component="form"
          noValidate
          onSubmit={methods.handleSubmit(onSubmit)}
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: 450 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "transparent",
            p: { xs: 3, sm: 4 },
          }}
        >
          {/* Logo */}
          <Box mb={1}>
            <img src={LogoImage} alt="Medi Logo" style={{ width: "160px" }} />
          </Box>

          {/* Heading */}
          <Typography
            mb={{ xs: 3, sm: 4 }}
            sx={{
              color: "#333",
              fontWeight: 500,
              fontFamily: '"Poppins", sans-serif',
              fontSize: { xs: "1.6rem", sm: "2rem" },
            }}
          >
            Create Your Account
          </Typography>

          {/* Fields */}
          <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
            <TextInputField
              name="fullName"
              label="Full name"
              sx={inputStyle("fullName")}
              rules={{ required: "Full name is required" }}
            />

            <TextInputField
              name="email"
              label="Email Address"
              sx={inputStyle("email")}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter valid email",
                },
              }}
            />

            <TextInputField
              name="mobile"
              label="Mobile Number"
              sx={inputStyle("mobile")}
              rules={{
                required: "Mobile number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter valid 10 digit mobile number",
                },
              }}
            />

            <TextInputField
              name="company"
              label="Company / Clinic Name"
              sx={inputStyle("company")}
            />

            <TextInputField
              name="city"
              label="City"
              sx={inputStyle("city")}
            />

            <TextInputField
              name="state"
              label="State"
              sx={inputStyle("state")}
            />
          </Box>

          {/* Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: { xs: 2, sm: 4 },
              fontWeight: 700,
              fontSize: { xs: "1rem", sm: "1.05rem" },
              backgroundColor: "#1b7f6b",
              textTransform: "none",
              border: "2px solid #1b7f6b",
              boxShadow: "0 0 0 1.5px #ffffff, 0 6px 14px rgba(0,0,0,0.25)",
              "&:hover": {
                backgroundColor: "#fff",
                color: "#1b7f6b",
              },
            }}
          >
            Next Step
          </Button>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default RegisterPage;
