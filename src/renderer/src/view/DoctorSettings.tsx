import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
  Stack,
  Radio,
  RadioGroup,
} from "@mui/material";

type DoctorSettingsState = {
  doctorName: boolean;
  registrationNumber: boolean;
  hospitalName: boolean;
  mobile: boolean;
  email: boolean;
  showDoctorOnInvoice: boolean;
  showDoctorOnPrescription: boolean;
};

/* ALL CHECKBOXES DEFAULT BLANK */
const defaultState: DoctorSettingsState = {
  doctorName: false,
  registrationNumber: false,
  hospitalName: false,
  mobile: false,
  email: false,
  showDoctorOnInvoice: false,
  showDoctorOnPrescription: false,
};

const DoctorsSettings: React.FC = () => {
  const [settings, setSettings] =
    useState<DoctorSettingsState>(defaultState);

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;
    setSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleRadioChange = (
    name: keyof DoctorSettingsState,
    value: string 
  ) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value === "yes",
    }));
  };

  const handleReset = () => {
    setSettings(defaultState); //  reset = all unchecked
  };

  const handleSave = () => {
    console.log("Saved Settings:", settings);
    alert("Settings saved successfully ");
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600}>
        Doctors Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Manage prescriptions, referrals, and doctor visibility
      </Typography>

      {/* Doctor Details */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={1}>
            Mandatory Doctor Details
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Stack>
            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.doctorName}
                  name="doctorName"
                  onChange={handleCheckboxChange}
                />
              }
              label="Doctor Name"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.registrationNumber}
                  name="registrationNumber"
                  onChange={handleCheckboxChange}
                />
              }
              label="Registration Number"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.hospitalName}
                  name="hospitalName"
                  onChange={handleCheckboxChange}
                />
              }
              label="Hospital / Clinic Name"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.mobile}
                  name="mobile"
                  onChange={handleCheckboxChange}
                />
              }
              label="Mobile Number (Optional)"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.email}
                  name="email"
                  onChange={handleCheckboxChange}
                />
              }
              label="Email ID (Optional)"
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Invoice & Prescription */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={1}>
            Invoice & Prescription Settings
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Stack spacing={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography>Show doctor name on invoice</Typography>

              <RadioGroup
                row
                value={settings.showDoctorOnInvoice ? "yes" : "no"}
                onChange={(e) =>
                  handleRadioChange("showDoctorOnInvoice", e.target.value)
                }
              >
                <Radio value="yes" />
              </RadioGroup>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography>Show doctor on prescription print</Typography>

              <RadioGroup
                row
                value={settings.showDoctorOnPrescription ? "yes" : "no"}
                onChange={(e) =>
                  handleRadioChange(
                    "showDoctorOnPrescription",
                    e.target.value
                  )
                }
              >
                <Radio value="yes" />
              </RadioGroup>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button
          variant="outlined"
          onClick={handleReset}
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
          variant="contained"
          onClick={handleSave}
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
  );
};

export default DoctorsSettings;
