 
import { Box, Button, Typography, Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import { FormProvider, useForm, Controller } from "react-hook-form";
import BgImage from "@/assets/bgloginpage.svg";
import LogoImage from "@/assets/logoimg.svg";
import { URL_PATH } from "@/constants/UrlPath";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/components/uncontrolled/ToastMessage";
import PasswordField from "@/components/controlled/PasswordField";
import { authService } from "@/service/authService";
import axios, { AxiosError } from "axios";
import { useState } from "react";
 
type AccountForm = {
  password: string;
  confirmPassword: string;
  terms: boolean;
  emailUpdates: boolean;
};
 
interface SubscriptionActivationResponse {
  success: boolean;
  message?: string;
  data?: {
    subscriptionId: number;
    startDate: string;
    endDate: string;
    planId: number;
  };
}
 
interface RegistrationResponse {
  userId?: number;
  message?: string;
  success?: boolean;
}
 
interface ErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
  status?: number;
}
 
interface PlanDetails {
  name: string;
  price: number;
  duration: number;
}
 
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
 
  const getPlanId = (planName: string): number => {
    const planMapping: Record<string, number> = {
      'basic': 1,
      'standard': 2,
      'premium': 3
    };
    return planMapping[planName] || 1;
  };
 
  const getPlanDetails = (planId: number): PlanDetails => {
    const planDetails: Record<number, PlanDetails> = {
      1: { name: 'Basic', price: 999, duration: 30 },
      2: { name: 'Standard', price: 1999, duration: 30 },
      3: { name: 'Premium', price: 2999, duration: 30 }
    };
    return planDetails[planId] || { name: 'Basic', price: 999, duration: 30 };
  };
 
  const activateSubscription = async (userId: number, planId: number): Promise<SubscriptionActivationResponse> => {
    try {
      const apiBaseUrl = 'http://localhost:5158/api';
     
      console.log(`Calling: ${apiBaseUrl}/UserSubscription/activate?userId=${userId}&planId=${planId}`);
     
      const response = await axios.post<SubscriptionActivationResponse>(`${apiBaseUrl}/UserSubscription/activate`, null, {
        params: {
          userId: userId,
          planId: planId
        }
      });
     
      console.log('Subscription activation response:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('Error activating subscription:', error);
     
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error('Response status:', axiosError.response?.status);
        console.error('Response data:', axiosError.response?.data);
       
        if (axiosError.response?.data === "User already has active subscription") {
          return { success: true, message: "Already subscribed" };
        }
      }
     
      throw error;
    }
  };
 
const onSubmit = async (data: AccountForm): Promise<void> => {
  setIsLoading(true);
 
  try {
   // const registrationData = JSON.parse(localStorage.getItem('registrationData') || '{}');
    // const selectedPlan = localStorage.getItem('selectedPlan');
 
    const registrationData = JSON.parse(
  localStorage.getItem("registrationData") || "{}"
);
 
const selectedPlan = registrationData.selectedPlan;
 
console.log("selectedPlan:", selectedPlan);
 
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
 
    const completeUserData = {
      username: registrationData.email.split('@')[0],
      password: data.password,
      fullName: registrationData.fullName,
      email: registrationData.email,
      mobileNumber: registrationData.mobileNumber,
      companyName: registrationData.companyName || "",
      city: registrationData.city || "",
      state: registrationData.state || "",
      ...(registrationData.businessDetail && {
        businessDetail: {
          businessType: registrationData.businessDetail.businessType || "",
          gstin: registrationData.businessDetail.gstin || "",
          licenseNumber: registrationData.businessDetail.licenseNumber || ""
        }
      })
    };
 
    const response = await authService.register(completeUserData) as RegistrationResponse;
    console.log("Registration response:", response);
 
    if (response.userId) {
      const userId = response.userId;
      const planId = getPlanId(selectedPlan);
      const planDetails = getPlanDetails(planId);
 
      localStorage.setItem('userId', userId.toString());
      localStorage.setItem('planId', planId.toString());
      localStorage.setItem('selectedPlan', selectedPlan);
 
      //first activate subscription, then login, then save payment data
      try {
        await activateSubscription(userId, planId);
        console.log("Subscription activated!");
      } catch (err) {
        console.error("Activation error:", err);
      }
 
      //auto-login after registration to get token for payment page
      try {
        const loginResult = await authService.login({
          usernameOrEmail: completeUserData.email,
          password: data.password
        });
        console.log("Auto-login token:", loginResult.token);
        console.log("Token saved:", localStorage.getItem("token"));
      } catch (loginErr) {
        console.error("Auto-login failed:", loginErr);
      }
 
      // Store payment data in localStorage for use in payment page
      const paymentData = {
        userId: userId,
        amount: planDetails.price,
        paymentMethod: '',
        planId: planId,
        couponCode: ''
      };
      localStorage.setItem('paymentData', JSON.stringify(paymentData));
 
      showToast("success", `Account created! ${planDetails.name} plan active.`);
      navigate(URL_PATH.ProceedToPaymentPage);
 
    } else {
      showToast("error", response.message || "Registration failed");
    }
  } catch (error: unknown) {
    console.error('Registration error:', error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.status === 409) {
        showToast("error", "User already exists. Please login.");
        navigate(URL_PATH.LOGIN);
      } else {
        showToast("error", "Registration failed. Please try again.");
      }
    } else {
      showToast("error", "An unexpected error occurred.");
    }
  } finally {
    setIsLoading(false);
  }
};
 
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
          <img
            src={LogoImage}
            style={{ width: "100%", maxWidth: "160px" }}
            alt="Logo"
          />
 
          <Typography
            sx={{
              fontSize: { xs: "1.5rem", sm: "1.7rem" },
              mb: 0.5,
            }}
          >
            Account Setup
          </Typography>
 
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
 
          <Box sx={{ width: "100%", maxWidth: 420 }}>
            <PasswordField
              name="confirmPassword"
              label="Confirm Password"
              required
              confirmFieldName="password"
              showStrengthIndicator={false}
            />
          </Box>
 
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
 
 
 
 
 