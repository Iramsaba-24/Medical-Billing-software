import { useMemo } from "react";
import { Box } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";

import SearchField from "@/components/controlled/SearchField";
import DateTimeField from "@/components/controlled/DateTimeField";
import {
  UniversalTable,
  Column,
} from "@/components/uncontrolled/UniversalTable";

import { Customer, FilterForm } from "./CustomerTypes";
import {
  showConfirmation,
  showToast,
} from "@/components/uncontrolled/ToastMessage";

type Props = {
  rows: Customer[];
  setRows: React.Dispatch<React.SetStateAction<Customer[]>>;
  onEdit: (row: Customer) => void;
};

export default function CustomerTable({ rows, setRows, onEdit }: Props) {
  const methods = useForm<FilterForm>({
    defaultValues: { search: "", filterDate: "" },
  });

  const search = methods.watch("search");
  const filterDate = methods.watch("filterDate");

  const handleDelete = async (deleteRows: Customer[]) => {
    const confirmed = showConfirmation(
      "Are you sure you want to delete this record?"
    );

    if (await confirmed) {
      setRows((prev) =>
        prev.filter((r) => !deleteRows.some((d) => d.id === r.id))
      );
      showToast("success", "Records deleted successfully!");
    }
  };
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const searchMatch =
        !search ||
        Object.values(r).join(" ").toLowerCase().includes(search.toLowerCase());

      const dateMatch =
        !filterDate || dayjs(r.date).format("YYYY-MM") === filterDate;

      return searchMatch && dateMatch;
    });
  }, [rows, search, filterDate]);

  const columns: Column<Customer>[] = [
    { key: "name", label: "Name" },
    { key: "mobile", label: "Mobile" },
    { key: "age", label: "Age" },
    { key: "email", label: "Email" },
    { key: "referenceFrom", label: "Reference From" },
    {
      key: "items",
      label: "Medicines",
      render: (r) =>
        r.items.map((i) => `${i.medicine} (x${i.quantity})`).join(", "),
    },
    {
      key: "total",
      label: "Total",
      render: (r) => `₹${r.total.toFixed(2)}`,
    },
    {
      key: "date",
      label: "Date",
      render: (r) => dayjs(r.date).format("DD-MM-YYYY"),
    },
    { key: "actionbutton", label: "Actions" },
  ];

  return (
    <>
      {/* Filter Records through the Search and Month Filter */}
      <FormProvider {...methods}>
        <Box
          display="flex"
          gap={2}
          mb={2}
          alignItems="center"
          sx={{
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "center", sm: "space-between" },
          }}
        >
          <SearchField
            name="search"
            label="Search"
            placeholder="Search customers..."
            sx={{ width: 260 }}
          />
          <DateTimeField
            name="filterDate"
            label="Month Filter"
            viewMode="month-year"
            sx={{ width: 260 }}
          />
        </Box>
      </FormProvider>

      {/* table */}
      <UniversalTable
        data={filteredRows}
        enableCheckbox
        caption="Customer Details"
        columns={columns}
        getRowId={(r) => r.id}
        onDeleteSelected={handleDelete}
        actions={{
          edit: onEdit,
          delete: async (row) => {
            handleDelete([row]);
          },
        }}
      />
    </>
  );
}
