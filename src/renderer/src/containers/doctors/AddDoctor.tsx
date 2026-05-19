import EmailField from "@/components/controlled/EmailField";

import MobileField from "@/components/controlled/MobileField";

import TextInputField from "@/components/controlled/TextInputField";

import { URL_PATH } from "@/constants/UrlPath";

import { Box, Button, Paper, Typography } from "@mui/material";

import { FormProvider, useForm } from "react-hook-form";

import { useNavigate,useLocation } from "react-router-dom";

import { addDoctor, updateDoctor } from "@/service/doctorService";

import { useEffect } from "react";

import { useAutoSave } from "@/hooks/Useautosave";
 
export interface AddDoctorFormValues {

  doctorId?: number;

  doctorName: string;

  degree: string;

  phone: string;

  email: string;

  registrationNumber: string;

  hospitalAddress: string;

  status: "Active";

}
 
 
const AddDoctor = () => {

  const navigate = useNavigate();

  const location = useLocation();
 
  const editDataFromState =

    location.state as AddDoctorFormValues | undefined;
 
  const methods = useForm<AddDoctorFormValues>({

    defaultValues: editDataFromState || {

      doctorName: "",

      degree: "",

      phone: "",

      email: "",

      registrationNumber: "",

      hospitalAddress: "",

      status: "Active",

    },

    mode: "onChange",

  });
 
  const { clearData } = useAutoSave({

    storageKey: "add_doctor_form",

    methods,

  });
 
  useEffect(() => {

    if (editDataFromState) {

      methods.reset(editDataFromState);

    }

  }, [editDataFromState, methods]);

  const { setError } = methods;
 
const onSubmit = async (data: AddDoctorFormValues) => {

  try {

    if (data.doctorId) {

      await updateDoctor(data.doctorId, {

        ...data,

        isActive: data.status === "Active",

      });

    } else {

      await addDoctor({

        ...data,

        isActive: data.status === "Active",

      });

    }
 
    clearData();

    navigate(URL_PATH.Doctors);

  } catch (error: unknown) {

  console.error(error);
 
  const err = error as {

    response?: {

      data?: unknown;

    };

  };
 
  const message =

    typeof err.response?.data === "string"

      ? err.response.data

      : (err.response?.data as { message?: string })?.message;
 
  if (message?.includes("Phone number already exists")) {

    setError("phone", {

      type: "manual",

      message: "Phone number already exists",

    });

  }

}

};
 
  return (
<Paper sx={{ p: { xs:2, md:4 }, mx: { xs:1, md:4 }, my: { xs:1, md:4 } }}>
<Typography fontSize={22} mb={2}>

  {editDataFromState ? "Edit Doctor" : "Add Doctor"}
</Typography>
<hr />
 
  <FormProvider {...methods}>
<form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
<Box

        maxWidth="900px"

        mx="auto"

        px={{ xs:1, md:6 }}
>
 
        <Box

          display="flex"

          flexDirection={{ xs:"column", md:"row" }}

          gap={3}

          mt={4}
>
<Box flex={1}>
<TextInputField

              name="doctorName"

              label="Doctor's Name"

              required

              inputType="alphabet"

              rows={1}

              minLength={3}

              maxLength={30}

              rules={{ required: "Doctor's Name is required" }}

            />
</Box>
 
          <Box flex={1}>
<TextInputField

              name="degree"

              label="Degree"

              maxLength={10}

              inputType="alphabet"

              required

              rules={{ required: "Degree is required" }}

            />
</Box>
</Box>
 
        <Box

          display="flex"

          flexDirection={{ xs:"column", md:"row" }}

          gap={3}

          mt={3}
>
<Box flex={1}>
<MobileField name="phone" label="Phone" countryCode preventDuplicate required />
</Box>
 
          <Box flex={1}>
<EmailField name="email" label="Email"   />
</Box>
</Box>
 
        <Box mt={3} width="100%">
<TextInputField

            inputType="numbers"

            name="registrationNumber"

            label="Registration No."

            required

            minLength={3}

            maxLength={15}

            rules={{ required: "Registration No. is required" }}

          />
</Box>
 
        <Box mt={3}>
<TextInputField

            name="hospitalAddress"

            label="Clinic / Hospital Address"

            inputType="all"

            required

            rules={{ required: "Address is required" }}

          />
</Box>
 
        <Box

          display="flex"

          justifyContent="flex-end"

          gap={2}

          mt={4}
>
<Button

            variant="outlined"

            onClick={() => {

              clearData();

              navigate(-1);

            }}

            sx={{

              px:4,

              width:"14%",

              textTransform:"none",

              border:"2px solid #1b7f6b",

              color:"#1b7f6b",

              "&:hover": {

                backgroundColor:"#1b7f6b",

                color:"#fff",

              },

            }}
>

            Cancel
</Button>
 
          <Button

            type="submit"

            variant="contained"

            sx={{

              px:4,

              width:"14%",                 

              textTransform:"none",

              backgroundColor:"#1b7f6b",

              "&:hover": {

                backgroundColor:"#fff",

                color:"#1b7f6b",

                border:"2px solid #1b7f6b",

              },

            }}
>

            Save
</Button>
</Box>
</Box>
</form>
</FormProvider>
</Paper>
 
  );

};
 
export default AddDoctor;
 