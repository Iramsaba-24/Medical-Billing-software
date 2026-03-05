// NetBanking_PurchaseDetails


import { useForm, FormProvider } from "react-hook-form";
import { Box, Button, Typography } from "@mui/material";
import BgImage from "@/assets/bgloginpage.svg";
import LogoImage from "@/assets/logoimg.svg";
import TextInputField from "@/components/controlled/TextInputField";
import EmailField from "@/components/controlled/EmailField";
import RadioField from "@/components/controlled/RadioField";
import { showToast } from "@/components/uncontrolled/ToastMessage";
import MobileField from "@/components/controlled/MobileField";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";


type FormInputs = {
  amount: string;
  billType: "email" | "whatsapp";
  email?: string;
  whatsapp?: string;
};

const NetBanking_PurchaseDetails = () => {
  const methods = useForm<FormInputs>({
    defaultValues: {
      amount: "",
      billType: "email",
      email: "",
      whatsapp: "",
    },
    mode: "onSubmit", 
  });

  const selectedBillType = methods.watch("billType");

  const navigate = useNavigate();
  const onSubmit = (data: FormInputs) => {
    console.log("Form Data:", data);
    showToast("success", "Payment initiated successfully!");
    navigate(URL_PATH.PaymentSuccess);
  };



  return (
    
     <Box 

    
      sx={{
         //minHeight: "100vh",
          minHeight: "110vh",
          display: "flex",
        backgroundImage: `url(${BgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        flexDirection: "column",
        alignItems: "center",

         
       
      }}
    > 

      {/* Logo */}
      <Box textAlign="center">
        <img src={LogoImage} alt="logo" style={{ width: 170 }} />
      </Box>

      {/* Heading */}
      <Typography
        variant="h4"
        sx={{
          mt: 2,
          mb: 4,
          fontWeight: 500,
          fontFamily: '"Poppins", sans-serif',
        }}
      >
        Net Banking Payment
      </Typography>

      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={methods.handleSubmit(onSubmit)}noValidate
          sx={{
            //width: "100%",
            maxWidth: 850,
            backgroundColor: "#ffffff", 
            borderRadius: 2,
            boxShadow: "4",
            p: 4,

          }}
          
        >
          {/* Purchase Details */}
          <Typography sx={{ fontWeight: 600, mb: 3 }}>
            Purchase Details
          </Typography>

          {/* Amount Field */}
          <TextInputField
            name="amount"
            label="Amount"
            placeholder="Enter Amount"
            fullWidth
           required
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#f9f9f9",
              },
            }}
          />

          {/* Radio Buttons */}
          <RadioField
            name="billType"
            label=""
            
            options={[
              { value: "email", label: "Send E-Bill on your Email ID" },
              { value: "whatsapp", label: "Send E-Bill on your WhatsApp" },
            ]}
            sx={{ mb: 2 }}
          />

          {/* Conditional Email Field */}
          {selectedBillType === "email" && (
            <EmailField
              name="email"
              label="Enter Email"
              required
              sx={{
                mt: 1,
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f9f9f9",
                },
              }}
            />
          )}

          {/* Conditional WhatsApp Field */}
          {selectedBillType === "whatsapp" && (
            <MobileField
              name="whatsapp"
              label="Whatsapp Number"
              placeholder="Enter WhatsApp Number"
              required
              fullWidth
              sx={{
                mt: 1,
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f9f9f9",
                },
              }}
            />
          )}

          {/* Bottom Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {/* Warning Box */}
            <Box
              sx={{
                backgroundColor: "#F8E7A1",
                px: 3,
                py: 1.5,
                borderRadius: 1,
                fontSize: "0.9rem",
              }}
            >
              ⚠ When payment is done, E-Bill will be sent to your selected Email / WhatsApp
            </Box>

            {/* Pay Button */}
            <Button
              type="submit"
              variant="contained"
              //onClick={onSubmit}
              sx={{
                backgroundColor: "#2c8a74",
                px: 5,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#246f5e",
                },
              }}
            >
              Pay
            </Button>
          </Box>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default NetBanking_PurchaseDetails;