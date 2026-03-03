import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import TextInputField from "@/components/controlled/TextInputField";
import BgImage from "@/assets/bgloginpage.svg";
import LogoImage from "@/assets/logoimg.svg";

import { showToast } from "@/components/uncontrolled/ToastMessage";

type FormValues = {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branch: string;
  ifsc: string;
};

const ReceiverDetails = () => {
  const navigate = useNavigate();

  const methods = useForm<FormValues>({
    defaultValues: {
      bankName: "",
      accountNumber: "",
      accountHolderName: "",
      branch: "",
      ifsc: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: FormValues) => {
    localStorage.setItem("paymentDetails", JSON.stringify(data));
    showToast("success", "Saved Successfully");
    navigate(""); 
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        backgroundImage: `url(${BgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <FormProvider {...methods}>
        <Box
          component="form"
          noValidate
          onSubmit={methods.handleSubmit(onSubmit)}
          sx={{ width: "100%", maxWidth: 800, textAlign: "center" }}
        >
          {/* Logo */}
          <img
            src={LogoImage}
            style={{ width: "100%", maxWidth: "140px", marginBottom: "5px" }}
          />

          {/* Title */}
          <Typography
            sx={{
              fontSize: { xs: "18px", sm: "20px", md: "22px" },
              mb: 1,
            }}
          >
            Net Banking Payment
          </Typography>

          {/* Card */}
          <Card
            sx={{
              width: "100%",
              maxWidth: 700,
              mx: "auto",
              borderRadius: "8px",
              border: "0.5px solid #9a9a9a",
            }}
          >
            <CardContent sx={{ p: 2 }}>
              {/* Receiver’s Details */}
              <Typography sx={{ textAlign: "left", mb: 1, fontSize: "15px" }}>
                Receiver's Details
              </Typography>

              {/* Bank Name */}
              <Box mb={1}>
                <TextInputField
                  name="bankName"
                  label="Bank Name"
                  required
                  inputType="alphabet"
                  maxLength={50}
                />
              </Box>

              {/* Account Number */}
              <Box mb={1}>
                <TextInputField
                  name="accountNumber"
                  label="Bank Account Number"
                  required
                  maxLength={13}
                  minLength={9}
                  rules={{
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Only numbers allowed",
                    },
                  }}
                />
              </Box>

              {/* Holder Name */}
              <Box mb={1}>
                <TextInputField
                  name="accountHolderName"
                  label="Account Holder Name"
                  required
                  inputType="alphabet"
                  maxLength={60}
                />
              </Box>

              {/* Branch and IFSC */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mb: 2,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Box flex={1}>
                  <TextInputField
                    name="branch"
                    label="Branch"
                    required
                    inputType="alphabet"
                    maxLength={40}
                  />
                </Box>

                <Box flex={1}>
                  <TextInputField
                    name="ifsc"
                    label="IFSC"
                    required
                    maxLength={11}
                    rules={{
                      pattern: {
                        value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                        message: "Invalid IFSC",
                      },
                    }}
                    inputProps={{
                      style: { textTransform: "uppercase" },
                    }}
                  />
                </Box>
              </Box>

              {/* Button */}
              <Box textAlign="right">
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#238878",
                    textTransform: "none",
                    minWidth: { xs: "100%", sm: "110px" },
                    height: "38px",
                    border: "2px solid #238878",
                    "&:hover": {
                      backgroundColor: "#fff",
                      color: "#238878",
                    },
                  }}
                >
                  Pay
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default ReceiverDetails;
