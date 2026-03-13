import { Paper, Typography } from "@mui/material";
import CheckboxGroup from "@/components/controlled/CheckboxGroup";

const PurchaseGSTConfiguration = () => {
  const options = [
    //checkbox options
    { label: "Enable Reverse Charge (RCM)", value: "rcm" },
    { label: "Validate supplier GSTIN", value: "validate_gstin" },
  ];

  return (
    <Paper sx={{ p: 2, borderRadius: "10px", boxShadow: 4, mb: 1 }}>
      <Typography
        sx={{
          fontWeight: 700,

          fontSize: { xs: "16px", sm: "18px" },
          color: "#212529",
          mb: 1,
        }}
      >
        Purchase GST Configuration
      </Typography>
      <CheckboxGroup name="gst_settings" label="" options={options} />
    </Paper>
  );
};

export default PurchaseGSTConfiguration;
