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

type CardFormFields = {
  paymentMethod: "credit-card";
  CardNumber: string;
  CardHolderName: string;
  Cvv: string;
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
  const methods = useForm<CardFormFields>({
    defaultValues: {
      paymentMethod: "credit-card",
      CardNumber: "",
      CardHolderName: "",
      Cvv: "",
    },
  });

  
  const { handleSubmit } = methods;
  const navigate = useNavigate();

  // payment status 
  const [cardPaymentStatus, setCardPaymentStatus] = useState<"default" | "loading" | "success"
  >("default");

const onCardPay = () => {
  setCardPaymentStatus("loading");

  setTimeout(() => {
    setCardPaymentStatus("success");
    navigate(URL_PATH.PaymentSuccess);
  }, 1500);
};

  //Status UI 
  const showPaymentStatus = (
    status: "default" | "loading" | "success"
  ) => {
    if (status === "loading") {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={1}
        >
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
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={1}
        >
          <CheckCircleIcon
            sx={{ color: "success.main", fontSize: { xs: 44, sm: 60 } }}
          />
          <Box fontWeight={700}>Payment Successful 🎉</Box>
        </Box>
      );
    }

    return null;
  };



  return (
    <FormProvider {...methods}>
      <form noValidate>
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
            {/* Logo */}
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
                  sm:"80%",
                  md: "70%",
                },
                mx: "auto",
              }}
            >
              {/* Card Radio label */}
              <RadioField
                name="paymentMethod"
                options={[{ label: "Debit / Credit Card", value: "credit-card" }]}
                label=""
                sx={radioStyle}
              />

              {/* Card Number n Icon */}
              <Box display="flex" alignItems="center" gap={2} mt={1}>
                <Box flex={1}>
                  <TextInputField
                    label="Card Number"
                    name="CardNumber"
                    inputType="numbers"
                    minLength={13}
                    maxLength={19}
                    rules={{
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

              {/* Card Holder Name */}
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

              {/* CVV n Pay button */}
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
                  />
                </Box>

                <Button
                  type="button"
                  variant="contained"
                  onClick={handleSubmit(onCardPay)}
                  disabled={cardPaymentStatus === "loading"}
                  sx={{
                    ...btnStyle,
                    width: { xs: "100%", sm: "auto" },
                    mb: 1,
                  }}
                //   onClick={handleSubmit}
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