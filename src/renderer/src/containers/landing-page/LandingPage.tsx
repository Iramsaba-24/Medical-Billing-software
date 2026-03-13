// import { Box, Button, Container, Typography } from "@mui/material"
// import { useLocation, useNavigate } from "react-router-dom";
// import landing_img from "@/assets/LandingPage.svg"
// import { URL_PATH } from "@/constants/UrlPath";
 
// // default data
// const User = {
//     name : "User",
//    // userName: "user01",
//    // licenseNo : "MP123456789",
//     licenseStatus : "Active"
// };
 
// const getGreeting = () => {
//   const hour = new Date().getHours();
//    switch (true) {
//     case hour >= 5 && hour < 12:
//       return "Good Morning";
//     case hour >= 12 && hour < 17:
//       return "Good Afternoon";
//     case hour >= 17 && hour < 21:
//       return "Good Evening";
//     default:
//       return "Good Night";
//    }
// };
 
// const LandingPage = () => {
//   const navigate = useNavigate();
//   const greeting = getGreeting();
//   const location = useLocation();
//   const { username, licenseKey } = location.state || {};  
 
//   return (
//   <>
//    <Box sx={{minHeight: "100vh"}}>
//     <Container maxWidth= {false} sx={{ bgcolor: "#D7FFFB", borderRadius:2, boxShadow:2, py:4}}>
 
//     <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection={{ xs:"column", md:"row" }}>
 
//         {/* left side */}
//         <Box mb={{ xs:2, md:0 }} textAlign={{xs:"center", md:"left"}}>
//             <Typography fontSize={20} fontWeight={600} sx={{ pb: {xs:0, md:1}}}>
//                {greeting}, {User.name}
//             </Typography>
//             <Typography fontWeight={500}>Experience your Comfort Zone With Us!</Typography>
//         </Box>
 
//         {/* right side */}
//         <Box textAlign={{ xs:"center", md:"left"}}>
//             <Typography fontSize={15} sx={{ pb: {xs:0, md:1}}}
//             >User Name : {username}
//             </Typography>
//             <Typography fontSize={15} sx={{ pb: {xs:0, md:1}}}>License No. : {licenseKey}</Typography>
//             <Typography fontSize={15}>License Status : <span style={{ color:"#166534", borderRadius:10, fontWeight:"600"}}>{User.licenseStatus}</span> </Typography>
//         </Box>
//     </Box>
//     </Container>
 
//           {/* buttons */}
//          <Box mt={2} display="flex" flexDirection={{ xs:"column", md:"row"}} gap={2}>
         
//           <Button variant="contained"
//            sx={{
//            textTransform:"none",
//            flex:{lg:1},
//            width:{ xs:"100%", md:"auto"},
//            fontSize:16,
//            fontWeight:600,
//            py:4,
//            bgcolor:"#238878",
//            "&:hover":{bgcolor:"#FFFFFF", color: "#238878", border: "2px solid #238878"}
//            }}
//            onClick={()=> navigate(URL_PATH.Billing)}>
//             New Invoice
//           </Button>
 
//           <Button variant="contained"
//            sx={{
//            textTransform:"none",
//            flex:{lg:1},
//            width:{ xs:"100%", md: "auto"},
//            fontSize:16,
//            fontWeight:600,
//            py:4,
//            bgcolor:"#238878",
//            "&:hover":{bgcolor:"#FFFFFF", color: "#238878", border: "2px solid #238878"}
//            }}
//            onClick={()=> navigate(URL_PATH.DistributorsForm)}>
//             New Distributor
//           </Button>
 
//           <Button variant="contained"
//            sx={{
//            textTransform:"none",
//            flex:{lg:1},
//            width:{ xs:"100%", md: "auto"},
//            fontSize:16,
//            fontWeight:600,
//            py:4,
//            bgcolor:"#238878",
//            "&:hover":{bgcolor:"#FFFFFF", color: "#238878", border: "2px solid #238878"}
//            }}
//            onClick={()=> navigate(URL_PATH.AddInventoryItem)}>
//             New Inventory
//           </Button>
//          </Box>
 
//           {/* img */}
//          <Box
//          sx={{
//           mt:4,
//           minHeight:{xs:400, md:800},
//           backgroundImage:`url(${landing_img})`,
//           backgroundSize:"cover",
//           backgroundPosition:"center"
//          }}>
 
//           <Typography fontSize={{xs:20, md:36}}
//           fontWeight={600}
//           color="#118E91"
//           alignItems="center"
//           sx={{
//             pl:{ xs:6, md:80 },
//             pt:{ xs:16, md:36 }
//           }}
//           >
//             "Trusted medicines, <br /> Trusted care."
//           </Typography>
//          </Box>
//    </Box>
//   </>
//   )
// }
 
// export default LandingPage




// import { Box, Button, Container, Typography } from "@mui/material"
// import { useLocation, useNavigate } from "react-router-dom";
// import landing_img from "@/assets/LandingPage.svg"
// import { URL_PATH } from "@/constants/UrlPath";
 

// const pharmacyName = localStorage.getItem("pharmacyName") || "User";
// const drugLicense = localStorage.getItem("drugLicense") || "Not Available";

// const User = {
//   name: pharmacyName,
//   licenseNo: drugLicense,
//   licenseStatus: "Active"
// };

// // default data
// // const User = {
// //     name : "User",
// //    // userName: "user01",
// //    // licenseNo : "MP123456789",
// //     licenseStatus : "Active"
// // };
 
// const getGreeting = () => {
//   const hour = new Date().getHours();
//    switch (true) {
//     case hour >= 5 && hour < 12:
//       return "Good Morning";
//     case hour >= 12 && hour < 17:
//       return "Good Afternoon";
//     case hour >= 17 && hour < 21:
//       return "Good Evening";
//     default:
//       return "Good Night";
//    }
// };
 
// const LandingPage = () => {
//   const navigate = useNavigate();
//   const greeting = getGreeting();
//   const location = useLocation();
//   const { username, licenseKey } = location.state || {};  

//   // 👉 ADD
// const storedLicense = localStorage.getItem("drugLicense");

// // final license logic
// const finalLicense = storedLicense || licenseKey;
 
//   return (
//   <>
//    <Box sx={{minHeight: "100vh"}}>
//     <Container maxWidth= {false} sx={{ bgcolor: "#D7FFFB", borderRadius:2, boxShadow:2, py:4}}>
 
//     <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection={{ xs:"column", md:"row" }}>
 
//         {/* left side */}
//         <Box mb={{ xs:2, md:0 }} textAlign={{xs:"center", md:"left"}}>
//             <Typography fontSize={20} fontWeight={600} sx={{ pb: {xs:0, md:1}}}>
//                {greeting}, {User.name}
//             </Typography>
//             <Typography fontWeight={500}>Experience your Comfort Zone With Us!</Typography>
//         </Box>
 
//         {/* right side */}
//         <Box textAlign={{ xs:"center", md:"left"}}>
//             <Typography fontSize={15} sx={{ pb: {xs:0, md:1}}}
//             >User Name : {username}
//             </Typography>
//             <Typography fontSize={15} sx={{ pb: {xs:0, md:1}}}>License No. : {User.finalLicense}</Typography>
//             <Typography fontSize={15}>License Status : <span style={{ color:"#166534", borderRadius:10, fontWeight:"600"}}>{User.licenseStatus}</span> </Typography>
//         </Box>
//     </Box>
//     </Container>
 
//           {/* buttons */}
//          <Box mt={2} display="flex" flexDirection={{ xs:"column", md:"row"}} gap={2}>
         
//           <Button variant="contained"
//            sx={{
//            textTransform:"none",
//            flex:{lg:1},
//            width:{ xs:"100%", md:"auto"},
//            fontSize:16,
//            fontWeight:600,
//            py:4,
//            bgcolor:"#238878",
//            "&:hover":{bgcolor:"#FFFFFF", color: "#238878", border: "2px solid #238878"}
//            }}
//            onClick={()=> navigate(URL_PATH.Billing)}>
//             New Invoice
//           </Button>
 
//           <Button variant="contained"
//            sx={{
//            textTransform:"none",
//            flex:{lg:1},
//            width:{ xs:"100%", md: "auto"},
//            fontSize:16,
//            fontWeight:600,
//            py:4,
//            bgcolor:"#238878",
//            "&:hover":{bgcolor:"#FFFFFF", color: "#238878", border: "2px solid #238878"}
//            }}
//            onClick={()=> navigate(URL_PATH.DistributorsForm)}>
//             New Distributor
//           </Button>
 
//           <Button variant="contained"
//            sx={{
//            textTransform:"none",
//            flex:{lg:1},
//            width:{ xs:"100%", md: "auto"},
//            fontSize:16,
//            fontWeight:600,
//            py:4,
//            bgcolor:"#238878",
//            "&:hover":{bgcolor:"#FFFFFF", color: "#238878", border: "2px solid #238878"}
//            }}
//            onClick={()=> navigate(URL_PATH.AddInventoryItem)}>
//             New Inventory
//           </Button>
//          </Box>
 
//           {/* img */}
//          <Box
//          sx={{
//           mt:4,
//           minHeight:{xs:400, md:800},
//           backgroundImage:`url(${landing_img})`,
//           backgroundSize:"cover",
//           backgroundPosition:"center"
//          }}>
 
//           <Typography fontSize={{xs:20, md:36}}
//           fontWeight={600}
//           color="#118E91"
//           alignItems="center"
//           sx={{
//             pl:{ xs:6, md:80 },
//             pt:{ xs:16, md:36 }
//           }}
//           >
//             "Trusted medicines, <br /> Trusted care."
//           </Typography>
//          </Box>
//    </Box>
//   </>
//   )
// }
 
// export default LandingPage



// import { Box, Button, Container, Typography } from "@mui/material"
// import { useLocation, useNavigate } from "react-router-dom";
// import landing_img from "@/assets/LandingPage.svg"
// import { URL_PATH } from "@/constants/UrlPath";

// // ✅ pharmacy name localStorage मधून घे
// const pharmacyName = localStorage.getItem("pharmacyName") || "User";

// // default user object
// const User = {
//   name: pharmacyName,
//   licenseStatus: "Active"
// };

// const getGreeting = () => {
//   const hour = new Date().getHours();
//    switch (true) {
//     case hour >= 5 && hour < 12:
//       return "Good Morning";
//     case hour >= 12 && hour < 17:
//       return "Good Afternoon";
//     case hour >= 17 && hour < 21:
//       return "Good Evening";
//     default:
//       return "Good Night";
//    }
// };

// const LandingPage = () => {

//   const navigate = useNavigate();
//   const greeting = getGreeting();
//   const location = useLocation();

//   // login मधून आलेला data
//   const { username, licenseKey } = location.state || {};

//   // ✅ pharmacy profile मधून save झालेला license
//   const storedLicense = localStorage.getItem("drugLicense");

//   // ✅ final logic → pharmacy profile license first priority
//   const finalLicense = storedLicense || licenseKey || "Not Available";

//   return (
//   <>
//    <Box sx={{minHeight: "100vh"}}>
//     <Container maxWidth={false} sx={{ bgcolor: "#D7FFFB", borderRadius:2, boxShadow:2, py:4}}>

//     <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection={{ xs:"column", md:"row" }}>

//         {/* left side */}
//         <Box mb={{ xs:2, md:0 }} textAlign={{xs:"center", md:"left"}}>
//             <Typography fontSize={20} fontWeight={600} sx={{ pb: {xs:0, md:1}}}>
//                {greeting}, {User.name}
//             </Typography>

//             <Typography fontWeight={500}>
//               Experience your Comfort Zone With Us!
//             </Typography>
//         </Box>

//         {/* right side */}
//         <Box textAlign={{ xs:"center", md:"left"}}>

//             <Typography fontSize={15} sx={{ pb: {xs:0, md:1}}}>
//             User Name : {username}
//             </Typography>

//             {/* ✅ CHANGE → इथे finalLicense वापरायचा */}
//             <Typography fontSize={15} sx={{ pb: {xs:0, md:1}}}>
//             License No. : {finalLicense}
//             </Typography>

//             <Typography fontSize={15}>
//             License Status :
//             <span style={{ color:"#166534", borderRadius:10, fontWeight:"600"}}>
//               {User.licenseStatus}
//             </span>
//             </Typography>

//         </Box>
//     </Box>
//     </Container>

//           {/* buttons */}
//          <Box mt={2} display="flex" flexDirection={{ xs:"column", md:"row"}} gap={2}>
         
//           <Button variant="contained"
//            sx={{
//            textTransform:"none",
//            flex:{lg:1},
//            width:{ xs:"100%", md:"auto"},
//            fontSize:16,
//            fontWeight:600,
//            py:4,
//            bgcolor:"#238878",
//            "&:hover":{bgcolor:"#FFFFFF", color: "#238878", border: "2px solid #238878"}
//            }}
//            onClick={()=> navigate(URL_PATH.Billing)}>
//             New Invoice
//           </Button>

//           <Button variant="contained"
//            sx={{
//            textTransform:"none",
//            flex:{lg:1},
//            width:{ xs:"100%", md: "auto"},
//            fontSize:16,
//            fontWeight:600,
//            py:4,
//            bgcolor:"#238878",
//            "&:hover":{bgcolor:"#FFFFFF", color: "#238878", border: "2px solid #238878"}
//            }}
//            onClick={()=> navigate(URL_PATH.DistributorsForm)}>
//             New Distributor
//           </Button>

//           <Button variant="contained"
//            sx={{
//            textTransform:"none",
//            flex:{lg:1},
//            width:{ xs:"100%", md: "auto"},
//            fontSize:16,
//            fontWeight:600,
//            py:4,
//            bgcolor:"#238878",
//            "&:hover":{bgcolor:"#FFFFFF", color: "#238878", border: "2px solid #238878"}
//            }}
//            onClick={()=> navigate(URL_PATH.AddInventoryItem)}>
//             New Inventory
//           </Button>

//          </Box>

//           {/* img */}
//          <Box
//          sx={{
//           mt:4,
//           minHeight:{xs:400, md:800},
//           backgroundImage:`url(${landing_img})`,
//           backgroundSize:"cover",
//           backgroundPosition:"center"
//          }}>

//           <Typography
//           fontSize={{xs:20, md:36}}
//           fontWeight={600}
//           color="#118E91"
//           alignItems="center"
//           sx={{
//             pl:{ xs:6, md:80 },
//             pt:{ xs:16, md:36 }
//           }}
//           >
//             "Trusted medicines, <br /> Trusted care."
//           </Typography>

//          </Box>
//    </Box>
//   </>
//   )
// }

// export default LandingPage



import { Box, Button, Container, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import landing_img from "@/assets/LandingPage.svg";
import { URL_PATH } from "@/constants/UrlPath";

const getGreeting = () => {
  const hour = new Date().getHours();

  switch (true) {
    case hour >= 5 && hour < 12:
      return "Good Morning";
    case hour >= 12 && hour < 17:
      return "Good Afternoon";
    case hour >= 17 && hour < 21:
      return "Good Evening";
    default:
      return "Good Night";
  }
};

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const greeting = getGreeting();

  // login मधून आलेला data
  const { username, licenseKey } = location.state || {};

  // ✅ pharmacy profile मधून save झालेला license
  const storedLicense = localStorage.getItem("drugLicense");

  // ✅ FINAL LOGIC
  // priority → pharmacy profile license > login license > default
  const finalLicense = storedLicense ? storedLicense : licenseKey || "Not Available";

  // ✅ pharmacy name localStorage मधून
  const pharmacyName = localStorage.getItem("pharmacyName") || "User";

  return (
    <>
      <Box sx={{ minHeight: "100vh" }}>
        <Container
          maxWidth={false}
          sx={{
            bgcolor: "#D7FFFB",
            borderRadius: 2,
            boxShadow: 2,
            py: 4,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexDirection={{ xs: "column", md: "row" }}
          >
            {/* LEFT SIDE */}
            <Box mb={{ xs: 2, md: 0 }} textAlign={{ xs: "center", md: "left" }}>
              <Typography
                fontSize={20}
                fontWeight={600}
                sx={{ pb: { xs: 0, md: 1 } }}
              >
                {greeting}, {pharmacyName}
              </Typography>

              <Typography fontWeight={500}>
                Experience your Comfort Zone With Us!
              </Typography>
            </Box>

            {/* RIGHT SIDE */}
            <Box textAlign={{ xs: "center", md: "left" }}>
              {/* ✅ login username */}
              <Typography fontSize={15} sx={{ pb: { xs: 0, md: 1 } }}>
                User Name : {username}
              </Typography>

              {/* ✅ FINAL LICENSE */}
              <Typography fontSize={15} sx={{ pb: { xs: 0, md: 1 } }}>
                License No. : {finalLicense}
              </Typography>

              <Typography fontSize={15}>
                License Status :
                <span
                  style={{
                    color: "#166534",
                    borderRadius: 10,
                    fontWeight: "600",
                  }}
                >
                  {" "}
                  Active
                </span>
              </Typography>
            </Box>
          </Box>
        </Container>

        {/* BUTTONS */}
        <Box
          mt={2}
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          gap={2}
        >
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              flex: { lg: 1 },
              width: { xs: "100%", md: "auto" },
              fontSize: 16,
              fontWeight: 600,
              py: 4,
              bgcolor: "#238878",
              "&:hover": {
                bgcolor: "#FFFFFF",
                color: "#238878",
                border: "2px solid #238878",
              },
            }}
            onClick={() => navigate(URL_PATH.Billing)}
          >
            New Invoice
          </Button>

          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              flex: { lg: 1 },
              width: { xs: "100%", md: "auto" },
              fontSize: 16,
              fontWeight: 600,
              py: 4,
              bgcolor: "#238878",
              "&:hover": {
                bgcolor: "#FFFFFF",
                color: "#238878",
                border: "2px solid #238878",
              },
            }}
            onClick={() => navigate(URL_PATH.DistributorsForm)}
          >
            New Distributor
          </Button>

          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              flex: { lg: 1 },
              width: { xs: "100%", md: "auto" },
              fontSize: 16,
              fontWeight: 600,
              py: 4,
              bgcolor: "#238878",
              "&:hover": {
                bgcolor: "#FFFFFF",
                color: "#238878",
                border: "2px solid #238878",
              },
            }}
            onClick={() => navigate(URL_PATH.AddInventoryItem)}
          >
            New Inventory
          </Button>
        </Box>

        {/* IMAGE */}
        <Box
          sx={{
            mt: 4,
            minHeight: { xs: 400, md: 800 },
            backgroundImage: `url(${landing_img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Typography
            fontSize={{ xs: 20, md: 36 }}
            fontWeight={600}
            color="#118E91"
            alignItems="center"
            sx={{
              pl: { xs: 6, md: 80 },
              pt: { xs: 16, md: 36 },
            }}
          >
            "Trusted medicines, <br /> Trusted care."
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default LandingPage;
 
 
 
 
 

 
 
 
 
 
 

 