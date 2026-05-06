import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { useLocation } from "react-router-dom";

type MedicineRow = {
  medicineRowId: number;
  medicineId: string;
  strengthType: string;
  qty: string;
};

type LocationState = {
  distributor: string;
  email: string;
  medicines: MedicineRow[];
};

export default function ReorderEmail() {
  const location = useLocation();

  const {
    distributor,
    email,
    medicines,
  } = (location.state as LocationState) || {
    distributor: "",
    email: "",
    medicines: [],
  };

  return (
    <Box sx={{ p: 3, maxWidth: "1100px", mx: "auto" }}>
      
      {/* Heading */}
      <Typography fontSize={20} fontWeight={700} mb={3}>
        Reorder Email
      </Typography>

      {/* Company + Email */}
      <Box display="flex" flexDirection="column" gap={2} mb={4}>
        
        <Box display="flex" gap={3}>
          <Typography fontWeight={600} sx={{ width: 180 }}>
            Distributor / Company
          </Typography>

          <Typography>
            {distributor}
          </Typography>
        </Box>

        <Box display="flex" gap={3}>
          <Typography fontWeight={600} sx={{ width: 180 }}>
            Email Address
          </Typography>

          <Typography>
            {email}
          </Typography>
        </Box>

      </Box>

      {/* Mail Preview */}
      <Box display="flex" gap={2} alignItems="flex-start">
        
        <Typography fontWeight={600}>
          Qty.
        </Typography>

        <Paper
          elevation={2}
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 2,
            border: "1px solid #ddd",
          }}
        >
          <Typography mb={1}>
            Dear {distributor},
          </Typography>

          <Typography mb={3}>
            Good day.
          </Typography>

          <Typography mb={3}>
            We would like to place a reorder for the following medicines for
            our medical store.
          </Typography>

          <Typography fontWeight={600} mb={2}>
            Order Details:
          </Typography>

          {/* Medicine Table */}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Sr. No.</TableCell>
                <TableCell>Medicine Name</TableCell>
                <TableCell>Strength / Type</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {medicines.map((item, index) => (
                <TableRow key={item.medicineRowId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.medicineId}</TableCell>
                  <TableCell>{item.strengthType}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Typography mt={3}>
            Please confirm the availability and expected delivery timeline.
          </Typography>

          <Box mt={4}>
            <Typography>
              Thank you.
            </Typography>

            <Typography mt={2}>
              Best regards,
            </Typography>

           
            <Typography>
              Medical Store
            </Typography>

            <Typography>
              Contact: +91 XXXXXXXXXX
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Send Button */}
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#238878",
            textTransform: "none",
          }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}