import { Box, Card, CardContent, Typography, Button} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import TextInputField from "@/components/controlled/TextInputField";
import BgImage from "@/assets/bgloginpage.svg";
import LogoImage from "@/assets/logoimg.svg";
import RadioField from "@/components/controlled/RadioField";
import { showToast } from "@/components/uncontrolled/ToastMessage";
import { URL_PATH } from "@/constants/UrlPath";

type FormValues = {
  paymentMethod: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branch: string;
  ifsc: string;
};

const radioStyle = {
  "& .MuiRadio-root": {
    color: "default.main",
    "&.Mui-checked": {
      color: "#238878",
    },
  },
};

const NetBanking = () => {
  const navigate = useNavigate();

  const methods = useForm<FormValues>({
    defaultValues: {
      paymentMethod: "netBanking",
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
    navigate(URL_PATH.NetPurchaseDetails);
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
      <FormProvider {...methods} >
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate style={{ width: "100%", maxWidth: 800 }}>
        <Box
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
              
              {/* Net Banking Radio */}
              <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 1 }}>
                <RadioField
                  name="paymentMethod"
                  options={[{ label: "Net Banking", value: "netBanking" }]}
                  label=""
                  sx={radioStyle}
                />
              </Box>

              {/* Bank Name */}
              <Box mb={1}>
                <TextInputField
                  name="bankName"
                  label="Bank Name"
                  required
                  inputType="alphabet"
                  maxLength={30}
                  minLength={3}
                />
              </Box>

              {/* Account Number */}
              <Box mb={1}>

                <TextInputField
                    label="Bank Account Number"
                    name="accountNumber"
                    inputType="numbers"
                    minLength={9}
                    maxLength={18}
                    rules={{
                      pattern: {
                        value: /^[0-9]{9,18}$/,
                        message: "Invalid Account Number",
                      },
                      required: "Account Number is required",
                    }}
                  />
              </Box>

              {/* Account Holder Name */}
              <Box mb={1}>
                <TextInputField
                  name="accountHolderName"
                  label="Account Holder Name"
                  required
                  inputType="alphabet"
                  maxLength={30}
                  minLength={3}
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
                    maxLength={30}
                    minLength={3}
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

              {/* Next Button */}
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
                  Next
                </Button>
              </Box>

            </CardContent>
          </Card>
        </Box>
        </form>
      </FormProvider>
    </Box>
  );
};

export default NetBanking;