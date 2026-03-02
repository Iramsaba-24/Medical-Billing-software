import {
  Box,
  Button,
  Typography,
  InputAdornment,
  IconButton,
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
                    return "Add at least one capital letter";
                  if (!/[a-z]/.test(value))
                    return "Add at least one small letter";
                  if (!/[0-9]/.test(value))
                    return "Add at least one number";
                  if (!/[@$_#.*]/.test(value))
                    return "Add special character";
                  return true;
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
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
                  if (
                    value !== methods.getValues("password")
                  )
                    return "Passwords do not match";
                  return true;
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirm(!showConfirm)
                      }
                    >
                      {showConfirm ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Checkbox */}
          <Box sx={{ width: "100%", maxWidth: 420 }}>
            <CheckboxGroup
              name="checkbox"
              label=""
              options={[
                {
                  label:
                    "I agree to Terms & Privacy Policy",
                  value: "terms",
                },
                {
                  label:
                    "I want product updates via email (optional)",
                  value: "email",
                },
              ]}
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