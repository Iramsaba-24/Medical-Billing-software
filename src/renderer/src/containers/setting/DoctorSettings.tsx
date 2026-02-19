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

type DoctorsSettingsForm = {
  mandatoryDetails: string[];
  showDoctorOnInvoice: string;
  showDoctorOnPrescription: string;
};

const defaultValues: DoctorsSettingsForm = {
  mandatoryDetails: [],
  showDoctorOnInvoice: "no",
  showDoctorOnPrescription: "no",
};

const RightRadioRow = ({
  name,
  label,
}: {
  name: keyof DoctorsSettingsForm;
  label: string;
}) => {
  const { control } = useFormContext();

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
