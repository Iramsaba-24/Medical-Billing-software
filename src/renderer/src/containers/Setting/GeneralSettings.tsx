import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { Button, Paper, Typography, Box } from "@mui/material";
import DropdownField from "@/components/controlled/DropdownField";
import SwitchToggle from "@/components/controlled/SwitchToggle";
import { showToast, showConfirmation, } from "@/components/uncontrolled/ToastMessage";
import { useEffect } from "react";



type GeneralSettingsFormValues = {
  language: string;
  dateFormat: string;
  timeZone: string;
  financialYear: string;
  currency: string;
  autoSave: boolean;
  darkMode: boolean;
  keyboardShortcuts: boolean;
};

// default Values
function GenralSettings() {
  const methods = useForm<GeneralSettingsFormValues>({
    defaultValues: {
      language: "English",
      dateFormat: "DD/MM/YYYY",
      timeZone: "India (IST)",
      financialYear: "2023-24",
      currency: "INR",
      autoSave: false,
      darkMode: false,
      keyboardShortcuts: false,
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem("generalSettings");

    if (savedSettings) {
      try {
        const parsedSettings: GeneralSettingsFormValues =
          JSON.parse(savedSettings);


        if (parsedSettings.language === "en") {
          parsedSettings.language = "English";
        }
        if (parsedSettings.language === "hi") {
          parsedSettings.language = "Hindi";
        }
        if (parsedSettings.language === "mr") {
          parsedSettings.language = "Marathi";
        }



        methods.reset(parsedSettings);
      } catch (error) {
        console.error("Failed to load settings", error);
      }
    }
  }, [methods]);

  //  For Drop down Options
  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "Marathi", label: "Marathi" },
  ];

  const dateFormatOptions = [
    { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
    { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
    { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
  ];


  const onSubmit: SubmitHandler<GeneralSettingsFormValues> = async (data) => {
    console.log("General Settings Data:", data);

    const confirmed = await showConfirmation(
      "Do you want to save these settings?",
      "Confirm Save"
    );

    if (!confirmed) return;

    localStorage.setItem("generalSettings", JSON.stringify(data));

    showToast("success", "Settings saved successfully!");
  };

  return (
    <FormProvider {...methods}>
      <Box mb={2}>
        <Typography
          sx={{
            fontSize: { xs: 20, sm: 22, md: 24 },
            fontWeight: 700,
            color: '#111827',
            mt: { xs: 1, md: 0.5 },
            mb: 0.5,
          }}
        >
          General Settings
        </Typography>
      </Box>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: "5px", boxShadow: 3, mb: 1, }}>


          {/* Language  */}
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={3}
            mb={{ xs: 2.5, md: 0 }}
            flexWrap="wrap"
          >
            <Box flex={1}>
              <Typography variant="subtitle2" mb={1}>
                Language
              </Typography>
              <DropdownField
                name="language"
                options={languageOptions}
                required
              />
            </Box>

            {/* Time Zone  */}
            <Box flex={1}>
              <Typography variant="subtitle2" mb={1}>
                Time Zone
              </Typography>
              {/* <DropdownField
                name="timeZone"
                options={timeZoneOptions}
                required
              /> */}
              <DropdownField
                name="timeZone"
                options={[
                  { value: "India (IST)", label: "India (IST)" },
                  { value: "UTC", label: "UTC" },
                  { value: "US (EST)", label: "US (EST)" },
                ]}
                required
              />
            </Box>
          </Box>

          {/*  Date Format & Currency */}
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={3}
            mb={{ xs: 2.5, md: 0 }}
          >
            <Box width={{ xs: "100%", md: "640px" }}>
              <Typography variant="subtitle2" mb={1}>
                Date Format
              </Typography>
              <DropdownField
                name="dateFormat"
                options={dateFormatOptions}
                required
              />
            </Box></Box>

          {/* Toggle buttons */}
          <Box mb={3}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>Auto Save</Typography>
              <SwitchToggle name="autoSave" />
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>Dark Mode</Typography>
              <SwitchToggle name="darkMode" />
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>Keyboard Shortcuts</Typography>
              <SwitchToggle name="keyboardShortcuts" />
            </Box>
            <Box
              sx={{
                mt: 2,
                maxWidth: 500,
                mx: "auto",
                textAlign: "center",
                p: 2,
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                backgroundColor: "#f9fafb"
              }}
            >
              <Typography fontWeight={600} mb={1}>
                Keyboard Shortcuts
              </Typography>

              <Typography variant="body2">
                Ctrl + B :- Billing Page
              </Typography>

              <Typography variant="body2">
                Ctrl + I :- Invoices Page
              </Typography>

              <Typography variant="body2">
                Ctrl + C :- Customer Page
              </Typography>

              <Typography variant="body2">
                Ctrl + R :- Reports Page
              </Typography>
            </Box>
          </Box>

          {/* Button: Reset & Submit*/}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 4 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => methods.reset()}
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
              }}>
              Save
            </Button>
          </Box>
        </Paper>
      </form>
    </FormProvider>
  );
}

export default GenralSettings;

