import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import {
  FormProvider,
  useForm,
  useFieldArray,
  FieldErrors,
} from "react-hook-form";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useState, useEffect } from "react";
import EmailField from "@/components/controlled/EmailField";
import MobileField from "@/components/controlled/MobileField";
import TextInputField from "@/components/controlled/TextInputField";
import DropdownField from "@/components/controlled/DropdownField";
import { useNavigate, useLocation } from "react-router-dom";
import { showToast } from "@/components/uncontrolled/ToastMessage";
import { URL_PATH } from "@/constants/UrlPath";
import { FormControl,InputLabel,Select,MenuItem} from "@mui/material";


/* STYLES */
const TEAL_COLOR = "#2D8B7A";
const BORDER_COLOR = "#D1D5DB";

const containerStyle = {
  p: { xs: 2 },
  backgroundColor: "#fff",
  borderRadius: "12px",
  border: `1px solid ${BORDER_COLOR}`,
  mb: 2,
};

type InventoryItem = {
  itemName: string;
  pricePerUnit: number;
};


type ItemRow = {
  name: string;
  qty: number;
  mrp: number;
  discount: number;
};
type Distributor = {
  id: string;
  companyName: string;
  ownerName?: string;
  mobile: string;
  email: string;
  address: string;
  status: "Active" | "Inactive";
};

type FormData = {
  company: string;
  supplier: string;
  mobile: string;
  email: string;
  address: string;
  gst: string;
  items: ItemRow[];
};

const RetailInvoice = () => {
  const navigate = useNavigate();
  const location = useLocation();  
  const [distributors, setDistributors] = useState<Distributor[]>([]);

  const methods = useForm<FormData>({
    mode: "onSubmit",
    shouldUnregister: false,
    defaultValues: {
      gst: "5",
      items: [{ name: "", qty: 1, mrp: 0, discount: 0 }],
    },
  });

  const {
    handleSubmit,
    watch,
    control,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items") || [];
  const gst = Number(watch("gst") || 0);

  const getRowAmount = (row: ItemRow) => {
    const qty = Number(row.qty || 0);
    const mrp = Number(row.mrp || 0);
    const discount = Number(row.discount || 0);

    const priceAfterDiscount = mrp - discount;
    if (priceAfterDiscount <= 0) return 0;

    return qty * priceAfterDiscount;
  };
   const activeTab: "new" | "retail" = location.pathname.includes('retail-invoice') ? "retail" : "new";


  const subTotal = items.reduce(
    (sum, row) => sum + getRowAmount(row),
    0
  );

const [inventory, setInventory] = useState<InventoryItem[]>([]);

const inventoryOptions = inventory.map((item) => ({
  label: item.itemName,
  value: item.itemName,
}));



  useEffect(() => {
  const saved = localStorage.getItem("distributors");
  if (saved) {
    const parsed: Distributor[] = JSON.parse(saved);
    setDistributors(parsed);
  }
}, []);

  const gstAmount = (subTotal * gst) / 100;
  const finalTotal = subTotal + gstAmount;
  const selectedCompany = watch("company");


  const onSubmit = (data: FormData) => {
    console.log("FORM SUBMITTED:", data);
    showToast("success", "Data saved successfully!");
     navigate(URL_PATH.PaymentDetails );
    
  };

  const onError = (formErrors: FieldErrors<FormData>) => {
    console.log("FORM ERRORS:", formErrors);
    showToast("error", "Please fill all required fields");
  };

 const companyOptions = distributors
  .filter((d) => d.status === "Active")
  .map((d) => ({
    label: d.companyName,
    value: d.companyName,
  }));


  useEffect(() => {
  const savedInventory = localStorage.getItem("inventory");
  if (savedInventory) {
    const parsed: InventoryItem[] = JSON.parse(savedInventory);
    setInventory(parsed);
  }
}, []);


  useEffect(() => {
  if (selectedCompany) {
    const selectedDistributor = distributors.find(
      (d) => d.companyName === selectedCompany
    );

    if (selectedDistributor) {
      methods.setValue("mobile", selectedDistributor.mobile || "");
      methods.setValue("email", selectedDistributor.email || "");
      methods.setValue("address", selectedDistributor.address || "");
      methods.setValue("supplier", selectedDistributor.ownerName || "");
    }
  }
}, [selectedCompany, distributors, methods]);



  return (
    <FormProvider {...methods}>
         <Button
        onClick={() => {
          if (location.pathname !== URL_PATH.Billing) {
            navigate(URL_PATH.Billing);
          }
        }}
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
        }}
      >
        New Invoice
      </Button>

      {/* Retail Invoice */}
      <Button
        onClick={() => {
          if (location.pathname !== URL_PATH.RetailInvoice) {
            navigate(URL_PATH.RetailInvoice);
          } 
        }}
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
        }}
      >
        Retail Invoice
      </Button>
      
      <Paper sx={{ p: 2 }}>
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          noValidate
        >
          <Box sx={containerStyle}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
  <InputLabel>Company</InputLabel>
  <Select
    value={methods.watch("company") || ""}
    label="Company"
    onChange={(e) => {
      methods.setValue("company", e.target.value);
    }}
  >
    {companyOptions.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </Select>
</FormControl>

              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextInputField
                  name="supplier"
                  label="Supplier"
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <MobileField
                  name="mobile"
                  label="Mobile Number"
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <EmailField
                  name="email"
                  label="Email Address"
                  required
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextInputField
                  name="address"
                  label="Address"
                  inputType="textarea"
                  rows={3}
                />
              </Grid>
            </Grid>
          </Box>

          {/* ITEMS */}
          <Box sx={containerStyle}>
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h6">Item Name</Typography>

              <Button
                type="button"
                startIcon={<AddIcon />}
                onClick={() =>
                  append({
                    name: "",
                    qty: 1,
                    mrp: 0,
                    discount: 0,
                  })
                }
                sx={{ textTransform: "none", color: TEAL_COLOR }}
              >
                Add Item
              </Button>
            </Box>

            {fields.map((field, index) => (
              <Grid container spacing={2} mb={2} key={field.id}>
                <Grid size={{ xs: 12, md: 3 }}>
        
<DropdownField
  name={`items.${index}.name`}
  label="Item"
  options={inventoryOptions}
  required
  freeSolo={false}
  onChangeCallback={(selectedValue) => {
    const selectedItem = inventory.find(
      (item) => item.itemName === selectedValue
    );

    if (selectedItem) {
      methods.setValue(
        `items.${index}.mrp`,
        selectedItem.pricePerUnit
      );
    } else {
      methods.setValue(`items.${index}.mrp`, 0);
    }
  }}
/>

                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                  <TextInputField
                    name={`items.${index}.qty`}
                    label="QTY"
                    type="number"
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                  <TextInputField
                    name={`items.${index}.mrp`}
                    label="MRP"
                    type="number"
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                  <TextInputField
                    name={`items.${index}.discount`}
                    label="DISCOUNT"
                    type="number"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                  <TextField
                    fullWidth
                    label="Amount"
                    disabled
                    value={getRowAmount(items[index]).toFixed(2)}
                  />
                </Grid>

                {/* <Grid size={{ xs: 12, md: 1 }}> */}
                  <Grid textAlign={{ xs: "right", md: "center" }} size={{ xs: 12, md: 1 }}>
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <RemoveIcon />
                  </Button>
                </Grid>
              </Grid>
            ))}

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 3 }}>
                <DropdownField
                  name="gst"
                  label="GST (%)"
                  options={[
                    { label: "5%", value: "5" },
                    { label: "12%", value: "12" },
                    { label: "18%", value: "18" },
                  ]}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }} ml="auto">
                <Box
                  sx={{
                    height: 56,
                    backgroundColor: "#E6F4F1",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: TEAL_COLOR,
                  }}
                >
                  Total: ₹ {finalTotal.toFixed(2)}
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box
            display="flex"
            gap={2}
            mt={3}
            sx={{
              justifyContent: { xs: "center", md: "flex-end" },
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              type="submit"
              
              sx={{
                bgcolor: TEAL_COLOR,
                color: "#fff",
                "&:hover": { bgcolor: "#fff", color: TEAL_COLOR },
                px: 4,
              }}
            >
              Save And Submit
            </Button>

            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              type="button"
              onClick={() => window.print()}
              sx={{
                bgcolor: TEAL_COLOR,
                color: "#fff",
                "&:hover": { bgcolor: "#fff", color: TEAL_COLOR },
                px: 4,
              }}
            >
              Print
            </Button>
            </Box>

        </form>
      </Paper>
    </FormProvider>
  );
};

export default RetailInvoice;