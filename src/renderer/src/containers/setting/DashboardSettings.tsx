import { useForm, FormProvider } from "react-hook-form";
import {
  Box,
  Paper,
  Typography,
  Button,
} from "@mui/material";
 
import CheckboxGroup from "@/components/controlled/CheckboxGroup";
import SwitchToggle from "@/components/controlled/SwitchToggle";
import DropdownField from "@/components/controlled/DropdownField";
import TextInputField from "@/components/controlled/TextInputField";
import { showToast } from "@/components/uncontrolled/ToastMessage";
//type
type DashboardSettingsForm = {
  visibleKpis: string[];
 
  lowStockAlert: boolean;
  quantityThreshold: number | null;
 
  expiryAlerts: string[];
  showExpiryOnDashboard: boolean;
 
  topSellingMedicine: string;
  chartPreferences: string[];
 
  autoRefresh: boolean;
  autoRefreshInterval: string;
};
 
const kpiOptions = [
  { label: "Total Revenue", value: "totalRevenue" },
  { label: "Inventory Status", value: "inventoryStatus" },
  { label: "Medicines Available", value: "medicinesAvailable" },
  { label: "Medicines Shortage", value: "medicinesShortage" },
];
 
const showExpiry = [
  { label: "30 Days", value: "30" },
  { label: "60 Days", value: "60" },
  { label: "90 Days", value: "90" },
  {
    label: "Show Expiry Alert on Dashboard",
    value: "Show Expiry Alert on Dashboard",
  },
];
 
const chartPreferences = [
  { label: "Bar Chart", value: "bar" },
  { label: "Line Chart", value: "line" },
  { label: "Donut Chart", value: "donut" },
];
 
const medicineOptions = [
  "Acetaminophen",
  "Antihistamines",
  "Lisinopril",
  "Statins",
  "Metformin",
  "Amoxicillin",
  "Paracetamol 500mg",
];
 
const medicineDropdownOptions = medicineOptions.map((med) => ({
  label: med,
  value: med,
}));
 
const autoRefreshOptions = [
  { label: "5 Min", value: "5" },
  { label: "10 Min", value: "10" },
  { label: "30 Min", value: "30" },
];
 
const cardStyle = {
  backgroundColor: "#fff",
  borderRadius: "6px",
  boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
  p: 2.5,
  mb: 2,
};
 
const DashboardSettings = () => {
  const methods = useForm<DashboardSettingsForm>({
    defaultValues: {
      visibleKpis: [],
      lowStockAlert: false,
      quantityThreshold: null,
      expiryAlerts: [],
      showExpiryOnDashboard: false,
      topSellingMedicine: "",
      chartPreferences: [],
      autoRefresh: false,
      autoRefreshInterval: "",
    },
  });
 
  const { handleSubmit, reset } = methods;
 
  const onSubmit = (data: DashboardSettingsForm) => {
    console.log("Submitted", data);
    showToast("success","saved");
  };
 
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ maxWidth: "100%", overflowX: "hidden" }}>
          
          <Box mb={2}>
          <Typography
          sx={{
            fontSize: { xs: 20, sm: 22, md: 24 },  
            fontWeight: 700,
            color: '#111827',
            mt: {xs:1 , md:0.5},
            mb: 0.5,
          }}
        >
          Dashboard Settings
        </Typography>
            <Typography fontSize={15} color="#8F8D8D">
              Control what appears on the main dashboard
            </Typography>
          </Box>
 
          {/* KPI Visibility */}
          <Paper sx={cardStyle}>
            <Typography fontSize={17} fontWeight={500} mb={1}>
              KPI Visibility
            </Typography>
            <CheckboxGroup
              name="visibleKpis"
              label=""
              options={kpiOptions}
            />
          </Paper>
 
          {/* Low Stock Alerts */}
          <Paper sx={cardStyle}>
            <Box display="flex" justifyContent="space-between">
              <Typography fontSize={16} fontWeight={500}>
                Low Stock Alerts
              </Typography>
              <SwitchToggle name="lowStockAlert" />
            </Box>
          </Paper>
 
          {/* Quantity Threshold */}
          <Paper sx={cardStyle}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontSize={16} fontWeight={500}>
                Quantity Threshold
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <TextInputField
                  name="quantityThreshold"
                  label=""
                  inputType="numbers"
                  sx={{
                    mt: 2,
                    width: 90,
                    "& .MuiInputBase-root": {
                      height: 40,
                    },
                  }}
                />
                <Typography fontSize={14}>Units</Typography>
              </Box>
            </Box>
          </Paper>
 
          {/* Expiry Alerts */}
          <Paper sx={cardStyle}>
            <Typography fontSize={17} fontWeight={500} mb={1}>
              Expiry Alerts
            </Typography>
            <CheckboxGroup
              name="expiryAlerts"
              label=""
              options={showExpiry}
            />
          </Paper>
 
          {/* Top Selling Medicines */}
          <Paper sx={cardStyle}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontSize={16} fontWeight={500}>
                Top Selling Medicines
              </Typography>
 
              <DropdownField
                name="topSellingMedicine"
                options={medicineDropdownOptions}
                placeholder="Select Medicine"
                freeSolo={false}
                sx={{ width: 150, minWidth: 150 }}
              />
            </Box>
          </Paper>
 
          {/* Chart Preferences */}
          <Paper sx={cardStyle}>
            <Typography fontSize={16} fontWeight={500} mb={1}>
              Chart Preferences
            </Typography>
            <CheckboxGroup
              name="chartPreferences"
              label=""
              options={chartPreferences}
            />
          </Paper>
 
          {/* Auto Refresh */}
          <Paper sx={cardStyle}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography fontSize={16} fontWeight={500}>
                Auto Refresh Interval
              </Typography>
 
              <DropdownField
                name="autoRefreshInterval"
                options={autoRefreshOptions}
                placeholder="Select"
                freeSolo={false}
                sx={{ width: 140, minWidth: 140 }}
              />
            </Box>
 
            <Box display="flex" justifyContent="space-between">
              <Typography fontSize={16}>Auto Refresh</Typography>
              <SwitchToggle name="autoRefresh" />
            </Box>
          </Paper>
 
          {/* Actions */}
          <Box
            display="flex"
            justifyContent={{
              xs: "center",
              md: "center",
            }}
            alignItems="center"
            gap={3}
            mt={3}
          >
            <Button
              variant="outlined"
              onClick={() => reset()}
              sx={{
                px: 4,
                textTransform: "none",
                fontSize: 14,
                color: "#238878",
                border: "2px solid #238878",
                "&:hover": {
                  backgroundColor: "#238878",
                  color: "#fff",
                },
              }}
            >
              Reset
            </Button>
 
            <Button
              type="submit"
              variant="contained"
              sx={{
                px: 4,
                fontSize: 14,
                backgroundColor: "#238878",
                border: "2px solid #238878",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "#238878",
                },
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </form>
    </FormProvider>
  );
};
 
export default DashboardSettings;
