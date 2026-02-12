import { useLocation,  } from "react-router-dom";
import { Box, Typography, Paper,} from "@mui/material";
import BankInfo from "./BankInfo";
import InventoryList from "./InventoryList";

const DistributorDetails = () => {
  const { state } = useLocation();
  const data = state?.distributor;

  if (!data) return <Typography p={3}>Distributor not found!</Typography>;
// fields for BankInfo and DistributorDetails
  const distributorFields = [
    { label: "Company Name", value: data.companyName },
    { label: "Owner Name", value: data.ownerName },
    { label: "Registration Number", value: data.registrationNumber },
    { label: "Mobile Number", value: data.mobile },
    { label: "Email", value: data.email },
    { label: "Website", value: data.website },
    { label: "Address", value: data.address },
  ];

  const bankFields = [
    { label: "Bank Name", value: data.bankName },
    { label: "A/C Number", value: data.accountNumber },
    { label: "A/C Holder's Name", value: data.accountHolderName },
    { label: "Branch", value: data.branch },
    { label: "IFSC", value: data.ifsc },
    { label: "UPI ID", value: data.upiId },
  ];

  return (
    <Box p={2}>
     {/* DistributorsDetails */}
      <Paper sx={{ p: 2, borderRadius: "5px", boxShadow: 3, mb: 3 }}>
        <BankInfo title="Distributor Details" details={distributorFields} />
      </Paper>
      {/* BankInfo  */}
       <Paper sx={{ p: 2, borderRadius: "5px", boxShadow: 3, mb: 3 }}>
        <BankInfo title="Bank Details" details={bankFields} />
      </Paper>
      {/* InventoryList call */}
        <InventoryList />
      
    </Box>
  );
};

export default DistributorDetails;