import { Box, Button, Typography } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import BgImage from "@/assets/bgloginpage.svg";
import LogoImage from "@/assets/logoimg.svg";
import RadioField from "@/components/controlled/RadioField";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import { showToast } from "@/components/uncontrolled/ToastMessage";

type PlanForm = {
  plan: string;
};

const ChoosePlan = () => {
  const methods = useForm<PlanForm>({
    defaultValues: {
      plan: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = (data: PlanForm) => {
    console.log(data);
    navigate(URL_PATH.AccountSetup);
      showToast("success", "Plan selected successfully!");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundImage: `url(${BgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: '"Poppins", sans-serif',
      }}
    >
      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={methods.handleSubmit(onSubmit)}
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 0.5,
            px: 2,
          }}
        >
          {/* Logo */}
          <img
            src={LogoImage}
            style={{
              width: "100%",
              maxWidth: "160px",
            }}
          />

          {/* Title */}
          <Typography
            sx={{
              mt: 0.5,
              mb: 1.5,
              color: "#333",
              fontWeight: 500,
              fontSize: { xs: "1.6rem", sm: "2rem" },
            }}
          >
            Choose Your Plan
          </Typography>

          {/* Radio Options */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: 360,
                ml: { xs: 2, sm: 6, md: 10 },
              }}
            >
              <RadioField
                label=""
                name="plan" 
                required
              
                options={[
                  { label: "Basic Plan -₹999 / month", value: "basic" },
                  { label: "Standard Plan -₹1999 / month", value: "standard" },
                  { label: "Premium Plan -₹2999 / month", value: "premium" },
                ]}
              />
            </Box>
          </Box>

          {/* Updated Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              maxWidth: 420,
              mt: { xs: 3, sm: 5 },
              fontWeight: 600,
              fontSize: { xs: "1rem", sm: "1.05rem" },
              backgroundColor: "#1b7f6b",
              textTransform: "none",
              border: "2px solid #1b7f6b",
              boxShadow:
                "0 0 0 1.5px #ffffff, 0 6px 14px rgba(0,0,0,0.25)",
              transition: "all 0.25s ease",
              "&:hover": {
                backgroundColor: "#fff",
                color: "#1b7f6b",
                border: "2px solid #1b7f6b",
              },
            }}
          >
            Next Step
          </Button>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default ChoosePlan;