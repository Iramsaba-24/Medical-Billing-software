import React from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  RadioGroup,
  Radio,
} from "@mui/material";
import { useForm, FormProvider, Controller, useFormContext } from "react-hook-form";
import CheckboxGroup from "@/components/controlled/CheckboxGroup";

/* Same Card Style as Pharmacy Profile */
const cardStyle = {
  p: { xs: 2, md: 4 },
  borderRadius: "5px",
  boxShadow: 3,
  mb: 1,
};

<<<<<<< HEAD
const headingStyle = {
  fontWeight: 700,
  fontSize: "18px",
  color: "#212529",
  mb: 1,
};


const defaultState: DoctorSettingsState = {
  doctorName: false,
  registrationNumber: false,
  hospitalName: false,
  mobile: false,
  email: false,
  showDoctorOnInvoice: false,
  showDoctorOnPrescription: false,
=======
type DoctorsSettingsForm = {
  mandatoryDetails: string[];
  showDoctorOnInvoice: string;
  showDoctorOnPrescription: string;
>>>>>>> 7515add9dbe93f28687b55d93beb8d6bc34572fb
};

const defaultValues: DoctorsSettingsForm = {
  mandatoryDetails: [],
  showDoctorOnInvoice: "no",
  showDoctorOnPrescription: "no",
};

<<<<<<< HEAD
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
    setSettings(defaultState);
  };

  const handleSave = () => {
    console.log("Saved Settings:", settings);
    alert("Settings saved successfully");
  };
  const cardStyle = {
p: { xs: 2, md: 4 },
  borderRadius: "5px",
  boxShadow: 3,
  mb: 1,
};

=======
const RightRadioRow = ({
  name,
  label,
}: {
  name: keyof DoctorsSettingsForm;
  label: string;
}) => {
  const { control } = useFormContext();
>>>>>>> 7515add9dbe93f28687b55d93beb8d6bc34572fb

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 0.5,
      }}
    >
      <Typography sx={{ fontWeight: 500 }}>
        {label}
      </Typography>

<<<<<<< HEAD
      <Typography variant="body2" color="text.secondary" mb={3}>
        Manage prescriptions, referrals, and doctor visibility
      </Typography>

      {/* Doctor Details */}
      <Card sx={cardStyle}>
        <CardContent>
          <Typography sx={headingStyle}>
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
          <Typography sx={headingStyle}>
            Invoice & Prescription Settings
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2}>
            {/* Invoice */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap:2,
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "14px", sm: "15px", md: "16px" },
                  fontWeight: 500,
                }}
              >
                Show doctor name on invoice
              </Typography>

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

            {/* Prescription */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "14px", sm: "15px", md: "16px" },
                  fontWeight: 500,
                }}
              >
                Show doctor on prescription print
              </Typography>

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
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 4 }}>
        <Button
            type="button"
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
            type="submit"
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
=======
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioGroup
            row
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            sx={{ m: 0 }}
          >
            <Radio value="yes" size="small" sx={{ p: 0.5 }} />
          </RadioGroup>
        )}
      />
>>>>>>> 7515add9dbe93f28687b55d93beb8d6bc34572fb
    </Box>
  );
};

const DoctorsSettings: React.FC = () => {
  const methods = useForm<DoctorsSettingsForm>({
    defaultValues,
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = (data: DoctorsSettingsForm) => {
    console.log("Saved Settings:", data);
  };

  return (
    <FormProvider {...methods}>
      <Box sx={{ width: "100%", backgroundColor: "#f9f9f9" }}>
        
        {/* Page Heading */}
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, mb: { xs: 2, md: 4 } }}
        >
          Doctors Settings
        </Typography>

        {/* CARD 1 : Mandatory Doctor Details */}
        <Paper sx={cardStyle}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Mandatory Doctor Details
          </Typography>

          <CheckboxGroup
            name="mandatoryDetails"
            label=""
            options={[
              { label: "Doctor Name", value: "doctorName" },
              { label: "Registration Number", value: "registrationNumber" },
              { label: "Hospital / Clinic Name", value: "hospitalName" },
              { label: "Mobile Number (Optional)", value: "mobile" },
              { label: "Email ID (Optional)", value: "email" },
            ]}
          />
        </Paper>

        {/* CARD 2 : Invoice & Prescription */}
        <Paper sx={cardStyle}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Invoice & Prescription Settings
          </Typography>

          <Stack spacing={1}>
            <RightRadioRow
              name="showDoctorOnInvoice"
              label="Show doctor name on invoice"
            />

            <RightRadioRow
              name="showDoctorOnPrescription"
              label="Show doctor on prescription print"
            />
          </Stack>
        </Paper>

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 4 }}>
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
            onClick={handleSubmit(onSubmit)}
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
    </FormProvider>
  );
};

export default DoctorsSettings;
