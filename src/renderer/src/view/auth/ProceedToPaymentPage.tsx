import { useForm, FormProvider } from "react-hook-form";
import {
  Box,
  Button,
  Typography,
  Collapse,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import BgImage from "@/assets/bgloginpage.svg";
import LogoImage from "@/assets/logoimg.svg";
import RadioField from "@/components/controlled/RadioField";
import TextInputField from "@/components/controlled/TextInputField";
import CheckboxGroup from "@/components/controlled/CheckboxGroup";

type PaymentFormInputs = {
  paymentMethod: string;
  couponApply: string[];
  couponCode: string;
  amount: string;
};

const ProceedToPaymentPage = () => {
  const methods = useForm<PaymentFormInputs>({
    defaultValues: {
      paymentMethod: "",
      couponApply: [],
      couponCode: "",
      amount: "",
    },
    mode: "onChange",
  });

  const navigate = useNavigate();

  const { watch, handleSubmit } = methods;

  const couponSelected = watch("couponApply")?.includes("applyCoupon");

  const onSubmit = (data: PaymentFormInputs) => {
    console.log("Payment Data:", data);

    if (data.paymentMethod === "upi") {
      navigate("/upi-payment");
    } 
    else if (data.paymentMethod === "card") {
      navigate("/card-payment");
    } 
    else if (data.paymentMethod === "netbanking") {
      navigate("/netbanking-payment");
    } 
    else if (data.paymentMethod === "gateway") {
      navigate("/gateway-payment");
    } 
    else {
      alert("Please select payment method");
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

          {/* Payment Method */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mb: 2,
            }}
          >
            <RadioField
              name="paymentMethod"
              label="Payment Method"
              required
              options={[
                { value: "upi", label: "UPI" },
                { value: "card", label: "Credit / Debit Card" },
                { value: "netbanking", label: "Net Banking" },
                { value: "gateway", label: "Razorpay / Stripe" },
              ]}
            />
          </Box>

          {/* Coupon Checkbox */}
          <Box sx={{ width: "100%", mb: 1 }}>
            <CheckboxGroup
              name="couponApply"
              label=""
              options={[
                { value: "applyCoupon", label: "Apply Coupon Code" },
              ]}
            />
          </Box>

          {/* Coupon Input */}
          <Collapse in={couponSelected}>
            <Box sx={{ width: "100%", mb: 2 }}>
              <TextInputField
                name="couponCode"
                label="Coupon Code"
                placeholder="Enter coupon code"
                inputType="alphanumeric"
              />
            </Box>
          </Collapse>

          {/* Amount Input */}
          <Box sx={{ width: "100%", mb: 2 }}>
            <TextInputField
              name="amount"
              label="Total Amount"
              required
              inputType="alphanumeric"
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 1,
              fontWeight: "1000",
              fontSize: { xs: "1rem", sm: "1.05rem" },
              backgroundColor: "#1b7f6b",
              textTransform: "none",
            }}
          >
            Register & Proceed to Payment
          </Button>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default ProceedToPaymentPage;