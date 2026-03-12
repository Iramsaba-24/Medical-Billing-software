import { useState, useEffect } from "react";
import { Box, Button, Typography, Paper, SxProps, Theme } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { Save } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { CustomerData } from "@/view/CustomerMaster";
import TextInputField from "@/components/controlled/TextInputField";
import MobileField from "@/components/controlled/MobileField";
import EmailField from "@/components/controlled/EmailField";
import DateField from "@/components/controlled/DateTimeField";
import DropdownField from "@/components/controlled/DropdownField";

export interface ItemRow {
  id: number;
  name: string;
  qty: number | "";
  price: number | "";
}

interface StoredDoctor {
  doctorName: string;
  doctorAddress?: string;
  address?: string;
  clinicAddress?: string;
}

interface Props {
  onBack: () => void;
  onSave: (
    data: CustomerData,
    total: number,
    meds: string,
    qty: number,
    actualRows: ItemRow[]
  ) => void;
  initialData: CustomerData | null;
}

const AddCustomerForm = ({ onBack, onSave, initialData }: Props) => {

  const navigate = useNavigate();

  const isEditMode = Boolean(initialData);

  const [rows, setRows] = useState<ItemRow[]>([
    { id: Date.now(), name: "", qty: "", price: "" }
  ]);

  const [doctorOptions, setDoctorOptions] = useState<
    { label: string; value: string; address: string }[]
  >([]);

  const methods = useForm<CustomerData>({
    defaultValues: {
      name: "",
      age: "",
      mobile: "",
      email: "",
      address: "",
      doctor: "",
      doctorAddress: "",
      date: ""
    },
    mode: "onChange"
  });

  const handleAgeInput = (event: React.FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    input.value = input.value.replace(/[^0-9]/g, "");
  };

  const buttonStyle: SxProps<Theme> = {
    backgroundColor: "#238878",
    color: "#fff",
    border: "2px solid #238878",
    textTransform: "none",
    px: 3,
    py: 1,
    width: { xs: "100%", sm: "auto" },
    "&:hover": {
      backgroundColor: "#fff",
      color: "#238878",
      border: "2px solid #238878"
    }
  };

  useEffect(() => {

    const storedDoctors: StoredDoctor[] = JSON.parse(
      localStorage.getItem("doctors") || "[]"
    );

    const existingDoctors = storedDoctors.map((doc) => ({
      label: doc.doctorName,
      value: doc.doctorName,
      address: doc.doctorAddress ?? doc.address ?? doc.clinicAddress ?? ""
    }));

    const options = [
      {
        label: "+ Add Doctor",
        value: "__add_doctor__",
        address: ""
      },
      ...existingDoctors
    ];

    setDoctorOptions(options);

  }, []);

  const selectedDoctor = methods.watch("doctor");

  useEffect(() => {

    if (selectedDoctor === "__add_doctor__") {
      methods.setValue("doctor", "");
      navigate("/add-doctor");
      return;
    }

    if (selectedDoctor) {

      const doctorData = doctorOptions.find(
        (doc) => doc.value === selectedDoctor
      );

      if (doctorData) {
        methods.setValue("doctorAddress", doctorData.address, {
          shouldValidate: true
        });
      }

    }

  }, [selectedDoctor, doctorOptions, methods, navigate]);

  useEffect(() => {

    if (initialData) {

      methods.reset(initialData);

      if (initialData.itemsList) {
        setRows(initialData.itemsList);
      }

    }

  }, [initialData, methods]);

  const subTotal = rows.reduce(
    (acc, r) => acc + Number(r.qty) * Number(r.price),
    0
  );

  const finalTotal = subTotal;

  const handleActualSave = (data: CustomerData) => {

    onSave(
      data,
      finalTotal,
      rows.map((r) => r.name).join(", "),
      rows.length,
      rows
    );
  };

  return (

    <FormProvider {...methods}>

      <Box
        component="form"
        noValidate
        onSubmit={methods.handleSubmit(handleActualSave)}
        sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", p: { xs: 1, md: 0 } }}
      >

        {/* Header */}

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>

          <Typography variant="h5" fontWeight="bold">
            {isEditMode ? "Edit Customer" : "Add Customer"}
          </Typography>

          <Button
            variant="contained"
            onClick={onBack}
            sx={{
              backgroundColor: "#238878",
              color: "#fff",
              border: "2px solid #238878",
              textTransform: "none"
            }}
          >
            Back
          </Button>

        </Box>

        <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }} elevation={3}>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.5fr 1fr" },
              gap: 4
            }}
          >

            {/* Customer */}

            <Box>

              <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                Customer Details
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2
                }}
              >

                <TextInputField
                  name="name"
                  label="Customer Name"
                  inputType="alphabet"
                  required
                  maxLength={20}
                />

                <DateField
                  name="date"
                  label="Date"
                  required
                  viewMode="date"
                  useCurrentDate
                />

                <TextInputField
                  name="age"
                  label="Age"
                  required
                  maxLength={3}
                  inputProps={{
                    inputMode: "numeric",
                    maxLength: 3,
                    onInput: handleAgeInput
                  }}
                />

                <MobileField
                  name="mobile"
                  label="Mobile"
                  countryCode
                  required
                />

                <EmailField
                  name="email"
                  label="Email"
                  required
                />

                <TextInputField
                  name="address"
                  label="Address"
                  inputType="textarea"
                  rows={1}
                  required
                />

              </Box>

            </Box>

            {/* Doctor */}

            <Box>

              <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                Doctor Information
              </Typography>

              <Box sx={{ display: "grid", gap: 2 }}>

                <DropdownField
                  name="doctor"
                  label="Doctor Name"
                  options={doctorOptions}
                  placeholder="Select Doctors"
                />

                <TextInputField
                  name="doctorAddress"
                  label="Doctor Address/Clinic"
                  inputType="textarea"
                  rows={1}
                />

              </Box>

            </Box>

          </Box>

        </Paper>

        {/* Save */}

        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: { xs: "stretch", sm: "flex-end" }
          }}
        >

          <Button
            variant="contained"
            type="submit"
            startIcon={<Save />}
            sx={buttonStyle}
          >
            {isEditMode ? "Update" : "Save and Continue"}
          </Button>

        </Box>

      </Box>

    </FormProvider>

  );
};

export default AddCustomerForm;