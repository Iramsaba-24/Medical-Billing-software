import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import TextInputField from "@/components/controlled/TextInputField";
import InvoiceTabButtons from "./InvoiceTabButtons";
import DropdownField from "@/components/controlled/DropdownField";
 
type MediPointsForm = {
  totalAmount: string;
  mediPoints: string;
  discountedAmount: string;
  gst: string;
};
 
type InfoRowProps = {
  label: string;
  value: string;
  color?: string;
};
 
const PayNPrint = {
  backgroundColor: "#238878",
  color: "#fff",
  border: "2px solid #238878",
  textTransform: "none",
  minWidth: "250px",
  height: "38px",
  "&:hover": {
    backgroundColor: "#fff",
    color: "#238878",
    border: "2px solid #238878",
  },
};
 
const MediPoints: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
 
const totalFromInvoice = location.state?.totalFromInvoice || 0;
const earned = Math.floor(totalFromInvoice / 200) * 5;
 
  const [used, setUsed] = useState(0);
  const [remains, setRemains] = useState(earned);
 
  const [isInvalid, setIsInvalid] = useState(false);
 
  const methods = useForm<MediPointsForm>({
    defaultValues: {
      totalAmount: totalFromInvoice.toString(),
      mediPoints: "",
      discountedAmount: totalFromInvoice.toString(),
       gst: "12",
    },
  });
 
  const { watch, setValue } = methods;
 
  const mediPointsValue = watch("mediPoints");
  const totalValue = watch("totalAmount");
const gstValue = watch("gst");
  const usedNow = Number(mediPointsValue ?? 0);
  const total = Number(totalValue ?? 0);
 
const gstOptions = [
  { label: "5%", value: "5" },
  { label: "12%", value: "12" },
  { label: "18%", value: "18" },
];
 
useEffect(() => {
  if (usedNow > earned) {
    setIsInvalid(true);
    setUsed(0);
    setRemains(earned);
 
    setValue("discountedAmount", total.toFixed());
    return;
  }
 
  setIsInvalid(false);
 
  setUsed(usedNow);
  setRemains(earned - usedNow);
 
  const gstPercent = Number(gstValue || 0);
 
  const amountAfterDiscount = total - usedNow;
 
  const gstAmount = (amountAfterDiscount * gstPercent) / 100;
 
  const finalAmount = amountAfterDiscount + gstAmount;
 
  setValue("discountedAmount", finalAmount.toFixed(2));
 
}, [usedNow, total, earned, gstValue, setValue]);
 
  const InfoRow: React.FC<InfoRowProps> = ({ label, value, color }) => (
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
 
      <Typography fontSize={15} fontWeight={700} sx={{ color }}>
        {value}
      </Typography>
    </Box>
  );
 
 const onSubmit = (data: MediPointsForm) => {
  if (isInvalid) return;
 
navigate(URL_PATH.PaymentMethod, {
  state: {
    flow: location.state?.flow || "retail",
    totalFromInvoice: Number(data.discountedAmount),
    usedPoints: usedNow,
    gstPercent: Number(data.gst),
    invoiceId: location.state?.invoiceId,
    rows: location.state?.rows,
    customerName: location.state?.customerName,
    doctorName: location.state?.doctorName,
  }
});
};
 
  return (
    <FormProvider {...methods}>
      <InvoiceTabButtons />
 
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
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
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
            }}
          >
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
              <InfoRow label="Used:" value={`${used} Pts.`} />
              <InfoRow label="Remains:" value={`${remains} Pts.`} color="red" />
 
              <Typography fontWeight={700} mt={2}>
                Description
              </Typography>
 
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li">
                  Medi Points is a smart reward system designed to thank
                  customers for their loyalty.
                </Typography>
                <Typography component="li">
                  Points can be redeemed during billing.
                </Typography>
                <Typography component="li">
                  For every ₹200 purchase, customers earn 5 Medi Points.
                </Typography>
                <Typography component="li">
                  Medi Points helps customers save money on future purchases.
                </Typography>
              </Box>
            </Paper>
 
            <Box sx={{ flex: 1 }}>
              <Box mb={2}>
                <Typography fontWeight={500} mb={0.5}>
                  Total
                </Typography>
 
                <TextInputField
                  name="totalAmount"
                  label=""
                  inputType="numbers"
                  InputProps={{ readOnly: true }}
                />
              </Box>
 
              <Box mb={2}>
                <Typography fontWeight={500} mb={0.5}>
                  Add Medi Points
                </Typography>
 
                <TextInputField inputType="numbers" name="mediPoints" label="" />
 
                {isInvalid && (
                  <Typography color="error" fontSize={13} mt={0.5}>
                    Maximum {earned} Medi Points allowed
                  </Typography>
                )}
              </Box>
 
              <Box mb={2}>
                <Typography fontWeight={500} mb={0.5}>
                  Total Amount (with discount)
                </Typography>
 
                <TextInputField
                  name="discountedAmount"
                  label=""
                  InputProps={{ readOnly: true }}
                />
              </Box>
            </Box>
          </Box>
 
          <Box
 
   sx={{
    display: "flex",
    justifyContent: { xs: "center", md: "flex-end" },
    alignItems: "center",
    gap: 1,
   
    flexWrap: "wrap",
  }}
 
>
 
  <Box sx={{ minWidth: "150px" }}>
    <Typography fontWeight={500} mb={0.5}>
      GST
    </Typography>
 
    <DropdownField
      name="gst"
      label=""
      options={gstOptions}
    size="small"
    />
  </Box>
 
 
  <Button
    variant="contained"
    type="submit"
    disabled={isInvalid}
    sx={{ ...PayNPrint, minWidth: "140px" }}
  >
    Save & Continue
  </Button>
</Box>
        </Paper>
      </form>
    </FormProvider>
  );
};
 
export default MediPoints;
 
 