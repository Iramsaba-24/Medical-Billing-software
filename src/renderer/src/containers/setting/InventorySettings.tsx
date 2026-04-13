import { useForm, FormProvider } from "react-hook-form";
import { Box, Button, Paper, Typography, Stack } from "@mui/material";
import CheckboxGroup from "@/components/controlled/CheckboxGroup";
import { showToast } from "@/components/uncontrolled/ToastMessage";
 
// Define Form Types for Type Safety
export interface InventoryFormValues {
  groupExpiry: string[];
  pricing: string[];
  lowStockThreshold: string;
  autoReorderQty: string;
  outOfStock: string;
  barcodeStorage: string[];
  returnsUpdate: string[];
  alertsVisibility: string[];
}

const InventorySettings = () => {
 
  const savedData = (() => {
    try {
      const data = localStorage.getItem("inventorySettings");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  })();
 
  const methods = useForm<InventoryFormValues>({
    defaultValues: savedData ?? {
      groupExpiry: [],
      pricing: [],
      lowStockThreshold: "",
      autoReorderQty: "",
      outOfStock: "",
      barcodeStorage: [],
      returnsUpdate: [],
      alertsVisibility: [],
    },
  });
 
  const headingStyle = {
    fontWeight: 700,
    fontSize: "18px",
    color: "#212529",
    mb: 1,
  };

  const checkboxStyle = {
    "& .MuiCheckbox-root": {
      color: "default.main",
      "&.Mui-checked": {
        color: "#238878",
      },
    },
  };
 
  // Save Function
  const { handleSubmit, reset } = methods;
 
  const onSubmit = (data: InventoryFormValues) => {
    showToast("success", "Settings updated successfully");
    console.log("Inventory Settings Saved ");
    console.log(data);
 
    localStorage.setItem("inventorySettings", JSON.stringify(data));
 
    // increment counter if checkbox selected
    if (data.returnsUpdate.includes("autoUpdate")) {
      const prevCount = Number(localStorage.getItem("returnsUpdateCount")) || 0;
      localStorage.setItem("returnsUpdateCount", String(prevCount + 1));
    }
    localStorage.setItem("inventorySettings", JSON.stringify(data));
 
    // Returns counter
    if (data.returnsUpdate.includes("autoUpdate")) {
      const prevCount = Number(localStorage.getItem("returnsUpdateCount")) || 0;
      localStorage.setItem("returnsUpdateCount", String(prevCount + 1));
    }
 
    // Low Stock Alert counter
    if (data.alertsVisibility.includes("alert1")) {
      const prevLowStock =
        Number(localStorage.getItem("lowStockAlertCount")) || 0;
      localStorage.setItem("lowStockAlertCount", String(prevLowStock + 1));
    }
 
    // Reorder Alert counter
    if (data.alertsVisibility.includes("alert2")) {
      const prevReorder =
        Number(localStorage.getItem("reorderAlertCount")) || 0;
      localStorage.setItem("reorderAlertCount", String(prevReorder + 1));
    }
  };
 
  return (
    <Box sx={{ backgroundColor: "#f9f9f9" }}>
      <Box mb={2}>
        <Typography
          sx={{
            fontSize: { xs: 20, sm: 22, md: 24 },
            fontWeight: 700,
            color: "#111827",
            mt: { xs: 1, md: 0.5 },
          }}
        >
          Inventory Settings
        </Typography>
      </Box>
 
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
 
            {/* Alerts & Visibility */}
            <Paper
              sx={{
                p: 2,
                borderRadius: "5px",
                boxShadow: 4,
                mb: 1,
                ...checkboxStyle,
              }}
            >
              <Typography variant="subtitle1" sx={headingStyle}>
                Alerts & Visibility
              </Typography>
 
              <CheckboxGroup
                name="alertsVisibility"
                label=""
                options={[
                  {
                    label: "Show low-stock alerts on dashboard",
                    value: "alert1",
                  },
                  {
                    label: "Show auto recorder alerts on dashboard",
                    value: "alert2",
                  },
                ]}
              />
            </Paper>
 
            {/* Buttons */}
            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 4 }}
            >
              <Button
                type="button"
                variant="outlined"
                onClick={() =>
                  reset({
                    groupExpiry: [],
                    pricing: [],
                    lowStockThreshold: "",
                    autoReorderQty: "",
                    outOfStock: "",
                    barcodeStorage: [],
                    returnsUpdate: [],
                    alertsVisibility: ["alert1", "alert2"],
                  })
                }
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
 
          </Stack>
        </form>
      </FormProvider>
    </Box>
  );
};
 
export default InventorySettings;