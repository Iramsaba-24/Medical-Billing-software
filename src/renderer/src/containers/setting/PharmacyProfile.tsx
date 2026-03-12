// import React, { useRef, useState, useEffect } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   Divider,
//   Grid,
//   Button,
//   Stack,
// } from "@mui/material";
// import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
// import TextInputField from "@/components/controlled/TextInputField";
// import MobileField from "@/components/controlled/MobileField";
// import EmailField from "@/components/controlled/EmailField";

// import LogoImage from "@/assets/icons.svg"; //  default logo image

// type PharmacyFormValues = {
//   pharmacyName: string;
//   address: string;
//   drugLicense: string;
//   fssaiNo: string;
//   contact: string;
//   email: string;
//   bankName: string;
//   branchIfsc: string;
//   acNumber: string;
//   acHolderName: string;
// };

// /* DEFAULT VALUES */

// const defaultValues: PharmacyFormValues = {
//   pharmacyName: "ABC Medical Store",
//   address: "Main Road, City",
//   drugLicense: "DL-KA-2023-001245",
//   fssaiNo: "12345678901234",
//   contact: "9876543210",
//   email: "pharmacy@gmail.com",
//   bankName: "State Bank of India",
//   branchIfsc: "SBIN0001234",
//   acNumber: "123456789012",
//   acHolderName: "ABC Medical Store",
// };

// function PharmacyProfile() {
//   const methods = useForm<PharmacyFormValues>({
//     mode: "onChange",
//     defaultValues: defaultValues,
//   });

//   const { handleSubmit, reset } = methods;

//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   // default preview logo
//   const [previewImage, setPreviewImage] = useState<string | null>(LogoImage);

//   /* LOAD SAVED DATA */

//   useEffect(() => {
//     const savedData = localStorage.getItem("pharmacyProfile");
//     const savedLogo = localStorage.getItem("pharmacyLogo");

//     if (savedData) {
//       reset(JSON.parse(savedData));
//     }

//     if (savedLogo) {
//       setPreviewImage(savedLogo); //  show saved logo
//     } else {
//       setPreviewImage(LogoImage); // show default logo
//     }
//   }, [reset]);

//   /* SAVE */

//   const onSubmit: SubmitHandler<PharmacyFormValues> = (data) => {
//     console.log("Form submitted with:", data);

//     localStorage.setItem("pharmacyProfile", JSON.stringify(data));
//     localStorage.setItem("pharmacyName", data.pharmacyName);

//     if (previewImage) {
//       localStorage.setItem("pharmacyLogo", previewImage);
//     }

//     window.alert("Data saved successfully!");

//     window.location.reload();
//   };

//   /* IMAGE CHANGE */

//   const handleImageChange = (
//     event: React.ChangeEvent<HTMLInputElement>,
//   ): void => {
//     const file = event.target.files?.[0];

//     if (file) {
//       const reader = new FileReader();

//       reader.onloadend = () => {
//         setPreviewImage(reader.result as string);
//       };

//       reader.readAsDataURL(file);
//     }
//   };

//   /* RESET → DEFAULT VALUES */

//   const handleReset = (): void => {
//     reset(defaultValues);

//     setPreviewImage(LogoImage); //  reset logo to default

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const cardStyle = {
//     p: { xs: 2, md: 4 },
//     borderRadius: "5px",
//     boxShadow: 3,
//     mb: 1,
//   };

//   return (
//     <FormProvider {...methods}>
//       <form onSubmit={handleSubmit(onSubmit)} noValidate>
//         <Box mb={2}>
//           <Typography
//             sx={{
//               fontSize: { xs: 20, sm: 22, md: 24 },
//               fontWeight: 700,
//               color: "#111827",
//               mt: { xs: 1, md: 0.5 },
//               mb: 0.5,
//             }}
//           >
//             Pharmacy Profile
//           </Typography>
//         </Box>

//         <Box sx={{ width: "100%" }}>
//           {/* CARD 1 */}

//           <Paper sx={cardStyle}>
//             <Grid container spacing={{ xs: 3, md: 12 }}>
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Stack spacing={{ xs: 2, md: 2 }}>
//                   <TextInputField
//                     name="pharmacyName"
//                     label="Pharmacy Name"
//                     placeholder="Pharmacy Name"
//                     maxLength={30}
//                     inputType="all"
//                     rows={1}
//                     required
//                   />

//                   <TextInputField
//                     name="address"
//                     label="Address"
//                     placeholder="Address"
//                     inputType="textarea"
//                     rows={4}
//                     required
//                   />

//                   <TextInputField
//                     name="drugLicense"
//                     label="Drug License No."
//                     placeholder="DL-KA-2023-001245"
//                     inputType="all"
//                     rows={1}
//                     minLength={15}
//                     maxLength={20}
//                     required
//                   />
//                 </Stack>
//               </Grid>

//               {/* Right Column (Upload Logo + FSSAI) */}
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Stack
//                   spacing={{ md: 3 }}
//                   alignItems={{ xs: "center", md: "flex-start" }}
//                 >
//                   {/* Upload Logo */}
//                   <Box sx={{ width: "100%" }}>
//                     <Typography
//                       sx={{
//                         mb: 1,
//                         fontWeight: 600,
//                         textAlign: { md: "left" },
//                         xs: { ml: 5 },
//                       }}
//                     >
//                       Upload Logo
//                     </Typography>

//                     <Box
//                       sx={{
//                         display: "flex",
//                         flexDirection: "row",
//                         gap: { xs: 3, md: 6 },
//                         flexWrap: "wrap",

//                         alignItems: "center",
//                         justifyContent: { xs: "center", md: "flex-start" },
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           display: "flex",
//                           flexDirection: "column",
//                           alignItems: { xs: "center", md: "flex-start" },
//                         }}
//                       >
//                         <Button
//                           variant="contained"
//                           onClick={() => fileInputRef.current?.click()}
//                           sx={{
//                             bgcolor: "#2D8A7D",
//                             height: { xs: 50, md: 45 },
//                             minWidth: { xs: "100%", md: 120 },
//                             textTransform: "none",
//                             fontSize: { xs: 16, md: 14 },
//                             "&:hover": {
//                               bgcolor: "#fff",
//                               color: "#2D8A7D",
//                               border: "1px solid #2D8A7D",
//                             },
//                           }}
//                         >
//                           Upload
//                         </Button>

//                         <Typography
//                           variant="caption"
//                           sx={{ color: "#666", mt: 0.5, textAlign: "center" }}
//                         >
//                           (.JPEG or .PNG only)
//                         </Typography>

//                         <input
//                           type="file"
//                           ref={fileInputRef}
//                           hidden
//                           accept="image/*"
//                           onChange={handleImageChange}
//                         />
//                       </Box>

//                       <Box
//                         sx={{
//                           width: 140,
//                           height: 140,
//                           bgcolor: "#EEEEEE",
//                           border: "1px dashed #ccc",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           borderRadius: "5px",
//                         }}
//                       >
//                         {previewImage ? (
//                           <img
//                             src={previewImage}
//                             alt="Preview"
//                             style={{
//                               width: "100%",
//                               height: "100%",
//                               objectFit: "cover",
//                             }}
//                           />
//                         ) : (
//                           <Typography variant="caption">Preview</Typography>
//                         )}
//                       </Box>
//                     </Box>
//                   </Box>

//                   <Box sx={{ mt: { xs: 0, md: 12 }, width: "100%" }}>
//                     <TextInputField
//                       name="fssaiNo"
//                       label="FSSAI No."
//                       placeholder="12345678901234"
//                       type="number"
//                       maxLength={25}
//                       sx={{ mt: 8 }}
//                       required
//                     />
//                   </Box>
//                 </Stack>
//               </Grid>
//             </Grid>
//           </Paper>

//           {/* CARD 2 */}

//           <Paper sx={cardStyle}>
//             <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
//               Contact Details
//             </Typography>

//             <Divider sx={{ my: 2 }} />

//             <Grid container spacing={{ xs: 2, md: 9 }}>
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <MobileField
//                   name="contact"
//                   label="Contact Number"
//                   placeholder="9876543210"
//                   countryCode
//                   required
//                 />
//               </Grid>

//               <Grid size={{ xs: 12, md: 6 }}>
//                 <EmailField
//                   name="email"
//                   label="Email Address"
//                   required
//                   maxLength={50}
//                 />
//               </Grid>
//             </Grid>
//           </Paper>

//           {/* BUTTONS */}

//           <Box
//             sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 4 }}
//           >
//             <Button
//               type="button"
//               variant="outlined"
//               onClick={handleReset}
//               sx={{
//                 color: "#238878",
//                 border: "2px solid #238878",
//                 textTransform: "none",
//               }}
//             >
//               Reset
//             </Button>

//             <Button
//               type="submit"
//               variant="contained"
//               sx={{
//                 backgroundColor: "#238878",
//                 color: "#fff",
//                 border: "2px solid #238878",
//                 textTransform: "none",
//               }}
//             >
//               Save
//             </Button>
//           </Box>
//         </Box>
//       </form>
//     </FormProvider>
//   );
// }

// export default PharmacyProfile;



import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid,
  Button,
  Stack,
} from "@mui/material";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import TextInputField from "@/components/controlled/TextInputField";
import MobileField from "@/components/controlled/MobileField";
import EmailField from "@/components/controlled/EmailField";

import LogoImage from "@/assets/icons.svg"; //  default logo image

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

/* DEFAULT VALUES */

const defaultValues: PharmacyFormValues = {
  pharmacyName: "ABC Medical Store",
  address: "Main Road, City",
  drugLicense: "DL-KA-2023-001245",
  fssaiNo: "12345678901234",
  contact: "9876543210",
  email: "pharmacy@gmail.com",
  bankName: "State Bank of India",
  branchIfsc: "SBIN0001234",
  acNumber: "123456789012",
  acHolderName: "ABC Medical Store",
};

function PharmacyProfile() {
  const methods = useForm<PharmacyFormValues>({
    mode: "onChange",
    defaultValues: defaultValues,
  });

  const { handleSubmit, reset } = methods;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // default preview logo
  const [previewImage, setPreviewImage] = useState<string | null>(LogoImage);

  /* LOAD SAVED DATA */

  useEffect(() => {
    const savedData = localStorage.getItem("pharmacyProfile");
    const savedLogo = localStorage.getItem("pharmacyLogo");

    if (savedData) {
      reset(JSON.parse(savedData));
    }

    if (savedLogo) {
      setPreviewImage(savedLogo); //  show saved logo
    } else {
      setPreviewImage(LogoImage); // show default logo
    }
  }, [reset]);

  /* SAVE */

  const onSubmit: SubmitHandler<PharmacyFormValues> = (data) => {
    console.log("Form submitted with:", data);

    localStorage.setItem("pharmacyProfile", JSON.stringify(data));
    localStorage.setItem("pharmacyName", data.pharmacyName);

      // ADD THIS   Drug License save
  localStorage.setItem("drugLicense", data.drugLicense);

    if (previewImage) {
      localStorage.setItem("pharmacyLogo", previewImage);
    }

    window.alert("Data saved successfully!");

    window.location.reload();
  };

  /* IMAGE CHANGE */

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  /* RESET → DEFAULT VALUES */

  const handleReset = (): void => {
    reset(defaultValues);

    setPreviewImage(LogoImage); //  reset logo to default

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const cardStyle = {
    p: { xs: 2, md: 4 },
    borderRadius: "5px",
    boxShadow: 3,
    mb: 1,
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box mb={2}>
          <Typography
            sx={{
              fontSize: { xs: 20, sm: 22, md: 24 },
              fontWeight: 700,
              color: "#111827",
              mt: { xs: 1, md: 0.5 },
              mb: 0.5,
            }}
          >
            Pharmacy Profile
          </Typography>
        </Box>

        <Box sx={{ width: "100%" }}>
          {/* CARD 1 */}

          <Paper sx={cardStyle}>
            <Grid container spacing={{ xs: 3, md: 12 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={{ xs: 2, md: 2 }}>
                  <TextInputField
                    name="pharmacyName"
                    label="Pharmacy Name"
                    placeholder="Pharmacy Name"
                    maxLength={30}
                    inputType="all"
                    rows={1}
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
                    inputType="all"
                    rows={1}
                    minLength={15}
                    maxLength={20}
                    required
                  />
                </Stack>
              </Grid>

              {/* Right Column (Upload Logo + FSSAI) */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack
                  spacing={{ md: 3 }}
                  alignItems={{ xs: "center", md: "flex-start" }}
                >
                  {/* Upload Logo */}
                  <Box sx={{ width: "100%" }}>
                    <Typography
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                        textAlign: { md: "left" },
                        xs: { ml: 5 },
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

                  <Box sx={{ mt: { xs: 0, md: 12 }, width: "100%" }}>
                    <TextInputField
                      name="fssaiNo"
                      label="FSSAI No."
                      placeholder="12345678901234"
                      type="number"
                      maxLength={25}
                      sx={{ mt: 8 }}
                      required
                    />
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* CARD 2 */}

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
                  countryCode
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <EmailField
                  name="email"
                  label="Email Address"
                  required
                  maxLength={50}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* BUTTONS */}

          <Box
            sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 4 }}
          >
            <Button
              type="button"
              variant="outlined"
              onClick={handleReset}
              sx={{
                color: "#238878",
                border: "2px solid #238878",
                textTransform: "none",
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
