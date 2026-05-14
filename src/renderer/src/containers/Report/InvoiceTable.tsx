import { useState, useMemo, useEffect } from "react";
import { Paper, Typography, Chip, Stack, Divider } from "@mui/material";
import {
  UniversalTable,
  Column,
} from "@/components/uncontrolled/UniversalTable";
import { useForm, FormProvider } from "react-hook-form";
import DropdownField from "@/components/controlled/DropdownField";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/ApiEndpoints";

export type InvoiceData = {
  srNo: number;
  invoice: string;
  name: string;
  date: string;
  price: number;
  gst?: number;
  total?: number;
  status: "Paid" | "Pending" | "Overdue";
};

type FilterForm = {
  statusFilter: string;
  timeFilter: string;
};

type InvoiceApi = {
  retailInvoiceId: number;
  customerName: string;
  invoiceDate: string;
  totalAmount: number;
  paymentStatus: "Paid" | "Pending" | "Overdue";
};

const InvoiceTable = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);

  const methods = useForm<FilterForm>({
    defaultValues: {
      statusFilter: "All",
      timeFilter: "All Time",
    },
  });

  const { watch } = methods;

  const statusFilter = watch("statusFilter");
  const timeFilter = watch("timeFilter");

  const fetchInvoices = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");

      const headers = {
        Authorization: token ? `Bearer ${token}` : "",
      };

      const response = await axios.get<InvoiceApi[]>(
        API_ENDPOINTS.RETAIL_INVOICE,
        {
          headers,
        }
      );

      const apiData: InvoiceApi[] = response.data || [];

      const formattedData: InvoiceData[] = apiData.map(
        (invoice, index): InvoiceData => ({
          srNo: index + 1,
          invoice: String(invoice.retailInvoiceId),
          name: invoice.customerName,
          date: new Date(invoice.invoiceDate).toLocaleDateString("en-GB"),
          price: invoice.totalAmount,
          gst: 0,
          total: invoice.totalAmount,
          status: invoice.paymentStatus,
        })
      );

      setInvoices(formattedData);
    } catch (error) {
      console.error("Error fetching invoices:", error);

      setInvoices([]);
    }
  };

  useEffect(() => {
    fetchInvoices();

    window.addEventListener("invoiceUpdated", fetchInvoices);

    return () => {
      window.removeEventListener("invoiceUpdated", fetchInvoices);
    };
  }, []);

  const filteredData = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesStatus =
        statusFilter === "All" || invoice.status === statusFilter;

      if (!invoice.date) return false;

      const parts = invoice.date.split("/");

      if (parts.length !== 3) return false;

      const invoiceDate = new Date(
        Number(parts[2]),
        Number(parts[1]) - 1,
        Number(parts[0])
      );

      const today = new Date();

      let matchesTime = true;

      if (timeFilter === "This Month") {
        matchesTime =
          invoiceDate.getMonth() === today.getMonth() &&
          invoiceDate.getFullYear() === today.getFullYear();
      }

    
      if (timeFilter === "Last 7 Days") {
        const sevenDaysAgo = new Date();

        sevenDaysAgo.setDate(today.getDate() - 7);

        matchesTime =
          invoiceDate >= sevenDaysAgo && invoiceDate <= today;
      }

      return matchesStatus && matchesTime;
    });
  }, [invoices, statusFilter, timeFilter]);


  const handleDeleteSelected = (
    rowsToDelete: InvoiceData[]
  ): void => {
    const updatedInvoices = invoices.filter(
      (invoice) =>
        !rowsToDelete.some(
          (row) => row.invoice === invoice.invoice
        )
    );

    setInvoices(updatedInvoices);

    window.dispatchEvent(new Event("invoiceUpdated"));
  };

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Paid", value: "Paid" },
    { label: "Pending", value: "Pending" },
    { label: "Overdue", value: "Overdue" },
  ];

  const timeOptions = [
    { label: "All Time", value: "All Time" },
    { label: "This Month", value: "This Month" },
    { label: "Last 7 Days", value: "Last 7 Days" },
  ];

  const columns: Column<InvoiceData>[] = [
    {
      key: "srNo",
      label: "Sr No",
    },
    {
      key: "invoice",
      label: "Invoice",
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "date",
      label: "Date",
    },
    {
      key: "price",
      label: "Price",
      render: (row) => `₹ ${row.price.toLocaleString()}`,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const statusStyles: Record<
          InvoiceData["status"],
          {
            bg: string;
            color: string;
          }
        > = {
          Paid: {
            bg: "#E8F5E9",
            color: "#2E7D32",
          },
          Pending: {
            bg: "#FFF9C4",
            color: "#F9A825",
          },
          Overdue: {
            bg: "#FFEBEE",
            color: "#D32F2F",
          },
        };

        const currentStyle = statusStyles[row.status];

        return (
          <Chip
            label={row.status}
            size="small"
            sx={{
              backgroundColor: currentStyle.bg,
              color: currentStyle.color,
              fontWeight: 600,
              borderRadius: "4px",
            }}
          />
        );
      },
    },
  ];

  return (
    <FormProvider {...methods}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 1 }}
        >
          Invoice Report Table
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <DropdownField
            name="statusFilter"
            label="Status"
            options={statusOptions}
          />

          <DropdownField
            name="timeFilter"
            label="Time Filter"
            options={timeOptions}
          />
        </Stack>

        <div
          style={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <UniversalTable<InvoiceData>
            data={filteredData}
            columns={columns}
            showSearch
            showExport
            getRowId={(row) => row.invoice}
            onDeleteSelected={handleDeleteSelected}
          />
        </div>
      </Paper>
    </FormProvider>
  );
};

export default InvoiceTable;