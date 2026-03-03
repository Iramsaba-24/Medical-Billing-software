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
import { showToast } from "@/components/uncontrolled/ToastMessage";

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
      showToast("success", "Register and proceed to payment!");
    

    if (data.paymentMethod === "upi") {
      navigate(URL_PATH.UpiPayment);
    } 
    else if (data.paymentMethod === "card") {
      navigate(URL_PATH.CardPayment);
    } 
    else if (data.paymentMethod === "netbanking") {
      navigate(URL_PATH.NetBanking);
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
                    <FormControlLabel value="upi" control={<Radio />} label="UPI" />
                    <FormControlLabel value="card" control={<Radio />} label="Credit / Debit Card" />
                    <FormControlLabel value="netbanking" control={<Radio />} label="Net Banking" />
                  </RadioGroup>
                )}
              />
              <FormHelperText>{errors.paymentMethod?.message}</FormHelperText>
            </FormControl>

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
            >
            </Box>
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
            Register & Proceed to Payment
          </Button>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default ProceedToPaymentPage;