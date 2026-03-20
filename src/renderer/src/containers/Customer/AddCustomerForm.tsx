import { useState, useEffect } from "react";
import { Box, Button, Typography, Paper, SxProps, Theme } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { Save } from "@mui/icons-material";
import { CustomerData } from "@/view/CustomerMaster";
import TextInputField from "@/components/controlled/TextInputField";
import MobileField from "@/components/controlled/MobileField";
import EmailField from "@/components/controlled/EmailField";
import DateTimeField from "@/components/controlled/DateTimeField";
import DropdownField from "@/components/controlled/DropdownField";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
interface StoredDoctor {
  doctorName: string;
  doctorAddress?: string;
  address?: string;
  clinicAddress?: string;
}
 
interface Props {
  onBack?: () => void;
  onSave?: (data: CustomerData) => void;
  initialData?: CustomerData | null;
}
 
const AddCustomerForm = ({ onBack, onSave, initialData }: Props) => {
  const navigate = useNavigate();
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
      date: new Date().toISOString().split("T")[0],
    },
    mode: "onChange",
  });
 
  const handleAgeInput = (event: React.FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const value = input.value.replace(/[^0-9]/g, "");
    input.value = value;
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
      border: "2px solid #238878",
    },
  };
 
  useEffect(() => {
    const storedDoctors: StoredDoctor[] = JSON.parse(
      localStorage.getItem("doctors") || "[]"
    );
 
    const options = storedDoctors.map((doc) => ({
      label: doc.doctorName,
      value: doc.doctorName,
      address:
        doc.doctorAddress ?? doc.address ?? doc.clinicAddress ?? "",
    }));
    const updatedOptions = [
      { label: "+ Add Doctor", value: "add_doctor", address: "" },
      ...options,
    ];
    setDoctorOptions(updatedOptions);
  }, []);
 
  const selectedDoctor = methods.watch("doctor");
 
  useEffect(() => {
    if (!selectedDoctor) return;
    if (selectedDoctor === "add_doctor") {
      navigate(URL_PATH.AddDoctor);
      return;
    }

    const doctorData = doctorOptions.find(
      (doc) => doc.value === selectedDoctor
    );

    if (doctorData) {
      methods.setValue("doctorAddress", doctorData.address, {
        shouldValidate: true,
      });
    }
  }, [selectedDoctor, doctorOptions, methods, navigate]);
  useEffect(() => {
    if (initialData) {
      methods.reset(initialData);
    }
  }, [initialData, methods]);
  const handleActualSave = (data: CustomerData) => {
    const existingCustomers: CustomerData[] = JSON.parse(
      localStorage.getItem("customers") || "[]"
    );

    let updatedCustomers: CustomerData[];

    if (initialData) {
      updatedCustomers = existingCustomers.map((customer) =>
        customer.mobile === initialData.mobile ? data : customer
      );
    } else {
      updatedCustomers = [...existingCustomers, data];
    }

    localStorage.setItem("customers", JSON.stringify(updatedCustomers));

    onSave?.(data);

    if (!initialData) {
      navigate(URL_PATH.Billing);
    }
  };
  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        noValidate
        onSubmit={methods.handleSubmit(handleActualSave)}
        sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", p: { xs: 1, md: 0 } }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            {initialData ? "Edit Customer" : "Add Customer"}
          </Typography>
        </Box>
        <Paper
          sx={{ p: { xs: 2, md: 3 }, mb: 3, border: "1px solid #e0e0e0" }}
          elevation={3}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.5fr 1fr" },
              gap: 4,
            }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                Customer Details
              </Typography>
 
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <TextInputField
                  name="name"
                  label="Customer Name"
                  inputType="alphabet"
                  required
                  maxLength={20}
                />
 
                <DateTimeField name="date" label="Date" required />
 
                <TextInputField
                  name="age"
                  label="Age"
                  required
                  maxLength={3}
                  rules={{
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Only numbers allowed",
                    },
                  }}
                  inputProps={{
                    inputMode: "numeric",
                    maxLength: 3,
                    onInput: handleAgeInput,
                  }}
                />
                <MobileField
                  name="mobile"
                  label="Mobile"
                  countryCode
                  preventDuplicate 
                  required
                />
                <EmailField name="email" label="Email" required />
 
                <TextInputField
                  name="address"
                  label="Address"
                  inputType="textarea"
                  rows={1}
                  required
                />
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                Doctor Information
              </Typography>
 
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
                <DropdownField
                  name="doctor"
                  label="Doctor Name"
                  options={doctorOptions}
                  placeholder="Select Doctors"
                  required
                />
 
                <TextInputField
                  name="doctorAddress"
                  label="Doctor Address/Clinic"
                  inputType="textarea"
                  rows={1}
                  required
                />
              </Box>
            </Box>
          </Box>
        </Paper>
        <Box
          sx={{
            mt: 4,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              if (onBack) {
                onBack();
              } else {
                navigate(-1);
              }
            }}
            sx={buttonStyle}
          >
            Back
          </Button>
          <Button
            variant="contained"
            type="submit"
            startIcon={<Save />}
            sx={buttonStyle}
          >
            Save and continue
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default AddCustomerForm;
