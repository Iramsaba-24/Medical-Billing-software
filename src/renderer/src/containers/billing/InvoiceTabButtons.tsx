import { Button, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";

function InvoiceTabButtons() {
  const navigate = useNavigate();
  const location = useLocation();

 const isRetailPage = location.pathname.startsWith(URL_PATH.Billing);
  const isNewInvoicePage = location.pathname === URL_PATH.NewInvoice;

  const buttonStyle = (active: boolean) => ({
    textTransform: "none",
    width: { xs: "50%", md: "10%" },
    height: "38px",
    fontWeight: 500,
    borderRadius: "0px 18px 0px 0px",
    backgroundColor: active ? "#238878" : "#fff",
    color: active ? "#fff" : "#000",
    border: active ? "none" : "1px solid #ccc",
    "&:hover": {
      backgroundColor: active ? "#238878" : "#f5f5f5",
    },
  });

  return (
    <Box display="flex" >
      <Button
        type="button"
        sx={buttonStyle(isRetailPage)}
        onClick={() => navigate(URL_PATH.Billing)}
      >
        Retail Invoice
      </Button>

      <Button
        type="button"
        sx={buttonStyle(isNewInvoicePage)}
        onClick={() => navigate(URL_PATH.NewInvoice)}
      >
        New Invoice
      </Button>
    </Box>
  );
}

export default InvoiceTabButtons;