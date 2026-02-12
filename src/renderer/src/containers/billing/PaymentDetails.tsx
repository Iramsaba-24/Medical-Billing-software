import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";

/* ======================= TextField Styles ======================= */
const inputSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#ffffff",
    height: 44,
    "& input": {
      padding: "10px 14px",
      fontSize: "14px",
    },
    "& fieldset": {
      borderColor: "#9a9a9a",
    },
    "&:hover fieldset": {
      borderColor: "#7d7d7d",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#9a9a9a",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#7a7a7a",
    fontSize: "14px",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#1976d2",
  },
};

type FormValues = {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branch: string;
  ifsc: string;
};

const RetailInvoice: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"new" | "retail">("new");
  const navigate = useNavigate();
  const location = useLocation();

  const methods = useForm<FormValues>({
    defaultValues: {
      bankName: "",
      accountNumber: "",
      accountHolderName: "",
      branch: "",
      ifsc: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data: FormValues) => {
    console.log("FORM DATA:", data);
  };

  return (
  <Box sx={{mx:{xs:-2, md:0.5}}}>
    <FormProvider {...methods}>
      <Button
          onClick={() => {setActiveTab("new");                                                        
            if (location.pathname !== "/settings/pos") { navigate("/settings/pos");}}}                   
          sx={{
            textTransform: "none",      
            px: { xs: 2, sm: 3 },
            height: "38px",
            fontWeight: 500,
            borderRadius: "0px 18px 0px 0px",
            backgroundColor: activeTab === "new" ? "#238878" : "#fff",       
            color: activeTab === "new" ? "#fff" : "#000",                   
            border: activeTab === "new" ? "none" : "1px solid #ccc",        
            "&:hover": {
              backgroundColor: activeTab === "new" ? "#238878" : "#f5f5f5",   
            },
          }}>
          New Invoice
        </Button>

        {/* Retail Invoice */}
          <Button
            onClick={() => {setActiveTab("retail");  
             if (location.pathname !== "/settings/retailinvoice") { navigate("/settings/retailinvoice"); }}}
            sx={{
              textTransform: "none",
              px: { xs: 2, sm: 3 },
              height: "38px",
              fontWeight: 500,
              borderRadius: "0px 18px 0px 0px",
              backgroundColor: activeTab === "retail" ? "#238878" : "#fff",
              color: activeTab === "retail" ? "#fff" : "#000",
              border: activeTab === "retail" ? "none" : "1px solid #ccc",
              "&:hover": {
                backgroundColor: activeTab === "retail" ? "#238878" : "#f5f5f5",
              },
            }}>
            Retail Invoice
          </Button>

      {/* Outer Container */}
      <Box
        sx={{
          border: "1px solid #9a9a9a",
          // minHeight: "90vh",
          bgcolor: "#ffffff",
          px: { xs: 1, sm: 2 },

        }}
      >
        <Card
          sx={{
            mx: "auto",
            my: { xs: 2, md: 4 },
            // width: "100%",
            // maxWidth: 1000,
            borderRadius: 1.5,
            border: "1px solid #9a9a9a",
            boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
            // bgcolor: "#f7f7f7",
          }}
        >
          <CardContent sx={{ px: { xs: 2, sm: 5 }, py:{ xs: 2, md: 4 }}}>
            <Typography fontWeight={600} mb={4}>
              Distributor Bank Details
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Box mb={3}>
                <TextField
                  fullWidth
                  label="Bank Name"
                  sx={inputSx}
                  error={!!errors.bankName}
                  helperText={errors.bankName?.message}
                  {...register("bankName", {
                    required: "Bank Name is required",
                  })}
                />
              </Box>

              <Box mb={3}>
                <TextField
                  fullWidth
                  label="Account Number"
                  sx={inputSx}
                  error={!!errors.accountNumber}
                  helperText={errors.accountNumber?.message}
                  {...register("accountNumber", {
                    required: "Account Number is required",
                  })}
                />
              </Box>

              <Box mb={3}>
                <TextField
                  fullWidth
                  label="Account Holder’s Name"
                  sx={inputSx}
                  error={!!errors.accountHolderName}
                  helperText={errors.accountHolderName?.message}
                  {...register("accountHolderName", {
                    required: "Account Holder Name is required",
                  })}
                />
              </Box>

              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                gap={{ xs: 3, sm: 6 }}
                mb={{ xs: 6, sm: 8 }}
              >
                <TextField
                  fullWidth
                  label="Branch"
                  sx={inputSx}
                  error={!!errors.branch}
                  helperText={errors.branch?.message}
                  {...register("branch", {
                    required: "Branch is required",
                  })}
                />

                <TextField
                  fullWidth
                  label="IFSC"
                  sx={inputSx}
                  error={!!errors.ifsc}
                  helperText={errors.ifsc?.message}
                  {...register("ifsc", {
                    required: "IFSC Code is required",
                  })}
                />
              </Box>

              <Box textAlign="center">
                <Button 
                onClick={()=> navigate (URL_PATH.PaymentMethod)} 
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: "#1f8f7a",
                    px: { xs: 4, sm: 6 },
                    py: 0.9,
                    minHeight: 36,
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": {
                      bgcolor: "#177564",
                    },
                  }}
                >
                  Pay
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </FormProvider>
  </Box>
  );
};

export default RetailInvoice;
