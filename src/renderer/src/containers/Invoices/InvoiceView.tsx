import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Invoice } from "@/types/invoice";
import { useLocation, useNavigate } from "react-router-dom";



const InvoiceView = () => {

  const navigate = useNavigate();
  const location = useLocation();

    const invoice = location.state as Invoice;

  if (!invoice) {
    navigate("/Billing");
    return null;
  }
  
  return (
    <Paper sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      <Typography align="center" fontWeight={600} mb={2}>
        Tax Invoice / Cash Memo
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box>
          <Typography fontWeight={600}>MEDIPLUS MEDICAL & GENERAL</Typography>
          <Typography variant="body2">
            Shinoli, Tal.- Ambegaon, Dist.- Pune
          </Typography>
        </Box>

        <Box textAlign="right">
          <Typography variant="body2">
            <b>Invoice No:</b> {invoice.invoice}
          </Typography>
          <Typography variant="body2">
            <b>Date:</b> {invoice.date}
          </Typography>
          <Typography variant="body2">
            <b>Patient:</b> {invoice.patient}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* MEDICINES TABLE */}
      <Table
        size="small"
        sx={{
          border: "1px solid #ccc",
          "& td, & th": { border: "1px solid #ccc" }, 
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell><b>Sr No</b></TableCell>
            <TableCell><b>Particulars</b></TableCell>
            <TableCell><b>Batch No</b></TableCell>
            <TableCell><b>Expiry</b></TableCell>
            <TableCell><b>Qty</b></TableCell>
            <TableCell align="right"><b>Amount</b></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {invoice.medicines.map((med, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{med.name}</TableCell>
              <TableCell>{med.batch}</TableCell>
              <TableCell>{med.expiry}</TableCell>
              <TableCell>{med.qty}</TableCell>
              <TableCell align="right">₹ {med.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Typography fontWeight={600}>
          NET : ₹ {invoice.price.toFixed(2)}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box display="flex" justifyContent="space-between" mt={3}>
        <Typography variant="caption">
          Drug License No: MH-PZ-115478/115479/115480 <br />
          Goods sold are not returnable. <br />
          Subject to Pune jurisdiction.
        </Typography>

        <Box textAlign="center">
          <Typography variant="body2">
            For MEDIPLUS MEDICAL & GENERAL STORE
          </Typography>
          <Typography mt={3}>Pharmacist</Typography>
        </Box>
      </Box>

      <Box mt={4} display="flex" justifyContent="space-between">
        {/* <Button variant="outlined" onClick={onBack}> */}
         <Button variant="outlined" onClick={() => navigate("/Billing")}
           sx={{ backgroundColor: "#fff",
                color: "#238878",
                border: "2px solid #238878",
                
                 "&:hover": {
                backgroundColor: "#238878",
                color: "#fff",
              },}}>
          Back
        </Button>
        <Button variant="contained" onClick={() => window.print()} 
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
            }}>
          Print
        </Button>
      </Box>
    </Paper>
  );
};

export default InvoiceView;
