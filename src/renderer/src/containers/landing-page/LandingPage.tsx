import { Box, Button, Container, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom";
import landing_img from "@/assets/LandingPage.svg"

// default data
const User = {
    name : "User",
    userName: "user01",
    licenseNo : "MP123456789",
    licenseStatus : "Active"
};

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

  const greeting = getGreeting();

  return (
  <>
   <Box sx={{minHeight: "100vh"}}>
    <Container maxWidth= {false} sx={{ bgcolor: "#D7FFFB", borderRadius:2, boxShadow:2, py:4}}>

    <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection={{ xs:"column", md:"row" }}>

        {/* left side */}
        <Box mb={{ xs:2, md:0 }} textAlign={{xs:"center", md:"left"}}>
            <Typography fontSize={20} fontWeight={600} sx={{ pb: {xs:0, md:1}}}>
               {greeting}, {User.name}
            </Typography>
            <Typography fontWeight={500}>Experience your Comfort Zone With Us!</Typography>
        </Box>

        {/* right side */}
        <Box textAlign={{ xs:"center", md:"left"}}>
            <Typography fontSize={15} sx={{ pb: {xs:0, md:1}}}
            >User Name : {User.userName}
            </Typography>
            <Typography fontSize={15} sx={{ pb: {xs:0, md:1}}}>License No. : {User.licenseNo}</Typography>
            <Typography fontSize={15}>License Status : <span style={{ color:"#166534", borderRadius:10, fontWeight:"600"}}>{User.licenseStatus}</span> </Typography>
        </Box>
    </Box>
    </Container>

          {/* buttons */}
         <Box mt={2} display="flex" flexDirection={{ xs:"column", md:"row"}} gap={2}>
          
          <Button variant="contained"
           sx={{ 
           textTransform:"none",
           flex:{lg:1},
           width:{ xs:"100%", md:"auto"}, 
           fontSize:16,
           fontWeight:600,
           py:4, 
           bgcolor:"#238878",
           "&:hover":{bgcolor:"#FFFFFF", color: "#238878", border: "2px solid #238878"}
           }}
           onClick={()=> navigate("/add-customer")}>
            New Customer
          </Button>

          <Button variant="contained"
           sx={{ 
           textTransform:"none",
           flex:{lg:1},
           width:{ xs:"100%", md: "auto"}, 
           fontSize:16,
           fontWeight:600,
           py:4, 
           bgcolor:"#238878",
           "&:hover":{bgcolor:"#FFFFFF", color: "#238878", border: "2px solid #238878"}
           }}
           onClick={()=> navigate("/add-distributor")}>
            New Distributor
          </Button>

          <Button variant="contained" 
           sx={{ 
           textTransform:"none",
           flex:{lg:1},
           width:{ xs:"100%", md: "auto"}, 
           fontSize:16,
           fontWeight:600,
           py:4, 
           bgcolor:"#238878",
           "&:hover":{bgcolor:"#FFFFFF", color: "#238878", border: "2px solid #238878"}
           }}
           onClick={()=> navigate("/inventory/add-inventory-item")}>
            New Inventory
          </Button>
         </Box>

          {/* img */}
         <Box
         sx={{
          mt:4,
          minHeight:{xs:400, md:800},
          backgroundImage:`url(${landing_img})`,
          backgroundSize:"cover",
          backgroundPosition:"center"
         }}>

          <Typography fontSize={{xs:20, md:36}}
          fontWeight={600}
          color="#118E91"
          alignItems="center"
          sx={{
            pl:{ xs:6, md:80 },
            pt:{ xs:16, md:36 }
          }}
        
          >
            "Trusted medicines, <br /> Trusted care."
          </Typography>
         </Box>

   </Box>
  </>
  )
}

export default LandingPage