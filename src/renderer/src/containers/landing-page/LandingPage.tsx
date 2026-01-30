import { Box, Button, Container, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom";
import landing_img from "@/assets/LandingPage.svg"

// default data
const User = {
    name : "Iramsaba",
    userName : "Priyanka 01",
    licenseNo : "MP123456789",
    licenseStatus : "Active"
};

const LandingPage = () => {
  const navigate = useNavigate();

  return (
  <>
   <Box sx={{minHeight : "100vh"}}>
    <Container  sx={{ bgcolor: "#D7FFFB", borderRadius:2, boxShadow:2, py:4}}>

    <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection={{ xs:"column", md:"row" }}>

        {/* left side */}
        <Box mb={{ xs:2, md:0 }} textAlign={{xs:"center", md:"left"}}>
            <Typography fontSize={20} fontWeight={600} sx={{ pb: {xs:0, md:1}}}>
              Good Morning {User.name}
            </Typography>
            <Typography fontWeight={500}>Experience your Comfort Zone With Us!</Typography>
        </Box>

        {/* right side */}
        <Box textAlign={{ xs:"right", md:"left"}}>
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
           py:4, 
           bgcolor:"#238878",
           "&:hover":{bgcolor:"#247366"}
           }}
           onClick={()=> navigate("/new-customer")}>
            New Customer
          </Button>

          <Button variant="contained"
           sx={{ 
           textTransform:"none", 
           flex:{lg:1},
           width:{ xs:"100%", md: "auto"}, 
           fontSize:16,
           py:4, 
           bgcolor:"#238878",
           "&:hover":{bgcolor:"#247366"}
           }}
           onClick={()=> navigate("/new-distributor")}>
            New Distributor
          </Button>

          <Button variant="contained"
           sx={{ 
           textTransform:"none", 
           flex:{lg:1},
           width:{ xs:"100%", md: "auto"}, 
           fontSize:16,
           py:4, 
           bgcolor:"#238878",
           "&:hover":{bgcolor:"#247366"}
           }}
           onClick={()=> navigate("/new-inventory")}>
            New Inventory
          </Button>
         </Box>

          {/* img */}
         <Box
         sx={{
          mt:4,
          minHeight:"400px",
          backgroundImage:`url(${landing_img})`,
          backgroundSize:"cover",
          backgroundPosition:"center"
         }}>

          <Typography fontSize={{xs:20, md:26}}
          fontWeight={600}
          color="#118E91"
          textAlign="center"
          sx={{pl:{ xs:4, md:70 }}}
          pt={14}
          >
            "Trusted medicines, <br /> Trusted care."
          </Typography>
         </Box>

   </Box>
  </>
  )
}

export default LandingPage