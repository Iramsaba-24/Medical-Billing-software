import { useForm, FormProvider } from "react-hook-form";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TextInputField from "@/components/controlled/TextInputField";
import BgImage from "@/assets/bgloginpage.svg";
import LogoImage from "@/assets/logoimg.svg";
import { showToast } from "@/components/uncontrolled/ToastMessage";
import { URL_PATH } from "@/constants/UrlPath";
import { useState } from "react";

type FormInputs = {
  businessType: string;
  gstin: string;
  licenseNumber: string;
};

const BusinessDetails = () => {
  const methods = useForm<FormInputs>({
    defaultValues: {
      businessType: "",
      gstin: "",
      licenseNumber: "",
    },
    mode: "onChange",
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormInputs) => {
    setIsLoading(true);
    
    try {
      // Get registration data from localStorage
      const existingData = JSON.parse(localStorage.getItem('registrationData') || '{}');
      
      // Combine with business details
      const completeData = { 
        ...existingData, 
        businessDetail: {
          businessType: data.businessType,
          gstin: data.gstin,
          licenseNumber: data.licenseNumber
        }
      };
      
      localStorage.setItem('registrationData', JSON.stringify(completeData));
      
      showToast("success", "Business details saved!");
      navigate(URL_PATH.ChoosePlan);
    } catch (error) {
      console.error("Error saving business details:", error);
      showToast("error", "Failed to save business details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
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
          onSubmit={methods.handleSubmit(onSubmit)}
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: 450 },
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            p: { xs: 3, sm: 4 },
          }}
        >
          <Box mb={2} alignSelf="center">
            <img
              src={LogoImage}
              alt="Medi Logo"
              style={{ width: "160px", maxWidth: "100%" }}
            />
          </Box>

          <Typography
            variant="h4"
            mb={{ xs: 3, sm: 4 }}
            sx={{
              color: "#333",
              fontWeight: 400,
              fontFamily: '"Poppins", sans-serif',
              fontSize: { xs: "1.6rem", sm: "2rem" },
              textAlign: "left",
              width: "100%",
            }}
          >
            Business Details
          </Typography>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: { xs: 1.5, sm: 2 },
            }}
          >
            <TextInputField
              name="businessType"
              label="Business Types"
              inputType="alphabet"
              maxLength={40}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#ffffff",
                },
              }}
              required
            />

            <TextInputField
              name="gstin"
              label="GSTIN "
              maxLength={15}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#ffffff",
                },
              }}
              rules={{
                pattern: {
                  value:
                    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/,
                  message: "Enter valid GSTIN (e.g., 22AAAAA0000A1Z5)",
                },
              }}
              required
            />

            <TextInputField
              name="licenseNumber"
              label="License Number (Optional)"
              placeholder="DL-KA-2023-001245"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#ffffff",
                },
              }}
              inputType="all"
              rows={1}
              minLength={15}
              maxLength={20}
            />
          </Box>

          <Button
            type="submit"
            disabled={isLoading}
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
           {isLoading ? "Saving..." : "Next Step"}
          </Button>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default BusinessDetails;
