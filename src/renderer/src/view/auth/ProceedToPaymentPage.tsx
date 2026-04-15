import { useForm, FormProvider } from "react-hook-form";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoImage from "@/assets/logoimg.svg";
import BgImage from "@/assets/bgloginpage.svg";
import TextInputField from "@/components/controlled/TextInputField";
import RadioField from "@/components/controlled/RadioField";
import { URL_PATH } from "@/constants/UrlPath";
import { showToast } from "@/components/uncontrolled/ToastMessage";
// import { useEffect } from "react";
type PaymentFormInputs = {
  paymentMethod: string;
  amount: string;
};
const radioStyle = {
  "& .MuiRadio-root": {
    color: "default.main",
    "&.Mui-checked": {
      color: "#238878",
    },
  },
};
// const selectedAmount = localStorage.getItem("selectedAmount") || "";

const ProceedToPaymentPage = () => {
  const methods = useForm<PaymentFormInputs>({
    defaultValues: {
      paymentMethod: "",
      amount: "",
    },
    mode: "onChange",
  });

//   useEffect(() => {
//   const amount = localStorage.getItem("selectedAmount");
//   console.log("Fetched Amount:", amount); 

//   if (amount) {
//     methods.setValue("amount", amount);
//   }
// }, [methods]);

  const navigate = useNavigate();
  const { handleSubmit } = methods;

  const handleAmountInput = (event: React.FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;

    let value = input.value.replace(/[^0-9]/g, "");

    if (value.length > 4) {
      value = value.slice(0, 4);
    }

    input.value = value;
  };

  const onSubmit = (data: PaymentFormInputs) => {
    console.log("Payment Data:", data);

    // Store payment data in localStorage
    const userId = localStorage.getItem('userId');
    const selectedPlan = localStorage.getItem('selectedPlan');

    // Validate required data
    if (!userId) {
      showToast("error", "User not found. Please register again.");
      navigate(URL_PATH.REGISTER);
      return;
    }

    if (!selectedPlan) {
      showToast("error", "Plan not selected. Please start over.");
      navigate(URL_PATH.ChoosePlan);
      return;
    }

    // Map plan to planId (you can also fetch from API)
    const planMapping: Record<string, number> = {
      'basic': 1,
      'standard': 2,
      'premium': 3
    };

    const paymentData = {
      userId: userId ? parseInt(userId) : 0,
      amount: parseFloat(data.amount),
      paymentMethod: data.paymentMethod,
      planId: planMapping[selectedPlan] || 1,
      couponCode: ''
    };

    localStorage.setItem('paymentData', JSON.stringify(paymentData));

    if (data.paymentMethod === "upi") {
      navigate(URL_PATH.UpiPayment);
    } else if (data.paymentMethod === "card") {
      navigate(URL_PATH.CardPayment);
    } else if (data.paymentMethod === "netbanking") {
      navigate(URL_PATH.NetBanking);
    } else {
      showToast("error", "Please select payment method");
    }
  };

  return (
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
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            width: "100%",
            maxWidth: { xs: 360, sm: 420, md: 460 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box mb={{ xs: 1, sm: 1.5 }}>
            <img
              src={LogoImage}
              alt="Medi Logo"
              style={{
                width: "100%",
                maxWidth: "150px",
                height: "auto",
              }}
            />
          </Box>

          <Typography
            mb={{ xs: 2.5, sm: 3 }}
            sx={{
              color: "#333",
              fontWeight: 600,
              fontFamily: '"Poppins", sans-serif',
              fontSize: { xs: "1.4rem", sm: "1.7rem", md: "1.9rem" },
              textAlign: "center",
            }}
          >
            Payment Details
          </Typography>

          <Box sx={{ width: "100%", mb: 3 }}>
            <RadioField
              name="paymentMethod"
              label="Payment Method"
              options={[
                { value: "upi", label: "UPI" },
                { value: "card", label: "Credit / Debit Card" },
                { value: "netbanking", label: "Net Banking" },
              ]}
              sx={{
                ...radioStyle,
                mb: 2,
                "& .MuiFormLabel-root": {
                  color: "#000 !important",
                },
                "& .MuiFormLabel-root.Mui-focused": {
                  color: "#000 !important",
                },
                "& .MuiFormLabel-asterisk": {
                  display: "none",
                },
              }}
            />
          </Box>

          <Box sx={{ width: "100%", mb: 3 }}>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "1rem",
                color: "#333",
                mb: 1,
              }}
            >
              Total Amount
            </Typography>

            <TextInputField
              name="amount"
              label=""
              placeholder="Enter total amount"
              // disabled={true}
              rules={{
                required: "Amount is required",
                pattern: {
                  value: /^[0-9]{1,4}$/,
                  message: "Only numbers allowed (max 4 digits)",
                },
              }}
              inputProps={{
                inputMode: "numeric",
                onInput: handleAmountInput,
                maxLength: 4,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f4f4f4",
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "#2a9d8f",
                    borderWidth: "2px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#2a9d8f",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#2a9d8f",
                  },
                },
              }}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: { xs: 3, sm: 5 },
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
              },
            }}
          >
            Proceed to Payment
          </Button>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default ProceedToPaymentPage;
