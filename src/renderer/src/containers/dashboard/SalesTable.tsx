import React, { useMemo, useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Chip, Slide } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import DropdownField from "@/components/controlled/DropdownField";
import {UniversalTable,type Column,ACTION_KEY,} from "@/components/uncontrolled/UniversalTable";
import ViewSalesDialog from "./ViewSalesTable";
import { getMedicines, MedicineResponse } from "@/service/medicineService";
import {getAllRetailInvoices,RetailInvoiceResponse,getRetailInvoiceItemsByInvoiceId, deleteRetailInvoice} from "@/service/retailInvoiceService";
import { showConfirmation, showSnackbar } from "@/components/uncontrolled/ToastMessage";
//types
// API response for invoice items
type RetailInvoiceItemResponse = {
  medicineId: number;
  quantity: number;
  price?: number;
  gstPercent?: number;
  discount?: number;
};
// Table data structure
export interface SalesData extends Record<string, unknown> {
  id: number;
  customerId: number;
  name: string;
  medicine: string;
  quantity: number;
  totalPrice: number;
  date: string;
  time: string;
    items?: RetailInvoiceItemResponse[]; 
}
// filter options
const filterOptions = [
  { value: "Today", label: "Today" },
  { value: "6 Days", label: "6 Days" },
  { value: "This Month", label: "This Month" },
  { value: "All", label: "All" },
];
// date filter logic this function filters data based on selected date range
const getFilteredDataByDate = (
  data: SalesData[],
  filter: string,
): SalesData[] => {
  const today = new Date();
  switch (filter) {
    case "Today":
      return data.filter(
        (d) => new Date(d.date).toDateString() === today.toDateString(),
      );

    case "6 Days": {
      const sixDaysAgo = new Date();
      sixDaysAgo.setDate(today.getDate() - 6);
      return data.filter((d) => {
        const date = new Date(d.date);
        return date >= sixDaysAgo && date <= today;
      });
    }

    case "This Month":
      return data.filter((d) => {
        const date = new Date(d.date);
        return (
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );
      });

    default:
      return data;
  }
};

// main component
const SalesTable: React.FC = () => {
  const [searchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("This Month");
  const [salesList, setSalesList] = useState<SalesData[]>([]);
  // const [editingRow, setEditingRow] = useState<SalesData | null>(null);
  const [viewRow, setViewRow] = useState<SalesData | null>(null);
  const methods = useForm({ defaultValues: { filter: "This Month" } });
  const [medicineList, setMedicineList] = useState<MedicineResponse[]>([]);

 
  //fetch sales data from backend
  const fetchSales = async () => {
  try {
    const res = await getAllRetailInvoices();

    const paidInvoices = res.filter(
      (inv: RetailInvoiceResponse) => inv.paymentStatus === "Paid",
    );

    const formatted: SalesData[] = await Promise.all(
      paidInvoices.map(async (item: RetailInvoiceResponse) => {
        const items: RetailInvoiceItemResponse[] =
          await getRetailInvoiceItemsByInvoiceId(item.retailInvoiceId);

        const medicineNames = items
          .map((i) => {
            const med = medicineList.find(
              (m) => m.medicineId === i.medicineId,
            );
            return med ? med.medicineName : "-";
          })
          .join(", ");

        const totalQty = items.reduce(
          (sum, i) => sum + (i.quantity || 0),
          0,
        );

        return {
          id: item.retailInvoiceId,
          customerId: item.customerId,
          name: item.customerName || "-",
          medicine: medicineNames || "-",
          quantity: totalQty,
          totalPrice: item.totalAmount,
          date: item.invoiceDate ? item.invoiceDate.split("T")[0] : "-",
          time: item.invoiceDate
            ? new Date(item.invoiceDate).toLocaleTimeString()
            : "-",
        };
      }),
    );

    setSalesList(formatted);
  } catch (error) {
    console.error("Error fetching sales", error);
  }
};
useEffect(() => {
  if (medicineList.length > 0) {
    fetchSales();
  }
}, [medicineList]);

  //fectch medicine data
  useEffect(() => {
    const fetchMedicines = async () => {
      const data = await getMedicines();
      setMedicineList(data);
    };

    fetchMedicines();
  }, []);
  
  //filtered sales data
  const filteredSalesData = useMemo(() => {
    const dateFiltered = getFilteredDataByDate(salesList, selectedMonth);

    if (!searchQuery.trim()) return dateFiltered;

    return dateFiltered.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.medicine.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [salesList, selectedMonth, searchQuery]);

  //table columns
  const columns: Column<SalesData>[] = [
    { key: "name", label: "Name" },
    { key: "medicine", label: "Medicine" },
    { key: "quantity", label: "Qty" },
    {
      key: "totalPrice",
      label: "Price",
      render: (row) => `₹ ${(row.totalPrice as number).toFixed(2)}`,
    },
    { key: "date", label: "Date" },
    { key: "time", label: "Time" },
    { key: ACTION_KEY, label: "Actions" },
  ];

  //handle delete selected
const handleDeleteSelected = async (rows: SalesData[]) => {
  const ok = await showConfirmation(
    `Delete ${rows.length} records?`,
    "Confirm Delete"
  );

  if (!ok) return;

  try {
    await Promise.all(rows.map((r) => deleteRetailInvoice(r.id))); //  multiple delete

    const ids = rows.map((r) => r.id);

    setSalesList((prev) =>
      prev.filter((item) => !ids.includes(item.id))
    );

    showSnackbar("success", "Selected records deleted");
  } catch (error) {
    console.error(error);
    showSnackbar("error", "Delete failed");
  }
};

  return (
    <>
      <Slide direction="up" in timeout={600}>
        <Card
          sx={{ borderRadius: 3, boxShadow: "0 6px 24px rgba(0,0,0,0.08)" }}
        >
          <CardContent>
            <FormProvider {...methods}>
              <Box
                display="flex"
                flexDirection={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", md: "center" }}
                gap={2}
                mb={3}
              >
                <Typography variant="h6" fontWeight={600}>
                  Recent Sales List
                </Typography>

                <Box sx={{ width: { xs: "100%", sm: 180 } }}>
                  <DropdownField
                    name="filter"
                    options={filterOptions}
                    onChangeCallback={(value) => setSelectedMonth(value)}
                  />
                </Box>
              </Box>
            </FormProvider>

            <Chip label={`Filter: ${selectedMonth}`} sx={{ mb: 2 }} />

            <UniversalTable
              showSearch={true}
              data={filteredSalesData}
              columns={columns}
              rowsPerPage={5}
              enableCheckbox
              getRowId={(row) => row.id}
              onDeleteSelected={handleDeleteSelected}
              actions={{
                view: setViewRow,
              }}
            />
          </CardContent>
        </Card>
      </Slide>



      <ViewSalesDialog viewRow={viewRow} onClose={() => setViewRow(null)} />
    </>
  );
};

export default SalesTable;
