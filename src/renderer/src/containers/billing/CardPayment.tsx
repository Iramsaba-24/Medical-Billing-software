import { Box, Button, Paper, Typography } from "@mui/material";
import { useFormContext} from "react-hook-form"; 
import TextInputField from "@/components/controlled/TextInputField";
import NumericField from "@/components/controlled/NumericField";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState } from "react";

const PaperStyle = {
  borderRadius: 2,
  p: { xs: 1, sm: 2 },
  mb: 1,
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
};

type Props = {
  finalAmount: number;
  onSuccess: () => void;
};

const CardPayment = ({ finalAmount, onSuccess }: Props) => {

  const { handleSubmit } = useFormContext();

  const [status, setStatus] =
    useState<"default" | "loading" | "success">("default");

  const onPay = () => {

    setStatus("loading");

    setTimeout(() => {

      setStatus("success");

      onSuccess();   // parent logic call

    }, 1500);
  };

  const showPaymentStatus = () => {
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
          <CheckCircleIcon sx={{ color: "success.main", fontSize: { xs: 44, sm: 60 } }} />
          <Box fontWeight={700}>Successful ₹{finalAmount}</Box>
        </Box>
      );
    }

    return null;
  };

  return (
    <Paper sx={PaperStyle}>
      <Typography 
      fontSize={{xs:16, md:18}} 
      mb={2}
      fontWeight={600}>
        Debit / Credit Card Payment
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>

        <Box display="flex" flexDirection={{ xs: "row", sm: "row" }} alignItems={{ xs: "stretch", sm: "center" }} gap={2}>

          <Box flex={1}>
            <TextInputField
              label="Card Number"
              name="CardNumber"
 
              inputType="numbers"
              minLength={13}
              maxLength={19}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
            <CreditCardIcon />
          </Box>

        </Box>

        <Box display="flex" gap={2} alignItems="center">

          <Box flex={1}>
            <TextInputField
              label="Card Holder Name"
              name="CardHolderName"

              inputType="alphabet"
              minLength={3}
              maxLength={50}
            />
          </Box>
 
          <Box sx={{ width: 24, display: { xs: "none", sm: "block" } }} />

        </Box>

        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} alignItems="flex-start" justifyContent={{ xs: "flex-start", sm: "space-between" }} gap={2}>

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
            type="button"
            variant="contained"
            onClick={handleSubmit(onPay)}
            sx={{
              ...btnStyle,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Pay ₹{finalAmount}
          </Button>

        </Box>

        <Box textAlign="center">{showPaymentStatus()}</Box>

      </Box>
    </Paper>
  );
};

export default CardPayment;


