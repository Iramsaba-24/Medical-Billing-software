// import { useState, useEffect } from "react";
// import { Box, Button, Typography, Paper, SxProps, Theme } from "@mui/material";
// import { useForm, FormProvider } from "react-hook-form";
// import { Save } from "@mui/icons-material";
// import { CustomerData } from "@/view/CustomerMaster";
// import TextInputField from "@/components/controlled/TextInputField";
// import MobileField from "@/components/controlled/MobileField";
// import EmailField from "@/components/controlled/EmailField";
// import DateTimeField from "@/components/controlled/DateTimeField";
// import DropdownField from "@/components/controlled/DropdownField";
// import { useNavigate } from "react-router-dom";
// import { URL_PATH } from "@/constants/UrlPath";
// import { getDoctors, DoctorResponse } from "@/service/doctorService";
// import { createCustomer, updateCustomer } from "@/service/customerService";

// interface Props {
//   onBack?: () => void;
//   onSave?: (data: CustomerData) => void;
//   initialData?: CustomerData | null;
// }

// const AddCustomerForm = ({ onBack, onSave, initialData }: Props) => {
//   const navigate = useNavigate();
//   const [doctorOptions, setDoctorOptions] = useState<
//     { label: string; value: string; address: string }[]
//   >([]);

//   const methods = useForm<CustomerData>({
//     defaultValues: {
//       name: "",
//       age: "",
//       phone: "",
//       email: "",
//       address: "",
//       doctor: "",
//       doctorAddress: "",
//       date: new Date().toISOString().split("T")[0],
//     },
//     mode: "onChange",
//   });

//   const handleAgeInput = (event: React.FormEvent<HTMLInputElement>) => {
//     const input = event.currentTarget;
//     let value = input.value.replace(/[^0-9]/g, "");

//     if (value !== "" && Number(value) > 100) {
//       value = value.slice(0, -1);
//     }

//     input.value = value;
//   };

//   const buttonStyle: SxProps<Theme> = {
//     backgroundColor: "#238878",
//     color: "#fff",
//     border: "2px solid #238878",
//     textTransform: "none",
//     px: 3,
//     py: 1,
//     width: { xs: "100%", sm: "auto" },
//     "&:hover": {
//       backgroundColor: "#fff",
//       color: "#238878",
//       border: "2px solid #238878",
//     },
//   };

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const doctors: DoctorResponse[] = await getDoctors();

//         const options = doctors.map((doc) => ({
//           label: doc.doctorName,
//           value: doc.doctorName,
//           address: doc.hospitalAddress,
//         }));

//         setDoctorOptions([
//           { label: "+ Add Doctor", value: "add_doctor", address: "" },
//           ...options,
//         ]);
//       } catch (error) {
//         console.error("Failed to fetch doctors", error);

//         setDoctorOptions([
//           { label: "+ Add Doctor", value: "add_doctor", address: "" },
//         ]);
//       }
//     };

//     fetchDoctors();
//   }, []);

//   const selectedDoctor = methods.watch("doctor");

//   useEffect(() => {
//     if (!selectedDoctor) return;
//     if (selectedDoctor === "add_doctor") {
//       navigate(URL_PATH.AddDoctor);
//       return;
//     }

//     const doctorData = doctorOptions.find(
//       (doc) => doc.value === selectedDoctor
//     );

//     if (doctorData) {
//       methods.setValue("doctorAddress", doctorData.address, {
//         shouldValidate: true,
//       });
//     }
//   }, [selectedDoctor, doctorOptions, methods, navigate]);
//   useEffect(() => {
//     if (initialData) {
//       methods.reset(initialData);
//     }
//   }, [initialData, methods]);
//   const handleActualSave = async (data: CustomerData) => {
//     try {
//       const formattedData = {
//         ...data,
//         age: String(data.age),
//         phone: String(data.phone),
//         name: data.name,
//         email: data.email,
//         address: data.address,
//         date: data.date,
//         doctor: data.doctor,
//         doctorAddress: data.doctorAddress,
//       };

//       let savedData: CustomerData;

//       if (initialData && initialData.customerId) {
//         savedData = await updateCustomer(initialData.customerId, formattedData);
//       } else {
//         savedData = await createCustomer(formattedData);
//       }
//       onSave?.(savedData);

//       if (!initialData) {
//         navigate(URL_PATH.Billing);
//       }
//     } catch (error) {
//       console.error("Save failed:", error);
//     }
//   };
//   return (
//     <FormProvider {...methods}>
//       <Box
//         component="form"
//         noValidate
//         onSubmit={methods.handleSubmit(handleActualSave)}
//         sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", p: { xs: 1, md: 0 } }}
//       >
//         <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//           <Typography variant="h5" fontWeight="bold">
//             {initialData ? "Edit Customer" : "Add Customer"}
//           </Typography>
//         </Box>
//         <Paper
//           sx={{ p: { xs: 2, md: 3 }, mb: 3, border: "1px solid #e0e0e0" }}
//           elevation={3}
//         >
//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: { xs: "1fr", md: "1.5fr 1fr" },
//               gap: 4,
//             }}
//           >
//             <Box>
//               <Typography variant="subtitle1" fontWeight="bold" mb={2}>
//                 Customer Details
//               </Typography>

//               <Box
//                 sx={{
//                   display: "grid",
//                   gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
//                   gap: 2,
//                 }}
//               >
//                 <TextInputField
//                   name="name"
//                   label="Customer Name"
//                   inputType="alphabet"
//                   minLength={3}
//                   maxLength={20}
//                   required
//                   rules={{
//                     pattern: {
//                       value: /^[A-Za-z ]+$/,
//                       message: "Only alphabets are allowed",
//                     },
//                   }}
//                   inputProps={{
//                     maxLength: 20,
//                     onInput: (e: React.FormEvent<HTMLInputElement>) => {
//                       e.currentTarget.value = e.currentTarget.value.replace(
//                         /[^A-Za-z ]/g,
//                         ""
//                       );
//                     },
//                   }}
//                 />

//                 <DateTimeField name="date" label="Date" disabled required />

//                 <TextInputField
//                   name="age"
//                   label="Age"
//                   required
//                   minLength={1}
//                   maxLength={3}
//                   rules={{
//                     pattern: {
//                       value: /^[0-9]+$/,
//                       message: "Only numbers allowed",
//                     },
//                     validate: (value) =>
//                       (Number(value) >= 15 && Number(value) <= 100) ||
//                       "Age should be between 15 and 100",
//                   }}
//                   inputProps={{
//                     inputMode: "numeric",
//                     maxLength: 3,
//                     onInput: handleAgeInput,
//                   }}
//                 />
//                 <MobileField
//                   name="phone"
//                   label="Mobile"
//                   countryCode
//                   preventDuplicate={!initialData}
//                   required
//                 />
//                 <EmailField
//                   name="email"
//                   label="Email"
//                   required
//                   preventDuplicate={!initialData}
//                 />

//                 <TextInputField
//                   name="address"
//                   label="Address"
//                   inputType="textarea"
//                   minLength={5}
//                   maxLength={50}
//                   rows={1}
//                   required
//                   rules={{
//                     pattern: {
//                       value: /^[A-Za-z0-9\s,./-]+$/,
//                       message:
//                         "Only alphabets, numbers and , . / - are allowed",
//                     },
//                   }}
//                   inputProps={{
//                     maxLength: 50,
//                     onInput: (
//                       e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
//                     ) => {
//                       e.currentTarget.value = e.currentTarget.value.replace(
//                         /[^A-Za-z0-9\s,./-]/g,
//                         ""
//                       );
//                       methods.trigger("address");
//                     },
//                   }}
//                 />
//               </Box>
//             </Box>
//             <Box>
//               <Typography variant="subtitle1" fontWeight="bold" mb={2}>
//                 Doctor Information
//               </Typography>

//               <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
//                 <DropdownField
//                   name="doctor"
//                   label="Doctor Name"
//                   options={doctorOptions}
//                   freeSolo={false}
//                   editable={true}
//                   placeholder="Select Doctors"
//                   required
//                 />

//                 <TextInputField
//                   name="doctorAddress"
//                   label="Doctor Address/Clinic"
//                   inputType="textarea"
//                   minLength={5}
//                   maxLength={50}
//                   rows={1}
//                   required
//                   rules={{
//                     pattern: {
//                       value: /^[A-Za-z0-9\s,./-]+$/,
//                       message:
//                         "Only alphabets, numbers and , . / - are allowed",
//                     },
//                   }}
//                   inputProps={{
//                     maxLength: 50,
//                     onInput: (
//                       e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
//                     ) => {
//                       e.currentTarget.value = e.currentTarget.value.replace(
//                         /[^A-Za-z0-9\s,./-]/g,
//                         ""
//                       );
//                       methods.trigger("doctorAddress");
//                     },
//                   }}
//                 />
//               </Box>
//             </Box>
//           </Box>
//         </Paper>
//         <Box
//           sx={{
//             mt: 4,
//             display: "flex",
//             flexWrap: "wrap",
//             justifyContent: "space-between",
//             alignItems: "center",
//             gap: 2,
//           }}
//         >
//           <Button
//             variant="contained"
//             onClick={() => {
//               if (onBack) {
//                 onBack();
//               } else {
//                 navigate(-1);
//               }
//             }}
//             sx={buttonStyle}
//           >
//             Back
//           </Button>
//           <Button
//             variant="contained"
//             type="submit"
//             startIcon={<Save />}
//             sx={buttonStyle}
//           >
//             Save and continue
//           </Button>
//         </Box>
//       </Box>
//     </FormProvider>
//   );
// };

// export default AddCustomerForm;








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
import { getDoctors, DoctorResponse } from "@/service/doctorService";
import { createCustomer, updateCustomer } from "@/service/customerService";
import { useAutoSave } from "@/hooks/Useautosave";
 
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
      phone: "",
      email: "",
      address: "",
      doctor: "",
      doctorAddress: "",
      date: new Date().toISOString().split("T")[0],
    },
    mode: "onChange",
  });
 
  // ✅ AutoSave hook — form data save & restore hoga automatically
  const { clearData } = useAutoSave({
    storageKey: "add_customer_form",
    methods,
  });

 
  const handleAgeInput = (event: React.FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    let value = input.value.replace(/[^0-9]/g, "");
 
    if (value !== "" && Number(value) > 100) {
      value = value.slice(0, -1);
    }
 
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
    const fetchDoctors = async () => {
      try {
        const doctors: DoctorResponse[] = await getDoctors();
 
        const options = doctors.map((doc) => ({
          label: doc.doctorName,
          value: doc.doctorName,
          address: doc.hospitalAddress,
        }));
 
        setDoctorOptions([
          { label: "+ Add Doctor", value: "add_doctor", address: "" },
          ...options,
        ]);
      } catch (error) {
        console.error("Failed to fetch doctors", error);
 
        setDoctorOptions([
          { label: "+ Add Doctor", value: "add_doctor", address: "" },
        ]);
      }
    };
 
    fetchDoctors();
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
 
  const handleActualSave = async (data: CustomerData) => {
    try {
      const formattedData = {
        ...data,
        age: String(data.age),
        phone: String(data.phone),
        name: data.name,
        email: data.email,
        address: data.address,
        date: data.date,
        doctor: data.doctor,
        doctorAddress: data.doctorAddress,
      };
 
      let savedData: CustomerData;
 
      if (initialData && initialData.customerId) {
        savedData = await updateCustomer(initialData.customerId, formattedData);
      } else {
        savedData = await createCustomer(formattedData);
      }
 
      onSave?.(savedData);
      clearData(); // ✅ submit ke baad draft clear karo
 
      if (!initialData) {
        navigate(URL_PATH.Billing);
      }
    } catch (error) {
      console.error("Save failed:", error);
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
                  minLength={3}
                  maxLength={20}
                  required
                  rules={{
                    pattern: {
                      value: /^[A-Za-z ]+$/,
                      message: "Only alphabets are allowed",
                    },
                  }}
                  inputProps={{
                    maxLength: 20,
                    onInput: (e: React.FormEvent<HTMLInputElement>) => {
                      e.currentTarget.value = e.currentTarget.value.replace(
                        /[^A-Za-z ]/g,
                        ""
                      );
                    },
                  }}
                />
 
                <DateTimeField name="date" label="Date" disabled required />
 
                <TextInputField
                  name="age"
                  label="Age"
                  required
                  minLength={1}
                  maxLength={3}
                  rules={{
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Only numbers allowed",
                    },
                    validate: (value) =>
                      (Number(value) >= 15 && Number(value) <= 100) ||
                      "Age should be between 15 and 100",
                  }}
                  inputProps={{
                    inputMode: "numeric",
                    maxLength: 3,
                    onInput: handleAgeInput,
                  }}
                />
                <MobileField
                  name="phone"
                  label="Mobile"
                  countryCode
                  preventDuplicate={!initialData}
                  required
                />
                <EmailField
                  name="email"
                  label="Email"
                  required
                  preventDuplicate={!initialData}
                />
 
                <TextInputField
                  name="address"
                  label="Address"
                  inputType="textarea"
                  minLength={5}
                  maxLength={50}
                  rows={1}
                  required
                  rules={{
                    pattern: {
                      value: /^[A-Za-z0-9\s,./-]+$/,
                      message:
                        "Only alphabets, numbers and , . / - are allowed",
                    },
                  }}
                  inputProps={{
                    maxLength: 50,
                    onInput: (
                      e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => {
                      e.currentTarget.value = e.currentTarget.value.replace(
                        /[^A-Za-z0-9\s,./-]/g,
                        ""
                      );
                      methods.trigger("address");
                    },
                  }}
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
                  freeSolo={false}
                  editable={true}
                  placeholder="Select Doctors"
                  required
                />
 
                <TextInputField
                  name="doctorAddress"
                  label="Doctor Address/Clinic"
                  inputType="textarea"
                  minLength={5}
                  maxLength={50}
                  rows={1}
                  required
                  rules={{
                    pattern: {
                      value: /^[A-Za-z0-9\s,./-]+$/,
                      message:
                        "Only alphabets, numbers and , . / - are allowed",
                    },
                  }}
                  inputProps={{
                    maxLength: 50,
                    onInput: (
                      e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => {
                      e.currentTarget.value = e.currentTarget.value.replace(
                        /[^A-Za-z0-9\s,./-]/g,
                        ""
                      );
                      methods.trigger("doctorAddress");
                    },
                  }}
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
              clearData(); // ✅ cancel pe bhi draft clear karo
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
 
