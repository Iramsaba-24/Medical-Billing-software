import { useForm, FormProvider, useWatch } from "react-hook-form";
import { Paper, Box, Button } from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import RadioField from "@/components/controlled/RadioField";
import NumericField from "@/components/controlled/NumericField";
import TextInputField from "@/components/controlled/TextInputField";
import gpayIcon from "@/assets/icons/googlepay.svg";
import paytmIcon from "@/assets/icons/paytm.svg";
import upiIcon from "@/assets/icons/upi.svg";
import phonepeIcon from "@/assets/icons/phonepe.svg";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect, useState } from "react";
import InvoiceTabButtons from "./InvoiceTabButtons";

// form fields
type PaymentMethods = {
  paymentMethod: "credit-card" | "upi";
  CardNumber?: string;
  CardHolderName?: string;
  Cvv?: string;
  UpiId?: string;
};

// paper style of card and upi
const PaperStyle = {
  borderRadius: 2,
  p: { xs: 1, sm: 2 },
  mb: { sx: 1 },
};

// radio btn style
const radioStyle = {
  "& .MuiRadio-root": {
    color: "default.main",
    "&.Mui-checked": {
      color: "#238878",
    },
  },
};

//btn style
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
};

// component
const PaymentMethod = () => {
  const methods = useForm<PaymentMethods>({
    defaultValues: {
      paymentMethod: "credit-card",
    },
    mode: "onChange",
  });

  // UPI value watch 
  const upiId = useWatch({
    control: methods.control,
    name: "UpiId",
  });

  // function to get UPI app icons
  const getUpiApp = (upiId?: string) => {
    if (!upiId) return null;

    const id = upiId.toLowerCase();

    // Google Pay
    if (
      id.includes("@okaxis") ||
      id.includes("@oksbi") ||
      id.includes("@okhdfcbank") ||
      id.includes("@okicici")
    ) {
      return "gpay";
    }

    // Paytm
    if (id.includes("@paytm")) {
      return "paytm";
    }

    // phonepe
    if (id.includes("@ybl") || id.includes("@axl") || id.includes("@ibl")) {
      return "phonepe";
    }
    return null;
  };

  // detected icon
  const detecteIcon = getUpiApp(upiId) || "upi";
  //icon
  const upiIcons: Record<string, string> = {
    //utility object-keys type and values type
    gpay: gpayIcon,
    paytm: paytmIcon,
    upi: upiIcon,
    phonepe: phonepeIcon,
  };

  // payment method watch (instant update)
  const payment = useWatch({
    control: methods.control,
    name: "paymentMethod",
  });

  const { handleSubmit } = methods;
  // handle to card payment
  const [CardPaymentStatus, setCardPaymentStatus] = useState<
    "default" | "loading" | "success"
  >("default");
  // handle to upi payment
  const [UpiPaymentStatus, setUpiPaymentStatus] = useState<
    "default" | "loading" | "success"
  >("default");

  const onCardPay = () => {
    setCardPaymentStatus("loading");

    setTimeout(() => {
      setCardPaymentStatus("success");

      const storedInvoice = localStorage.getItem("currentInvoice");
      const storedNewInvoice = localStorage.getItem("currentNewInvoice");

if (storedInvoice) {
  const invoice = JSON.parse(storedInvoice);

  const existingInvoices = JSON.parse(
    localStorage.getItem("invoices") || "[]"
  );

  const RetailInvoice = {
    invoice: `INV-${Date.now()}`,
    name: invoice.name || "Customer",
    date: new Date().toISOString().split("T")[0],
    price: invoice.totalPrice || 0,
    status: "Paid",
  };

  const updated = [RetailInvoice, ...existingInvoices];

  localStorage.setItem("invoices", JSON.stringify(updated));

 localStorage.removeItem("currentInvoice");
}

      if (storedNewInvoice) {
        const newInvoices = JSON.parse(storedNewInvoice);

        const existingRetail = JSON.parse(
          localStorage.getItem("newInvoices") || "[]",
        );

        const updatedRetail = [...existingRetail, ...newInvoices];

        localStorage.setItem("newInvoices", JSON.stringify(updatedRetail));
        localStorage.removeItem("currentNewInvoice");
      }
    }, 1500);
  };

  const onUpiPay = () => {
    setUpiPaymentStatus("loading");

    setTimeout(() => {
      setUpiPaymentStatus("success");

      const storedInvoice = localStorage.getItem("currentInvoice");
      const storednewInvoice = localStorage.getItem("currentNewInvoice");

      if (storedInvoice) {
        const invoice = JSON.parse(storedInvoice);

        const existingSales = JSON.parse(
          localStorage.getItem("invoices") || "[]",
        );

        existingSales.push({
          ...invoice,
          price: invoice.totalPrice,
        });

       localStorage.setItem("invoices", JSON.stringify(existingSales));

        localStorage.removeItem("currentInvoice");
      }

      if (storednewInvoice) {
        const newInvoices = JSON.parse(storednewInvoice);

        const existingRetail = JSON.parse(
          localStorage.getItem("newInvoices") || "[]",
        );

        const updatedRetail = [...existingRetail, ...newInvoices];

        localStorage.setItem("newInvoices", JSON.stringify(updatedRetail));
        localStorage.removeItem("currentNewInvoice");
      }
    }, 2000);
  };

  // function to show the status of payment for upi and card
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
          <CheckCircleIcon
            sx={{ color: "success.main", fontSize: { xs: 44, sm: 60 } }}
          />
          <Box fontWeight={700}>Successful ₹{finalAmount}</Box>
        </Box>
      );
    }

    return null;
  };

  // get final amount from local storage
  const [finalAmount, setFinalAmount] = useState<number>(0);


//  useEffect(() => {
//   const storedInvoice = localStorage.getItem("currentInvoice");
//   const storednewInvoice = localStorage.getItem("currentNewInvoice");

//   if (storedInvoice) {
//     const invoice = JSON.parse(storedInvoice);
//     setFinalAmount(invoice.totalPrice || 0);
//     return;
//   }

//   if (storednewInvoice) {
//     const newInvoices: RetailInvoiceItem[] = JSON.parse(storednewInvoice);

//     const total = newInvoices.reduce(
//       (sum, item) => sum + item.total,
//       0
//     );

//     setFinalAmount(total);
//   }
// }, []);


useEffect(() => {

  const storedInvoice = localStorage.getItem("currentInvoice");
  const storedNewInvoice = localStorage.getItem("currentNewInvoice");

  if (storedInvoice) {
    const invoice = JSON.parse(storedInvoice);
    setFinalAmount(invoice.totalPrice || 0);
    return;
  }

  if (storedNewInvoice) {

    const newInvoices = JSON.parse(storedNewInvoice);

    if (newInvoices.length > 0) {

      const lastInvoice = newInvoices[newInvoices.length - 1];

      setFinalAmount(lastInvoice.totalPrice || 0);

    }

  }

}, []);

  return (
    <FormProvider {...methods}>
      <form noValidate>
       <InvoiceTabButtons/>
          {/* CARD PAYMENT */}
          <Paper sx={PaperStyle}>
            <RadioField
              name="paymentMethod"
              options={[{ label: "Debit / Credit Card", value: "credit-card" }]}
              label=""
              sx={radioStyle}
            />

            <Box
              display="flex"
              flexDirection={{ xs: "row", sm: "row" }}
              alignItems={{ xs: "stretch", sm: "center" }}
              gap={2}
            >
              {/* Card Number */}
              <Box flex={1}>
                <TextInputField
                  label="Card Number"
                  name="CardNumber"
                  disabled={payment === "upi"}
                  inputType="numbers"
                  minLength={13}
                  maxLength={19}
                  rules={{
                    required:
                      payment === "credit-card"
                        ? "Card Number is required"
                        : false,
                  }}
                />
              </Box>

              {/* Icon */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <CreditCardIcon />
              </Box>
            </Box>

            {/* Card holder name */}
            <Box display="flex" gap={2} alignItems="center">
              <Box flex={1}>
                <TextInputField
                  label="Card Holder's Name"
                  name="CardHolderName"
                  disabled={payment === "upi"}
                  inputType="alphabet"
                  minLength={3}
                  maxLength={50}
                  rules={{
                    required:
                      payment === "credit-card"
                        ? "Card Holder's Name is required"
                        : false,
                  }}
                />
              </Box>

              {/* Empty box only for sm+ screens */}
              <Box
                sx={{
                  width: 24,
                  display: { xs: "none", sm: "block" },
                }}
              />
            </Box>

            {/* Cvv */}
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              alignItems="flex-start"
              justifyContent={{ xs: "flex-start", sm: "space-between" }}
              gap={2}
            >
              <Box width={{ xs: "100%", sm: "auto" }}>
                <NumericField
                  label="CVV"
                  name="Cvv"
                  required={payment === "credit-card"}
                  disabled={payment === "upi"}
                  decimal={false}
                  maxlength={3}
                  max={999}
                />
              </Box>

              {/* Pay Button */}
              <Button
                type="submit"
                variant="contained"
                onClick={handleSubmit(onCardPay)}
                disabled={payment === "upi"}
                sx={{
                  ...btnStyle,
                  width: { xs: "100%", sm: "auto" },
                  mb: 1,
                }}
              >
                Pay
              </Button>
            </Box>

            <Box textAlign="center" alignItems={"center"}>
              {showPaymentStatus(CardPaymentStatus)}
            </Box>
          </Paper>

          {/* UPI PAYMENT SECTION */}
          <Paper sx={PaperStyle}>
            <RadioField
              name="paymentMethod"
              options={[{ label: "UPI Payment", value: "upi" }]}
              label=""
              sx={radioStyle}
            />

            <Box display="flex" flexDirection="column" gap={1}>
              <Box display="flex" alignItems="center" gap={2}>
                <Box flex={1}>
                  <TextInputField
                    label="Enter your UPI ID"
                    name="UpiId"
                    inputType="alphanumeric"
                    maxLength={30}
                    disabled={payment === "credit-card"}
                    rules={{
                      required:
                        payment === "upi" ? "UPI ID is required" : false,
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._-]+@(okaxis|oksbi|okhdfcbank|okicici|paytm|ybl|axl|ibl|phonepe)$/,
                        message: "Enter valid UPI ID",
                      },
                    }}
                  />
                </Box>

                {detecteIcon && upiIcons[detecteIcon] && (
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
                    }}
                  >
                    <img src={upiIcons[detecteIcon]} width={28} height={28} />
                  </Box>
                )}
              </Box>

              {/* UPi pay btn */}
              <Box display="flex" justifyContent="flex-end" mt={0}>
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleSubmit(onUpiPay)}
                  disabled={payment === "credit-card"}
                  sx={{ ...btnStyle, width: { xs: "100%", sm: "auto" } }}
                >
                  Pay
                </Button>
              </Box>
              {/* Payment status circular progress*/}
              <Box alignItems="center" textAlign={"center"}>
                {showPaymentStatus(UpiPaymentStatus)}
              </Box>
            </Box>
          </Paper>
        
      </form>
    </FormProvider>
  );
};

export default PaymentMethod;
