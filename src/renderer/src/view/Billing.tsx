import { Box, Button, Paper } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import TextInputField from "@/components/controlled/TextInputField";
import MobileField from "@/components/controlled/MobileField";
import DropdownField from "@/components/controlled/DropdownField";
import RetailItemSection from "@/containers/billing/RetailItemSection";
import type { ItemRow } from "@/containers/billing/RetailItemSection";
import NumericField from "@/components/controlled/NumericField";
import { useNavigate, useLocation } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import InvoiceTabButtons from "@/containers/billing/InvoiceTabButtons";
import NewInvoice from "@/containers/billing/NewInvoice";
import EmailField from "@/components/controlled/EmailField";
import { createRetailInvoice } from "@/service/retailInvoiceService";
import { getAllCustomers  } from "@/service/customerService";
import { CustomerData } from "@/view/CustomerMaster";
import { getDoctors, DoctorResponse } from "@/service/doctorService";

// Payprint button reuse sx
const PayNPrint = {
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

type PaymentNavigationState = {
  invoiceId: number;
  rows: ItemRow[];
  totalFromInvoice: number;
  customerName: string;
  doctorName: string;
};


type RetailInvoiceFormValues = {
  name: string;
  age: string;
  mobile: string;
  email: string;
  doctor: string;
  reference: string;
  addressLeft: string;
  addressRight: string;
};

function RetailInvoice() {
  const navigate = useNavigate();
  const location = useLocation();
  const methods = useForm<RetailInvoiceFormValues>({
    defaultValues: {
      name: "",
      age: "",
      mobile: "",
      email: "",
      doctor: "",
      reference: "",
      addressLeft: "",
      addressRight: "",
    },
    mode: "onChange",
  });

  const isRetail = location.pathname.includes("retail-invoice");

const [customerOptions, setCustomerOptions] = useState<CustomerData[]>([]);
  const activeInvoice = location.pathname.match(/invoice(\d+)/)?.[1] ?? "1";
  const [isSubmitted, setIsSubmitted] = useState(false);


 const [doctorList, setDoctorList] = useState<DoctorResponse[]>([]);
  useEffect(() => {
  const fetchCustomers = async () => {
    try {
      const data = await getAllCustomers();
      setCustomerOptions(data);
    } catch (error) {
      console.error("Error fetching customers", error);
    }
  };

  fetchCustomers();
}, []);

  // Invoice button reusable sx
  const invoiceButtonSx = (isActive: boolean) => ({
    backgroundColor: isActive ? "#fff" : "#238878",
    color: isActive ? "#238878" : "#fff",
    border: "2px solid #238878",
    textTransform: "none",
    minWidth: "250px",
    height: "36px",
    "&:hover": {
      backgroundColor: "#fff",
      color: "#238878",
      border: "2px solid #238878",
    },
  });
  
 const onSubmit = async () => {
  setIsSubmitted(true);

  const hasInvalidItems = rows.some(
    (row) =>
      row.medicineId === "" ||
      row.quantity === "" ||
      Number(row.quantity) <= 0 ||
      row.price === "" ||
      Number(row.price) <= 0
  );

  if (hasInvalidItems) return;

  try {
    const now = new Date();
    const customerName = methods.getValues("name");
    const doctorName = methods.getValues("doctor");
    
   const selectedCustomer = customerOptions.find(
  (c) => c.name === customerName
);

if (!selectedCustomer) {
  console.error("Customer not selected");
  return;
}
const customerId: number = selectedCustomer.customerId;
const payload = {
  userId: 1,
  customerId: customerId, 
  invoiceType: "Retail",
  invoiceDate: now.toISOString(),
  totalAmount: finalTotal,
  totalGST: 0,
  totalDiscount: 0,
 medipointsEarned: Math.floor(finalTotal / 200) * 5, 
  paymentStatus: "Pending",
};

    const res = await createRetailInvoice(payload);

    navigate(URL_PATH.MediPoints, {
      state: {
        invoiceId: res.retailInvoiceId,
        rows,
        totalFromInvoice: finalTotal,
        customerName,
        doctorName,
      } as PaymentNavigationState,
    });
  } catch (error) {
    console.error("Create invoice failed", error);
  }
};
const [invoiceDataMap, setInvoiceDataMap] = useState<Record<string, ItemRow[]>>({});

const [rows, setRows] = useState<ItemRow[]>([
  {
    retailItemId: Date.now(),
    medicineId: "",
    quantity: 1,
    price: "",
    amount: 0,
  },
]);

const setRowsAndSave = (newRows: ItemRow[]) => {
  setRows(newRows);
  setInvoiceDataMap((prev) => ({ ...prev, [activeInvoice]: newRows }));
};
 
useEffect(() => {
  const savedRows = invoiceDataMap[activeInvoice];
  if (savedRows && savedRows.length > 0) {
    setRows(savedRows);
  } else {
    setRows([
      {
        retailItemId: Date.now(),
        medicineId: "",
        quantity: 1,
        price: "",
        amount: 0,
      },
    ]);
  }
}, [activeInvoice, invoiceDataMap]);


  const [doctorOptions, setDoctorOptions] = useState<
    { label: string; value: string }[]
  >([]);


  // load doctor list
 useEffect(() => {
  const fetchDoctors = async () => {
    try {
      const data = await getDoctors();
      setDoctorList(data);
      const options = data.map((doc: DoctorResponse) => ({
        label: `Dr. ${doc.doctorName}`,
        value: doc.doctorName,
      }));
      setDoctorOptions(options);
    } catch (error) {
      console.error("Error fetching doctors", error);
    }
  };
  fetchDoctors();
}, []);
  const selectedDoctorName = methods.watch("doctor");
  const selectedCustomerName = methods.watch("name");

const nameOptions = [
  { label: "+ Add Customer", value: "add_customer" },
  ...customerOptions.map((customer) => ({
    label: customer.name,
    value: customer.name,
  })),
];
 
useEffect(() => {
  if (selectedCustomerName === "add_customer") {
    navigate(URL_PATH.AddCustomerForm);
    return;
  }

  if (!selectedCustomerName) return;

  const selectedCustomer = customerOptions.find(
    (c) => c.name === selectedCustomerName
  );

  if (selectedCustomer) {
    methods.setValue("age", selectedCustomer.age || "");
    methods.setValue("mobile", selectedCustomer.phone || "");
    methods.setValue("email", selectedCustomer.email || "");
    methods.setValue("addressLeft", selectedCustomer.address || "");
    methods.setValue("doctor", selectedCustomer.doctor || "");

    const normalize = (str: string) =>
      str.replace("Dr.", "").replace("dr.", "").trim().toLowerCase();

    const matchedDoctor = doctorList.find(
      (doc) =>
        normalize(doc.doctorName) ===
        normalize(selectedCustomer.doctor || "")
    );

    if (matchedDoctor) {
      methods.setValue(
        "addressRight",
        matchedDoctor.hospitalAddress || ""
      );
    }
  }
}, [selectedCustomerName, customerOptions, methods, navigate, doctorList]);


useEffect(() => {
  if (!selectedDoctorName) return;
  if (selectedCustomerName && selectedCustomerName !== "add_customer") return;

  const normalize = (str: string) =>
    str.replace("Dr.", "").replace("dr.", "").trim().toLowerCase();

  const selectedDoctor = doctorList.find(
    (doc) => normalize(doc.doctorName) === normalize(selectedDoctorName)
  );
  if (selectedDoctor) {
    methods.setValue("addressRight", selectedDoctor.hospitalAddress || "");
  }
}, [selectedDoctorName, doctorList, methods, selectedCustomerName]);


 const subTotal = rows.reduce(
    (sum, r) => sum + (Number(r.quantity) * Number(r.price) || 0),
    0
  );

  const finalTotal = subTotal;

  return (
    <FormProvider {...methods}>
      {/* invoice tab button */}
      <InvoiceTabButtons />
      {!isRetail ? (
        <NewInvoice />
      ) : (
        <Box
          sx={{
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "grey.400",
            p: 2,
            backgroundColor: "#fff",
          }}
        >
          <Box
            display="flex"
            gap={1.5}
            mb={2}
            flexWrap="wrap"
            sx={{
              justifyContent: { xs: "flex-start", md: "flex-start" },
            }}
          >
            {Array.from({ length: 10 }, (_, i) => {
              const invoiceNumber = i + 1;
              const isActive = String(invoiceNumber) === activeInvoice;
              return (
                <Button
                  key={invoiceNumber}
                  sx={{
                    ...invoiceButtonSx(isActive),
                    width: { xs: "calc(50% - 6px)", md: "19%" },
                    minWidth: { xs: "unset", md: "19%" },
                    fontSize: { xs: "12px", md: "14px" },
                  }}
onClick={() => {
  setInvoiceDataMap((prev) => ({ ...prev, [activeInvoice]: rows }));
  navigate(`${URL_PATH.Billing}${invoiceNumber}`);
}}>

                  Invoice {invoiceNumber}
                </Button>
              );
            })}
          </Box>
          <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
            <Paper sx={{ p: 3, borderRadius: 2 }} elevation={3}>
              {/* inner box */}
              <Box
                display="flex"
                gap={2}
                flexDirection={{ xs: "column", md: "row" }}
              >
                {/* left box */}
                <Box flex={2} display="flex" flexDirection="column" gap={2}>
                  <Box
                    display="flex"
                    gap={2}
                    flexDirection={{ xs: "column", sm: "row" }}
                  >
                    <Box width={{ xs: "100%", sm: "260px" }}>
                      <DropdownField
                        name="name"
                        label="Name"
                        options={nameOptions}
                        required
                        onlyAlphabet
                        // freeSolo
                        editable={true}
                        

                      />
                    </Box>

                    <Box width={{ xs: "100%", sm: "260px" }}>
                      <NumericField name="age" label="Age" min={15} max={100} />
                    </Box>
                  </Box>

                  <Box
                    display="flex"
                    gap={2}
                    flexDirection={{ xs: "column", sm: "row" }}
                  >
                    <Box width={{ xs: "100%", sm: "260px" }}>
                      <MobileField
                        name="mobile"
                        label="Mobile Number"
                        countryCode
                        required
                      />
                    </Box>
                    <Box width={{ xs: "100%", sm: "260px" }}>
                      <EmailField name="email" label="Email" />
                    </Box>
                  </Box>
                  <Box sx={{ width: { xs: "100%", md: "535px" } }}>
                    <TextInputField
                      name="addressLeft"
                      label="Address"
                      inputType="textarea"
                       minLength={10}
                      maxLength={50}
                      rows={3}
                    />
                  </Box>
                </Box>
                {/* right */}
                <Box
                  flex={1}
                  display="flex"
                  flexDirection="column"
                  gap={{ xs: 2, md: 1.5 }}>

                  <Box width={{ xs: "100%", sm: "260px" }}>
                    <DropdownField
                      name="doctor"
                      label="Doctor"
                      options={doctorOptions}
                     freeSolo={false}
                      editable={true}
                      placeholder="Select Dr"
                    />
                  </Box>
                  <Box width={{ xs: "100%", sm: "260px" }}>
                    <TextInputField
                      name="addressRight"
                      label="Address"
                      inputType="textarea"
                      minLength={10}
                      maxLength={50}
                      rows={3} />

                  </Box>
                </Box>
              </Box>
            </Paper>

            <Box mt={3}>

              <RetailItemSection
                rows={rows}
                setRows={setRowsAndSave}
                finalTotal={finalTotal}
                isSubmitted={isSubmitted}
              />

            </Box>

            {/* Bottom pay print button */}
            <Box
              sx={{
                mt: 4,
                mb: 5,
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: { xs: "center", md: "flex-end" },
              }}
            >
              <Button
                variant="contained"
                type="submit"
                sx={{
                  ...PayNPrint,
                  minWidth: "140px",
                }}
              >
                Save & Continue
              </Button>
            </Box>
          </form>
        </Box>
      )}
    </FormProvider>
  );
}

export default RetailInvoice;