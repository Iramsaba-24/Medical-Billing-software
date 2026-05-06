import {
  Paper,
  Box,
  Typography,
  Button,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import Sign from "@/assets/Sign.svg";
import LogoImage from "@/assets/logoimg.svg";
import { useNavigate } from "react-router-dom";
import { Invoice } from "./InvoiceView";
import { PharmacySettingsResponse } from "@/service/pharmacySettingsService";

interface Medicine {
  name: string;
  qty: number | string;
  amount: number;
  batch?: string;
  manufacturing?: string;
  expiry?: string;
}

interface MobileInvoiceViewProps {
  invoice: Invoice | null;
  pharmacyData: PharmacySettingsResponse | null;
  showLogo: boolean;
  subTotal: number;
  usedPoints: number;
  gstPercent: number;
  cgst: number;
  sgst: number;
  netTotal: number;
  currentDate: string;
}

const MobileInvoiceView = ({
  invoice,
  pharmacyData,
  showLogo,
  subTotal,
  usedPoints,
  gstPercent,
  cgst,
  sgst,
  netTotal,
  currentDate,
}: MobileInvoiceViewProps) => {
  const navigate = useNavigate();
  const pharmacyName = pharmacyData?.pharmacyName || "Your Pharmacy";
  const pharmacyAddress = pharmacyData?.address || "-";

  return (
    <>
      <Paper sx={{ p: 1, mx: 0 }} id="invoice">
        <Typography
          textAlign="center"
          mb={2}
          fontSize={14}
          sx={{
            textDecoration: "underline",
            textUnderlineOffset: 4,
          }}
        >
          Tax Invoice / Cash Memo
        </Typography>

        {/* Header — Shop Info */}
        <Box sx={{ border: "1.5px solid #000", p: 1.5, mb: 0 }}>
          <Box display="flex" alignItems="center" gap={1}>
            {showLogo && (
              <Box
                component="img"
                src={pharmacyData?.logoUrl || LogoImage}
                alt="logo"
                sx={{ width: 36, height: 36, objectFit: "contain" }}
              />
            )}
            <Box>
              <Typography fontSize={13} fontWeight={600}>
                {pharmacyName}
              </Typography>
              <Typography fontSize={11}>{pharmacyAddress}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Customer Info */}
        <Box
          sx={{
            border: "1.5px solid #000",
            borderTop: "none",
            p: 1.5,
            mb: 0,
          }}
        >
          <Typography fontSize={12}>
            <strong>Name:</strong> {invoice?.name}
          </Typography>
          <Typography fontSize={12} mt={0.5}>
            <strong>Doctor:</strong> {invoice?.doctor}
            {invoice?.doctor && invoice?.doctorAddress ? " - " : ""}
            {invoice?.doctorAddress}
          </Typography>
          <Box
            sx={{
              mt: 1,
              pt: 1,
              borderTop: "1px solid #000",
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography fontSize={12}>
              <strong>Invoice No.:</strong> {invoice?.invoice}
            </Typography>
            <Typography fontSize={12}>
              <strong>Date:</strong> {currentDate}
            </Typography>
          </Box>
        </Box>

        {/* Column Headers */}
        <Box
          sx={{
            border: "1.5px solid #000",
            borderTop: "none",
            display: "grid",
            gridTemplateColumns: "18px 1fr 55px 55px 45px 45px",
            p: "6px 8px",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Typography fontSize={10} fontWeight={700}>#</Typography>
          <Typography fontSize={10} fontWeight={700}>Particulars</Typography>
          <Typography fontSize={10} fontWeight={700} textAlign="center">MFG</Typography>
          <Typography fontSize={10} fontWeight={700} textAlign="center">Expiry</Typography>
          <Typography fontSize={10} fontWeight={700} textAlign="center">Qty</Typography>
          <Typography fontSize={10} fontWeight={700} textAlign="center">Amt</Typography>
        </Box>

        {/* Medicine Rows */}
        {invoice?.medicines?.map((med: Medicine, index: number) => (
          <Box
            key={index}
            sx={{
              border: "1.5px solid #000",
              borderTop: "none",
              display: "grid",
              gridTemplateColumns: "18px 1fr 55px 55px 45px 45px",
              p: "5px 6px",
              backgroundColor: index % 2 === 0 ? "#fff" : "#fafafa",
            }}
          >
            <Typography fontSize={11}>{index + 1}</Typography>
            <Typography fontSize={11} sx={{ wordBreak: "break-word", minWidth: 0 }}>
              {med.name}
            </Typography>
            <Typography fontSize={11} textAlign="center">
              {med.manufacturing
                ? `${med.manufacturing.split("/")[1]}/${med.manufacturing.split("/")[2]?.slice(-2)}`
                : ""}
            </Typography>
            <Typography fontSize={11} textAlign="center">
              {med.expiry
                ? `${med.expiry.split("/")[1]}/${med.expiry.split("/")[2]?.slice(-2)}`
                : ""}
            </Typography>
            <Typography fontSize={11} textAlign="center">{med.qty}</Typography>
            <Typography fontSize={11} textAlign="center">₹{med.amount.toFixed(2)}</Typography>
          </Box>
        ))}

        {/* Totals */}
        <Box sx={{ border: "1.5px solid #000", borderTop: "none", p: "6px 8px" }}>
          <Box display="flex" justifyContent="space-between">
            <Typography fontSize={12} fontWeight={600}>Sub Total</Typography>
            <Typography fontSize={12}>₹ {subTotal.toFixed(2)}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mt={0.5}>
            <Typography fontSize={12} fontWeight={600}>Discount</Typography>
            <Typography fontSize={12}>- ₹ {usedPoints.toFixed(2)}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mt={0.5}>
            <Typography fontSize={12} fontWeight={600}>CGST ({gstPercent / 2}%)</Typography>
            <Typography fontSize={12}>₹ {cgst.toFixed(2)}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mt={0.5}>
            <Typography fontSize={12} fontWeight={600}>SGST ({gstPercent / 2}%)</Typography>
            <Typography fontSize={12}>₹ {sgst.toFixed(2)}</Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            mt={0.5}
            pt={0.5}
            sx={{ borderTop: "1px solid #000" }}
          >
            <Typography fontSize={13} fontWeight={700}>NET</Typography>
            <Typography fontSize={13} fontWeight={700}>₹ {netTotal.toFixed(2)}</Typography>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ border: "1.5px solid #000", borderTop: "none", p: 1.5 }}>
          <Typography fontSize={10} color="text.secondary">
            Vat Tin No. :<br />
            Drug Lic No. : MH-PZ4-115478,115479,115480
            <br />
            I/We hereby certify that my/our registration certificate under the
            Maharashtra Value Added Tax Act 2002 is in force on the date on
            the which sales of the goods specified in this tax invoice is made
            by me/us and that the transaction of the sale covered by this tax
            invoice has been effected by me/us and it shall be accounted for
            in the turnover of sales while filling of return and the due tax,
            if any, payble on the sales has been paid or shall be paid.
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center" mt={1.5}>
            <Typography fontSize={11} fontWeight={600}>For {pharmacyName}</Typography>
            <Box component="img" src={Sign} alt="Store Sign" sx={{ width: 80, py: 1 }} />
            <Typography fontSize={11}>Pharmacist</Typography>
          </Box>
        </Box>
      </Paper>

      <Box m={2} display="flex" justifyContent="flex-end" gap={2}>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{
            px: 3,
            textTransform: "none",
            fontSize: 13,
            color: "#238878",
            border: "2px solid #238878",
            "&:hover": { backgroundColor: "#238878", color: "#fff" },
          }}
        >
          Cancel
        </Button>
        <Button
          startIcon={<PrintIcon />}
          variant="contained"
          onClick={() => window.print()}
          sx={{
            px: 3,
            fontSize: 13,
            backgroundColor: "#238878",
            color: "#fff",
            border: "2px solid #238878",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#fff",
              color: "#238878",
              border: "2px solid #238878",
            },
          }}
        >
          Print
        </Button>
      </Box>
    </>
  );
};

export default MobileInvoiceView;