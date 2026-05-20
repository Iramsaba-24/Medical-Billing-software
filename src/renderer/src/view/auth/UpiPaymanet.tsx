
import { Box, Paper, Button, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BgImage from "@/assets/bgloginpage.svg";
import LogoImage from "@/assets/logoimg.svg";
import TextInputField from "@/components/controlled/TextInputField";
import RadioField from "@/components/controlled/RadioField";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import gpayIcon from "@/assets/icons/googlepay.svg";
import paytmIcon from "@/assets/icons/paytm.svg";
import upiIcon from "@/assets/icons/upi.svg";
import phonepeIcon from "@/assets/icons/phonepe.svg";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import { showToast } from "@/components/uncontrolled/ToastMessage";
import { authService } from "@/service/authService";
//import { createUpiPayment } from "@/service/paymentService";

type UpiFormFields = {
  paymentMethod: "upi";
  UpiId: string;
};

// Define the error type
type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

const radioStyle = {
  "& .MuiRadio-root": {
    color: "default.main",
    "&.Mui-checked": { color: "#238878" },
  },
};

const btnStyle = {
  backgroundColor: "#238878",
  height: 40,
  minWidth: 150,
  color: "#fff",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#fff",
    color: "#238878",
    borderColor: "#238878",
  },
}

// UPI app icon detection
const getUpiApp = (upiId?: string) => {
  if (!upiId) return null;
  const id = upiId.toLowerCase();

  if (
    id.includes("@okaxis") ||
    id.includes("@oksbi") ||
    id.includes("@okhdfcbank") ||
    id.includes("@okicici")
  )
    return "gpay";

  if (id.includes("@paytm")) return "paytm";

  if (
    id.includes("@ybl") ||
    id.includes("@axl") ||
    id.includes("@ibl")
  )
    return "phonepe";

  return null;
};

const upiIcons: Record<string, string> = {
  gpay: gpayIcon,
  paytm: paytmIcon,
  upi: upiIcon,
  phonepe: phonepeIcon,
};

const UpiPayment: React.FC = () => {
  const navigate = useNavigate();
  const methods = useForm<UpiFormFields>({
    defaultValues: {
      paymentMethod: "upi",
      UpiId: "",
    },
    mode: "onChange",
  });

  const { handleSubmit, control } = methods;
  const upiId = useWatch({ control, name: "UpiId" });
  const detectedIcon = getUpiApp(upiId) || "upi";
  const [upiPaymentStatus, setUpiPaymentStatus] = useState<"default" | "loading" | "success">("default");

  const onUpiPay = async () => {
    setUpiPaymentStatus("loading");

    try {
      const paymentDataStr = localStorage.getItem('paymentData');
      const userId = localStorage.getItem('userId');
      
      if (!paymentDataStr || !userId) {
        throw new Error("Missing payment information");
      }

      const paymentData = JSON.parse(paymentDataStr);
      // const upiIdValue = methods.getValues("UpiId");

      // Create subscription first
      const subscriptionResponse = await authService.createSubscription({
        userId: parseInt(userId),
        planId: paymentData.planId
      });
      console.log("subscriptionId:", subscriptionResponse.subscriptionId);
console.log("userId:", userId);


      if (!subscriptionResponse.subscriptionId) {
        throw new Error("Failed to create subscription");
      }

      


const paymentRequest = {
  userId: parseInt(userId),
  subscriptionId: subscriptionResponse.subscriptionId,
  amount: paymentData.amount,
  paymentMethod: "UPI",
};

// const paymentResponse = await authService.processPayment(
//   paymentRequest,
//   "email"
// );

const userData = JSON.parse(localStorage.getItem("userData") || "{}");
const registrationData = JSON.parse(localStorage.getItem("registrationData") || "{}");

const email =
  userData.email ||
  registrationData.email ||
  "test@gmail.com";

const paymentResponse = await authService.processPayment(
  paymentRequest,
  "email",
  email
);
      

        // if (paymentResponse) {
        if (paymentResponse && paymentResponse.success === true) {
  setUpiPaymentStatus("success");
        // Clear stored data
       localStorage.removeItem('registrationData');
  localStorage.removeItem('paymentData');
  localStorage.removeItem('selectedPlanId');

  showToast("success", "Payment Successful!");
        
       setTimeout(() => {
    navigate(URL_PATH.PaymentSuccess);
   }, 900);
} else {
  throw new Error("Payment failed");
}
    } catch (error: unknown) {
      console.error("Payment error:", error);
      setUpiPaymentStatus("default");
      
      // Safely extract error message
      let errorMessage = "Payment failed. Please try again.";
      if (error && typeof error === 'object') {
        const apiError = error as ApiError;
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
      }
      
      showToast("error", errorMessage);
    }
  };

  // useEffect(() => {
  //   if (upiPaymentStatus === "success") {
  //     const timer = setTimeout(() => {
  //       navigate(URL_PATH.NetPurchaseDetails);
  //     }, 900);
  //     return () => clearTimeout(timer);
  //   }
  // }, [upiPaymentStatus, navigate]);

  const showPaymentStatus = (status: "default" | "loading" | "success") => {
    if (status === "loading") {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <CircularProgress />
          <Box textAlign="center">
            Waiting for payment confirmation…
            <br />
            Please complete the payment.
          </Box>
        </Box>
      );
    }

    if (status === "success") {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <CheckCircleIcon sx={{ color: "success.main", fontSize: { xs: 44, sm: 60 } }} />
          <Box fontWeight={700}>Payment Successful 🎉</Box>
        </Box>
      );
    }

    return null;
  };

  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={handleSubmit(onUpiPay)}>
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
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Box
              component="img"
              src={LogoImage}
              alt="Logo"
              sx={{ width: 160, mb: 2 }}
            />
            <Typography
              variant="h4"
              fontWeight={500}
              sx={{
                color: "#212529",
                mb: 3,
                fontSize: { xs: 20, sm: 22, md: 25 }
              }}
            >
              UPI Payment
            </Typography>

            <Paper
              elevation={4}
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 3,
                textAlign: "left",
                backgroundColor: "#F8F9FA",
                maxWidth: {
                  xs: "100%",
                  sm: "80%",
                  md: "70%",
                },
                mx: "auto",
              }}
            >
              <RadioField
                name="paymentMethod"
                options={[{ label: "UPI Payment", value: "upi" }]}
                label=""
                sx={radioStyle}
              />

              <Box display="flex" alignItems="center" gap={2} mt={1}>
                <Box flex={1}>
                  <TextInputField
                    label="Enter your UPI ID"
                    name="UpiId"
                    inputType="alphanumeric"
                    maxLength={30}
                    rules={{
                      required: "UPI ID is required",
                      pattern: {
                        value: /^[a-zA-Z0-9._-]+@(okaxis|oksbi|okhdfcbank|okicici|paytm|ybl|axl|ibl|phonepe)$/,
                        message: "Enter valid UPI ID example: user@oksbi",
                      },
                    }}
                  />
                </Box>

                {upiIcons[detectedIcon] && (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                      boxShadow: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                      flexShrink: 0,
                    }}
                  >
                    <img src={upiIcons[detectedIcon]} width={28} height={28} alt={detectedIcon} />
                  </Box>
                )}
              </Box>

              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={upiPaymentStatus === "loading"}
                  sx={{ ...btnStyle, width: { xs: "100%", sm: "auto" } }}
                >
                  Pay
                </Button>
              </Box>

              <Box textAlign="center" mt={2}>
                {showPaymentStatus(upiPaymentStatus)}
              </Box>
            </Paper>
          </Box>
        </Box>
      </form>
    </FormProvider>
  );
}

export default UpiPayment;



