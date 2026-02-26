 import { Box } from "@mui/material";
import DistributorCards from "@/containers/Distributors/DistributorsCard";
import DistributorsTable from "@/containers/Distributors/DistributorTable";
import { useState, useEffect } from "react";
 
  function DistributorsPage() {
  const [count, setCount] = useState(0);
 
  useEffect(() => {
    const storedData = localStorage.getItem("distributors");
    if (storedData) {
      const data = JSON.parse(storedData);
      setCount(data.length);
    }
  }, []);
 
  return (
    <Box >
      <DistributorCards totalCount={count} />
      <DistributorsTable />
    </Box>
  );
}
export default DistributorsPage;
 