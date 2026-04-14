import { Box, Button, Typography } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import BgImage from "@/assets/bgloginpage.svg";
import LogoImage from "@/assets/logoimg.svg";
import RadioField from "@/components/controlled/RadioField";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import { showToast } from "@/components/uncontrolled/ToastMessage";

type PlanForm = {
  plan: string;
};
const planAmountMapping: Record<string, number> = {
  basic: 999,
  standard: 1999,
  premium: 2999,
};

const radioStyle = {
  "& .MuiRadio-root": {
    color: "default.main",
    "&.Mui-checked": {
      color: "#238878",
    },
  },
};

const ChoosePlan = () => {
  const methods = useForm<PlanForm>({
    defaultValues: {
      plan: "",
    },
  });
const radioStyle = {
  "& .MuiRadio-root": {
    color: "default.main",
    "&.Mui-checked": { color: "#238878" },
  },
};
  const navigate = useNavigate();

<<<<<<< HEAD
  const onSubmit = (data: PlanForm) => {
    console.log("Plan selected:", data);

    localStorage.setItem("selectedPlan", data.plan);

    const existingData = JSON.parse(
      localStorage.getItem("registrationData") || "{}"
    );
    const completeData = { ...existingData, plan: data.plan };
    localStorage.setItem("registrationData", JSON.stringify(completeData));

    showToast("success", "Plan selected successfully!");

    navigate(URL_PATH.AccountSetup);
  };
=======
const onSubmit = (data: PlanForm) => {
  const amount = planAmountMapping[data.plan];

  localStorage.setItem("selectedPlan", data.plan);
  localStorage.setItem("selectedAmount", amount.toString());

  const existingData = JSON.parse(localStorage.getItem("registrationData") || '{}');
  const completeData = { ...existingData, plan: data.plan, amount };
  localStorage.setItem('registrationData', JSON.stringify(completeData));

  showToast("success", "Plan selected successfully!");
  navigate(URL_PATH.AccountSetup);
};
>>>>>>> bb6fb6a6eae991e9d6b094c581ef2d821f351aab

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundImage: `url(${BgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: '"Poppins", sans-serif',
      }}
    >
      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={methods.handleSubmit(onSubmit)}
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 0.5,
            px: 2,
          }}
        >
          <img
            src={LogoImage}
            style={{
              width: "100%",
              maxWidth: "160px",
            }}
            alt="Logo"
          />

          <Typography
            sx={{
              mt: 0.5,
              mb: 1.5,
              color: "#333",
              fontWeight: 500,
              fontSize: { xs: "1.6rem", sm: "2rem" },
            }}
          >
            Choose Your Plan
          </Typography>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: 360,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <RadioField
                label=""
                name="plan"
                required
                options={[
                  { label: "Basic Plan - ₹999 / month", value: "basic" },
                  { label: "Standard Plan - ₹1999 / month", value: "standard" },
                  { label: "Premium Plan - ₹2999 / month", value: "premium" },
                ]}
                sx={{
                  ...radioStyle,
<<<<<<< HEAD
                  mb: 2,
                  "& .MuiFormLabel-root": {
                    color: "#000 !important",
                  },
                  "& .MuiFormLabel-root.Mui-focused": {
                    color: "#000 !important",
                  },
                  "& .MuiFormLabel-asterisk": {
                    display: "none",
=======
                  "& .MuiFormLabel-asterisk": {
                    display: "none", 
>>>>>>> bb6fb6a6eae991e9d6b094c581ef2d821f351aab
                  },
                }}
              />
            </Box>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              maxWidth: 420,
              mt: { xs: 3, sm: 5 },
              fontWeight: 600,
              fontSize: { xs: "1rem", sm: "1.05rem" },
              backgroundColor: "#1b7f6b",
              textTransform: "none",
              border: "2px solid #1b7f6b",
              boxShadow: "0 0 0 1.5px #ffffff, 0 6px 14px rgba(0,0,0,0.25)",
              transition: "all 0.25s ease",
              "&:hover": {
                backgroundColor: "#fff",
                color: "#1b7f6b",
                border: "2px solid #1b7f6b",
              },
            }}
          >
            Next Step
          </Button>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default ChoosePlan;




// import { Box, Button, Typography } from "@mui/material";
// import { useForm, FormProvider } from "react-hook-form";
// import BgImage from "@/assets/bgloginpage.svg";
// import LogoImage from "@/assets/logoimg.svg";
// import RadioField from "@/components/controlled/RadioField";
// import { useNavigate } from "react-router-dom";
// import { URL_PATH } from "@/constants/UrlPath";
// import { showToast } from "@/components/uncontrolled/ToastMessage";
// import { useState } from "react";

// type PlanForm = {
//   plan: string;
// };

// const ChoosePlan = () => {
//   const methods = useForm<PlanForm>({
//     defaultValues: {
//       plan: "",
//     },
//   });

//   const navigate = useNavigate();
//    const [isLoading, setIsLoading] = useState(false);

//   const onSubmit = (data: PlanForm) => {
//     console.log(data);
//     const existingData = JSON.parse(localStorage.getItem('registrationData') || '{}');
//     const completeData = { ...existingData, plan: data.plan };
//     localStorage.setItem('registrationData', JSON.stringify(completeData)); localStorage.setItem('registrationData', JSON.stringify(completeData));
//     localStorage.setItem('selectedPlan', data.plan);
//     showToast("success", "Plan selected successfully!");
//     navigate(URL_PATH.AccountSetup);
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         backgroundImage: `url(${BgImage})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         fontFamily: '"Poppins", sans-serif',
//       }}
//     >
//       <FormProvider {...methods}>
//         <Box
//           component="form"
//           onSubmit={methods.handleSubmit(onSubmit)}
//           sx={{
//             minHeight: "100vh",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             textAlign: "center",
//             gap: 0.5,
//             px: 2,
//           }}
//         >
//           {/* Logo */}
//           <img
//             src={LogoImage}
//             style={{
//               width: "100%",
//               maxWidth: "160px",
//             }}
//           />

//           {/* Title */}
//           <Typography
//             sx={{
//               mt: 0.5,
//               mb: 1.5,
//               color: "#333",
//               fontWeight: 500,
//               fontSize: { xs: "1.6rem", sm: "2rem" },
//             }}
//           >
//             Choose Your Plan
//           </Typography>

//           {/* Radio Options */}
//           <Box
//             sx={{
//               width: "100%",
//               display: "flex",
//               justifyContent: "center",
//             }}
//           >
//             <Box
//               sx={{
//                 width: "100%",
//                 maxWidth: 360,
//                 ml: { xs: 2, sm: 6, md: 10 },
//               }}
//             >
//               <RadioField
//                 label=""
//                 name="plan"
//                 required

//                 options={[
//                   { label: "Basic Plan -₹999 / month", value: "basic" },
//                   { label: "Standard Plan -₹1999 / month", value: "standard" },
//                   { label: "Premium Plan -₹2999 / month", value: "premium" },
//                 ]}
//               />
//             </Box>
//           </Box>

//           {/* Updated Button */}
//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{
//               maxWidth: 420,
//               mt: { xs: 3, sm: 5 },
//               fontWeight: 600,
//               fontSize: { xs: "1rem", sm: "1.05rem" },
//               backgroundColor: "#1b7f6b",
//               textTransform: "none",
//               border: "2px solid #1b7f6b",
//               boxShadow:
//                 "0 0 0 1.5px #ffffff, 0 6px 14px rgba(0,0,0,0.25)",
//               transition: "all 0.25s ease",
//               "&:hover": {
//                 backgroundColor: "#fff",
//                 color: "#1b7f6b",
//                 border: "2px solid #1b7f6b",
//               },
//             }}
//           >
//             Next Step
//           </Button>
//         </Box>
//       </FormProvider>
//     </Box>
//   );
// };

// export default ChoosePlan;