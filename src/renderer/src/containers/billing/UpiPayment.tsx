import { Box, Button, Paper, Typography } from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";
import TextInputField from "@/components/controlled/TextInputField";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState } from "react";
import gpayIcon from "@/assets/icons/googlepay.svg";
import paytmIcon from "@/assets/icons/paytm.svg";
import upiIcon from "@/assets/icons/upi.svg";
import phonepeIcon from "@/assets/icons/phonepe.svg";

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


const upiIcons: Record<string, string> = {
  gpay: gpayIcon,
  paytm: paytmIcon,
  upi: upiIcon,
  phonepe: phonepeIcon,
};

const getUpiApp = (upiId?: string) => {
  if (!upiId) return null;

  const id = upiId.toLowerCase();

  if (["@okaxis", "@oksbi", "@okhdfcbank", "@okicici"].some((v) => id.includes(v)))
    return "gpay";

  if (id.includes("@paytm"))
    return "paytm";

  if (["@ybl", "@axl", "@ibl"].some((v) => id.includes(v)))
    return "phonepe";

  return "upi";
};

type Props = {
  finalAmount: number;
  onSuccess: () => void;
};

const UpiPayment = ({ finalAmount, onSuccess }: Props) => {
  const [status, setStatus] = useState<"default" | "loading" | "success">("default");
  const { handleSubmit, control } = useFormContext();
  const paymentMethod = useWatch({
  control,
  name: "paymentMethod",
});

  const onPay = () => {

    setStatus("loading");

    setTimeout(() => {

      setStatus("success");

      onSuccess(); 

    }, 2000);
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
          <CheckCircleIcon
            sx={{ color: "success.main", fontSize: { xs: 44, sm: 60 } }}
          />

          <Box fontWeight={700}>Successful ₹{finalAmount}</Box>
        </Box>
      );
    }

    return null;
  };

  const upiId = useWatch({
    control,
    name: "UpiId",
  });

  const detectedIcon = getUpiApp(upiId) || "upi"; 

  return (
    <Paper sx={PaperStyle}>
            <Typography 
      fontSize={{xs:16, md:18}} 
      mb={2}
      fontWeight={600}>
        UPI Payment
      </Typography>

      <Box display="flex" flexDirection="column" gap={1}>

        <Box display="flex" alignItems="center" gap={2}>
          <Box flex={1}>
            <TextInputField
              label="Enter your UPI ID"
              name="UpiId"
              disabled={paymentMethod !== "upi"}
              inputType="alphanumeric"
              rules={{
                required: paymentMethod === "upi" ? "UPI ID is required" : false,
                pattern: {
                  value:
                    /^[a-zA-Z0-9._-]+@(okaxis|oksbi|okhdfcbank|okicici|paytm|ybl|axl|ibl|phonepe)$/,
                  message: "Enter valid UPI ID",
                },
              }}
            />
          </Box>

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
              }}
            >
              <img
                src={upiIcons[detectedIcon]}
                width={28}
                height={28}
              />
            </Box> 
          )}
        </Box>

        <Box display="flex" justifyContent="flex-end">
          <Button
            type="button"
            variant="contained"
            onClick={handleSubmit(onPay)}
            disabled={paymentMethod !== "upi"}
            sx={{
              ...btnStyle,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Pay ₹{finalAmount}
          </Button>
        </Box>

        <Box textAlign="center">
          {showPaymentStatus()}
        </Box>

      </Box>
    </Paper>
  );
};

export default UpiPayment;