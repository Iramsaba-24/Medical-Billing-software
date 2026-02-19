import { useEffect, useState } from "react";
import { Box, Paper, Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { UniversalTable, Column, DropdownOption,
} from "@/components/uncontrolled/UniversalTable";

import { Invoice, InvoiceStatus } from "@/types/invoice";
import { FormProvider, useForm } from "react-hook-form";
import DropdownField from "@/components/controlled/DropdownField";
import { URL_PATH } from "@/constants/UrlPath";
import { showToast, showConfirmation } from "@/components/uncontrolled/ToastMessage.tsx"; 
type Props = {
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  onCreate: () => void;
  onView: (invoice: Invoice) => void;
};


type FilterType = "all" | "daily" | "monthly" | "yearly";

const BillingTable = ({ onCreate, invoices, setInvoices, }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();

  // invoice local storage
  useEffect(() => {
    if (location.state) {
      const newInvoice = location.state as Invoice; //convert data into invoice type
      //check if invoice item already exists
      setInvoices((prev) => {
        const exists = prev.some((inv) => inv.invoice === newInvoice.invoice);
        if (exists) return prev;

        const safeInvoice = {
          ...newInvoice,
          medicines: newInvoice.medicines.map((med) => ({
            ...med,
            amount: Number(med.amount),
          })),
        };
        return [safeInvoice, ...prev];
      });
    }
  },[location.state, setInvoices] );

  const [filterType, setFilterType] = useState<FilterType>("all");

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Daily", value: "daily" },
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
  ];

  const filteredInvoices = invoices.filter((invoice) => {
    if (filterType === "all") return true;

    const invoiceDate = new Date(invoice.date);
    const today = new Date();

    if (filterType === "daily")
      return invoiceDate.toDateString() === today.toDateString();

    if (filterType === "monthly")
      return (
        invoiceDate.getMonth() === today.getMonth() &&
        invoiceDate.getFullYear() === today.getFullYear()
      );

    if (filterType === "yearly")
      return invoiceDate.getFullYear() === today.getFullYear();

    return true;
  });

  const columns: Column<Invoice>[] = [
    { key: "invoice", label: "Invoice" },
    { key: "patient", label: "Patient" },
    { key: "date", label: "Date" },
    {
      key: "price",
      label: "Price",
      render: (row) => `₹ ${row.price.toLocaleString()}`,
    },
    { key: "status", label: "Status" },
    { key: "actionbutton", label: "Action" },
  ];

  const statusOptions: DropdownOption[] = [
    { value: "Paid", label: "Paid" },
    { value: "Pending", label: "Pending" },
    { value: "Overdue", label: "Overdue" },
  ];

  const methods = useForm({ defaultValues: { filterType: "all" } });

  //  DELETE
  const handleDelete = async (invoiceNo: string) => {
    const confirmed = await showConfirmation(
      "Are you sure you want to delete this invoice?",
      "Confirm Delete"
    );

    if (!confirmed) return;

    setInvoices((prev) =>
      prev.filter((inv) => inv.invoice !== invoiceNo)
    );

    showToast("success", "Invoice deleted successfully");
  };

  return (
    <FormProvider {...methods}>
      <Paper sx={{ p: 2 }}>
                <Typography fontSize={{ xs: 18, md: 20 }} mb={2} fontWeight={600}>
          Invoice List
        </Typography>
      <Box
        mb={2}
        display="flex"
        justifyContent="flex-end"
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}

          gap={2}
          width={{ xs: "100%", sm: "auto" }}
        >
          <Box sx={{ width: { xs: "100%", sm: 180 } }}>
            <DropdownField
              name="filterType"
              label="Filter"
              options={filterOptions}
              onChangeCallback={(value) => setFilterType(value as FilterType)}
              size="small"
            />
          </Box>
          <Button
            variant="contained"
            onClick={onCreate}
            sx={{
              backgroundColor: "#238878",
              color: "#fff",
              border: "2px solid #238878",
              textTransform: "none",
              height: 40,
              "&:hover": {
                backgroundColor: "#fff",
                color: "#238878",
                border: "2px solid #238878",
              },
            }}
          >
            + Create Invoice
          </Button>
        </Box>
      </Box>
        <UniversalTable<Invoice>
          data={filteredInvoices}
          columns={columns}
          showSearch
          showExport
          enableCheckbox
          getRowId={(row) => row.invoice}
          dropdown={{
            key: "status",
            options: statusOptions,
            onChange: (row, value) => {
              setInvoices((prev) =>
                prev.map((inv) =>
                  inv.invoice === row.invoice
                    ? { ...inv, status: value as InvoiceStatus }
                    : inv
                )
              );

              showToast("success", "Status updated successfully");
            },
          }}
          actions={{
            view: (invoice) =>
              navigate(`${URL_PATH.InvoiceView}/${invoice.invoice}`, {
                state: invoice,
              }),

            edit: (invoice) =>
              navigate(URL_PATH.CreateInvoice, {
                state: invoice,
              }),

            delete: (invoice) =>
              handleDelete(invoice.invoice),
          }}
          onDeleteSelected={async (rows) => {
            const confirmed = await showConfirmation(
              "Delete selected invoices?",
              "Confirm Delete"
            );

            if (!confirmed) return;

            setInvoices((prev) =>
              prev.filter(
                (inv) =>
                  !rows.some((r) => r.invoice === inv.invoice)
              )
            );

            showToast("success", "Selected invoices deleted");
          }}
        />
      </Paper>
    </FormProvider>
  );
};

export default BillingTable;
