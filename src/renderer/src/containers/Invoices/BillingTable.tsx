import { useEffect, useState } from "react";
import { Box, Paper, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import {
  UniversalTable,
  Column,
  DropdownOption,
} from "@/components/uncontrolled/UniversalTable";

import { Invoice, InvoiceStatus } from "@/types/invoice";
import { FormProvider, useForm } from "react-hook-form";
import DropdownField from "@/components/controlled/DropdownField";
import { URL_PATH } from "@/constants/UrlPath";

type Props = {
  onCreate: () => void;
  onView: (invoice: Invoice) => void;
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

  useEffect(() => {
    if (location.state) {
      const newInvoice = location.state as Invoice;

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

    if (filterType === "daily") return invoiceDate.toDateString() === today.toDateString();
    if (filterType === "monthly") return invoiceDate.getMonth() === today.getMonth() && invoiceDate.getFullYear() === today.getFullYear();
    if (filterType === "yearly") return invoiceDate.getFullYear() === today.getFullYear();

    return true;
  });

  const columns: Column<Invoice>[] = [
    { key: "invoice", label: "Invoice" },
    { key: "patient", label: "Patient" },
    { key: "date", label: "Date" },
    { key: "price", label: "Price", render: (row) => `₹ ${row.price.toLocaleString()}` },
    { key: "status", label: "Status" },
    { key: "actionbutton", label: "Action" },
  ];

  const statusOptions: DropdownOption[] = [
    { value: "Paid", label: "Paid" },
    { value: "Pending", label: "Pending" },
    { value: "Overdue", label: "Overdue" },
  ];

  const methods = useForm({ defaultValues: { filterType: "all" } });

  return (
    <FormProvider {...methods}>
      <Paper sx={{ p: 2 }}>
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Box width={220}>
            <DropdownField
              name="filterType"
              label="Filter"
              options={filterOptions}
              freeSolo={false}
              onChangeCallback={(value) => setFilterType(value as FilterType)}
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
              "&:hover": { backgroundColor: "#fff", color: "#238878", border: "2px solid #238878" },
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
                  inv.invoice === row.invoice ? { ...inv, status: value as InvoiceStatus } : inv
                )
              );
            },
          }}
          actions={{
            view: (invoice) => navigate(`${URL_PATH.InvoiceView}/${invoice.invoice}`, { state: invoice }),
            print: (invoice) => navigate(`${URL_PATH.InvoiceView}/${invoice.invoice}`, { state: invoice }),
            download: (invoice) => navigate(`${URL_PATH.InvoiceView}/${invoice.invoice}`, { state: invoice }),
          }}
          onDeleteSelected={(rows) =>
            setInvoices((prev) => prev.filter((inv) => !rows.some((r) => r.invoice === inv.invoice)))
          }
        />
      </Paper>
    </FormProvider>
  );
};

export default BillingTable;
