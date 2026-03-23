import { useForm, FormProvider } from "react-hook-form";
import { Box, Paper, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
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

type InventoryItem = {
  itemName: string;
};

type MedicineOption = {
  label: string;
  value: string;
};

// medicines from localStorage
const getMedicineOptions = (): MedicineOption[] => {
  const stored = localStorage.getItem("inventory");

  if (!stored) return [];

  const parsed: InventoryItem[] = JSON.parse(stored);

  const result: MedicineOption[] = [];

  for (const item of parsed) {
    result.push({
      label: item.itemName,
      value: item.itemName,
    });
  }

  return result;
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
    value: "showExpiryOnDashboard",
  },
];

const chartPreferences = [
  { label: "Bar Chart", value: "bar" },
  { label: "Line Chart", value: "line" },
  { label: "Donut Chart", value: "donut" },
];

const cardStyle = {
  p: { xs: 2, md: 4 },
  borderRadius: "5px",
  boxShadow: 3,
  mb: 1,
};

const defaultValues: DashboardSettingsForm = {
  visibleKpis: [
    "totalRevenue",
    "inventoryStatus",
    "medicinesAvailable",
    "medicinesShortage",
  ],
  lowStockAlert: false,
  quantityThreshold: null,
  expiryAlerts: ["30"],
  showExpiryOnDashboard: false,
  topSellingMedicine: "Paracetamol 500mg",
  chartPreferences: ["bar"],
  autoRefresh: false,
  autoRefreshInterval: "",
};

const DashboardSettings = () => {
  const [medicineDropdownOptions, setMedicineDropdownOptions] = useState<
    MedicineOption[]
  >([]);

  const savedSettings = localStorage.getItem("dashboardSettings");

  const methods = useForm<DashboardSettingsForm>({
    defaultValues: savedSettings
      ? JSON.parse(savedSettings)
      : defaultValues,
  });

  const { handleSubmit, reset } = methods;

  // auto update medicines
  useEffect(() => {
    const loadMedicines = () => {
      const data = getMedicineOptions();
      setMedicineDropdownOptions(data);
    };

    loadMedicines();

    window.addEventListener("inventoryUpdated", loadMedicines);

    return () => {
      window.removeEventListener("inventoryUpdated", loadMedicines);
    };
  }, []);

  const onSubmit = (data: DashboardSettingsForm) => {
    console.log("Submitted", data);

    // ✅ existing save
    localStorage.setItem("dashboardSettings", JSON.stringify(data));

    // ✅ IMPORTANT: Top Selling Medicine separate save
    localStorage.setItem("topSellingMedicine", data.topSellingMedicine);

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
                reset(defaultValues);
                localStorage.removeItem("dashboardSettings");
                
                localStorage.removeItem("topSellingMedicine");
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