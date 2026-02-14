import { Paper, Table, TableBody, TableCell, TableContainer, Box, TableRow, Typography, Button, GlobalStyles } from "@mui/material"
import PrintIcon from "@mui/icons-material/Print";
import Sign from "@/assets/Sign.svg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export interface Invoice {
  patient: string;
  doctor: string;
  address: string;
  invoice: string;
  date: string;
  medicines: {
    name: string;
    qty: string;
    amount: number;
    batch: string;
    expiry: string;
  }[];
  subTotal: number;
  gst: number;
  total: number;
}

const columns = [
  { label: "Sr No.", width: "7%"},
  { label: "Particulars", width: "33%"},
  { label: "Batch No.", width: "13%"},
  { label: "Expiry", width: "12%"},
  { label: "Quantity", width: "10%"},
  { label: "Amount", width: "15%"},
];

interface Medicine {
  name: string;
  qty: number | string;
  amount: number;
  batch?: string;
  expiry?: string;
}

const InvoiceView = () => {
  const { invoiceNo } = useParams<{ invoiceNo: string }>();
  const location = useLocation();
  const [invoice, setInvoice] = useState<Invoice>(location.state as Invoice);
  const navigate = useNavigate();

  useEffect(() => {
    if (!invoice && invoiceNo) {
      const savedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]");
      const found = savedInvoices.find((inv: Invoice) => inv.invoice === invoiceNo);
      if (found) setInvoice(found);
      else navigate(-1); 
    }
  }, [invoice, invoiceNo, navigate]);
  
  const subTotal = invoice?.medicines?.reduce(
  (sum, med) => sum + Number(med.amount), 0 ) || 0;

const gstAmount = (subTotal * 12) / 100; 
const discount = 0; 
const netTotal = subTotal + gstAmount - discount;

return (
    <>
    {/* print */}
      <GlobalStyles
        styles={{
          "@media print": {
            "body *": {
              visibility: "hidden",
            },
            "#invoice, #invoice *": {
              visibility: "visible",
            },
            "#invoice": {
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
            },
          },
        }}
      />

    <Paper sx={{p: {xs: 2, md: 4}, mx: {xs: 0, md: 3}}} id="invoice">
      <Typography textAlign="center" mb={2} sx={{
        textDecoration:"underline", textUnderlineOffset:4
      }}>Tax Invoice / Cash Memo</Typography>
  <TableContainer>
  <Table 
      sx={{
      width: "100%",
      borderCollapse:"collapse",
      border: "2px solid #000",

    }}
    >
    <TableBody>
      <TableRow>
        <TableCell colSpan={2}
          sx={{
            border: "2px solid #000",
          }}>
          <Typography fontSize={20}>MEDIPLUS MEDICAL & GENERAL</Typography>
          <Typography>Shinoli, Tal: Ambegaon, Dist: Pune</Typography>
        </TableCell>

       <TableCell
       colSpan={4} sx={{border:"2px solid #000"}}>
  <Typography>
    <strong>Name:</strong> {invoice.patient}
  </Typography>

  <Typography sx={{ mt: 0.5 }}>
    <strong>Doctor:</strong> {invoice.doctor} {invoice.address}
  </Typography>

  <Box
    gap={8}
    sx={{
      mt: 1,
      pt: 1,
      borderTop: "2px solid #000",
      display:"flex"
    }}
  >
    <Typography>
      <strong>Invoice No.:</strong> {invoice.invoice}
    </Typography>

    <Typography>
      <strong>Date:</strong> {invoice.date}
    </Typography>
  </Box>
</TableCell>
      </TableRow>
     <TableRow>
        {columns.map((col) => (
          <TableCell
            key={col.label}
            sx={{
              width: col.width,
              border: "2px solid #000",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {col.label}
          </TableCell>
        ))}
      </TableRow>


{invoice.medicines.map((med: Medicine, index: number) => (
  <TableRow
    key={index}
    sx={{
      "& td": {
        borderLeft: "2px solid #000",
        borderRight: "2px solid #000",
      },
    }}
  >
    <TableCell align="center">{index + 1}</TableCell>
    <TableCell>{med.name}</TableCell>
    <TableCell align="center">{med.batch}</TableCell>
    <TableCell align="center">{med.expiry}</TableCell>
    <TableCell align="center">{med.qty}</TableCell>
    <TableCell align="center">
      ₹ {med.amount.toFixed(2)}
    </TableCell>
  </TableRow>
  ))}
    
      <TableRow
      sx={{
         "& td": {
          borderLeft: "2px solid #000",
          borderRight: "2px solid #000",
        },
      }}
        >
      {/* <TableCell colSpan={4} sx={{ borderLeft: "2px solid red", borderRight: "2px solid red" }} /> */}
      <TableCell />
      <TableCell />
      <TableCell />
      <TableCell />
      <TableCell sx={{ borderBottom: "2px solid #000", borderTop: "2px solid #000" }} align="center">
        <strong>Sub Total</strong>
      </TableCell>
      <TableCell sx={{ borderBottom: "2px solid #000", borderTop: "2px solid #000" }} align="center">
        ₹ {subTotal.toFixed(2)}
      </TableCell>
    </TableRow>

    <TableRow
      sx={{
         "& td": {
          borderLeft: "2px solid #000",
          borderRight: "2px solid #000",
        },
      }}
        >
      <TableCell />
      <TableCell />
      <TableCell />
      <TableCell />
      <TableCell sx={{ borderBottom: "2px solid #000", borderTop: "2px solid #000" }} align="center">
          <strong>GST 12%</strong>        
      </TableCell>
      <TableCell sx={{ borderBottom: "2px solid #000", borderTop: "2px solid #000" }} align="center">
        ₹ {gstAmount.toFixed(2)}
      </TableCell>
    </TableRow>

    <TableRow
    sx={{
         "& td": {
          borderLeft: "2px solid #000",
          borderRight: "2px solid #000",
        },
      }}
        >
      {/* <TableCell colSpan={4} sx={{borderTop: "none", borderBottom: "none"}} /> */}
      <TableCell sx={{border:"2px solid #000"}} />
      <TableCell sx={{border:"2px solid #000"}} />
      <TableCell sx={{border:"2px solid #000"}} />
      <TableCell sx={{border:"2px solid #000"}} />
      <TableCell sx={{ border: "2px solid #000" }} align="center">
      <strong>Discount</strong></TableCell>
      <TableCell align="center" sx={{ border: "2px solid #000" }}>  
     </TableCell>
    </TableRow>
      
      <TableRow sx={{borderTop:"2px solid #000"}}>
  <TableCell colSpan={4} sx={{border:"2px solid #000"}}>
    Get Well Soon.. GSTIN ABC12345SDGFJK789
  </TableCell>

  <TableCell sx={{border:"2px solid #000"}}>
   <Typography fontWeight={600} sx={{textAlign:"right"}}>NET :</Typography> 
  </TableCell>

  <TableCell sx={{pl: {xs:1, md:2, border:"2px solid #000"}}}>
  <Typography fontWeight={600}>₹ {netTotal.toFixed(2)}</Typography> 
  </TableCell>
</TableRow>

 <TableRow >
  <TableCell colSpan={4} sx={{border:"2px solid #000"}}>
     Vat Tin No. : 
     <br />
     Drug Lic No. : MH-PZ4-115478,115479,115480
     <br />
     I/We hereby certify that my/our registration certificate under the Maharashtra Value Added Tax Act 2002
     is in force on the date on the which sales of the goods specified in this tax invoice is made by me/us and
     that the transaction of the sale covered by this tax invoice has been effected by me/us and it shall be accounted for in the turnover of sales while filling of return and the due tax, if any, payble on the sales has been paid or shall be paid. </TableCell>

  <TableCell colSpan={2} align="center" sx={{border:"2px solid #000"}}>
    <Box
     display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center">
    <strong>For MEDIPLUS MEDICAL & GENERAL STORE</strong>

      <Box
       component="img"
       src={Sign}
       alt="Store Sign"
        sx={{
         width: { xs: 80, md: 120 },
         alignItems: "center",
         py: 2
        }}
     />
     <Typography>Pharmacist</Typography>
     </Box>
  </TableCell>

</TableRow>
    </TableBody>
  </Table>
</TableContainer>
</Paper>
<Box
     m={3}
        display="flex"
        justifyContent="flex-end"
        gap={2}
        >
         <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{
          px:4,
          textTransform: "none",
          fontSize:14,
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
             px:4,
             fontSize:14,
             backgroundColor: "#238878",
             color: "#fff",
             border: "2px solid #238878",
             textTransform: "none",
             "&:hover": { backgroundColor: "#fff", color: "#238878", border: "2px solid #238878" },
          }}
         >
           Print
        </Button>
       </Box>
    </>
  )
}

export default InvoiceView


