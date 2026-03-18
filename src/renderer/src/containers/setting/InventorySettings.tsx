import { useForm, FormProvider } from "react-hook-form";
import { Box, Button, Paper, Typography, Stack } from "@mui/material";
import CheckboxGroup from "@/components/controlled/CheckboxGroup";
import TextInputField from "@/components/controlled/TextInputField";
import { useEffect } from "react";
import { showToast } from "@/components/uncontrolled/ToastMessage";
 
//  Define Form Types for Type Safety
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
  const methods = useForm<InventoryFormValues>({
    defaultValues: {
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
 
  //  Save Function
  const { handleSubmit, reset } = methods;
  const onSubmit = (data: InventoryFormValues) => {
    console.log("Inventory Settings Saved ");
    console.log(data);
    localStorage.setItem("inventorySettings", JSON.stringify(data));
    showToast("success", "Settings updated successfully!");
  };
  useEffect(() => {
      const storedSettings = localStorage.getItem("inventorySettings");
  
      if (storedSettings) {
        reset(JSON.parse(storedSettings));
      }
    }, [reset]);
 
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
            <Paper sx={{ p: 2, borderRadius: "5px", boxShadow: 4, mb: 1 }}>
              <Typography sx={headingStyle}>Stock Limits</Typography>
 
              {/* Row 1 */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 0.5,
                }}
              >
                <Typography fontSize="14px">Low Stock Threshold</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextInputField
                    name="lowStockThreshold"
                    label=""
                    inputType="numbers"
                    sx={{
                      width: "80px",
                      "& .MuiInputBase-root": { height: "25px" },
                    }}
                  />
                  <Typography fontSize="14px" sx={{ mb: 3 }}>
                    Units
                  </Typography>
                </Box>
              </Box>
 
              {/* Row 2 */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography fontSize="14px" sx={{ mb: 3 }}>
                  Auto Reorder Quantity
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextInputField
                    name="autoReorderQty"
                    label=""
                    inputType="numbers"
                    sx={{
                      width: "80px",
                      "& .MuiInputBase-root": { height: "25px" },
                    }}
                  />
                  <Typography fontSize="14px" sx={{ mb: 3 }}>
                    Units
                  </Typography>
                </Box>
              </Box>
 
              {/* Row 3 */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography fontSize="14px" sx={{ mb: 3 }}>
                  {" "}
                  Out of stock{" "}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextInputField
                    name="outOfStock"
                    label=""
                    inputType="numbers"
                    sx={{
                      width: "80px",
                      "& .MuiInputBase-root": { height: "25px" },
                    }}
                  />
                  <Typography fontSize="14px" sx={{ mb: 3 }}>
                    Units
                  </Typography>
                </Box>
              </Box>
            </Paper>
 
            {/*  Returns & Auto Update */}
            <Paper sx={{ p: 2, borderRadius: "5px", boxShadow: 4, mb: 1 }}>
              <Typography variant="subtitle1" sx={headingStyle}>
                Returns & Auto Update
              </Typography>
              <CheckboxGroup
                name="returnsUpdate"
                label=""
                options={[
                  {
                    label: "Auto-update stock on returns (Sales & Purchase)",
                    value: "autoUpdate",
                  },
                ]}
              />
            </Paper>
 
            {/*  Alerts & Visibility */}
            <Paper sx={{ p: 2, borderRadius: "5px", boxShadow: 4, mb: 1 }}>
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
            {/*  Buttons- save reset*/}
            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 4 }}
            >
              <Button
                type="button"
                variant="outlined"
                onClick={() => reset()}
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