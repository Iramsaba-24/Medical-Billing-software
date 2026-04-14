// import { useForm, FormProvider } from "react-hook-form";
// import { Box, Button, Typography, CircularProgress } from "@mui/material";
// import { useEffect, useState } from "react";
// import BgImage from "@/assets/bgloginpage.svg";
// import LogoImage from "@/assets/logoimg.svg";
// import TextInputField from "@/components/controlled/TextInputField";
// import EmailField from "@/components/controlled/EmailField";
// import RadioField from "@/components/controlled/RadioField";
// import { showToast } from "@/components/uncontrolled/ToastMessage";
// import MobileField from "@/components/controlled/MobileField";
// import { useNavigate } from "react-router-dom";
// import { URL_PATH } from "@/constants/UrlPath";
// import { authService } from "@/service/authService";
// import { AxiosError } from "axios";

// const radioStyle = {
//   "& .MuiRadio-root": {
//     color: "default.main",
//     "&.Mui-checked": { color: "#238878" },
//   },
// };

// type FormInputs = {
//   amount: string;
//   billType: "email" | "whatsapp";
//   email?: string;
// };

// const NetBanking_PurchaseDetails = () => {
//   const methods = useForm<FormInputs>({
//     defaultValues: {
//       amount: "",
//       billType: "email",
//       email: "",
//     },
//     mode: "onChange",
//   });

//   const selectedBillType = methods.watch("billType");
//   const navigate = useNavigate();
//   const [isProcessing, setIsProcessing] = useState(false);

//   useEffect(() => {
//     const paymentDataStr = localStorage.getItem('paymentData');
//     const userDataStr = localStorage.getItem('userData');
//     const registrationDataStr = localStorage.getItem('registrationData');
    
//     if (paymentDataStr) {
//       try {
//         const paymentData = JSON.parse(paymentDataStr);
        
//         if (paymentData.amount) {
//           methods.setValue('amount', paymentData.amount.toString());
//         }
        
//         if (paymentData.email) {
//           methods.setValue('email', paymentData.email);
//         } else if (userDataStr) {
//           const userData = JSON.parse(userDataStr);
//           if (userData.email) {
//             methods.setValue('email', userData.email);
//           }
//         } else if (registrationDataStr) {
//           const registrationData = JSON.parse(registrationDataStr);
//           if (registrationData.email) {
//             methods.setValue('email', registrationData.email);
//           }
//         }
        
//       } catch (error) {
//         console.error("Error parsing payment data:", error);
//       }
//     }
//   }, [methods]);

//   const getOrCreateSubscription = async (userId: number, planId: number): Promise<number> => {
//     try {
//       const response = await authService.createSubscription({
//         userId,
//         planId
//       });

//       const subscriptionId = response.subscriptionId || response.data?.subscriptionId;
      
//       if (!subscriptionId || typeof subscriptionId !== 'number') {
//         throw new Error("No valid subscription ID returned from server");
//       }
      
//       return subscriptionId;
//     } catch (error) {
//       console.error("Error in getOrCreateSubscription:", error);
//       throw new Error("Failed to get subscription");
//     }
//   };

//   const onSubmit = async (data: FormInputs) => {
//     setIsProcessing(true);
    
//     try {
//       const userId = localStorage.getItem("userId");
//       if (!userId) {
//         throw new Error("User ID not found. Please login again.");
//       }
      
//       const parsedUserId = parseInt(userId);
//       if (isNaN(parsedUserId)) {
//         throw new Error("Invalid User ID");
//       }
      
//       const paymentDataStr = localStorage.getItem('paymentData');
//       if (!paymentDataStr) {
//         throw new Error("Payment data not found. Please select a plan first.");
//       }
      
//       const paymentData = JSON.parse(paymentDataStr);
      
//       if (!paymentData.planId) {
//         throw new Error("Plan ID not found. Please select a plan again.");
//       }
      
//       const subscriptionId = await getOrCreateSubscription(parsedUserId, paymentData.planId);
      
//       console.log("Using subscription ID:", subscriptionId);
      
//       const paymentRequest = {
//         userId: parsedUserId,
//         subscriptionId: subscriptionId,
//         amount: Number(data.amount),
//         paymentMethod: "NetBanking",
//       };
      
//       console.log("Processing payment with data:", paymentRequest);
//       console.log("Bill type:", data.billType);
      
//       let paymentResponse;
      
//       if (data.billType === "email") {
//         const emailParam: string = data.email || "";
//         paymentResponse = await authService.processPayment(
//           paymentRequest,
//           data.billType,
//           emailParam,
//         );
//       }
      
//       console.log("Payment response:", paymentResponse);
      
//       if (paymentResponse && paymentResponse.success === true) {
//         localStorage.removeItem('paymentData');
//         localStorage.removeItem('selectedPlanId');
        
//         showToast("success", "Payment successful & receipt sent!");
//         navigate(URL_PATH.PaymentSuccess);
//       } else {
//         const errorMsg = paymentResponse && typeof paymentResponse === 'object' && 'message' in paymentResponse 
//           ? String(paymentResponse.message) 
//           : "Payment failed";
//         throw new Error(errorMsg);
//       }
      
//     } catch (error: unknown) {
//       console.error("Payment error details:", error);
      
//       let errorMessage = "Payment failed. Please try again.";
      
//       if (error instanceof AxiosError) {
//         errorMessage = error.response?.data?.message || error.message;
//       } else if (error instanceof Error) {
//         if (error.message !== "Success") {
//           errorMessage = error.message;
//         } else {
//           showToast("success", "Payment successful!");
//           navigate(URL_PATH.PaymentSuccess);
//           setIsProcessing(false);
//           return;
//         }
//       }
      
//       showToast("error", errorMessage);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "110vh",
//         display: "flex",
//         backgroundImage: `url(${BgImage})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         flexDirection: "column",
//         alignItems: "center",
//         py: 4,
//       }}
//     >
//       <Box textAlign="center">
//         <img src={LogoImage} alt="logo" style={{ width: 170 }} />
//       </Box>

//       <Typography
//         variant="h4"
//         sx={{
//           mt: 2,
//           mb: 4,
//           fontWeight: 500,
//           fontFamily: '"Poppins", sans-serif',
//         }}
//       >
//         Net Banking Payment
//       </Typography>

//       <FormProvider {...methods}>
//         <Box
//           component="form"
//           onSubmit={methods.handleSubmit(onSubmit)}
//           noValidate
//           sx={{
//             maxWidth: 850,
//             backgroundColor: "#ffffff",
//             borderRadius: 2,
//             boxShadow: 4,
//             p: 4,
//           }}
//         >
//           <Typography sx={{ fontWeight: 600, mb: 3 }}>
//             Purchase Details
//           </Typography>

//           <TextInputField
//             name="amount"
//             label="Amount"
//             placeholder="Enter Amount"
//             type="number"
//             maxLength={30}
//             fullWidth
//             required
//             disabled={isProcessing}
//             sx={{
//               mb: 3,
//               "& .MuiOutlinedInput-root": {
//                 backgroundColor: "#f9f9f9",
//               },
//             }}
//           />

//           <RadioField
//             name="billType"
//             label=""
//             options={[
//               { value: "email", label: "Send E-Bill on your Email ID" },
//               { value: "whatsapp", label: "Send E-Bill on your WhatsApp" },
//             ]}
//             sx={{ mb: 2, ...radioStyle }}
//           />

//           {selectedBillType === "email" && (
//             <EmailField
//               name="email"
//               label="Enter Email"
//               maxLength={50}
//               required
//               disabled={isProcessing}
//               sx={{
//                 mt: 1,
//                 mb: 3,
//                 "& .MuiOutlinedInput-root": {
//                   backgroundColor: "#f9f9f9",
//                 },
//               }}
//             />
//           )}

//           {selectedBillType === "whatsapp" && (
//             <MobileField
//               name="whatsapp"
//               label="Whatsapp Number"
//               placeholder="Enter WhatsApp Number"
//               countryCode
//               required
//               fullWidth
//               disabled={isProcessing}
//               sx={{
//                 mt: 1,
//                 mb: 3,
//                 "& .MuiOutlinedInput-root": {
//                   backgroundColor: "#f9f9f9",
//                 },
//               }}
//             />
//           )}

//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               mt: 3,
//               flexWrap: "wrap",
//               gap: 2,
//             }}
//           >
//             <Box
//               sx={{
//                 backgroundColor: "#F8E7A1",
//                 px: 3,
//                 py: 1.5,
//                 borderRadius: 1,
//                 fontSize: "0.9rem",
//               }}
//             >
//               ⚠ When payment is done, E-Bill will be sent to your selected Email / WhatsApp
//             </Box>

//             <Button
//               type="submit"
//               variant="contained"
//               disabled={isProcessing}
//               sx={{
//                 backgroundColor: "#2c8a74",
//                 px: 5,
//                 textTransform: "none",
//                 fontWeight: 600,
//                 "&:hover": {
//                   backgroundColor: "#246f5e",
//                 },
//               }}
//             >
//               {isProcessing ? <CircularProgress size={24} color="inherit" /> : "Pay"}
//             </Button>
//           </Box>
//         </Box>
//       </FormProvider>
//     </Box>
//   );
// };

// export default NetBanking_PurchaseDetails;


import { useForm, FormProvider } from "react-hook-form";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import BgImage from "@/assets/bgloginpage.svg";
import LogoImage from "@/assets/logoimg.svg";
import TextInputField from "@/components/controlled/TextInputField";
import EmailField from "@/components/controlled/EmailField";
import RadioField from "@/components/controlled/RadioField";
import { showToast } from "@/components/uncontrolled/ToastMessage";
import MobileField from "@/components/controlled/MobileField";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import { authService } from "@/service/authService";
import  { AxiosError } from "axios";

// Define error type
// interface ApiError {
//   response?: {
//     data?: {
//       message?: string;
//       errors?: Record<string, string[]>;
//     };
//   };
//   message?: string;
// }

const radioStyle = {
  "& .MuiRadio-root": {
    color: "default.main",
    "&.Mui-checked": { color: "#238878" },
  },
};

type FormInputs = {
  amount: string;
  billType: "email" | "whatsapp";
  email?: string;
  whatsapp?: string;
};

const NetBanking_PurchaseDetails = () => {
  const methods = useForm<FormInputs>({
    defaultValues: {
      amount: "",
      billType: "email",
      email: "",
      whatsapp: "",
    },
    mode: "onChange",
  });

  const selectedBillType = methods.watch("billType");
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-fill form data from localStorage
  useEffect(() => {
    const paymentDataStr = localStorage.getItem('paymentData');
    const userDataStr = localStorage.getItem('userData');
    const registrationDataStr = localStorage.getItem('registrationData');
    
    if (paymentDataStr) {
      try {
        const paymentData = JSON.parse(paymentDataStr);
        
        // Auto-fill amount
        if (paymentData.amount) {
          methods.setValue('amount', paymentData.amount.toString());
        }
        
        // Auto-fill email
        if (paymentData.email) {
          methods.setValue('email', paymentData.email);
        } else if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          if (userData.email) {
            methods.setValue('email', userData.email);
          }
        } else if (registrationDataStr) {
          const registrationData = JSON.parse(registrationDataStr);
          if (registrationData.email) {
            methods.setValue('email', registrationData.email);
          }
        }
        
        // Auto-fill whatsapp
        if (paymentData.whatsapp) {
          methods.setValue('whatsapp', paymentData.whatsapp);
        } else if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          if (userData.phone) {
            methods.setValue('whatsapp', userData.phone);
          }
        } else if (registrationDataStr) {
          const registrationData = JSON.parse(registrationDataStr);
          if (registrationData.mobile) {
            methods.setValue('whatsapp', registrationData.mobile);
          }
        }
        
      } catch (error) {
        console.error("Error parsing payment data:", error);
      }
    }
  }, [methods]);

  const getOrCreateSubscription = async (userId: number, planId: number) => {
  try {
    const response = await authService.createSubscription({
      userId,
      planId
    });

    return response.subscriptionId;
  } catch (error) {
    throw new Error("Failed to get subscription");
  }
};

const onSubmit = async (data: FormInputs) => {
  setIsProcessing(true);
  
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      throw new Error("User ID not found. Please login again.");
    }
    
    const parsedUserId = parseInt(userId);
    if (isNaN(parsedUserId)) {
      throw new Error("Invalid User ID");
    }
    
    // Get payment data
    const paymentDataStr = localStorage.getItem('paymentData');
    if (!paymentDataStr) {
      throw new Error("Payment data not found. Please select a plan first.");
    }
    
    const paymentData = JSON.parse(paymentDataStr);
    
    // Validate required fields
    if (!paymentData.planId) {
      throw new Error("Plan ID not found. Please select a plan again.");
    }
    
    // Get or create subscription
    const subscriptionId = await getOrCreateSubscription(parsedUserId, paymentData.planId);
    
    console.log("Using subscription ID:", subscriptionId);
    
    // Prepare payment request
    const paymentRequest = {
      userId: parsedUserId,
      subscriptionId: subscriptionId,
      amount: Number(data.amount),
      paymentMethod: "NetBanking",
      couponCode: paymentData.couponCode || "",
    };
    
    console.log("Processing payment with data:", paymentRequest);
    console.log("FINAL CHECK →", {
  userId: parsedUserId,
  subscriptionId,
  amount: Number(data.amount),
  paymentMethod: "NetBanking",
  couponCode: paymentData.couponCode || "",
});
    console.log("Bill type:", data.billType);
    
    // Process payment with receipt delivery
    let paymentResponse;
    
    if (data.billType === "email") {
      const emailParam: string = data.email || "";
      paymentResponse = await authService.processPayment(
        paymentRequest,
        data.billType,
        emailParam,
        ""
      );
    } else {
      const whatsappParam: string = data.whatsapp || "";
      paymentResponse = await authService.processPayment(
        paymentRequest,
        data.billType,
        "",
        whatsappParam
      );
    }
    
    console.log("Payment response:", paymentResponse);
    
    // Check if payment was successful - the response will have userPaymentId if successful
if (
  paymentResponse &&
  paymentResponse.success &&
  paymentResponse.data &&
  (paymentResponse.data.userPaymentId || paymentResponse.data.userPaymentId === 0)
) {      // Clear temporary data but keep subscription info
      localStorage.removeItem('paymentData');
      localStorage.removeItem('selectedPlanId');
      
      showToast("success", "Payment successful & receipt sent!");
      navigate(URL_PATH.PaymentSuccess);
    } else {
throw new Error(paymentResponse?.data?.paymentStatus || "Payment failed");    }
    
  } catch (error: unknown) {
    console.error("Payment error details:", error);
    
    let errorMessage = "Payment failed. Please try again.";
    
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      // Don't show "Success" as an error
      if (error.message !== "Success") {
        errorMessage = error.message;
      } else {
        // If it says "Success" but we're in error block, payment was actually successful
        showToast("success", "Payment successful!");
        navigate(URL_PATH.PaymentSuccess);
        return;
      }
    }
    
    showToast("error", errorMessage);
  } finally {
    setIsProcessing(false);
  }
};

  return (
    <Box
      sx={{
        minHeight: "110vh",
        display: "flex",
        backgroundImage: `url(${BgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        flexDirection: "column",
        alignItems: "center",
        py: 4,
      }}
    >
      {/* Logo */}
      <Box textAlign="center">
        <img src={LogoImage} alt="logo" style={{ width: 170 }} />
      </Box>

      {/* Heading */}
      <Typography
        variant="h4"
        sx={{
          mt: 2,
          mb: 4,
          fontWeight: 500,
          fontFamily: '"Poppins", sans-serif',
        }}
      >
        Net Banking Payment
      </Typography>

      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={methods.handleSubmit(onSubmit)}
          noValidate
          sx={{
            maxWidth: 850,
            backgroundColor: "#ffffff",
            borderRadius: 2,
            boxShadow: 4,
            p: 4,
          }}
        >
          {/* Purchase Details */}
          <Typography sx={{ fontWeight: 600, mb: 3 }}>
            Purchase Details
          </Typography>

          {/* Amount Field */}
          <TextInputField
            name="amount"
            label="Amount"
            placeholder="Enter Amount"
            type="number"
            maxLength={30}
            fullWidth
            required
            disabled={isProcessing}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#f9f9f9",
              },
            }}
          />

          {/* Radio Buttons */}
          <RadioField
            name="billType"
            label=""
            options={[
              { value: "email", label: "Send E-Bill on your Email ID" },
              { value: "whatsapp", label: "Send E-Bill on your WhatsApp" },
            ]}
            sx={{ mb: 2, ...radioStyle }}
          />

          {/* Conditional Email Field */}
          {selectedBillType === "email" && (
            <EmailField
              name="email"
              label="Enter Email"
              maxLength={50}
              required
              disabled={isProcessing}
              sx={{
                mt: 1,
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f9f9f9",
                },
              }}
            />
          )}

          {/* Conditional WhatsApp Field */}
          {selectedBillType === "whatsapp" && (
            <MobileField
              name="whatsapp"
              label="Whatsapp Number"
              placeholder="Enter WhatsApp Number"
              countryCode
              required
              fullWidth
              disabled={isProcessing}
              sx={{
                mt: 1,
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f9f9f9",
                },
              }}
            />
          )}

          {/* Bottom Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {/* Warning Box */}
            <Box
              sx={{
                backgroundColor: "#F8E7A1",
                px: 3,
                py: 1.5,
                borderRadius: 1,
                fontSize: "0.9rem",
              }}
            >
              ⚠ When payment is done, E-Bill will be sent to your selected Email / WhatsApp
            </Box>

            {/* Pay Button */}
            <Button
              type="submit"
              variant="contained"
              disabled={isProcessing}
              sx={{
                backgroundColor: "#2c8a74",
                px: 5,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#246f5e",
                },
              }}
            >
              {isProcessing ? <CircularProgress size={24} color="inherit" /> : "Pay"}
            </Button>
          </Box>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default NetBanking_PurchaseDetails;