import { useForm, FormProvider, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoImage from "@/assets/logoimg.svg";
import BgImage from "@/assets/bgloginpage.svg";
import TextInputField from "@/components/controlled/TextInputField";
import { URL_PATH } from "@/constants/UrlPath";

type PaymentFormInputs = {
  paymentMethod: string;
  amount: string;
};

const ProceedToPaymentPage = () => {
  const methods = useForm<PaymentFormInputs>({
    defaultValues: {
      paymentMethod: "",
      amount: "",
    },
    mode: "onChange",
  });

  const navigate = useNavigate();
  const { handleSubmit, control } = methods;

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

    if (data.paymentMethod === "upi") {
      navigate(URL_PATH.UpiPayment);
    } else if (data.paymentMethod === "card") {
      navigate(URL_PATH.CardPayment);
    } else if (data.paymentMethod === "netbanking") {
      navigate(URL_PATH.NetBanking);
    } else {
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

          {/* Heading */}
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
          <Box sx={{ width: "100%", mb: 3 }}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel sx={{ mb: 1, fontWeight: 600, color: "black" }}>
                Payment Method
              </FormLabel>

              <Controller
                name="paymentMethod"
                control={control}
                rules={{ required: "Please select payment method" }}
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <FormControlLabel value="upi" control={<Radio />} label="UPI" />
                    <FormControlLabel
                      value="card"
                      control={<Radio />}
                      label="Credit / Debit Card"
                    />
                    <FormControlLabel
                      value="netbanking"
                      control={<Radio />}
                      label="Net Banking"
                    />
                  </RadioGroup>
                )}
              />
            </FormControl>
          </Box>

          {/* Total Amount Display */}
          <Box sx={{ width: "100%", mb: 3 }}>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "1rem",
                color: "#333",
                mb: 1,
              }}
            >
              Total Amount Display
            </Typography>

            <TextInputField
              name="amount"
              label=""
              required
              maxLength={4}
              placeholder="Enter total amount"
              rules={{
                pattern: {
                  value: /^[0-9]{1,4}$/,
                  message: "Only numbers allowed (max 4 digits)",
                },
              }}
              inputProps={{
                inputMode: "numeric",
                onInput: handleAmountInput,
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

          {/* Submit Button */}
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