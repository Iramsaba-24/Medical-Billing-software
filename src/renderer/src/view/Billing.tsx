import { Box, Button, Paper } from '@mui/material';
import { FormProvider, useForm  } from 'react-hook-form';
import { useState, useEffect } from "react";
import TextInputField from '@/components/controlled/TextInputField';
import EmailField from '@/components/controlled/EmailField';
import MobileField from '@/components/controlled/MobileField';
import DropdownField from '@/components/controlled/DropdownField';
import ItemsSection from '@/containers/Customer/ItemsSection';
import NumericField from '@/components/controlled/NumericField';
import { useNavigate, useLocation} from "react-router-dom";
import { Print } from "@mui/icons-material";
import { URL_PATH } from "@/constants/UrlPath";


// Invoice button reuse sx
const invoiceButtonSx = {
  backgroundColor: "#238878",
  color: "#fff",
  border: "2px solid #238878",
  textTransform: "none",
  minWidth: "250px",
  height: "36px",
  "&:hover": {
    backgroundColor: "#fff",
    color: "#238878",
    border: "2px solid #238878",
  },
};


type NewInvoiceFormValues = {
  name: string;
  age: string;
  mobile: string;
  email: string;
  doctor: string;
  reference: string;
  addressLeft: string;
  addressRight: string;
};

// Doctor Option
const doctorOptions = [
  { label: 'Dr. Amit Sharma', value: 'amit_sharma' },
  { label: 'Dr. Sneha Patil', value: 'sneha_patil' },
  { label: 'Dr. Rahul Mehta', value: 'rahul_mehta' }
];

function POSMaster() {
  
  const navigate = useNavigate();
  const methods = useForm<NewInvoiceFormValues>({
    defaultValues: {
      name: '',
      age: '',
      mobile: '',
      email: '',
      doctor: '',
      reference: '',
      addressLeft: '',
      addressRight: ''
    }
  });

  useEffect(() => {
    methods.reset();          // form reset
    setRows([{               // items reset
      id: Date.now(),
      name: "",
      qty: 1,
      price: ""
    }]);
  }, [methods]);    // when url change with invoice number

 



  const [activeTab, setActiveTab] = useState<"new" | "retail">("new");   //in () default value of active tab

  
  const location = useLocation();
  const match = location.pathname.match(/invoice(\d+)/);
  const activeInvoiceNumber = match ? match[1] : null;




  const onSubmit = (data: NewInvoiceFormValues) => {
    console.log(data);
    navigate("/medi-point")
  };

  type ItemRow = {
  id: number;
  name: string;
  qty: number | "";
  price: number | "";
};

 const [rows, setRows] = useState<ItemRow[]>([ { id: Date.now(), name: "", qty: 1, price: "" }]);
    //  rows for current setrows for updated


const [gst, setGst] = useState(5);
const [paymentMode, setPaymentMode] = useState("Cash");

const subTotal = rows.reduce(
  (sum, r) => sum + (Number(r.qty) * Number(r.price) || 0),
  0
);                                                                   //calculation for total total amount without gst

const finalTotal = subTotal + (subTotal * gst) / 100;               // calculation fot total amount with gst


  return (
    <FormProvider {...methods}>

        {/* New Invoice */}
        <Button
          onClick={() => {setActiveTab("new");                                                        //active tab value new 
            if (location.pathname !== URL_PATH.Billing) { navigate(URL_PATH.Billing);}}}                   
          sx={{
            textTransform: "none",       //capital none
            // px: { xs: 7.5, sm: 3 },
            width: { xs: "50%", md: "10%" },
            height: "38px",
            fontWeight: 500,
            borderRadius: "0px 18px 0px 0px",
            backgroundColor: activeTab === "new" ? "#238878" : "#fff",       //if active make it green background
            color: activeTab === "new" ? "#fff" : "#000",                   //if active text color white
            border: activeTab === "new" ? "none" : "1px solid #ccc",        //if active border color none
            "&:hover": {
              backgroundColor: activeTab === "new" ? "#238878" : "#f5f5f5",   //if active same color inactive=gray
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
              // px: { xs: 7.5, sm: 3 },
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


      {/* outter box */}
       <Box sx={{borderWidth: 1, borderStyle: "solid", borderColor: "grey.400", p: 2, backgroundColor: "#fff" }}>

        {/* Invoice Button */}

          <Box display="flex" gap={1.5} mb={2} flexWrap="wrap"
                      sx={{
                        justifyContent: { xs: 'flex-start', md: 'flex-start' }
                      }}>
                          {Array.from({ length: 10 }, (_, i) => {
                            const invoiceNumber = i + 1;
                            const isActive = activeInvoiceNumber === String(invoiceNumber);

          
                            return (
                              <Button
                                key={invoiceNumber}
                               sx={{
                                  width: { xs: 'calc(50% - 6px)', md: 'auto' },
                                  minWidth: { xs: 'unset', md: '250px' },
                                  fontSize: { xs: '12px', md: '14px' },
                                  textTransform: "none",
                                  minHeight: "36px",
                                  borderRadius: "4px",

                                  backgroundColor: isActive ? "#fff" : "#238878",
                                  color: isActive ? "#238878" : "#fff",
                                  border: "2px solid #238878",

                                  "&:hover": {
                                    backgroundColor: "#fff",
                                    color: "#238878",
                                  },
                                }}
                                onClick={() => {
                                navigate(`${URL_PATH.Billing}/invoice${invoiceNumber}`);}}>
                               
                                Invoice {invoiceNumber}
                              </Button>
                            );
                          })}
          
                    </Box>


          <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <Paper sx={{ p: 3, borderRadius: 2 }} elevation={3}>
          
            {/* Inner box */}
          <Box display="flex" gap={2} flexDirection={{ xs: 'column', md: 'row' }} >

            {/* left side */}
            <Box flex={2} display="flex" flexDirection="column" gap={2}>
              

              <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
                <Box width={{ xs: '100%', sm: '260px' }}>
                  <TextInputField
                    name="name"
                    label="Name"
                    
                    required
                    inputType="alphabet"
                  />
                </Box>

                <Box width={{ xs: '100%', sm: '260px' }}>
                  <NumericField
                    name="age"
                    label="Age"
                    required
                    max={100}/>
                </Box>
              </Box>

              <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
                <Box width={{ xs: '100%', sm: '260px' }}>
                  <MobileField
                    name="mobile"
                    label="Mobile Number"
                   
                    required
                  />
                </Box>

                <Box width={{ xs: '100%', sm: '260px' }}>
                  <EmailField
                    name="email"
                    label="Email"
                    required
                   
                  />
                </Box>
              </Box>


              <Box sx={{ width: { xs: "100%", md: "535px"}}}>
              <TextInputField
                  name="addressLeft"
                  label="Address"
                  inputType="textarea"
                  required
                  rows={3}/>
              </Box>

            </Box>

            {/* right */}
            <Box flex={1} display="flex" flexDirection="column"  gap={{ xs: 2, md: 1.5 }}>
              
              <Box width={{ xs: '100%', sm: '260px' }}>
                <DropdownField
                  name="doctor"
                  label="Doctor"
                  // size="small"
                  required
                  options={doctorOptions}
                  freeSolo={false}
                  placeholder='Doctor'
                />
              </Box>

              <Box width={{ xs: '100%', sm: '260px' }}>
                <TextInputField
                  name="reference"
                  label="New Reference"
                 
                />
              </Box>

              <Box width={{ xs: '100%', sm: '260px' }}>
                <TextInputField
                  name="addressRight"
                  label="Address"
                  inputType="textarea"
                  
                  rows={3}
                />
              </Box>


            </Box>
          </Box>
        
        </Paper>

        {/* called using props for item name section */}
        <Box mt={3}>
          <ItemsSection
            rows={rows}
            setRows={setRows}
            gst={gst}
            setGst={setGst}
            paymentMode={paymentMode}
            setPaymentMode={setPaymentMode}
            finalTotal={finalTotal}/>
        </Box>




        {/* Bottom Action Buttons (Print, Pay) */}
                  <Box sx={{ mt: 4, mb: 5, display: "flex", gap: 2, flexWrap: "wrap", justifyContent: { xs: "center", md: "flex-end" }}}>
                     {/* Pay Button */}
                      <Button
                        variant="contained"
                        type='submit'
                        sx={{
                          ...invoiceButtonSx,
                          minWidth: "140px",}}
                        >
                        Pay
                      </Button>
                     
                      {/* Print Button */}
                      <Button
                        variant="outlined"
                        startIcon={<Print />}
                        sx={{
                          ...invoiceButtonSx,
                          minWidth: "140px",}}
                        onClick={() => window.print()}>
                        Print
                      </Button>
                  </Box>
      </form>
      </Box>
    </FormProvider>
  );
}

export default POSMaster;
