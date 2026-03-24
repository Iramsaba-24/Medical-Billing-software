import { Box, Button, Typography, Checkbox, FormControlLabel, FormHelperText,
} from "@mui/material";
import { FormProvider, useForm, Controller } from "react-hook-form";
import BgImage from "@/assets/bgloginpage.svg";
import LogoImage from "@/assets/logoimg.svg";
import { URL_PATH } from "@/constants/UrlPath";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/components/uncontrolled/ToastMessage";
import PasswordField from "@/components/controlled/PasswordField";

type AccountForm = {
  password: string;
  confirmPassword: string;
  terms: boolean;
  emailUpdates: boolean;
};
  const checkboxStyle = {
  "& .MuiCheckbox-root": {
    color: "default.main",
    "&.Mui-checked": {
      color: "#238878",
    },
  },
};

const AccountSetup = () => {

  const methods = useForm<AccountForm>({
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
      terms: false,
      emailUpdates: false,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;



  const navigate = useNavigate();

  const onSubmit = (data: AccountForm) => {
    console.log(data);
    navigate(URL_PATH.ProceedToPaymentPage);
    showToast("success", "Account setup successful!");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${BgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        fontFamily: '"Poppins", sans-serif',
      }}
    >
      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            px: 2,
          }}
        >

          {/* Logo */}
          <img
            src={LogoImage}
            style={{ width: "100%", maxWidth: "160px" }}
          />

          {/* Title */}
          <Typography
            sx={{
              fontSize: { xs: "1.5rem", sm: "1.7rem" },
              mb: 0.5,
            }}
          >
            Account Setup
          </Typography>

          {/* Password */}
          <Box sx={{ width: "100%", maxWidth: 420 }}>
            <PasswordField
              name="password"
              label="Create Password"
              required
              minLength={8}
              maxLength={32}
              showStrengthIndicator={false}
              
            />
          </Box>

          {/* Confirm Password */}
          <Box sx={{ width: "100%", maxWidth: 420 }}>
            <PasswordField
              name="confirmPassword"
              label="Confirm Password"
              required
              confirmFieldName="password"
              showStrengthIndicator={false} 
            />
          </Box>

          {/* Terms Checkbox */}
          <Box sx={{ width: "100%", maxWidth: 420 }}>
            <Controller
              name="terms"
              control={control}
              rules={{ required: "You must accept Terms & Privacy Policy" }}
              render={({ field }) => (
                <>
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value}  />}
                    label="I agree to Terms & Privacy Policy"
                    sx={checkboxStyle}
                  />
                  {errors.terms && (
                    <FormHelperText error>
                      {errors.terms.message}
                    </FormHelperText>
                  )}
                </>
              )}
            />
          </Box>

          {/* Checkbox */}
          <Box sx={{ width: "100%", maxWidth: 420 }}>
            <Controller
              name="emailUpdates"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value}  />}
                  label="I want product updates via email (optional)"
                  sx={checkboxStyle}
                />
              )}
            />
          </Box>

          {/* Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              maxWidth: 420,
              mt: 2,
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

export default AccountSetup;