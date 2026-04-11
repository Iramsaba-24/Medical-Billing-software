import EmailField from "@/components/controlled/EmailField";
import MobileField from "@/components/controlled/MobileField";
import TextInputField from "@/components/controlled/TextInputField";
import { URL_PATH } from "@/constants/UrlPath";
import { Box, Button, Paper, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { addDoctor } from "@/service/doctorService";

export interface AddDoctorFormValues {
  doctorName: string;
  degree: string;
  phone: string;
  email: string;
  registrationNumber: string;
  hospitalAddress: string;
  status: "Active";
}

const AddDoctor = () => {
  const methods = useForm<AddDoctorFormValues>({
    defaultValues: {
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

  const navigate = useNavigate();

const onSubmit = async (data: AddDoctorFormValues) => {
  try {
    await addDoctor({
      ...data,
      isActive: data.status === "Active", 
    });

    navigate(URL_PATH.Doctors);
  } catch (error) {
    console.error(error);
  }
};

  return (
   <Paper sx={{ p: { xs:2, md:4 }, mx: { xs:1, md:4 }, my: { xs:1, md:4 } }}>
  <Typography fontSize={22} mb={2}>
    Add Doctor
  </Typography>
  <hr />

  <FormProvider {...methods}>
    <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
      <Box
        maxWidth="900px"
        mx="auto"
        px={{ xs:1, md:6 }}
      >

   {/* doctor name & degree */}

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

    {/* phone & email  */}
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

    {/* registration number */}
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

      {/* address */}
        <Box mt={3}>
          <TextInputField
            name="hospitalAddress"
            label="Clinic / Hospital Address"
            inputType="all"
            required
            rules={{ required: "Address is required" }}
          />
        </Box>

      {/* save & cancel button */}
        <Box
          display="flex"
          justifyContent="flex-end"
          gap={2}
          mt={4}
        >
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
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