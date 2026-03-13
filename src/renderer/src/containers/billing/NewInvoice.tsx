import {
  Box,
  Grid,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { FormProvider, useForm, FieldErrors } from "react-hook-form";

import { useState, useEffect } from "react";

import EmailField from "@/components/controlled/EmailField";
import MobileField from "@/components/controlled/MobileField";
import TextInputField from "@/components/controlled/TextInputField";

import { useNavigate } from "react-router-dom";
import { showToast } from "@/components/uncontrolled/ToastMessage";
import { URL_PATH } from "@/constants/UrlPath";

import InvoiceTabButtons from "./InvoiceTabButtons";
import ItemsSection from "@/containers/customer/ItemsSection";

const BORDER_COLOR = "#D1D5DB";

const containerStyle = {
  p: { xs: 2 },
  backgroundColor: "#fff",
  borderRadius: "12px",
  border: `1px solid ${BORDER_COLOR}`,
  mb: 2,
};

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
};

type ItemRow = {
  id: number;
  name: string;
  qty: number | "";
  price: number | "";
};

const NewInvoice = () => {
  const navigate = useNavigate();

  const [distributors, setDistributors] = useState<Distributor[]>([]);

  const [rows, setRows] = useState<ItemRow[]>([
    { id: Date.now(), name: "", qty: 1, price: "" },
  ]);

  const [isSubmitted, setIsSubmitted] = useState(false);

  /*  GRAND TOTAL */

  const finalTotal = rows.reduce((sum, r) => {
    return sum + Number(r.qty || 0) * Number(r.price || 0);
  }, 0);

  const methods = useForm<FormData>({
    mode: "onSubmit",
    shouldUnregister: false,
  });

  const { handleSubmit, watch } = methods;

  /* LOAD DISTRIBUTORS */

  useEffect(() => {
    const saved = localStorage.getItem("distributors");

    if (saved) {
      const parsed: Distributor[] = JSON.parse(saved);
      setDistributors(parsed);
    }
  }, []);

  const selectedCompany = watch("company");

  const onSubmit = (data: FormData) => {
    setIsSubmitted(true);

    if (rows.some((r) => !r.name || !r.qty || !r.price)) {
      showToast("error", "Please fill all item details");
      return;
    }

    const existingInvoices = JSON.parse(
      localStorage.getItem("currentNewInvoice") || "[]",
    );

    const newInvoice = {
      id: Date.now(),
      company: data.company,
      supplier: data.supplier,
      mobile: data.mobile,
      email: data.email,
      address: data.address,
      items: rows,
      totalPrice: finalTotal,
    };

    const updatedInvoices = [...existingInvoices, newInvoice];

    localStorage.setItem("currentNewInvoice", JSON.stringify(updatedInvoices));

    showToast("success", "Data saved successfully!");

    navigate(URL_PATH.PaymentMethod, {
      state: { totalFromInvoice: finalTotal },
    });
  };

  const onError = (formErrors: FieldErrors<FormData>) => {
    console.log("FORM ERRORS:", formErrors);
    showToast("error", "Please fill all required fields");
  };

  /* COMPANY OPTIONS */

  const companyOptions = distributors
    .filter((d) => d.status === "Active")
    .map((d) => ({
      label: d.companyName,
      value: d.companyName,
    }));

  /* AUTO FILL */

  useEffect(() => {
    if (selectedCompany) {
      const selectedDistributor = distributors.find(
        (d) => d.companyName === selectedCompany,
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
      <InvoiceTabButtons />

      <Paper sx={{ p: 2 }}>
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
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
                <TextInputField name="supplier" label="Supplier" required />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <MobileField
                  name="mobile"
                  label="Mobile Number"
                  required
                  countryCode
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <EmailField name="email" label="Email Address" required />
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

          <ItemsSection
            rows={rows}
            setRows={setRows}
            finalTotal={finalTotal}
            isSubmitted={isSubmitted}
          />

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
              sx={{ ...PayNPrint, minWidth: "140px" }}
            >
              Save And Submit
            </Button>
          </Box>
        </form>
      </Paper>
    </FormProvider>
  );
};

export default NewInvoice;
