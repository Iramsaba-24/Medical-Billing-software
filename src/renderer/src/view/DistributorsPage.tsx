 import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DistributorCards from '@/containers/Distributors/DistributorsCard'; 
import DistributorTable from '@/containers/Distributors/DistributorsTable'; 

const DistributorsPage = () => {
  const navigate = useNavigate();


  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>Distributors Management</Typography>

        <Button variant="contained"
           sx={{ backgroundColor: "#238878", textTransform: "none" }}
                onClick={() => navigate("/form")}  >
                + Add New Distributor
                 </Button>

      </Box>

      <DistributorCards totalCount={0} />
      <Box mt={4}>

        <DistributorTable />
      </Box>
    </Box>
  );
};



export default DistributorsPage;