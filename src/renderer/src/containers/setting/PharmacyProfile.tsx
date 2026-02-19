
import React, { useRef, useState } from "react";
import {Box,Paper,Typography,Divider,Grid,Button,Stack,} from "@mui/material";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import TextInputField from "@/components/controlled/TextInputField";
import MobileField from "@/components/controlled/MobileField";
import EmailField from "@/components/controlled/EmailField";
 

type PharmacyFormValues = {
  pharmacyName: string;
  address: string;
  drugLicense: string;
  fssaiNo: string;
  contact: string;
  email: string;
  bankName: string;
  branchIfsc: string;
  acNumber: string;
  acHolderName: string;
};
 
function PharmacyProfile() {
  const methods = useForm<PharmacyFormValues>({
    mode: "onChange",
    defaultValues: {
      pharmacyName: "",
      address: "",
      drugLicense: "",
      fssaiNo: "",
      contact: "",
      email: "",
      bankName: "",
      branchIfsc: "",
      acNumber: "",
      acHolderName: "",
    },
  });
 
  const { handleSubmit, reset } = methods;
 
  const fileInputRef = useRef<HTMLInputElement | null>(null);
 
  // Image preview state
  const [previewImage, setPreviewImage] = useState<string | null>(null);
 
  const onSubmit: SubmitHandler<PharmacyFormValues> = (data) => {
    console.log("Form submitted with:", data);
    window.alert("Data saved successfully!");
    handleReset();
  };
 
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };
 
  /* Reset */
  const handleReset = (): void => {
    reset();
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
 
  /* Styles */
 const cardStyle = {
  p: { xs: 2, md: 4 },
  borderRadius: "5px",
  boxShadow: 3,
  mb: 1,
};
 
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ width: "100%", backgroundColor: "#f9f9f9", }}>
 
  <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: { xs: 2, md: 4} }}
            >
              Pharmacy Profile
            </Typography>
          {/* CARD 1 : Pharmacy Profile */}
          <Paper sx={cardStyle}>
           
 
            <Grid container spacing={{ xs: 3, md: 12 }}>
              {/* Left Column */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={{ xs: 2, md: 2 }}>
                  <TextInputField
                    name="pharmacyName"
                    label="Pharmacy Name"
                    placeholder="Pharmacy Name"
                    required
                  />
 
                  <TextInputField
                    name="address"
                    label="Address"
                    placeholder="Address"
                    inputType="textarea"
                    rows={4}
                    required
                  />
 
                  <TextInputField
                    name="drugLicense"
                    label="Drug License No."
                    placeholder="DL-KA-2023-001245"
                    required
                     
                  />
                </Stack>
              </Grid>
 
              {/* Right Column (Upload Logo + FSSAI) */}
              <Grid size={{ xs: 12, md: 6}}>
                <Stack
                  spacing={{  md: 3}}
                  alignItems={{ xs: "center", md: "flex-start" }}
                >
                  {/* Upload Logo */}
                  <Box sx={{ width: "100%" }}>
                    <Typography
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                        textAlign: { md: "left" },
                       xs:{ml:5} ,
                      }}
                    >
                      Upload Logo
                    </Typography>
 
                    <Box
                      sx={{
                        display: "flex",
                      flexDirection: "row",
                        gap: { xs: 3, md: 6 },
                        flexWrap: "wrap",
                 
                        alignItems: "center",
                        justifyContent: { xs: "center", md: "flex-start" },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: { xs: "center", md: "flex-start" },
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={() => fileInputRef.current?.click()}
                          sx={{
                            bgcolor: "#2D8A7D",
                            height: { xs: 50, md: 45 },
                            minWidth: { xs: "100%", md: 120 },
                            textTransform: "none",
                            fontSize: { xs: 16, md: 14 },
                            "&:hover": {
                              bgcolor: "#fff",
                              color: "#2D8A7D",
                              border: "1px solid #2D8A7D",
                            },
                          }}
                        >
                          Upload
                        </Button>
 
                        <Typography
                          variant="caption"
                          sx={{ color: "#666", mt: 0.5, textAlign: "center" }}
                        >
                          (.JPEG or .PNG only)
                        </Typography>
 
                        <input
                          type="file"
                          ref={fileInputRef}
                          hidden
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </Box>
 
                      <Box
                        sx={{
                          width: 140,
                          height: 140,
                          bgcolor: "#EEEEEE",
                          border: "1px dashed #ccc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "5px",
                        }}
                      >
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Typography variant="caption">Preview</Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
 
                  {/* FSSAI No */}
                  <Box sx={{ mt: { xs: 0, md: 12 }, width: "100%" }}>
                    <TextInputField
                      name="fssaiNo"
                      label="FSSAI No."
                      placeholder="12345678901234"
                      sx={{ mt: 8 }}
                      required
 
 
                    />
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
 
          {/* CARD 2 : Contact Details */}
          <Paper sx={cardStyle}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Contact Details
            </Typography>
            <Divider sx={{ my: 2 }} />
 
            <Grid container spacing={{ xs: 2, md: 9 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <MobileField
                  name="contact"
                  label="Contact Number"
                  placeholder="9876543210"
                  required
                />
              </Grid>
 
              <Grid size={{ xs: 12, md: 6 }}>
                <EmailField name="email" label="Email Address" required />
              </Grid>
            </Grid>
          </Paper>
 
          {/* CARD 3 : Bank Details */}
          <Paper sx={cardStyle}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Bank Details
            </Typography>
            <Divider sx={{ my: 2 }} />
 
            <Grid container spacing={{ xs: 3, md: 9 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2}>
                  <TextInputField name="bankName" label="Bank Name" required />
 
                  <TextInputField
                    name="acNumber"
                    label="A/C Number"
                    placeholder="12345678912"
                    required
                 
                  />
                </Stack>
              </Grid>
 
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2}>
                  <TextInputField
                    name="branchIfsc"
                    label="Branch / IFSC"
                    placeholder="SBIN0000456"
                    required
                  />
 
                  <TextInputField
                    name="acHolderName"
                    label="A/C Holder Name"
                    required
                  />
                </Stack>
              </Grid>
            </Grid>
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
      </form>
    </FormProvider>
  );
}
 
export default PharmacyProfile;