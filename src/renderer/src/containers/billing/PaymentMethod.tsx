import { useForm, FormProvider, useWatch } from "react-hook-form";
import { Paper, Box, Button } from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import RadioField from "@/components/controlled/RadioField";
import NumericField from "@/components/controlled/NumericField";
import TextInputField from "@/components/controlled/TextInputField";
import gpayIcon from "@/assets/icons/googlepay.svg";
import paytmIcon from "@/assets/icons/paytm.svg";
import upiIcon from "@/assets/icons/upi.svg";
import phonepeIcon from "@/assets/icons/phonepe.svg";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState } from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";


// form fields
type PaymentMethods = {
  paymentMethod: "credit-card" | "upi";
  CardNumber?: string;
  CardHolderName?: string;
  Cvv?: string;
  UpiId?: string;
};

// paper style of card and upi
const PaperStyle ={
  borderRadius: 2, 
  p: { xs: 1, sm: 2 },
  mb:{sx:1}
}

// radio btn style
const radioStyle = {
  "& .MuiRadio-root": {   
    color: "default.main",
    "&.Mui-checked": {   
      color: "#238878",
    },
  },
};

//btn style
const btnStyle = {
   backgroundColor: "#238878",
  height: 40,
  minWidth: 80,
  color: "#fff",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#fff",
    color: "#238878",
    borderColor: "#238878",
  },
}

// component
const PaymentMethod = () => {
  const methods = useForm<PaymentMethods>({

    defaultValues: {
      paymentMethod: "credit-card",
    },
  });

  // UPI value watch (instant update)
  const upiId = useWatch({
    control: methods.control,
    name: "UpiId",
  });

  // function to get UPI app icons
  const getUpiApp = (upiId?: string) => {
  if (!upiId) return null;

  const id = upiId.toLowerCase();

  // Google Pay
  if (
    id.includes("@okaxis") ||
    id.includes("@oksbi") ||
    id.includes("@okhdfcbank") ||
    id.includes("@okicici")
  ) {
    return "gpay";
  }

  // Paytm
  if (id.includes("@paytm")) 
  {
    return "paytm";
  }

  // phonepe
  if(id.includes("@ybl") ||
  id.includes("@axl") ||
  id.includes("@ibl"))
  {
    return "phonepe"
  }
  return null;
  };

  // detected icon
  const detecteIcon = getUpiApp(upiId) || "upi";
  //icon 
  const upiIcons: Record<string, string> = { //utility object-keys type and values type
    gpay: gpayIcon,
    paytm: paytmIcon,
    upi:upiIcon,
    phonepe: phonepeIcon,
  };

  // payment method watch (instant update)
  const payment = useWatch({
    control: methods.control,
    name: "paymentMethod",
  });

  const {handleSubmit} = methods
  // handle to card payment 
  const [CardPaymentStatus, setCardPaymentStatus] = useState<"default" | "loading" | "success"> ("default"); 
  // handle to upi payment
  const [UpiPaymentStatus, setUpiPaymentStatus] = useState<"default" | "loading" | "success"> ("default"); 

  const onCardPay = () => {
    setCardPaymentStatus("loading");
    setTimeout(() => {
      setCardPaymentStatus("success");
    }, 1500);
  };

const onUpiPay =() =>
{
  setUpiPaymentStatus("loading");
  setTimeout(()=>{
    setUpiPaymentStatus("success")
  },1500)
}


// function to show the status of payment for upi and card
const showPaymentStatus = (
  status: "default" | "loading" | "success"
) => {
  if (status === "loading") {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
        <CircularProgress />
        <Box textAlign="center">
          Waiting for payment confirmation…
          <br />
          Please complete the payment.
        </Box>
      </Box>
    );
  }

  if (status === "success") {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
        <CheckCircleIcon
          sx={{ color: "success.main", fontSize: { xs: 44, sm: 60 } }}
        />
        <Box fontWeight={500}>Successful</Box>
      </Box>
    );
  }

  return null;
};

const [activeTab, setActiveTab] = useState<"new" | "retail">("new");   
const navigate = useNavigate();
  const location = useLocation();
  return (

   
  <FormProvider {...methods}>
  <form noValidate>
    {/* new invoice and retail invoice btn */}
    <Button
          onClick={() => {setActiveTab("new");                                                        
            if (location.pathname !== URL_PATH.Billing) { navigate(URL_PATH.Billing);}}}                  
          sx={{
            textTransform: "none",       
            width: { xs: "50%", md: "10%" },
            height: "38px",
            fontWeight: 500,
            borderRadius: "0px 18px 0px 0px",
            backgroundColor: activeTab === "new" ? "#238878" : "#fff",       
            color: activeTab === "new" ? "#fff" : "#000",                   
            border: activeTab === "new" ? "none" : "1px solid #ccc",        
            "&:hover": {
              backgroundColor: activeTab === "new" ? "#238878" : "#f5f5f5",   
            },
          }}>
          New Invoice
        </Button>
 
        {/* Retail Invoice */}
          <Button
            onClick={() => {setActiveTab("retail");  
             if (location.pathname !== URL_PATH.RetailInvoice) { navigate(URL_PATH.RetailInvoice); }}}
            sx={{
              textTransform: "none",
              width: { xs: "50%", md: "10%" },
              height: "38px",
              fontWeight: 500,
              borderRadius: "0px 18px 0px 0px",
              backgroundColor: activeTab === "retail" ? "#238878" : "#fff",
              color: activeTab === "retail" ? "#fff" : "#000",
              border: activeTab === "retail" ? "none" : "1px solid #ccc",
              "&:hover": {
                backgroundColor: activeTab === "retail" ? "#238878" : "#f5f5f5",
              },
            }}>
            Retail Invoice
          </Button>
          <Box
          display="flex"
          flexDirection="column"
          sx={{
            border: "1px solid #ccc",
            gap: { xs: 2, sm: 3 }, 
            backgroundColor: "#fff",
            p: { xs: 2, sm: 3 },  
            // mx:{xs:-2 , md:0.5},          
          }}
        >
  
      {/* CARD PAYMENT */}
      <Paper sx={PaperStyle}>
        <RadioField
          name="paymentMethod"
          options={[
            { label: "Debit / Credit Card", value: "credit-card"},]}
          label=""
          sx={radioStyle}
        />

        <Box display="flex"   flexDirection={{ xs: "row", sm: "row" }} alignItems={{ xs: "stretch", sm: "center" }} gap={2}>
          {/* Card Number */}
          <Box flex={1} >
            <TextInputField
              label="Card Number"
              name="CardNumber"
              disabled={payment === "upi"}
              inputMode="numeric"
              minLength={13}
              maxLength={19}
              rules={{                
                required: payment === "credit-card" ? "Card Number is required" : false,
                pattern: {
                value: /^[0-9]{13,19}$/,
                message: "Enter valid card number",
              },
              }
            }
            />
          </Box>

          {/* Icon */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3
            }}
          >
            <CreditCardIcon />
          </Box>
        </Box>
        
        {/* Card holder name */}
        <Box display="flex" gap={2} alignItems="center">
          <Box flex={1}>
            <TextInputField
              label="Card Holder's Name"
              name="CardHolderName"
              disabled={payment === "upi"}
              minLength={3}
              maxLength={50}
              rules={{
                required:
                  payment === "credit-card"
                    ? "Card Holder's Name is required"
                    : false,
              }}
            />
          </Box>

          {/* Empty box only for sm+ screens */}
          <Box
            sx={{
              width: 24,
              display: { xs: "none", sm: "block" },
            }}
          />
        </Box>

        {/* Cvv */}       
        <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems="flex-start"
        justifyContent={{ xs: "flex-start", sm: "space-between" }}
        gap={2}
        >
          <Box width={{ xs: "100%", sm: "auto" }}>
            <NumericField
              label="CVV"
              name="Cvv"
              required={payment === "credit-card"}
              disabled={payment === "upi"}
              decimal={false}
              maxlength={3}
              min={0}
              max={999}
            />
          </Box>

          {/* Pay Button */}
          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit(onCardPay)}
            disabled={payment === "upi"}
            sx={{
              ...btnStyle,
              width: { xs: "100%", sm: "auto" },
              mb:1
            }}
          >
            Pay
          </Button>
        </Box>
        
        <Box textAlign="center" alignItems={"center"}>
            {showPaymentStatus(CardPaymentStatus)}
        </Box>
      </Paper>

      {/* UPI PAYMENT SECTION */}
      <Paper sx={PaperStyle}>
        <RadioField
          name="paymentMethod"
          options={[
            { label: "UPI Payment", value: "upi" },
          ]}
          label=""
          sx={radioStyle}
        />

        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box flex={1}>
              <TextInputField
                label="Enter your UPI ID"
                name="UpiId"
                inputType="all"
                rows={1}
                disabled={payment === "credit-card"}
                rules={{
                  required: payment === 'upi' ? 'UPI ID is required' : false,
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@(okaxis|oksbi|okhdfcbank|okicici|paytm|ybl|axl|ib|phonepe)$/,
                    message: 'Enter valid UPI ID'
                  }
                }}
                
              />
            </Box>

            {detecteIcon && upiIcons[detecteIcon] && (   
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  boxShadow: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <img
                  src={upiIcons[detecteIcon]}
                  width={28}
                  height={28}
                />
              </Box>
            )}
          </Box>

          {/* UPi pay btn */}
          <Box display="flex" justifyContent="flex-end" mt={0} >
            <Button 
                type="button" 
                variant="contained" 
                onClick={handleSubmit(onUpiPay)}
                disabled={payment === "credit-card"}
                sx={{...btnStyle,  width: { xs: "100%", sm: "auto" }}}>
                Pay
            </Button>

          </Box>
          {/* Payment status circular progress*/}
          <Box  alignItems="center" textAlign={"center"}>
            {showPaymentStatus(UpiPaymentStatus)}
          </Box>
        </Box>
      </Paper>
    </Box>
  </form>
</FormProvider>

  )
};

export default PaymentMethod;
