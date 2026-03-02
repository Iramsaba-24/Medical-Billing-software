import {Box,Paper,Button,CircularProgress, Typography} from "@mui/material";
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

type UpiFormFields = {
  paymentMethod: "upi";
  UpiId: string;
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

// UPI app icon 
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
  const methods = useForm<UpiFormFields>({
    defaultValues: {
      paymentMethod: "upi",
      UpiId: "",
    },
  });

  const { handleSubmit, control } = methods;
  const navigate = useNavigate();

  // watch UPI ID for live icon detection
  const upiId = useWatch({ control, name: "UpiId" });
  const detectedIcon = getUpiApp(upiId) || "upi";

  // payment status 
const [upiPaymentStatus, setUpiPaymentStatus] = useState <"default" | "loading" | "success">("default");

  const onUpiPay = () => {
    setUpiPaymentStatus("loading");

    setTimeout(() => {
      setUpiPaymentStatus("success");
      navigate(URL_PATH.PaymentSuccess);
    }, 2000);
  };

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
                    backgroundColor: " #F8F9FA",
                    maxWidth: {
                    xs: "100%", 
                    sm: "80%",       
                    md: "70%",      
                    },
                    mx: "auto",     
                }}
            >
              {/* UPI Radio label */}
              <RadioField
                name="paymentMethod"
                options={[{ label: "UPI Payment", value: "upi" }]}
                label=""
                sx={radioStyle}
              />

              {/* UPI ID input n icon */}
              <Box display="flex" alignItems="center" gap={2} mt={1}>
                <Box flex={1}>
                  <TextInputField
                    label="Enter your UPI ID"
                    name="UpiId"
                    inputType="alphanumeric"
                    rules={{
                      required: "UPI ID is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._-]+@(okaxis|oksbi|okhdfcbank|okicici|paytm|ybl|axl|ib|phonepe)$/,
                        message: "Enter valid UPI ID",
                      },
                    }}
                  />
                </Box>

                {/* UPI app icon */}
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
                    <img
                      src={upiIcons[detectedIcon]}
                      width={28}
                      height={28}
                      alt={detectedIcon}
                    />
                  </Box>
                )}
              </Box>

              {/* Pay button */}
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleSubmit(onUpiPay)}
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