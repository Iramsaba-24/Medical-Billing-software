
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import TextInputField from "@/components/controlled/TextInputField";
import BgImage from "@/assets/bgloginpage.svg";
import LogoImage from "@/assets/logoimg.svg";
import { URL_PATH } from "@/constants/UrlPath";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { authService, LoginRequest } from "@/service/authService";
import { showToast } from "@/components/uncontrolled/ToastMessage";
import axios from "axios";

type LoginFormInputs = {
  usernameOrEmail: string;
  password: string;
  licenseKey?: string;
};

type ErrorResponse = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  title?: string;
  status?: number;
};

const LoginPage = () => {
  const methods = useForm<LoginFormInputs>({
    defaultValues: {
      usernameOrEmail: "",
      password: "",
      licenseKey: "",
    },
    mode: "onChange",
  });
  
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [tempUserData, setTempUserData] = useState<{ userId?: number; email?: string }>({});

  const onSubmit = async (data: LoginFormInputs) => {
    console.log("Login attempt:", data);
    setIsLoading(true);

    
    
    try {
      const loginData: LoginRequest = {
        usernameOrEmail: data.usernameOrEmail,
        password: data.password,
      };
      
      if (data.licenseKey && data.licenseKey.trim() !== "") {
        loginData.licenseKey = data.licenseKey.trim();
      }
      
      console.log("Sending login data:", loginData);
      
      const response = await authService.login(loginData);
      
      console.log("Login response:", response);
      
      // if (response.token) {
      //   localStorage.setItem('token', response.token);
      //   if (response.userId) {
      //     localStorage.setItem('userId', response.userId.toString());
      //   }

        
      //   if (response.username) {
      //     localStorage.setItem('username', response.username);
      //   }
      //   if (response.email) {
      //     localStorage.setItem('userEmail', response.email);
      //   }
        
      //   showToast("success", "Login successful!");
        
      //   navigate(URL_PATH.Landing);

   if (response.token) {
  localStorage.setItem('token', response.token);
  
  if (response.userId) {
    localStorage.setItem('userId', response.userId.toString());
  }

 const emailToSave = response.email || data.usernameOrEmail;
  localStorage.setItem('userEmail', emailToSave);

  // block 
  try {
    const payload = JSON.parse(atob(response.token.split('.')[1]));
    console.log("JWT payload:", payload);
    const jwtUsername = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    if (jwtUsername) {
      localStorage.setItem('username', jwtUsername);  
    }
  } catch (e) {
    console.error("JWT decode failed", e);
  }

  if (data.licenseKey && data.licenseKey.trim() !== "") {
    localStorage.setItem('licenseKey', data.licenseKey.trim());
  }
  showToast("success", "Login successful!");
  navigate(URL_PATH.Landing);

      } else {
        showToast("error", response.message || "Login failed");
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const errorData = error.response?.data as ErrorResponse;
        
        console.log("Error status:", statusCode);
        console.log("Error data:", errorData);
        
        if (errorData?.message?.toLowerCase().includes("subscription not active")) {
          
          setShowSubscriptionDialog(true);
          
          if (data.usernameOrEmail) {
            setTempUserData({ email: data.usernameOrEmail });
          }
          
          showToast("warning", "Your subscription is not active. Please activate your plan to continue.");
          return;
        }
        
        if (statusCode === 400) {
          if (errorData?.errors) {
            const errorMessages = Object.values(errorData.errors).flat();
            showToast("error", errorMessages[0] || "Invalid input data");
          } else if (typeof errorData === 'string') {
            showToast("error", errorData);
          } else if (errorData?.message) {
            if (errorData.message.includes("license")) {
              showToast("error", "Invalid or expired license key");
            } else if (errorData.message.includes("password")) {
              showToast("error", "Invalid username or password");
            } else {
              showToast("error", errorData.message);
            }
          } else {
            showToast("error", "Invalid username or password");
          }
        } else if (statusCode === 401) {
          showToast("error", "Invalid username or password");
        } else if (statusCode === 403) {
          showToast("error", "Account is locked. Please contact support.");
        } else if (statusCode === 404) {
          showToast("error", "User not found");
        } else {
          showToast("error", errorData?.message || "Login failed. Please try again.");
        }
      } else if (error instanceof Error) {
        showToast("error", error.message || "An unexpected error occurred");
      } else {
        showToast("error", "Login failed. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleActivateSubscription = () => {
    setShowSubscriptionDialog(false);
    if (tempUserData.email) {
      localStorage.setItem('pendingActivationEmail', tempUserData.email);
    }
    navigate(URL_PATH.ChoosePlan);
  };
  
  const handleContactSupport = () => {
    setShowSubscriptionDialog(false);
    showToast("info", "Please contact support at support@yourdomain.com");
  };
  
  const {
    formState: { errors },
  } = methods;
  
  const inputStyle = (fieldName: keyof LoginFormInputs) => ({
    "& .MuiOutlinedInput-root": {
      height: { xs: 44, sm: 48 },
      borderRadius: "6px",
      backgroundColor: "#fff",
      "& fieldset": {
        borderColor: errors[fieldName]
          ? "#d32f2f !important"
          : "#1b7f6b !important",
        borderWidth: "3px",
      },
      "&:hover fieldset": {
        borderColor: errors[fieldName]
          ? "#d32f2f !important"
          : "#1b7f6b !important",
      },
      "&.Mui-focused fieldset": {
        borderColor: errors[fieldName]  // If there's an error for this field, use red; otherwise, use green
          ? "#d32f2f !important"      //type of error color
          : "#1b7f6b !important",
      },
    },
    "& .MuiOutlinedInput-input": {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: { xs: "13px", sm: "14px" },
    },
  });
  
  return (
    <>
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
              borderRadius: 2,
            }}
          >
            <Box mb={1}>
              <img
                src={LogoImage}
                alt="Medi Logo"
                style={{ width: "160px", maxWidth: "100%" }}
              />
            </Box>

            <Typography
              variant="h4"
              mb={{ xs: 3, sm: 4 }}
              sx={{
                color: "#333",
                fontWeight: 400,
                fontFamily: '"Poppins", sans-serif',
                fontSize: { xs: "1.6rem", sm: "2rem" },
              }}
            >
              Login
            </Typography>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: { xs: 1.5, sm: 2 },
              }}
            >
              <TextInputField
                name="usernameOrEmail"
                label="User Name / Email ID"
                sx={inputStyle("usernameOrEmail")}
                rules={{
                  required: "Username or Email is required",
                  validate: (value: string) => {
                    if (!value) return true; 
                    
                    const emailRegex = /^[a-z0-9]+@[a-z0-9]+\.[a-z]{2,}$/i;
                    const usernameRegex = /^[a-zA-Z0-9_.@]{3,20}$/;
                    
                    if (value.includes("@")) {
                      if (/[A-Z]/.test(value)) return "Email must be in lowercase letters only";
                      if (!emailRegex.test(value)) return "Enter a valid email";
                      return true;
                    }
                    
                    if (usernameRegex.test(value)) {
                      return true;
                    }
                    
                    return "Enter a valid username or email";
                  },
                }}
              />
              
              <TextInputField
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                sx={inputStyle("password")}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  validate: (value: string) => {
                    if (!/[A-Z]/.test(value))
                      return "Add at least one capital letter (A-Z)";
                    if (!/[a-z]/.test(value))
                      return "Add at least one small letter (a-z)";
                    if (!/[0-9]/.test(value))
                      return "Add at least one number (0-9)";
                    if (!/[@$_#.*]/.test(value))
                      return "Add at least one special character (@$_#.*)";
                    return true;
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* <TextInputField
                name="licenseKey"
                label="License Key (Optional)"
                sx={inputStyle("licenseKey")}
                rules={{
                  pattern: {
                    value: /^[A-Z0-9-]{5,25}$/,
                    message: "Invalid License Key format",
                  },
                }}
              /> */}
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
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
                "&.Mui-disabled": {
                  backgroundColor: "#cccccc",
                  color: "#666666",
                },
              }}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </Box>
        </FormProvider>
      </Box>

      <Dialog
        open={showSubscriptionDialog}
        onClose={() => setShowSubscriptionDialog(false)}
        aria-labelledby="subscription-dialog-title"
      >
        <DialogTitle id="subscription-dialog-title">
          Subscription Not Active
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your subscription is not active. To access your account and continue using our services,
            you need to activate your subscription by selecting a plan.
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              What would you like to do?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleContactSupport} color="inherit">
            Contact Support
          </Button>
          <Button 
            onClick={handleActivateSubscription} 
            variant="contained"
            sx={{
              backgroundColor: "#1b7f6b",
              "&:hover": {
                backgroundColor: "#0f5e4e",
              }
            }}
          >
            Activate Subscription
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LoginPage;







