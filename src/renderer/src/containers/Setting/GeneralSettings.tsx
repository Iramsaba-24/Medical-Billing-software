import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { Button, Paper, Typography, Box } from "@mui/material";
import DropdownField from "@/components/controlled/DropdownField";
import SwitchToggle from "@/components/controlled/SwitchToggle";

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
      language: "en",
      dateFormat: "DD/MM/YYYY",
      timeZone: "IST",
      financialYear: "2023-24",
      currency: "INR",
      autoSave: false,
      darkMode: false,
      keyboardShortcuts: false,
    },
    mode: "onSubmit",
  });

  //  For Drop down Options
  const languageOptions = [
    { value: "en", label: "English" },
    { value: "hi", label: "Hindi" },
    { value: "mr", label: "Marathi" },
  ];

  const dateFormatOptions = [
    { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
    { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
    { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
  ];

  const timeZoneOptions = [
    { value: "IST", label: "India (IST)" },
    { value: "UTC", label: "UTC" },
    { value: "EST", label: "US (EST)" },
  ];

  const financialYearOptions = [
    { value: "2023-24", label: "2023-24" },
    { value: "2024-25", label: "2024-25" },
    { value: "2025-26", label: "2025-26" },
  ];

  const currencyOptions = [
    { value: "INR", label: "₹ INR" },
    { value: "USD", label: "$ USD" },
    { value: "EUR", label: "€ EUR" },
  ];

  const { reset } = methods;
  const onSubmit: SubmitHandler<GeneralSettingsFormValues> = (data) => {
    console.log("General Settings Data:", data);
    alert("data submited");
  };

  return (
    <FormProvider {...methods}>
      <Typography variant="h6" mb={3} fontWeight="bold">
        General Settings
      </Typography>

      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <Paper
          sx={{
            p: 4,
            width: { xs: "95%", sm: "90%", md: "1000px", lg: "1200px" },
            m: "auto",
            mt: 4,
          }}
        >
          {/* Language  */}
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={3}
            mb={3}
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
              <DropdownField
                name="timeZone"
                options={timeZoneOptions}
                required
              />
            </Box>
          </Box>

          {/*  Date Format & Currency */}
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={3}
            mb={3}
          >
            <Box flex={1}>
              <Typography variant="subtitle2" mb={1}>
                Date Format
              </Typography>
              <DropdownField
                name="dateFormat"
                options={dateFormatOptions}
                required
              />
            </Box>

            <Box flex={1}>
              <Typography variant="subtitle2" mb={1}>
                Currency
              </Typography>
              <DropdownField
                name="currency"
                options={currencyOptions}
                required
              />
            </Box>
          </Box>

          {/* Financial Year */}
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={3}
            mb={4}
          >
            <Box flex={1}>
              <Typography variant="subtitle2" mb={1}>
                Financial Year
              </Typography>
              <DropdownField
                name="financialYear"
                options={financialYearOptions}
                required
              />
            </Box>
            <Box flex={1} />
          </Box>

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
          </Box>
        </Paper>

        {/* Button: Reset & Submit*/}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
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
            {" "}
            Save{" "}
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
}

export default GenralSettings;
