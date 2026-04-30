import { useState, useMemo, useEffect } from "react";
import { Typography, Stack, Paper, Divider } from "@mui/material";
import {
  UniversalTable,
  Column,
} from "@/components/uncontrolled/UniversalTable";
import DropdownField from "@/components/controlled/DropdownField";
import { useForm, FormProvider } from "react-hook-form";
import { getAllCustomers } from "@/service/customerService";
import { CustomerData } from "@/view/CustomerMaster";

import {
  getAllRetailInvoices,
  getRetailInvoiceItemsByInvoiceId,
} from "@/service/retailInvoiceService";

import { getMedicines, MedicineResponse } from "@/service/medicineService";

type Customer = {
  srNo: number; 
  id: number;
  name: string;
  medicines: string;
  quantity: number;
  totalPrice: number;
  referenceFrom: string;
  date: string;
};

type FilterForm = {
  timeFilter: string;
};

type Invoice = {
  retailInvoiceId: number;
  customerId: number;
  invoiceDate: string;
};

type InvoiceItem = {
  medicineId: number;
  quantity: number;
  price: number;
};

function CustomerTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const methods = useForm<FilterForm>({
    defaultValues: {
      timeFilter: "All Time",
    },
  });

  const timeFilter = methods.watch("timeFilter");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerRes: CustomerData[] = await getAllCustomers();
        const invoices: Invoice[] = await getAllRetailInvoices();
        const medicines: MedicineResponse[] = await getMedicines();

        const medicineMap = new Map<number, string>();
        medicines.forEach((m) => {
          medicineMap.set(m.medicineId, m.itemName);
        });

        const formatted: Customer[] = [];

        for (const cust of customerRes) {
          const custInvoices = invoices.filter(
            (inv) => inv.customerId === cust.customerId
          );

          let totalQty = 0;
          let totalPrice = 0;
          const medNames: string[] = [];

          for (const inv of custInvoices) {
            const items: InvoiceItem[] =
              await getRetailInvoiceItemsByInvoiceId(inv.retailInvoiceId);

            items.forEach((item) => {
              totalQty += item.quantity;
              totalPrice += item.price * item.quantity;

              const name = medicineMap.get(item.medicineId);
              if (name) medNames.push(name);
            });
          }

          formatted.push({
            srNo: cust.srNo, 
            id: Number(cust.customerId),
            name: cust.name || "",
            medicines: medNames.join(", "),
            quantity: totalQty,
            totalPrice: totalPrice,
            referenceFrom: cust.doctor || "",
            date: cust.date || "",
          });
        }

        setCustomers(formatted);
      } catch (error) {
        console.error("Failed to fetch customers", error);
        setCustomers([]);
      }
    };

    fetchData();

    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const filteredData = useMemo(() => {
    return customers.filter((customer) => {
      if (timeFilter === "All Time") return true;

      const itemDate = new Date(customer.date);
      const today = new Date();

      if (timeFilter === "This Month") {
        return (
          itemDate.getMonth() === today.getMonth() &&
          itemDate.getFullYear() === today.getFullYear()
        );
      }

      if (timeFilter === "Last 7 Days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        return itemDate >= sevenDaysAgo && itemDate <= today;
      }

      return true;
    });
  }, [customers, timeFilter]);

  const columns: Column<Customer>[] = [
    { key: "srNo", label: "Sr No" }, 
    { key: "name", label: "Name" },
    { key: "medicines", label: "Medicines" },
    { key: "quantity", label: "Quantity" },
    {
      key: "totalPrice",
      label: "Total Price",
      render: (row) => `₹${row.totalPrice.toFixed(2)}`,
    },
    { key: "referenceFrom", label: "Reference From" },
    { key: "date", label: "Date" },
  ];

  const filterOptions = [
    { label: "All Time", value: "All Time" },
    { label: "Last 7 Days", value: "Last 7 Days" },
    { label: "This Month", value: "This Month" },
  ];

  return (
    <FormProvider {...methods}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          Customers List
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
          <DropdownField
            name="timeFilter"
            label="Filter"
            options={filterOptions}
          />
        </Stack>

        <div style={{ width: "100%", maxWidth: "100%", overflowX: "auto" }}>
          <UniversalTable<Customer>
            data={filteredData}
            columns={columns}
            showSearch
            showExport
            getRowId={(row) => row.id}
          />
        </div>
      </Paper>
    </FormProvider>
  );
}

export default CustomerTable;