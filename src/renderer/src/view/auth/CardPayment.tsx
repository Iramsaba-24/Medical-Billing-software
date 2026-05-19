
import {
  Box,
  Paper,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import BgImage from "@/assets/bgloginpage.svg";
import LogoImage from "@/assets/logoimg.svg";
import TextInputField from "@/components/controlled/TextInputField";
import NumericField from "@/components/controlled/NumericField";
import RadioField from "@/components/controlled/RadioField";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import { showToast } from "@/components/uncontrolled/ToastMessage";
import { authService } from "@/service/authService";

type CardFormFields = {
  paymentMethod: "credit-card";
  CardNumber: string;
  CardHolderName: string;
  Cvv: string;
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

const CardPayment: React.FC = () => {
  const navigate = useNavigate();
  const methods = useForm<CardFormFields>({
    defaultValues: {
      paymentMethod: "credit-card",
      CardNumber: "",
      CardHolderName: "",
      Cvv: "",
    },
    mode: "onChange",
  });

  const { handleSubmit } = methods;
  const [cardPaymentStatus, setCardPaymentStatus] = useState<"default" | "loading" | "success">("default");

  const onCardPay = async () => {
    setCardPaymentStatus("loading");

    try {
      const paymentDataStr = localStorage.getItem('paymentData');
      const userId = localStorage.getItem('userId');
      
      if (!paymentDataStr || !userId) {
        throw new Error("Missing payment information");
      }

      const paymentData = JSON.parse(paymentDataStr);
      const cardDetails = methods.getValues();

      // Create subscription first
      const subscriptionResponse = await authService.createSubscription({
        userId: parseInt(userId),
        planId: paymentData.planId
      });

      if (!subscriptionResponse.subscriptionId) {
        throw new Error("Failed to create subscription");
      }


      const paymentRequest = {
  userId: Number(userId),
  subscriptionId: Number(subscriptionResponse.subscriptionId),
  amount: Number(paymentData.amount),
  paymentMethod: "card",
  cardDetails: {
    cardNumber: cardDetails.CardNumber,
    cardHolderName: cardDetails.CardHolderName,
    cvv: cardDetails.Cvv,
  },
  couponCode: paymentData.couponCode || ""
};

      // Choose one of these options based on your preference:
      // Option 1: Send via email



const userData = JSON.parse(localStorage.getItem("userData") || "{}");

const registrationData = JSON.parse(
  localStorage.getItem("registrationData") || "{}"
);

const email =
  userData.email ||
  registrationData.email ||
  "test@gmail.com";


  const paymentResponse = await authService.processPayment(
  paymentRequest,
  "email",
  email
);
      

      // if (paymentResponse.paymentStatus === "success") {
    if (paymentResponse && paymentResponse.success === true) { 
        setCardPaymentStatus("success");
        
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
      setCardPaymentStatus("default");
      
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
  //   if (cardPaymentStatus === "success") {
  //     const timer = setTimeout(() => {
  //       navigate(URL_PATH.NetPurchaseDetails);
  //     }, 900);
  //     return () => clearTimeout(timer);
  //   }
  // }, [cardPaymentStatus, navigate]);

  const showPaymentStatus = (status: "default" | "loading" | "success") => {
    if (status === "loading") {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <CircularProgress />
          <Box textAlign="center">
            Processing your card payment...
            <br />
            Please don't close the window.
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
      <form noValidate onSubmit={handleSubmit(onCardPay)}>
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
                fontSize: { xs: 20, sm: 22, md: 25 },
              }}
            >
              Card Payment
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
                options={[{ label: "Debit / Credit Card", value: "credit-card" }]}
                label=""
                sx={radioStyle}
              />

              <Box display="flex" alignItems="center" gap={2} mt={1}>
                <Box flex={1}>
                  <TextInputField
                    label="Card Number"
                    name="CardNumber"
                    inputType="numbers"
                    minLength={13}
                    maxLength={19}
                    rules={{
                      pattern: {
                        value: /^[0-9]{13,19}$/,
                        message: "Invalid Card Number",
                      },
                      required: "Card Number is required",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    flexShrink: 0,
                  }}
                >
                  <CreditCardIcon />
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
                <Box flex={1}>
                  <TextInputField
                    label="Card Holder's Name"
                    name="CardHolderName"
                    inputType="alphabet"
                    minLength={3}
                    maxLength={50}
                    rules={{
                      required: "Card Holder's Name is required",
                    }}
                  />
                </Box>
                <Box sx={{ width: 24, flexShrink: 0 }} />
              </Box>

              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                alignItems="flex-start"
                justifyContent={{ xs: "flex-start", sm: "space-between" }}
                gap={2}
                mt={1}
              >
                <Box width={{ xs: "100%", sm: "auto" }}>
                  <NumericField
                    label="CVV"
                    name="Cvv"
                    required={true}
                    decimal={false}
                    maxlength={3}
                    max={999}
                    min={100}
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={cardPaymentStatus === "loading"}
                  sx={{
                    ...btnStyle,
                    width: { xs: "100%", sm: "auto" },
                    mb: 1,
                  }}
                >
                  Pay
                </Button>
              </Box>

              <Box textAlign="center" mt={2}>
                {showPaymentStatus(cardPaymentStatus)}
              </Box>
            </Paper>
          </Box>
        </Box>
      </form>
    </FormProvider>
  );
}

export default CardPayment;







