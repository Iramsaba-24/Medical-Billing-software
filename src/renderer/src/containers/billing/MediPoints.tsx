import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import PrintIcon from "@mui/icons-material/Print";
import NumericField from "@/components/controlled/NumericField";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";


// types
type MediPointsForm = {
  totalAmount: string;       
  mediPoints: string;         
  discountedAmount: string;   
};

// Reusable form field props
type FormFieldProps = {
  title: string;
  name: keyof MediPointsForm;
  required?: boolean;
  decimal?: boolean;
};

// Earned / Used / Remains row props
type InfoRowProps = {
  label: string;
  value: string;
  color?: string;
};

const MediPoints: React.FC = () => {

  //state

  const [earned, setEarned] = useState(0);   // Points earned from current bill
  const [used, setUsed] = useState(0);       // Points used
  const [remains, setRemains] = useState(0); // Remaining points

  // Active tab (New / Retail)
  const [activeTab, setActiveTab] =
    useState<"new" | "retail">("new");

  //react hook setup
  const methods = useForm<MediPointsForm>({
    defaultValues: {
      totalAmount: "",
      mediPoints: "",
      discountedAmount: "",
    },
  });

  // Watch form values
  const total = Number(methods.watch("totalAmount")) || 0;
  const usedNow = Number(methods.watch("mediPoints")) || 0;

  useEffect(() => {
    const basePoints = 5; 

    // Earn 5 points for every ₹200
    const earnedNow =
      basePoints + Math.floor(total / 200) * 5;

   
    const validUsed = Math.min(
      usedNow,
      earnedNow
    );

    // Update states
    setEarned(earnedNow);
    setUsed(validUsed);
    setRemains(earnedNow - validUsed);

    
    const finalAmount =
      Math.max(total - validUsed, 0);

    methods.setValue(
      "discountedAmount",
      finalAmount.toFixed(2)
    );
  }, [total, usedNow, methods]);

 
     //Reusable Component
  // Form input field
  const FormField: React.FC<FormFieldProps> = ({
    title,
    name,
    required,
    decimal,
  }) => (
    <Box mb={2}>
      <Typography fontWeight={500} mb={0.5}>
        {title}
      </Typography>
      <NumericField
        name={name}
        label=""
        required={required}
        decimal={decimal}
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#fff",
          },
        }}
      />
    </Box>
  );

  // Earned / Used / Remains row
  const InfoRow: React.FC<InfoRowProps> = ({
    label,
    value,
    color,
  }) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mb: 1,
      }}
    >
      <Typography fontSize={15} fontWeight={700}>
        {label}
      </Typography>
      <Typography
        fontSize={15}
        fontWeight={700}
        sx={{ color }}
      >
        {value}
      </Typography>
    </Box>
  );

  const navigate = useNavigate();
  return (
    <FormProvider {...methods}>

      {/* New Invoice Button */}
      <Button
        fullWidth
        onClick={() => {
          setActiveTab("new");      // Set active tab
          if (location.pathname !== "") {
            navigate(URL_PATH.NewInvoice);          
          }
        }}
        sx={{
          textTransform: "none",
          width: { xs: "50%", md: "10%" },
          height: "38px",
          fontWeight: 500,
          borderRadius: "0px 18px 0px 0px",
          backgroundColor:
            activeTab === "new"
              ? "#238878"
              : "#fff",
          color:
            activeTab === "new"
              ? "#fff"
              : "#000",
          border:
            activeTab === "new"
              ? "none"
              : "1px solid #ccc",
          "&:hover": {
            backgroundColor:
              activeTab === "new"
                ? "#238878"
                : "#f5f5f5",
          },
        }}
      >
        New Invoice
      </Button>

      {/* Retail Invoice Button */}
      <Button
        onClick={() => {
          setActiveTab("retail");
          if (location.pathname !== "") {
            navigate(URL_PATH.RetailInvoice);
          }
        }}
        sx={{
          textTransform: "none",
          width: { xs: "50%", md: "10%" },
          height: "38px",
          fontWeight: 500,
          borderRadius: "0px 18px 0px 0px",
          backgroundColor:
            activeTab === "retail"
              ? "#238878"
              : "#fff",
          color:
            activeTab === "retail"
              ? "#fff"
              : "#000",
          border:
            activeTab === "retail"
              ? "none"
              : "1px solid #ccc",
          "&:hover": {
            backgroundColor:
              activeTab === "retail"
                ? "#238878"
                : "#f5f5f5",
          },
        }}
      >
        Retail Invoice
      </Button>

      {/* ------ Main Card -------*/}

      <Box>
        <Paper
          elevation={1}
          sx={{
            p: 3,
            bgcolor: "#ffffff",
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography fontWeight={600}>
            Medi Points
          </Typography>

          {/* Two Column Layout */}
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row",
              },
              gap: 4,
            }}
          >

            {/* Left Section - Points Info */}
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 2,
                border: "1px solid #bdbdbd",
              }}
            >
              <InfoRow
                label="Earned:"
                value={`${earned} Pts.`}
                color="#1f8f7a"
              />
              <InfoRow
                label="Used:"
                value={`${used} Pts.`}
              />
              <InfoRow
                label="Remains:"
                value={`${remains} Pts.`}
                color="red"
              />

              <Typography
                variant="body2"
                fontWeight={700}
                mt={2}
              >
                Description
              </Typography>

              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" sx={{ mb: 0.5 }}>
                  Medi Points is a smart reward system designed to thank customers for their loyalty.
                </Typography>
                <Typography component="li" sx={{ mb: 0.5 }}>
                  For every ₹200 purchase, customers earn 5 Medi Points.
                </Typography>
                <Typography component="li" sx={{ mb: 0.5 }}>
                  Points can be redeemed during billing.
                </Typography>
              </Box>
            </Paper>

            {/* Right Section - Form Inputs */}
            <Box sx={{ flex: 1 }}>
              <FormField
                title="Total (GST included)"
                name="totalAmount"
                required
                decimal
              />
              <FormField
                title="Add Medi Points"
                name="mediPoints"
              />
              <FormField
                title="Total Amount (with discount)"
                name="discountedAmount"
                decimal
              />
            </Box>
          </Box>

          {/* Bottom Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: {
                xs: "center",
                md: "flex-end",
              },
              gap: 2,
              mt: 3,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              sx={{
                bgcolor: "#1f8f7a",
                textTransform: "none",
              }}
              onClick={() => navigate(URL_PATH.PaymentMethod)}
            >
              PAY
            </Button>

            <Button
              startIcon={<PrintIcon />}
              variant="contained"
              sx={{
                bgcolor: "#1f8f7a",
                textTransform: "none",
              }}
            >
              PRINT
            </Button>
          </Box>
        </Paper>
      </Box>
    </FormProvider>
  );
};

export default MediPoints;
