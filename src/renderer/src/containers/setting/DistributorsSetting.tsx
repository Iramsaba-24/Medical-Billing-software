// import { useForm, FormProvider } from "react-hook-form";
// import { Typography, Box, Button, Paper } from "@mui/material";
// import PaymentTerms from "./PaymentTerm";
// import PurchaseGSTConfiguration from "./PurchaseGstConfiguration";
// import { useEffect } from "react";
// import { showToast } from "@/components/uncontrolled/ToastMessage";
// import CheckboxGroup from "@/components/controlled/CheckboxGroup";
// type DistributorFormValues = {
//   supplier_details: string[];
//   product_linking: string[];
//   credit_control: string[];
//   bank_details: string[];
//   report_settings: string[];
//   export_format: string;
//   payment_method?: string;
//   gst_settings?: string[];
//   creditDays: string;
// };

// const DEFAULT_VALUES: DistributorFormValues = {
//   supplier_details: [],
//   product_linking: [],
//   credit_control: [],
//   bank_details: [],
//   report_settings: [],
//   export_format: "",
//   payment_method: "cash",
//   creditDays: "30",
//   gst_settings: ["Regular GST"],
// };
// const DistributorSettings = () => {
//   const methods = useForm<DistributorFormValues>({
// defaultValues: DEFAULT_VALUES,
//   });

//   const { handleSubmit, reset } = methods;

//   const onSubmit = (data: DistributorFormValues) => {
//     console.log(" Data:", data);
//     localStorage.setItem("distributorSettings", JSON.stringify(data));
//     localStorage.setItem(
//       "distributorPaymentMethod",
//       data.payment_method || "cash",
//     );
//     showToast("success", "Settings updated successfully!");
//   };
//   useEffect(() => {
//     const storedSettings = localStorage.getItem("distributorSettings");

//     if (storedSettings) {
//       reset(JSON.parse(storedSettings));
//     }
//   }, [reset]);

//   const checkboxStyle = {
//   "& .MuiCheckbox-root": {
//     color: "default.main",
//     "&.Mui-checked": {
//       color: "#238878",
//     },
//   },
// };
//   return (
//     <Box sx={{ backgroundColor: "#f9f9f9" }}>
//       <Typography
//         sx={{
//           fontSize: { xs: 20, sm: 22, md: 24 },
//           fontWeight: 700,
//           color: "#111827",
//           mt: { xs: 1, md: 0.5 },
//           mb: 1,
//         }}
//       >
//         Distributors Settings
//       </Typography>

//       <FormProvider {...methods}>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <PaymentTerms />
//           <PurchaseGSTConfiguration />
//           {/*  Bank Details Storage */}
//           <Paper sx={{ p: 2, borderRadius: "10px", boxShadow: 4, mb: 1 }}>
//             <Typography
//               sx={{
//                 fontWeight: 700,

//                 fontSize: { xs: "16px", sm: "18px" },
//                 color: "#212529",
//                 mb: 1,
//               }}
//             >
//               Bank Details Storage
//             </Typography>
//             <CheckboxGroup
//               name="bank_details"
//               label=""
//               sx={{...checkboxStyle}}
//               options={[
//                 { label: "Distributor bank details", value: "bank_details" },
//               ]}
//             />
//           </Paper>

//           {/*  Buttons- save reset*/}
//           <Box
//             sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 4 }}
//           >
//           <Button
//             type="button"
//             variant="outlined"
//             onClick={() => {
//               reset(DEFAULT_VALUES);
//               localStorage.setItem("distributorSettings", JSON.stringify(DEFAULT_VALUES));
//               localStorage.setItem("distributorPaymentMethod", DEFAULT_VALUES.payment_method || "cash");
//               showToast("success", "Settings reset to default");
//             }}
//             sx={{
//               color: "#238878",
//               border: "2px solid #238878",
//               textTransform: "none",
//               "&:hover": {
//                 backgroundColor: "#238878",
//                 color: "#fff",
//                 border: "2px solid #238878",
//               },
//             }}
//           >
//             Reset
//           </Button>
//             <Button
//               type="submit"
//               variant="contained"
//               sx={{
//                 backgroundColor: "#238878",
//                 color: "#fff",
//                 border: "2px solid #238878",
//                 textTransform: "none",
//                 "&:hover": {
//                   backgroundColor: "#fff",
//                   color: "#238878",
//                   border: "2px solid #238878",
//                 },
//               }}
//             >
//               Save
//             </Button>
//           </Box>
//         </form>
//       </FormProvider>
//     </Box>
//   );
// };

// export default DistributorSettings;


import { useForm, FormProvider } from "react-hook-form";
import { Box, Paper, Typography, Button } from "@mui/material";
 
import CheckboxGroup from "@/components/controlled/CheckboxGroup";
import DropdownField from "@/components/controlled/DropdownField";
import { showToast } from "@/components/uncontrolled/ToastMessage";
 
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
 
const cardStyle = {
  p: { xs: 2, md: 4 },
  borderRadius: "5px",
  boxShadow: 3,
  mb: 1,
};
 
const DashboardSettings = () => {
 
  const savedSettings = localStorage.getItem("dashboardSettings");
 
  const methods = useForm<DashboardSettingsForm>({
    defaultValues: {
      //  KPI Visibility
      visibleKpis: savedSettings ? JSON.parse(savedSettings) : [],
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
 
    //  KPI Visibility save
    localStorage.setItem("dashboardSettings", JSON.stringify(data.visibleKpis));
 
    showToast("success", "Saved");
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
                color: "#111827",
                mt: { xs: 1, md: 0.5 },
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
 
          {/* Actions */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 4 }}>
 
            <Button
              type="button"
              variant="outlined"
              onClick={() => {
                reset();
                localStorage.removeItem("dashboardSettings");
              }}
              sx={{
                color: "#238878",
                border: "2px solid #238878",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#238878",
                  color: "#fff",
                  border: "2px solid #238878",
                },
              }}
            >
              Reset
            </Button>
 
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#238878",
                color: "#fff",
                border: "2px solid #238878",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "#238878",
                  border: "2px solid #238878",
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
 
 
 
 