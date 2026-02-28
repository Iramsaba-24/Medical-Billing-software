import React, { useState } from "react";
import { Box, Card, CardContent, Button, Typography } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import TextInputField from "@/components/controlled/TextInputField";
import { showToast } from "@/components/uncontrolled/ToastMessage";
import { URL_PATH } from "@/constants/UrlPath";
 
type FormValues = {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branch: string;
  ifsc: string;
};
 
const PayNPrint = {
  backgroundColor: "#238878",
  color: "#fff",
  border: "2px solid #238878",
  textTransform: "none",
  minWidth: "250px",
  height: "36px",
  "&:hover": {
    backgroundColor: "#fff",
    color: "#238878",
    border: "2px solid #238878",
  },
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
    mode: "onChange",
  }); 
 
 const onSubmit = (data: FormValues) => {
  localStorage.setItem(
    "paymentDetails",
    JSON.stringify(data)
  );

  showToast("success", "Details saved");
  navigate(URL_PATH.PaymentMethod);
};
 
  return (
    <Box sx={{ mx: { xs: -2, md: 0.5 } }}>
      <FormProvider {...methods}>
        <Button
          onClick={() => {
            setActiveTab("new");
            if (location.pathname !== URL_PATH.Billing)
              navigate(URL_PATH.Billing);
          }}
          sx={{
            textTransform: "none",
            px: { xs: 2, sm: 3 },
            height: 38,
            fontWeight: 500,
            borderRadius: "0px 18px 0px 0px",
            backgroundColor: activeTab === "new" ? "#238878" : "#fff",
            color: activeTab === "new" ? "#fff" : "#000",
            border: activeTab === "new" ? "none" : "1px solid #ccc",
          }}
        >
          New Invoice
        </Button>
 
        <Button
          onClick={() => {
            setActiveTab("retail");
            if (location.pathname !== URL_PATH.RetailInvoice)
              navigate(URL_PATH.RetailInvoice);
          }}
          sx={{
            textTransform: "none",
            px: { xs: 2, sm: 3 },
            height: 38,
            fontWeight: 500,
            borderRadius: "0px 18px 0px 0px",
            backgroundColor: activeTab === "retail" ? "#238878" : "#fff",
            color: activeTab === "retail" ? "#fff" : "#000",
            border: activeTab === "retail" ? "none" : "1px solid #ccc",
          }}
        >
          Retail Invoice
        </Button>
 
        <Box
          sx={{
            border: "1px solid #9a9a9a",
            bgcolor: "#ffffff",
            px: { xs: 1, sm: 2 },
          }}
        >
          <Card
            sx={{
              mx: "auto",
              my: { xs: 2, md: 4 },
              borderRadius: 1.5,
              border: "1px solid #9a9a9a",
            }}
          >
            <CardContent sx={{ px: { xs: 2, sm: 5 }, py: { xs: 1.5, md: 3 } }}>
              <Typography fontWeight={600} mb={1.5} fontSize={{ xs: 16, md: 18 }}>
                Distributor Bank Details
              </Typography>
 
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Box
                  display="flex"
                  flexDirection={{ xs: "column", md: "row" }}
                  gap={{ xs: 0.5, sm: 2 }}
                  mb={1}
                >
                  <Box flex={1}>
                    <TextInputField
                      name="bankName"
                      label="Bank Name"
                      required
                      inputType="alphabet"
                      maxLength={50}
                    />
                  </Box>
 
                  <Box flex={1}>
                    <TextInputField
                      name="accountNumber"
                      label="Account Number"
                      required
                      maxLength={13}
                      minLength={9}
                      rules={{
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "Only numbers allowed",
                        },
                      }}
                      inputProps={{ inputMode: "numeric" }}
                    />
                  </Box>
                </Box>
                <Box
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  gap={{ xs: 0.5, sm: 2 }}
                  mb={1.5}
                >
                  <Box flex={1}>
                    <TextInputField
                      name="accountHolderName"
                      label="Account Holder’s Name"
                      required
                      inputType="alphabet"
                      maxLength={60}
                    />
                  </Box>
 
                  <Box flex={1}>
                    <TextInputField
                      name="branch"
                      label="Branch"
                      required
                      inputType="alphabet"
                      maxLength={40}
                    />
                  </Box>
                </Box>
                <Box display="flex" justifyContent="center" mb={3}>
                  <Box width={{ xs: "100%", sm: "calc(50% - 24px)" }}>
                    <TextInputField
                      name="ifsc"
                      label="IFSC"
                      required
                      maxLength={11}
                      rules={{
                        pattern: {
                          value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                          message: "Invalid IFSC format",
                        },
                      }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                    />
                  </Box>
                </Box>
 
                <Box textAlign="center">
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{ ...PayNPrint, minWidth: "140px" }}
                  >
                    Save & Continue
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
