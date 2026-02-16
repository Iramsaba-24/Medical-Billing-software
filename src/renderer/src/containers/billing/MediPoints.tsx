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
import TextInputField from "@/components/controlled/TextInputField";

// types
type MediPointsForm = {
  totalAmount: string;
  mediPoints: string;
  discountedAmount: string;
};

type InfoRowProps = {
  label: string;
  value: string;
  color?: string;
};

const MediPoints: React.FC = () => {
  
  const [earned] = useState(5);

  const [used, setUsed] = useState(0);
  const [remains, setRemains] = useState(5);

  const [activeTab, setActiveTab] =
    useState<"new" | "retail">("new");

  const methods = useForm<MediPointsForm>({
    defaultValues: {
      totalAmount: "",
      mediPoints: "",
      discountedAmount: "",
    },
  });

  const total = Number(methods.watch("totalAmount")) || 0;
  const usedNow = Number(methods.watch("mediPoints")) || 0;

  useEffect(() => {
   
    const validUsed =
      usedNow > earned
        ? earned
        : usedNow < 0
        ? 0
        : usedNow;

    setUsed(validUsed);

   
    setRemains(earned - validUsed);

    // Discount calculation
    const finalAmount =
      Math.max(total - validUsed, 0);

    methods.setValue(
      "discountedAmount",
      finalAmount.toFixed()
    );
  }, [usedNow, total, earned, methods]);

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
   const onSubmit = (data:  MediPointsForm) => {
    console.log(data);
    navigate(URL_PATH.PaymentMethod);
  };
  return (
    <FormProvider {...methods}>
    
      {/* Tabs */}
      <Box sx={{ display: "flex" }}>
        <Button
          onClick={() => setActiveTab("new")}
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
          }}
        >
          New Invoice
        </Button>
        <Button
          onClick={() => setActiveTab("retail")}
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
          }}
        >
          Retail Invoice
        </Button>
      </Box>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
      {/* Main Card */}
      <Box>
        <Paper
          elevation={1}
          sx={{
            p: 3,
            bgcolor: "#ffffff",
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography fontWeight={600} mb={2}>
            Medi Points
          </Typography>

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
            {/* LEFT SECTION */}
            <Paper
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

              <Typography fontWeight={700} mt={2}>
                Description
              </Typography>

              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" sx={{ mb: 0.5 }}>
                  Medi Points is a smart reward system designed to thank customers for their loyalty.
                </Typography>
                <Typography component="li" sx={{ mb: 0.5 }}>
                  Points can be redeemed during billing.
                </Typography>
                <Typography component="li" sx={{ mb: 0.5 }}>
                  For every ₹200 purchase, customers earn 5 Medi Points.
                </Typography>
                <Typography component="li" sx={{ mb: 0.5 }}>
                  Medi Points is a smart reward system designed to thank customers for their loyalty.
                </Typography>

              </Box>
            </Paper>

            {/* RIGHT SECTION */}
            <Box sx={{ flex: 1 }}>
              <Box mb={2}>
                <Typography fontWeight={500} mb={0.5}>
                  Total (GST included)
                </Typography>
                <TextInputField
                  name="totalAmount"
                  label=""
                  inputType="numbers"
                 
                />
              </Box>

              <Box mb={2}>
                <Typography fontWeight={500} mb={0.5}>
                  Add Medi Points
                </Typography>
                <NumericField
                  name="mediPoints"
                  label=""
                
                />
              </Box>

              <Box mb={2}>
                <Typography fontWeight={500} mb={0.5}>
                  Total Amount (with discount)
                </Typography>
                <TextInputField
                  name="discountedAmount"
                  label="" 
                />
              </Box>
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
              type="submit"
              sx={{
                bgcolor: "#1f8f7a",
                textTransform: "none",
                
              }}
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
      </form>
    </FormProvider>
  );
};

export default MediPoints;
