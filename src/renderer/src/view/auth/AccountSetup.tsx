// AccountSetup.tsx
import { Box, Button, Typography, Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import { FormProvider, useForm, Controller } from "react-hook-form";
import BgImage from "@/assets/bgloginpage.svg";
import LogoImage from "@/assets/logoimg.svg";
import { URL_PATH } from "@/constants/UrlPath";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/components/uncontrolled/ToastMessage";
import PasswordField from "@/components/controlled/PasswordField";
import { authService } from "@/service/authService";
import axios from "axios";
import { useState } from "react";

type AccountForm = {
  password: string;
  confirmPassword: string;
  terms: boolean;
  emailUpdates: boolean;
};

const checkboxStyle = {
  "& .MuiCheckbox-root": {
    color: "default.main",
    "&.Mui-checked": {
      color: "#238878",
    },
  },
};

const AccountSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const methods = useForm<AccountForm>({
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
      terms: false,
      emailUpdates: false,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const navigate = useNavigate();

  // Map plan name to plan ID based on your backend
  const getPlanId = (planName: string): number => {
    const planMapping: Record<string, number> = {
      'basic': 1,
      'standard': 2,
      'premium': 3
    };
    return planMapping[planName] || 1;
  };

  const onSubmit = async (data: AccountForm) => {
    setIsLoading(true);
    
    try {
      console.log("Account setup data:", data);
      
      // Get all registration data from localStorage
      const registrationData = JSON.parse(localStorage.getItem('registrationData') || '{}');
      const selectedPlan = localStorage.getItem('selectedPlan');
      
      console.log("Registration data:", registrationData);
      console.log("Selected plan:", selectedPlan);

      // Validate required data
      if (!registrationData.email || !registrationData.fullName) {
        showToast("error", "Registration data missing. Please start over.");
        navigate(URL_PATH.REGISTER);
        return;
      }

      if (!selectedPlan) {
        showToast("error", "Plan not selected. Please start over.");
        navigate(URL_PATH.ChoosePlan);
        return;
      }

      // Prepare complete user data for registration
      const completeUserData = {
        username: registrationData.email.split('@')[0], // Generate username from email
        password: data.password,
        fullName: registrationData.fullName,
        email: registrationData.email,
        mobileNumber: registrationData.mobileNumber,
        companyName: registrationData.companyName,
        city: registrationData.city,
        state: registrationData.state,
        businessDetail: registrationData.businessDetail ? {
          businessType: registrationData.businessDetail.businessType,
          gstin: registrationData.businessDetail.gstin,
          licenseNumber: registrationData.businessDetail.licenseNumber
        } : undefined
      };

      console.log("Sending to registration API:", completeUserData);

      // Register user
      const response = await authService.register(completeUserData);

      if (response.success && response.userId) {
        // Store user ID for payment
        localStorage.setItem('userId', response.userId.toString());
        
        // Store the plan ID for payment (convert plan name to ID)
        const planId = getPlanId(selectedPlan);
        localStorage.setItem('planId', planId.toString());
        
        showToast("success", response.message || "Account created successfully!");
        
        // Navigate to payment page
        navigate(URL_PATH.ProceedToPaymentPage);
      } else {
        showToast("error", response.message || "Registration failed");
      }
    } catch (error: any) {
  console.error("Registration error:", error);
  
  if (axios.isAxiosError(error)) {
    // Log the full error response to see what the backend is saying
    console.error("Error response data:", error.response?.data);
    console.error("Error response status:", error.response?.status);
    console.error("Error response headers:", error.response?.headers);
    
    const errorMessage = error.response?.data?.message || 
                        error.response?.data || 
                        error.message || 
                        "Registration failed";
    showToast("error", errorMessage);
  } else {
    showToast("error", "Registration failed. Please try again.");
  }
}
}

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${BgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        fontFamily: '"Poppins", sans-serif',
      }}
    >
      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            px: 2,
          }}
        >
          {/* Logo */}
          <img
            src={LogoImage}
            style={{ width: "100%", maxWidth: "160px" }}
            alt="Logo"
          />

          {/* Title */}
          <Typography
            sx={{
              fontSize: { xs: "1.5rem", sm: "1.7rem" },
              mb: 0.5,
            }}
          >
            Account Setup
          </Typography>

          {/* Password */}
          <Box sx={{ width: "100%", maxWidth: 420 }}>
            <PasswordField
              name="password"
              label="Create Password"
              required
              minLength={8}
              maxLength={32}
              showStrengthIndicator={false}
            />
          </Box>

          {/* Confirm Password */}
          <Box sx={{ width: "100%", maxWidth: 420 }}>
            <PasswordField
              name="confirmPassword"
              label="Confirm Password"
              required
              confirmFieldName="password"
              showStrengthIndicator={false} 
            />
          </Box>

          {/* Terms Checkbox */}
          <Box sx={{ width: "100%", maxWidth: 420 }}>
            <Controller
              name="terms"
              control={control}
              rules={{ required: "You must accept Terms & Privacy Policy" }}
              render={({ field }) => (
                <>
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label="I agree to Terms & Privacy Policy"
                    sx={checkboxStyle}
                  />
                  {errors.terms && (
                    <FormHelperText error>
                      {errors.terms.message}
                    </FormHelperText>
                  )}
                </>
              )}
            />
          </Box>

          {/* Email Updates Checkbox */}
          <Box sx={{ width: "100%", maxWidth: 420 }}>
            <Controller
              name="emailUpdates"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="I want product updates via email (optional)"
                  sx={checkboxStyle}
                />
              )}
            />
          </Box>

          {/* Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              maxWidth: 420,
              mt: 2,
              fontWeight: 600,
              fontSize: { xs: "1rem", sm: "1.05rem" },
              backgroundColor: "#1b7f6b",
              textTransform: "none",
              border: "2px solid #1b7f6b",
              boxShadow: "0 0 0 1.5px #ffffff, 0 6px 14px rgba(0,0,0,0.25)",
              transition: "all 0.25s ease",
              "&:hover": {
                backgroundColor: "#fff",
                color: "#1b7f6b",
                border: "2px solid #1b7f6b",
              },
              "&.Mui-disabled": {
                backgroundColor: "#cccccc",
                color: "#666666",
              }
            }}
          >
            {isLoading ? "Creating Account..." : "Next Step"}
          </Button>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default AccountSetup;




// import { Box, Button, Typography, Checkbox, FormControlLabel, FormHelperText,
// } from "@mui/material";
// import { FormProvider, useForm, Controller } from "react-hook-form";
// import BgImage from "@/assets/bgloginpage.svg";
// import LogoImage from "@/assets/logoimg.svg";
// import { URL_PATH } from "@/constants/UrlPath";
// import { useNavigate } from "react-router-dom";
// import { showToast } from "@/components/uncontrolled/ToastMessage";
// import PasswordField from "@/components/controlled/PasswordField";
// import { authService } from "@/service/authService";
// import axios from "axios";

// type AccountForm = {
//   password: string;
//   confirmPassword: string;
//   terms: boolean;
//   emailUpdates: boolean;
// };
//   const checkboxStyle = {
//   "& .MuiCheckbox-root": {
//     color: "default.main",
//     "&.Mui-checked": {
//       color: "#238878",
//     },
//   },
// };

// const AccountSetup = () => {

//   const methods = useForm<AccountForm>({
//     mode: "onChange",
//     defaultValues: {
//       password: "",
//       confirmPassword: "",
//       terms: false,
//       emailUpdates: false,
//     },
//   });

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = methods;



//   const navigate = useNavigate();

//   const onSubmit = async (data: AccountForm) => {
//     console.log(data);
//     const registrationData = JSON.parse(localStorage.getItem('registrationData') || '{}');

//     // Validate required data
//     if (!registrationData.email || !registrationData.fullName) {
//       showToast("error", "Registration data missing. Please start over.");
//       navigate(URL_PATH.REGISTER);
//       return;
//     }

//     const completeUserData = {
//       username: registrationData.email?.split('@')[0], // Generate username
//       password: data.password,
//       fullName: registrationData.fullName,
//       email: registrationData.email,
//       mobileNumber: registrationData.mobileNumber,
//       companyName: registrationData.companyName,
//       clinicName: registrationData.companyName,
//       city: registrationData.city,
//       state: registrationData.state,
//       businessDetail: registrationData.businessDetails ? {
//         businessType: registrationData.businessDetails.BuisinessTypes,
//         gstin: registrationData.businessDetails.gstin,
//         licenseNumber: registrationData.businessDetails.LicenseNumber
//       } : undefined
//     };

//     try {
//       // Register user
//       const response = await authService.register(completeUserData);

//       if (response.success && response.userId) {
//         // Store user ID for payment
//         localStorage.setItem('userId', response.userId.toString());

//         showToast("success", "Account setup successful!");
//         navigate(URL_PATH.ProceedToPaymentPage);
//       } else {
//         showToast("error", response.message || "Registration failed");
//       }
//     } catch (error) {
//       console.error("Registration error:", error);
//       if (axios.isAxiosError(error)) {
//         showToast("error", error.response?.data?.message || "Registration failed");
//       } else {
//         showToast("error", "Registration failed. Please try again.");
//       }
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         backgroundImage: `url(${BgImage})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         display: "flex",
//         flexDirection: "column",
//         fontFamily: '"Poppins", sans-serif',
//       }}
//     >
//       <FormProvider {...methods}>
//         <Box
//           component="form"
//           onSubmit={handleSubmit(onSubmit)}
//           sx={{
//             minHeight: "100vh",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: 1,
//             px: 2,
//           }}
//         >

//           {/* Logo */}
//           <img
//             src={LogoImage}
//             style={{ width: "100%", maxWidth: "160px" }}
//           />

//           {/* Title */}
//           <Typography
//             sx={{
//               fontSize: { xs: "1.5rem", sm: "1.7rem" },
//               mb: 0.5,
//             }}
//           >
//             Account Setup
//           </Typography>

//           {/* Password */}
//           <Box sx={{ width: "100%", maxWidth: 420 }}>
//             <PasswordField
//               name="password"
//               label="Create Password"
//               required
//               minLength={8}
//               maxLength={32}
//               showStrengthIndicator={false}
              
//             />
//           </Box>

//           {/* Confirm Password */}
//           <Box sx={{ width: "100%", maxWidth: 420 }}>
//             <PasswordField
//               name="confirmPassword"
//               label="Confirm Password"
//               required
//               confirmFieldName="password"
//               showStrengthIndicator={false} 
//             />
//           </Box>

//           {/* Terms Checkbox */}
//           <Box sx={{ width: "100%", maxWidth: 420 }}>
//             <Controller
//               name="terms"
//               control={control}
//               rules={{ required: "You must accept Terms & Privacy Policy" }}
//               render={({ field }) => (
//                 <>
//                   <FormControlLabel
//                     control={<Checkbox {...field} checked={field.value}  />}
//                     label="I agree to Terms & Privacy Policy"
//                     sx={checkboxStyle}
//                   />
//                   {errors.terms && (
//                     <FormHelperText error>
//                       {errors.terms.message}
//                     </FormHelperText>
//                   )}
//                 </>
//               )}
//             />
//           </Box>

//           {/* Checkbox */}
//           <Box sx={{ width: "100%", maxWidth: 420 }}>
//             <Controller
//               name="emailUpdates"
//               control={control}
//               render={({ field }) => (
//                 <FormControlLabel
//                   control={<Checkbox {...field} checked={field.value}  />}
//                   label="I want product updates via email (optional)"
//                   sx={checkboxStyle}
//                 />
//               )}
//             />
//           </Box>

//           {/* Button */}
//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{
//               maxWidth: 420,
//               mt: 2,
//               fontWeight: 600,
//               fontSize: { xs: "1rem", sm: "1.05rem" },
//               backgroundColor: "#1b7f6b",
//               textTransform: "none",
//               border: "2px solid #1b7f6b",
//               boxShadow:
//                 "0 0 0 1.5px #ffffff, 0 6px 14px rgba(0,0,0,0.25)",
//               transition: "all 0.25s ease",
//               "&:hover": {
//                 backgroundColor: "#fff",
//                 color: "#1b7f6b",
//                 border: "2px solid #1b7f6b",
//               },
//             }}
//           >
//             Next Step
//           </Button>

//         </Box>
//       </FormProvider>
//     </Box>
//   );
// };

// export default AccountSetup;