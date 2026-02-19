

import { useState, useMemo, useEffect } from "react";
import {
  Typography,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import {
  UniversalTable,
  Column,
} from "@/components/uncontrolled/UniversalTable";
import DropdownField from "@/components/controlled/DropdownField";

import { useForm, FormProvider } from "react-hook-form";

// TYPES

type CustomerItem = {
  name: string;
  qty: number | string;
  price: number | string;
};

type SavedCustomer = {
  id: number;
  name?: string;
  doctor?: string;
  date?: string;
  itemsList?: CustomerItem[];
};

type Customer = {
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

function CustomerTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const methods = useForm<FilterForm>({
    defaultValues: {
      timeFilter: "All Time",
    },
  });

  const timeFilter = methods.watch("timeFilter");

  //  LOAD DATA 

  useEffect(() => {
    const savedData = localStorage.getItem("medical_customers");

    if (!savedData) {
      setCustomers([]);
      return;
    }

    const parsed: SavedCustomer[] = JSON.parse(savedData);

    const formatted: Customer[] = parsed.map((item) => {
      const items = item.itemsList || [];

      const medicines = items.map((i) => i.name).join(", ");

      const quantity = items.reduce(
        (sum, i) => sum + (Number(i.qty) || 0),
        0
      );

      const totalPrice = items.reduce(
        (sum, i) =>
          sum + (Number(i.qty) || 0) * (Number(i.price) || 0),
        0
      );

      return {
        id: item.id,
        name: item.name || "",
        medicines,
        quantity,
        totalPrice,
        referenceFrom: item.doctor || "",
        date: item.date || "",
      };
    });

    setCustomers(formatted);
  }, []);

  // FILTER LOGIC 

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

  // TABLE COLUMNS
  const columns: Column<Customer>[] = [
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

  //  DROPDOWN OPTIONS 

  const filterOptions = [
    { label: "All Time", value: "All Time" },
    { label: "Last 7 Days", value: "Last 7 Days" },
    { label: "This Month", value: "This Month" },
  ];

  //  UI 

  return (
    <FormProvider {...methods}>   
      {/* FormProvider is required for DropdownField */}

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
            isStatic={true}  
            floatLabel
            
          />
        </Stack>

        <UniversalTable<Customer>
          data={filteredData}
          columns={columns}
          enableCheckbox
          showSearch
          showExport
          getRowId={(row) => row.id}
        />
      </Paper>
    </FormProvider>
  );
}

export default CustomerTable;

