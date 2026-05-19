
// import { useForm, FormProvider } from "react-hook-form";
// import { Box, Button, Typography, Paper } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import TextInputField from "@/components/controlled/TextInputField";
// import EmailField from "@/components/controlled/EmailField";
// import MobileField from "@/components/controlled/MobileField";
// import DateTimeField from "@/components/controlled/DateTimeField";
// import { useState } from "react";
// import AppToast from "@/containers/distributors/AppToast";
// import { URL_PATH } from "@/constants/UrlPath";
// import { addDistributor, checkFieldExists, } from "@/service/distributorService";

//  import { useLocation } from "react-router-dom";
// import { useEffect } from "react";
// import { updateDistributor } from "@/service/distributorService";
// import { showToast } from "@/components/uncontrolled/ToastMessage";
 
// type DistributorFormInput = {
//   distributorId: number;
//   companyName: string;
//   ownerName?: string;
//   phone: string;
//   email: string;
//   createdAt: string;
//   registrationNumber: string;
//   website: string;
//   gstin: string;
//   address: string;
//   bankName: string;
//   accountNumber: string;
//   accountHolderName: string;
//   branch: string;
//   ifscCode: string;
//   upiId: string;
// };
 
// const DistributorsForm = () => {
//   const methods = useForm<DistributorFormInput>({
//     defaultValues: {
//       companyName: "",
//       ownerName: "",
//       phone: "",
//       email: "",
//       createdAt: "",
//       registrationNumber: "",
//       website: "",
//       gstin: "",
//       address: "",
//       bankName: "",
//       accountNumber: "",
//       accountHolderName: "",
//       branch: "",
//       ifscCode: "",
//       upiId: "",
//     },
//     mode: "onChange",
//   });
 
//   const location = useLocation();
// const editData = location.state?.distributor;
 
 
// useEffect(() => {
//   if (editData) {
//     methods.reset({
//       companyName: editData.companyName,
//       ownerName: editData.ownerName,
//       phone: editData.phone,
//       email: editData.email,
 
 
//        createdAt: editData.createdDate
//         ? editData.createdDate.split("T")[0]
//         : "",
//      // createdAt: editData.createdDate,
//       registrationNumber: editData.registrationNumber,
//       website: editData.website || "",
//       gstin: editData.gstin,
//       address: editData.address,
//       bankName: editData.bankDetails?.bankName || "",
//       accountNumber: editData.bankDetails?.accountNumber || "",
//       accountHolderName: editData.bankDetails?.accountHolderName || "",
//       branch: editData.bankDetails?.branch || "",
//       ifscCode: editData.bankDetails?.ifscCode || "",
//       upiId: editData.bankDetails?.upiId || "",
//     });
//   }
// }, [editData, methods]);
 
//   const navigate = useNavigate();
//   const [toastOpen, setToastOpen] = useState(false);
  
  
// const onSubmit = async (data: DistributorFormInput) => {
//   try {
  

//     // EMAIL
// const emailExists = await checkFieldExists("email", data.email);
// if (emailExists && data.email !== editData?.email) {
//   methods.setError("email", {
//     type: "manual",
//     message: "Email already exists",
//   });
//   return;
// }

// // PHONE
// const phoneExists = await checkFieldExists("phone", data.phone);
// if (phoneExists && data.phone !== editData?.phone) {
//   methods.setError("phone", {
//     type: "manual",
//     message: "Phone number already exists",
//   });
//   return;
// }

// // GSTIN
// const gstinExists = await checkFieldExists("gstin", data.gstin);
// if (gstinExists && data.gstin !== editData?.gstin) {
//   methods.setError("gstin", {
//     type: "manual",
//     message: "GSTIN already exists",
//   });
//   return;
// }

// //registration number

// const regExists = await checkFieldExists(
//   "registrationNumber",
//   data.registrationNumber
// );

// if (regExists && data.registrationNumber !== editData?.registrationNumber) {
//   methods.setError("registrationNumber", {
//     type: "manual",
//     message: "Registration number already exists",
//   });
//   return;
// }

//     const cleanedData = {
//       ...data,
//       ownerName: data.ownerName || "",
//       website: data.website ? data.website : undefined,
//     };

//     if (editData) {
//       await updateDistributor(editData.id, cleanedData);
//     } else {
//       await addDistributor(cleanedData);
//     }

//     showToast("success", "Business details saved!");

//     setTimeout(() => {
//       navigate(URL_PATH.DistributorsPage);
//     }, 1000);

//   } catch (error: unknown) {
//     console.error(error);
//   }
// };
// return (
//     <Box p={2} sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
//       <FormProvider {...methods}>
//         <form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
         
//           <Paper
//             sx={{
//               maxWidth: 800,
//               mx: "auto",
//               p: 2,
//               backgroundColor: "#fff",
//               borderRadius: "10px",
//               boxShadow: 3,
//               mb: 3,
//             }}
//           >
//             <Typography variant="h6" mb={3} fontWeight={600}>
//               Add Distributor
//             </Typography>
 
//             <Box
//               sx={{
//                 display: "grid",
//                 gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
//                 gap: 2,
//                 mt: 2,
//               }}
//             >
//               <TextInputField
//                 name="companyName"
//                 label="Company Name"
//                 minLength={3}
//                 maxLength={30}
//                 inputType="textarea"
//                 rows={1}
//                 required
//               />
 
//               <TextInputField
//                 name="ownerName"
//                 label="Owner Name"
//                 inputType="alphabet"
//                 minLength={3}
//                 maxLength={30}
//                 required
//               />
 
//               <MobileField
//                 name="phone"
//                 label="Phone"
//                 placeholder="Mobile Number"
//                 countryCode
//                 preventDuplicate
//                 required
//               />
 
//               <EmailField
//                 name="email"
//                 label="Email"
//                 required
//                 maxLength={50}
//                 preventDuplicate
//               />
 
//               <DateTimeField
//                 name="createdAt"
//                 label="Date"
//                 viewMode="date"
//                 useCurrentDate={true}
//                 disabled
//                 dateRestriction="current-future-only"
//                 required
//               />
 
//               <TextInputField
//                 name="registrationNumber"
//                 label="Registration Number"
//                 type="number"
//                 preventDuplicate
//                 required
//                 maxLength={14}
//               />
 
//               <TextInputField
//                 name="gstin"
//                 label="GSTIN"
//                 placeholder=" e.g 27AAAAA0000A1ZS"
//                 preventDuplicate
//                 rows={1}
//                 required
//                 rules={{
//                   pattern: {
//                     value:
//                       /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
//                     message: "Enter valid GSTIN (e.g., 22AAAAA0000A1Z5)",
//                   },
//                 }}
//               />
//             </Box>
 
//             <Box sx={{ mt: 2 }}>
//               <TextInputField
//                 name="address"
//                 label="Address"
//                 inputType="textarea"
//                 rows={2}
//                 required
//                 maxLength={50}
//                 minLength={10}
//               />
//             </Box>
//           </Paper>
//           <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 6 }}>
//             <Button
//               variant="outlined"
//               onClick={() => navigate(URL_PATH.DistributorsPage)}
//               sx={{
//                 color: "#238878",
//                 border: "2px solid #238878",
//                 textTransform: "none",
//                 "&:hover": {
//                   backgroundColor: "#238878",
//                   color: "#fff",
//                 },
//               }}
//             >
//               Cancel
//             </Button>
 
//             <Button
//               type="submit"
//               variant="contained"
//               sx={{
//                 backgroundColor: "#238878",
//                 color: "#fff",
//                 border: "2px solid #238878",
//                 textTransform: "none",
//                 "&:hover": {
//                   backgroundColor: "#fff",
//                   color: "#238878",
//                 },
//               }}
//             >
//               Save
//             </Button>
//           </Box>
//         </form>
//       </FormProvider>
 
//       <AppToast
//         open={toastOpen}
//         message="Data saved successfully"
//         severity="success"
//         onClose={() => setToastOpen(false)}
//       />
//     </Box>
//   );
// };
 
// export default DistributorsForm;                          
 

import { useForm, FormProvider } from "react-hook-form";

import { Box, Button, Typography, Paper } from "@mui/material";

import { useNavigate } from "react-router-dom";

import TextInputField from "@/components/controlled/TextInputField";

import EmailField from "@/components/controlled/EmailField";

import MobileField from "@/components/controlled/MobileField";

import DateTimeField from "@/components/controlled/DateTimeField";

import { useState } from "react";

import AppToast from "@/containers/distributors/AppToast";

import { URL_PATH } from "@/constants/UrlPath";

import { addDistributor, checkFieldExists, } from "@/service/distributorService";

import { useLocation } from "react-router-dom";

import { useEffect } from "react";

import { updateDistributor } from "@/service/distributorService";

import { showToast } from "@/components/uncontrolled/ToastMessage";

import { useAutoSave } from "@/hooks/Useautosave";
 
type DistributorFormInput = {

  distributorId: number;

  companyName: string;

  ownerName?: string;

  phone: string;

  email: string;

  createdAt: string;

  registrationNumber: string;

  website: string;

  gstin: string;

  address: string;

  bankName: string;

  accountNumber: string;

  accountHolderName: string;

  branch: string;

  ifscCode: string;

  upiId: string;

};
 
const DistributorsForm = () => {

  const methods = useForm<DistributorFormInput>({

    defaultValues: {

      companyName: "",

      ownerName: "",

      phone: "",

      email: "",

      createdAt: "",

      registrationNumber: "",

      website: "",

      gstin: "",

      address: "",

      bankName: "",

      accountNumber: "",

      accountHolderName: "",

      branch: "",

      ifscCode: "",

      upiId: "",

    },

    mode: "onChange",

  });
 
  const location = useLocation();

  const editData = location.state?.distributor;
 
  const { clearData } = useAutoSave({

    storageKey: "add_distributor_form_v2",

    methods,

  });
 
  useEffect(() => {

    if (editData) {

      methods.reset({

        companyName: editData.companyName,

        ownerName: editData.ownerName,

        phone: editData.phone,

        email: editData.email,

        createdAt: editData.createdDate

          ? editData.createdDate.split("T")[0]

          : "",

        registrationNumber: editData.registrationNumber,

        website: editData.website || "",

        gstin: editData.gstin,

        address: editData.address,

        bankName: editData.bankDetails?.bankName || "",

        accountNumber: editData.bankDetails?.accountNumber || "",

        accountHolderName: editData.bankDetails?.accountHolderName || "",

        branch: editData.bankDetails?.branch || "",

        ifscCode: editData.bankDetails?.ifscCode || "",

        upiId: editData.bankDetails?.upiId || "",

      });

    }

  }, [editData, methods]);
 
  const navigate = useNavigate();

  const [toastOpen, setToastOpen] = useState(false);
 
  const onSubmit = async (data: DistributorFormInput) => {

    try {

      const emailExists = await checkFieldExists("email", data.email);

      if (emailExists && data.email !== editData?.email) {

        methods.setError("email", {

          type: "manual",

          message: "Email already exists",

        });

        return;

      }
 
      const phoneExists = await checkFieldExists("phone", data.phone);

      if (phoneExists && data.phone !== editData?.phone) {

        methods.setError("phone", {

          type: "manual",

          message: "Phone number already exists",

        });

        return;

      }
 
      const gstinExists = await checkFieldExists("gstin", data.gstin);

      if (gstinExists && data.gstin !== editData?.gstin) {

        methods.setError("gstin", {

          type: "manual",

          message: "GSTIN already exists",

        });

        return;

      }
 
      const regExists = await checkFieldExists("registrationNumber", data.registrationNumber);

      if (regExists && data.registrationNumber !== editData?.registrationNumber) {

        methods.setError("registrationNumber", {

          type: "manual",

          message: "Registration number already exists",

        });

        return;

      }
 
      const cleanedData = {

        ...data,

        ownerName: data.ownerName || "",

        website: data.website ? data.website : undefined,

      };
 
      if (editData) {

        await updateDistributor(editData.id, cleanedData);

      } else {

        await addDistributor(cleanedData);

      }
 
      showToast("success", "Business details saved!");

      clearData();
 
      setTimeout(() => {

        navigate(URL_PATH.DistributorsPage);

      }, 1000);
 
    } catch (error: unknown) {

      console.error(error);

    }

  };
 
  return (
<Box p={2} sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
<FormProvider {...methods}>
<form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
<Paper

            sx={{

              maxWidth: 800,

              mx: "auto",

              p: 2,

              backgroundColor: "#fff",

              borderRadius: "10px",

              boxShadow: 3,

              mb: 3,

            }}
>
<Typography variant="h6" mb={3} fontWeight={600}>

              Add Distributor
</Typography>
 
            <Box

              sx={{

                display: "grid",

                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },

                gap: 2,

                mt: 2,

              }}
>
<TextInputField

                name="companyName"

                label="Company Name"

                minLength={3}

                maxLength={30}

                inputType="textarea"

                rows={1}

                required

              />
 
              <TextInputField

                name="ownerName"

                label="Owner Name"

                inputType="alphabet"

                minLength={3}

                maxLength={30}

                required

              />
 
              <MobileField

                name="phone"

                label="Phone"

                placeholder="Mobile Number"

                countryCode

                preventDuplicate

                required

              />
 
              <EmailField

                name="email"

                label="Email"

                required

                maxLength={50}

                preventDuplicate

              />
 
              <DateTimeField

                name="createdAt"

                label="Date"

                viewMode="date"

                useCurrentDate={true}

                disabled

                dateRestriction="current-future-only"

                required

              />
 
              <TextInputField

                name="registrationNumber"

                label="Registration Number"

                type="number"

                preventDuplicate

                required

                maxLength={14}

              />
 
              <TextInputField

                name="gstin"

                label="GSTIN"

                placeholder=" e.g 27AAAAA0000A1ZS"

                preventDuplicate

                rows={1}

                required

                rules={{

                  pattern: {

                    value:

                      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,

                    message: "Enter valid GSTIN (e.g., 22AAAAA0000A1Z5)",

                  },

                }}

              />
</Box>
 
            <Box sx={{ mt: 2 }}>
<TextInputField

                name="address"

                label="Address"

                inputType="textarea"

                rows={2}

                required

                maxLength={50}

                minLength={10}

              />
</Box>
</Paper>
 
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 6 }}>
<Button

              variant="outlined"

              onClick={() => {

                clearData();

                navigate(URL_PATH.DistributorsPage);

              }}

              sx={{

                color: "#238878",

                border: "2px solid #238878",

                textTransform: "none",

                "&:hover": {

                  backgroundColor: "#238878",

                  color: "#fff",

                },

              }}
>

              Cancel
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

                },

              }}
>

              Save
</Button>
</Box>
</form>
</FormProvider>
 
      <AppToast

        open={toastOpen}

        message="Data saved successfully"

        severity="success"

        onClose={() => setToastOpen(false)}

      />
</Box>

  );

};
 
export default DistributorsForm;
 