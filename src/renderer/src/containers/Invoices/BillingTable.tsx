import { useEffect, useState } from "react";
import { Box, Paper, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { UniversalTable, Column, DropdownOption,
} from "@/components/uncontrolled/UniversalTable";

import { Invoice, InvoiceStatus } from "@/types/invoice";
import { FormProvider, useForm } from "react-hook-form";
import DropdownField from "@/components/controlled/DropdownField";
import { URL_PATH } from "@/constants/UrlPath";
import { showToast, showConfirmation } from "@/components/uncontrolled/ToastMessage.tsx"; 
type Props = {
  onCreate: () => void;
};

type FilterType = "all" | "daily" | "monthly" | "yearly";

const BillingTable = ({ onCreate }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      invoice: "INV-001",
      patient: "Rajesh Kumar",

      date: "8/15/2026",
      price: 2500,
      status: "Paid",
      medicines: [
        { name: "Pantosec D", batch: "14044008", expiry: "10/26", qty: "6xTAB", amount: 91.2 },
        { name: "Nucoxia PY", batch: "1405019", expiry: "09/26", qty: "6xTAB", amount: 102 },
      ],
    },
    {
      invoice: "INV-002",
      patient: "Priya Singh",
      date: "12/20/2026",
      price: 5400,
      status: "Pending",
      medicines: [
        { name: "Pantosec DO", batch: "14044008", expiry: "10/26", qty: "6xTAB", amount: 91.2 },
        { name: "Nucoxia P", batch: "1405019", expiry: "09/26", qty: "6xTAB", amount: 102 },
      ],
    },
  ]);

  //  Add new invoice
  useEffect(() => {
    if (location.state) {
      const newInvoice = location.state as Invoice;

      setInvoices((prev) => {
        const exists = prev.some((inv) => inv.invoice === newInvoice.invoice);
        if (exists) return prev;
        return [newInvoice, ...prev];
      });
    }
  }, [location.state]);

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
        <Box
          mb={2}
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Box width={220}>
            <DropdownField
              name="filterType"
              label="Filter"
              options={filterOptions}
              freeSolo={false}
              onChangeCallback={(value) =>
                setFilterType(value as FilterType)
              }
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

        <UniversalTable<Invoice>
          data={filteredInvoices}
          columns={columns}
          caption="Billing Invoices"
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
