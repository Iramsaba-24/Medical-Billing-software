import {
  Box, Button, Paper, Table, TableBody, TableCell,
  TableHead, TableRow, Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from "@/components/uncontrolled/ToastMessage";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";
import { URL_PATH } from "@/constants/UrlPath";
import { useEffect, useState } from "react";
import {
  pharmacySettingsService,
  PharmacySettingsResponse,
} from "@/service/pharmacySettingsService";

type MedicineRow = {
  medicineRowId?: number;
  medicineId?: string;
  qty?: string;
  medicineName?: string;
  quantity?: string | number;
  strengthType: string;
};

type LocationState = {
  distributor: string;
  email: string;
  medicines: MedicineRow[];
};

export default function ReorderEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pharmacySettings, setPharmacySettings] =
  useState<PharmacySettingsResponse | null>(null);

  const { distributor, email, medicines } = (location.state as LocationState) || {
    distributor: "", email: "", medicines: [],
  };

  const handleSend = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        DistributorName: distributor,
        EmailAddress: email,
        ExistingMedicines: medicines.map((m) => ({
         MedicineName:
  m.medicineId || m.medicineName,
          Strength: m.strengthType,
          CompanyName: distributor,
        Qty: Number(
  m.qty || m.quantity
),
        })),
        NewMedicines: [],
      };

      await axios.post(API_ENDPOINTS.REORDER, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showToast("success", "Reorder email sent successfully!");
      navigate(URL_PATH.Reorder);

    } catch (error) {
      console.error("Reorder failed:", error);
      showToast("error", "Failed to send reorder. Please try again.");
    }
  };
  useEffect(() => {
  const fetchPharmacySettings = async () => {
    try {
      const userId = Number(localStorage.getItem("userId"));

      if (!userId) return;

      const response = await pharmacySettingsService.getSettings(userId);

      setPharmacySettings(response);
    } catch (error) {
      console.error("Failed to fetch pharmacy settings", error);
    }
  };

  fetchPharmacySettings();
}, []);

  return (
    <Box sx={{ p: 3, maxWidth: "1100px", mx: "auto" }}>
      <Typography fontSize={20} fontWeight={700} mb={3}>
        Order Email
      </Typography>

      {/* Distributor + Email */}
      <Box display="flex" flexDirection="column" gap={2} mb={4}>
        <Box display="flex" gap={3}>
          <Typography fontWeight={600} sx={{ width: 180 }}>
            Distributor / Company
          </Typography>
          <Typography>{distributor}</Typography>
        </Box>

        <Box display="flex" gap={3}>
          <Typography fontWeight={600} sx={{ width: 180 }}>
            Email Address
          </Typography>
          <Typography>{email}</Typography>
        </Box>
      </Box>

      {/* Mail Preview */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, border: "1px solid #ddd" }}>
        <Typography mb={1}>Dear {distributor},</Typography>
        <Typography mb={3}>Good day.</Typography>
        <Typography mb={3}>
          We would like to place a reorder for the following medicines for our medical store.
        </Typography>
        <Typography fontWeight={600} mb={2}>Order Details:</Typography>

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
                <TableCell>
  {item.medicineId || item.medicineName}
</TableCell>
                <TableCell>{item.strengthType}</TableCell>
<TableCell>
  {item.qty || item.quantity}
</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Typography mt={3}>
          Please confirm the availability and expected delivery timeline.
        </Typography>

        <Box mt={4}>
          <Typography>Thank you.</Typography>
          <Typography mt={2}>Best regards,</Typography>
<Typography>
  {pharmacySettings?.pharmacyName || "Medical Store"}
</Typography>

<Typography>
  Contact: {pharmacySettings?.contactNumber || "+91 XXXXXXXXXX"}
</Typography>
        </Box>
      </Paper>

      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#238878", textTransform: "none" }}
          onClick={handleSend}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}