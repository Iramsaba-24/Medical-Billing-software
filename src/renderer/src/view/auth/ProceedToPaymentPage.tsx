import { useForm, FormProvider, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Typography,
  Collapse,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import BgImage from "@/assets/bgloginpage.svg";
import LogoImage from "@/assets/logoimg.svg";
import { URL_PATH } from "@/constants/UrlPath";

type PaymentFormInputs = {
  paymentMethod: string;
  coupon: string;
};

const ProceedToPaymentPage = () => {
  const methods = useForm<PaymentFormInputs>({
    defaultValues: {
      paymentMethod: "",
      coupon: "",
    },
    mode: "onChange",
  });

  const navigate = useNavigate();

  const {
    watch,
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = methods;

  const selectedMethod = watch("paymentMethod");

  const onSubmit = (data: PaymentFormInputs) => {
    console.log("Payment Data:", data);
    navigate(URL_PATH.LOGIN);
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
          {/* Logo */}
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

          {/* Title */}
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

          {/* Payment Methods */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mb: 2,
            }}
          >
            <Typography sx={{ fontWeight: 500 }}>Payment Method</Typography>

            <FormControl fullWidth error={!!errors.paymentMethod}>
              <Controller
                name="paymentMethod"
                control={control}
                rules={{ required: "Please select payment method" }}
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <FormControlLabel
                      value="upi"
                      control={
                        <Radio
                          sx={{
                            color: "grey.500",
                            "&.Mui-checked": {
                              color: "#238878",
                            },
                          }}
                        />
                      }
                      label="UPI"
                    />
                    <FormControlLabel
                      value="card"
                      control={
                        <Radio
                          sx={{
                            color: "grey.500",
                            "&.Mui-checked": {
                              color: "#238878",
                            },
                          }}
                        />
                      }
                      label="Credit / Debit Card"
                    />
                    <FormControlLabel
                      value="netbanking"
                      control={
                        <Radio
                          sx={{
                            color: "grey.500",
                            "&.Mui-checked": {
                              color: "#238878",
                            },
                          }}
                        />
                      }
                      label="Net Banking"
                    />
                    <FormControlLabel
                      value="gateway"
                      control={
                        <Radio
                          sx={{
                            color: "grey.500",
                            "&.Mui-checked": {
                              color: "#238878",
                            },
                          }}
                        />
                      }
                      label="Razorpay / Stripe"
                    />
                    <FormControlLabel
                      value="coupon"
                      control={
                        <Radio
                          sx={{
                            color: "grey.500",
                            "&.Mui-checked": {
                              color: "#238878",
                            },
                          }}
                        />
                      }
                      label="Apply Coupon Code (Optional)"
                    />
                  </RadioGroup>
                )}
              />

              <FormHelperText>{errors.paymentMethod?.message}</FormHelperText>
            </FormControl>

            {/* Coupon Field */}
            <Collapse in={selectedMethod === "coupon"}>
              <TextField
                fullWidth
                placeholder="Enter coupon code"
                {...register("coupon")}
                sx={{
                  mt: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
              />
            </Collapse>
          </Box>

          {/* Amount Box */}
          <Box sx={{ width: "100%", mb: 2 }}>
            <Typography sx={{ fontWeight: 500, mb: 1 }}>
              Total Amount Display
            </Typography>

            <Box
              sx={{
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 3,
                borderRadius: "12px",
                backgroundColor: "#fff",
                border: "3px solid #1b7f6b",
                fontSize: "20px",
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            ></Box>
          </Box>

          {/* Submit Button */}
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
              border: "2px solid #1b7f6b",
              boxShadow: "0 0 0 1.5px #ffffff, 0 6px 14px rgba(0,0,0,0.25)",
              transition: "all 0.25s ease",
              "&:hover": {
                backgroundColor: "#fff",
                color: "#1b7f6b",
              },
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
