import { useForm, FormProvider, useWatch } from "react-hook-form";
import { Paper, Box, Button } from "@mui/material";
import RadioField from "@/components/controlled/RadioField";
import NumericField from "@/components/controlled/NumericField";
import TextInputField from "@/components/controlled/TextInputField";
import gpayIcon from "@/assets/icons/googlepay.svg";
import paytmIcon from "@/assets/icons/paytm.svg";
import upiIcon from "@/assets/icons/upi.svg";
import phonepeIcon from "@/assets/icons/phonepe.svg";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState } from "react";


type PaymentMethods = {
  paymentMethod: "credit-card" | "upi";
  CardNumber?: string;
  CardHolderName?: string;
  Cvv?: string;
  UpiId?: string;
};

const PaperStyle = {
  borderRadius: 2,
  p: { xs: 1, sm: 2 },
  mb: 1,
};

const radioStyle = {
  "& .MuiRadio-root": {
    color: "default.main",
    "&.Mui-checked": {
      color: "#238878",
    },
  },
};

const btnStyle = {
  backgroundColor: "#238878",
  height: 40,
  minWidth: 80,
  color: "#fff",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#fff",
    color: "#238878",
    borderColor: "#238878",
  },
};

const PaymentMethod = () => {

  const methods = useForm<PaymentMethods>({
    defaultValues: {
      paymentMethod: "credit-card",
    },
  });

  const { handleSubmit } = methods;

  const upiId = useWatch({
    control: methods.control,
    name: "UpiId",
  });

  const payment = useWatch({
    control: methods.control,
    name: "paymentMethod",
  });

  const [cardStatus, setCardStatus] = useState<
    "default" | "loading" | "success"
  >("default");

  const [upiStatus, setUpiStatus] = useState<
    "default" | "loading" | "success"
  >("default");

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

    if (id.includes("@ybl") || id.includes("@axl") || id.includes("@ibl"))
      return "phonepe";

    return null;
  };

  const detectedIcon = getUpiApp(upiId) || "upi";

  const upiIcons: Record<string, string> = {
    gpay: gpayIcon,
    paytm: paytmIcon,
    upi: upiIcon,
    phonepe: phonepeIcon,
  };

 const saveFinalInvoice = () => {
  const savedInvoice = localStorage.getItem("currentRetailInvoice");
  if (!savedInvoice) return;

  const invoiceData = JSON.parse(savedInvoice); // already normalized in step 1

  const existing = JSON.parse(localStorage.getItem("retailInvoices") || "[]");

  localStorage.setItem(
    "retailInvoices",
    JSON.stringify([...existing, ...invoiceData])
  );

  localStorage.removeItem("currentRetailInvoice");
};



  const onCardPay = () => {
    setCardStatus("loading");

    setTimeout(() => {
      setCardStatus("success");
      saveFinalInvoice();
    }, 1500);
  };

  const onUpiPay = () => {
    setUpiStatus("loading");

    setTimeout(() => {
      setUpiStatus("success");
      saveFinalInvoice();
    }, 1500);
  };

  const showPaymentStatus = (
    status: "default" | "loading" | "success"
  ) => {
    if (status === "loading") {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <CircularProgress />
          <Box textAlign="center">
            Waiting for payment confirmation…
          </Box>
        </Box>
      );
    }

    if (status === "success") {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <CheckCircleIcon
            sx={{ color: "success.main", fontSize: 50 }}
          />
          <Box fontWeight={500}>Successful</Box>
        </Box>
      );
    }

    return null;
  };

  return (
    <FormProvider {...methods}>
      <form noValidate>
        <Box sx={{ border: "1px solid #ccc", p: 3, bgcolor: "#fff" }}>
          
          {/* CARD */}
          <Paper sx={PaperStyle}>
            <RadioField
              name="paymentMethod"
              options={[{ label: "Debit / Credit Card", value: "credit-card" }]}
              label=""
              sx={radioStyle}
            />

            <TextInputField
              label="Card Number"
              name="CardNumber"
              disabled={payment === "upi"}
              rules={{
                required:
                  payment === "credit-card"
                    ? "Card Number is required"
                    : false,
              }}
            />

            <TextInputField
              label="Card Holder Name"
              name="CardHolderName"
              disabled={payment === "upi"}
            />

            <NumericField
              label="CVV"
              name="Cvv"
              disabled={payment === "upi"}
            />

            <Button
              variant="contained"
              onClick={handleSubmit(onCardPay)}
              disabled={payment === "upi"}
              sx={btnStyle}
            >
              Pay
            </Button>

            {showPaymentStatus(cardStatus)}
          </Paper>

          {/* UPI */}
          <Paper sx={PaperStyle}>
            <RadioField
              name="paymentMethod"
              options={[{ label: "UPI Payment", value: "upi" }]}
              label=""
              sx={radioStyle}
            />

            <TextInputField
              label="Enter your UPI ID"
              name="UpiId"
              disabled={payment === "credit-card"}
            />

            {upiIcons[detectedIcon] && (
              <Box mt={1}>
                <img src={upiIcons[detectedIcon]} width={32} />
              </Box>
            )}

            <Button
              variant="contained"
              onClick={handleSubmit(onUpiPay)}
              disabled={payment === "credit-card"}
              sx={btnStyle}
            >
              Pay
            </Button>

            {showPaymentStatus(upiStatus)}
          </Paper>
        </Box>
      </form>
    </FormProvider>
  );
};

export default PaymentMethod;