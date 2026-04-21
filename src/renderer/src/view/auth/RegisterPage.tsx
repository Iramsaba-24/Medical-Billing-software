import { ChangeEvent } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TextInputField from "@/components/controlled/TextInputField";
import EmailField from "@/components/controlled/EmailField";
import MobileField from "@/components/controlled/MobileField";
import BgImage from "@/assets/bgloginpage.svg";
import LogoImage from "@/assets/logoimg.svg";
import { URL_PATH } from "@/constants/UrlPath";
import { showToast } from "@/components/uncontrolled/ToastMessage";
 
type RegisterFormInputs = {
   fullName: string;
  
  email: string;
  mobileNumber: string;
  companyName: string;
  city: string;
  state: string;
};
 
const RegisterPage = () => {
  const methods = useForm<RegisterFormInputs>({
    defaultValues: {
      fullName: "",
      
      email: "",
      mobileNumber: "",
      companyName: "",
      city: "",
      state: "",
    },
    mode: "onChange",
  });
 
  const navigate = useNavigate();
 
  const {
    formState: { errors },
    setValue,
    handleSubmit,
    setError,
    clearErrors,
  } = methods;
 
  const inputStyle = (fieldName: keyof RegisterFormInputs) => ({
    "& .MuiOutlinedInput-root": {
      height: { xs: 42, sm: 46, md: 48 },
      borderRadius: "8px",
      backgroundColor: "#fff",
      "& fieldset": {
        borderColor: errors[fieldName]
          ? "#d32f2f !important"
          : "#1b7f6b !important",
        borderWidth: "2.5px",
      },
      "&:hover fieldset": {
        borderColor: errors[fieldName]
          ? "#d32f2f !important"
          : "#1b7f6b !important",
      },
      "&.Mui-focused fieldset": {
        borderColor: errors[fieldName]
          ? "#d32f2f !important"
          : "#1b7f6b !important",
      },
    },
    "& .MuiOutlinedInput-input": {
      fontSize: { xs: "13px", sm: "14px", md: "15px" },
      padding: { xs: "10px 12px", sm: "12px 14px" },
    },
  });
 
  const handleLettersOnlyChange =
    (field: "fullName" | "city" | "state") =>
    (e: ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.replace(/[^A-Za-z ]/g, "");
      value = value.slice(0, 20);
      setValue(field, value, { shouldValidate: true });
      if (value) clearErrors(field);
    };
 
  const validateRequiredFields = (data: RegisterFormInputs) => {
    let isValid = true;
 
    (Object.keys(data) as (keyof RegisterFormInputs)[]).forEach((field) => {
      if (!data[field]?.trim()) {
        setError(field, { type: "manual", message: "This field is required" });
        isValid = false;
      }
    });
 
    return isValid;
  };
 
  const onSubmit = (data: RegisterFormInputs) => {
    if (!validateRequiredFields(data)) return;
 
    const cleanedData = {
      ...data,
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      companyName: data.companyName.trim(),
      city: data.city.trim(),
      state: data.state.trim(),
    };
 
     localStorage.setItem('registrationData', JSON.stringify({
    fullName: cleanedData.fullName,
    email: cleanedData.email,
    mobileNumber: cleanedData.mobileNumber,
    companyName: cleanedData.companyName,
    city: cleanedData.city,
    state: cleanedData.state,
  }));
 
    console.log(cleanedData);
 
    navigate(URL_PATH.BusinessDetails);
    showToast("success", "Personal details saved!");
  };
 
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "center",
        backgroundImage: `url(${BgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 4, sm: 5 },
      }}
    >
      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{
            width: "100%",
            maxWidth: { xs: 360, sm: 420, md: 460 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box mb={{ xs: 1, sm: 1.5 }}>
            <img
              src={LogoImage}
              alt="Medi Logo"
              style={{ width: "100%", maxWidth: "150px" }}
            />
          </Box>
 
          <Typography
            mb={{ xs: 2.5, sm: 3 }}
            sx={{
              color: "#333",
              fontWeight: 600,
              fontFamily: '"Poppins", sans-serif',
              fontSize: { xs: "1.4rem", sm: "1.7rem", md: "1.9rem" },
              textAlign: "center",
            }}
          >
            Create Your Account
          </Typography>
 
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: { xs: 1.8, sm: 2 },
            }}
          >
            <TextInputField
              name="fullName"
              label="Full Name"
              placeholder="Full Name"
              minLength={3}
              maxLength={30}
              inputType="alphabet"
              rows={1}
              sx={inputStyle("fullName")}
              required
           
              onChange={handleLettersOnlyChange("fullName")}
              rules={{
                pattern: {
                  value: /^[A-Za-z ]+$/,
                  message: "Only alphabets allowed",
                },
              }}
            />
 
            <EmailField
              name="email"
              label="Email Address"
              required
              sx={inputStyle("email")}
            />
 
            <MobileField
              name="mobileNumber"
              label="Mobile Number"
              countryCode
              required
              sx={inputStyle("mobileNumber")}
            />
 
            <TextInputField
              name="companyName"
              label="Company / Clinic Name"
              inputType="alphabet"
              required
              sx={inputStyle("companyName")}
              minLength={3}
              maxLength={30}
            />
 
            <TextInputField
              name="city"
              label="City"
              required
              minLength={3}
              maxLength={30}
              sx={inputStyle("city")}
              onChange={handleLettersOnlyChange("city")}
              rules={{
                pattern: {
                  value: /^[A-Za-z ]+$/,
                  message: "Only letters allowed",
                },
              }}
            />
 
            <TextInputField
              name="state"
              label="State"
              required
              sx={inputStyle("state")}
              minLength={3}
              maxLength={30}
              onChange={handleLettersOnlyChange("state")}
              rules={{
                pattern: {
                  value: /^[A-Za-z ]+$/,
                  message: "Only letters allowed",
                },
              }}
            />
          </Box>
 
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: { xs: 2, sm: 5 },
              fontWeight: "1000",
              fontSize: { xs: "1rem", sm: "1.05rem" },
              backgroundColor: "#1b7f6b",
              textTransform: "none",
              border: "2px solid #1b7f6b",
              boxShadow: "0 0 0 1.5px #ffffff, 0 6px 14px rgba(0,0,0,0.25)",
              transition: "all 0.25s ease",
              "&:hover": {
                backgroundColor: "#fff",
                color: "#1b7f6b",
              },
            }}
          >
            Next step
          </Button>
 
          <Typography
            mt={2}
            sx={{ fontSize: "14px", color: "#555", textAlign: "center" }}
          >
            Already have an account?{" "}
            <Box
              component="span"
              onClick={() => navigate(URL_PATH.LOGIN)}
              sx={{
                color: "black",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-block",
                borderBottom: "2px solid transparent",
                "&:hover": {
                  color: "#145c4d",
                  borderBottom: "2px solid #145c4d",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Login
            </Box>
          </Typography>
        </Box>
      </FormProvider>
    </Box>
  );
};
 
export default RegisterPage;