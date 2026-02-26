import { Box, Button, Typography, InputAdornment, IconButton,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import BgImage from "@/assets/bgloginpage.svg";
import LogoImage from "@/assets/logoimg.svg";   
import TextInputField from "@/components/controlled/TextInputField";
import CheckboxGroup from "@/components/controlled/CheckboxGroup";

type AccountForm = {
  password: string;
  confirmPassword: string;
  checkbox: string[];
};

const AccountSetup = () => {
  const methods = useForm<AccountForm>({
    defaultValues: {
      password: "",
      confirmPassword: "",
      checkbox: [],
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = (data: AccountForm) => {
    console.log(data);
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
          onSubmit={methods.handleSubmit(onSubmit)}
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            px: 2,
          }}
        >
          {/* Logo */}
          <img src={LogoImage} style={{ width: "100%", maxWidth: "170px" }} />

          {/* Title */}
          <Typography
            sx={{
              fontSize: { xs: "1.5rem", sm: "1.7rem" },
              mb: 1,
            }}
          >
            Account Setup
          </Typography>

          {/* Password */}
          <Box sx={{ width: "100%", maxWidth: 420 }}>
            <TextInputField
              name="password"
              label="Create Password"
              type={showPassword ? "text" : "password"}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                validate: (value: string) => {
                  if (!/[A-Z]/.test(value))
                    return "Add at least one capital letter (A-Z)";
                  if (!/[a-z]/.test(value))
                    return "Add at least one small letter (a-z)";
                  if (!/[0-9]/.test(value))
                    return "Add at least one number (0-9)";
                  if (!/[@$_#.*]/.test(value))
                    return "Add at least one special character (@$_#.*)";
                  return true;
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Confirm Password */}
          <Box sx={{ width: "100%", maxWidth: 420 }}>
            <TextInputField
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirm ? "text" : "password"}
              rules={{
                required: "Confirm Password is required",
                validate: (value) => {
                  if (value !== methods.getValues("password"))
                    return "Passwords do not match";
                  return true;
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Checkbox */}
          <Box sx={{ width: "100%", maxWidth: 420, mt: 1 }}>
            <CheckboxGroup
              name="checkbox"
              label=""
              options={[
                {
                  label: "I agree to Terms & Privacy Policy",
                  value: "terms",
                },
                {
                  label: "I want product updates via email (optional)",
                  value: "email",
                },
              ]}
            />
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              maxWidth: 420,
              mt: 1.5,
              height: 45,
              background: "#2c8a7b",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1,
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              "&:hover": {
                background: "#fff",
                color: "#2c8a7b",
                border: "2px solid #2c8a7b",
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
