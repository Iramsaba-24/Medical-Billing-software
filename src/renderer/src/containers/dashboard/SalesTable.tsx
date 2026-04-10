import React, { useMemo, useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Chip, Slide } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import DropdownField from "@/components/controlled/DropdownField";
import {UniversalTable,type Column,ACTION_KEY,} from "@/components/uncontrolled/UniversalTable";
import EditSalesForm from "./EditSalesForm";
import ViewSalesDialog from "./ViewSalesTable";
import { getMedicines, MedicineResponse } from "@/service/medicineService";
import {getAllRetailInvoices,RetailInvoiceResponse,getRetailInvoiceItemsByInvoiceId, deleteRetailInvoice, updateRetailInvoice, getRetailInvoiceById,} from "@/service/retailInvoiceService";
import { showConfirmation, showSnackbar } from "@/components/uncontrolled/ToastMessage";
import { createRetailInvoiceItems } from "@/service/retailInvoiceService";
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
  const [editingRow, setEditingRow] = useState<SalesData | null>(null);
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
            return med ? med.itemName : "-";
          })
          .join(", ");

        const totalQty = items.reduce(
          (sum, i) => sum + (i.quantity || 0),
          0,
        );

        return {
          id: item.retailInvoiceId,
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
  //handle edit
const handleEdit = async (row: SalesData) => {
  try {
    const items = await getRetailInvoiceItemsByInvoiceId(row.id);

    setEditingRow({
      ...row,
      items,
    });
  } catch (error) {
    console.error(error);
  }
};

const handleCloseEditDialog = () => setEditingRow(null);
  //handle save edit
const handleSaveEdit = async (data: SalesData) => {
  try {
    const existing = await getRetailInvoiceById(data.id);

    const payload = {
      ...existing,
      customerName: data.name,
      totalAmount: data.totalPrice,
      invoiceDate: `${data.date}T${data.time}`,
    };

    //Update invoice
    await updateRetailInvoice(data.id, payload);

    //Recreate items
    if (data.items?.length) {
      await createRetailInvoiceItems(
        data.items.map((item) => ({
          retailInvoiceId: data.id,
          medicineId: item.medicineId,
          quantity: item.quantity,
          price: item.price || 0,
          gstPercent: item.gstPercent || 0,
          discount: item.discount || 0,
        }))
      );
    }

    await fetchSales();

    showSnackbar("success", "Sales updated successfully");
    handleCloseEditDialog();

  } catch (error) {
    console.error(error);
    showSnackbar("error", "Update failed");
  }
};
  //handle delete
const handleDelete = async (row: SalesData) => {
  const ok = await showConfirmation(
    `Delete ${row.name}?`,
    "Confirm Delete"
  );

  if (!ok) return;

  try {
    await deleteRetailInvoice(row.id);   

    setSalesList((prev) => prev.filter((item) => item.id !== row.id));

    showSnackbar("success", "Deleted successfully");
  } catch (error) {
    console.error(error);
    showSnackbar("error", "Delete failed");
  }
};
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
                edit: handleEdit,
                delete: handleDelete,
              }}
            />
          </CardContent>
        </Card>
      </Slide>

      <EditSalesForm
        editingRow={editingRow}
        onClose={handleCloseEditDialog}
        onSave={handleSaveEdit}
      />

      <ViewSalesDialog viewRow={viewRow} onClose={() => setViewRow(null)} />
    </>
  );
};

export default SalesTable;



// import React, { useMemo, useState, useEffect } from "react";
// import { Box, Card, CardContent, Typography, Chip, Slide } from "@mui/material";
// import { useForm, FormProvider } from "react-hook-form";
// import DropdownField from "@/components/controlled/DropdownField";
// import {UniversalTable,type Column,ACTION_KEY,} from "@/components/uncontrolled/UniversalTable";
// import EditSalesForm from "./EditSalesForm";
// import ViewSalesDialog from "./ViewSalesTable";
// import { getMedicines, MedicineResponse } from "@/service/medicineService";
// import {getAllRetailInvoices,RetailInvoiceResponse,getRetailInvoiceItemsByInvoiceId, deleteRetailInvoice, updateRetailInvoice, getRetailInvoiceById, deleteRetailInvoiceItemsByInvoiceId,} from "@/service/retailInvoiceService";
// import { showConfirmation, showSnackbar } from "@/components/uncontrolled/ToastMessage";
// import { createRetailInvoiceItems } from "@/service/retailInvoiceService";
// import dayjs from "dayjs";
// //types
// // API response for invoice items
// type RetailInvoiceItemResponse = {
//   medicineId: number;
//   quantity: number;
//   price?: number;
//   gstPercent?: number;
//   discount?: number;
// };
// // Table data structure
// export interface SalesData extends Record<string, unknown> {
//   id: number;
//   customerId: number;
//   name: string;
//   medicine: string;
//   quantity: number;
//   totalPrice: number;
//   date: string;
//   time: string;
//     items?: RetailInvoiceItemResponse[]; 
// }
// // filter options
// const filterOptions = [
//   { value: "Today", label: "Today" },
//   { value: "6 Days", label: "6 Days" },
//   { value: "This Month", label: "This Month" },
//   { value: "All", label: "All" },
// ];
// // date filter logic this function filters data based on selected date range
// const getFilteredDataByDate = (
//   data: SalesData[],
//   filter: string,
// ): SalesData[] => {
//   const today = new Date();
//   switch (filter) {
//     case "Today":
//       return data.filter(
//         (d) => new Date(d.date).toDateString() === today.toDateString(),
//       );

//     case "6 Days": {
//       const sixDaysAgo = new Date();
//       sixDaysAgo.setDate(today.getDate() - 6);
//       return data.filter((d) => {
//         const date = new Date(d.date);
//         return date >= sixDaysAgo && date <= today;
//       });
//     }

//     case "This Month":
//       return data.filter((d) => {
//         const date = new Date(d.date);
//         return (
//           date.getMonth() === today.getMonth() &&
//           date.getFullYear() === today.getFullYear()
//         );
//       });

//     default:
//       return data;
//   }
// };

// // main component
// const SalesTable: React.FC = () => {
//   const [searchQuery] = useState("");
//   const [selectedMonth, setSelectedMonth] = useState("This Month");
//   const [salesList, setSalesList] = useState<SalesData[]>([]);
//   const [editingRow, setEditingRow] = useState<SalesData | null>(null);
//   const [viewRow, setViewRow] = useState<SalesData | null>(null);
//   const methods = useForm({ defaultValues: { filter: "This Month" } });
//   const [medicineList, setMedicineList] = useState<MedicineResponse[]>([]);

 
//   //fetch sales data from backend
//   const fetchSales = async () => {
//   try {
//     const res = await getAllRetailInvoices();

//     const paidInvoices = res.filter(
//       (inv: RetailInvoiceResponse) => inv.paymentStatus === "Paid",
//     );

//     const formatted: SalesData[] = await Promise.all(
//       paidInvoices.map(async (item: RetailInvoiceResponse) => {
//         const items: RetailInvoiceItemResponse[] =
//           await getRetailInvoiceItemsByInvoiceId(item.retailInvoiceId);

//         const medicineNames = items
//           .map((i) => {
//             const med = medicineList.find(
//               (m) => m.medicineId === i.medicineId,
//             );
//             return med ? med.itemName : "-";
//           })
//           .join(", ");

//         const totalQty = items.reduce(
//           (sum, i) => sum + (i.quantity || 0),
//           0,
//         );

//         return {
//           id: item.retailInvoiceId,
//           name: item.customerName || "-",
//           medicine: medicineNames || "-",
//           quantity: totalQty,
//           totalPrice: item.totalAmount,
//           date: item.invoiceDate ? item.invoiceDate.split("T")[0] : "-",
//           // time: item.invoiceDate
//           //   ? new Date(item.invoiceDate).toLocaleTimeString()
//           //   : "-",
//           time: item.invoiceDate
//   ? dayjs(item.invoiceDate).format("HH:mm")
//   : "",

//               items: items, //added
//         };
//       }),
//     );

//     setSalesList(formatted);
//   } catch (error) {
//     console.error("Error fetching sales", error);
//   }
// };
// useEffect(() => {
//   if (medicineList.length > 0) {
//     fetchSales();
//   }
// }, [medicineList]);

//   //fectch medicine data
//   useEffect(() => {
//     const fetchMedicines = async () => {
//       const data = await getMedicines();
//       setMedicineList(data);
//     };

//     fetchMedicines();
//   }, []);
//   //filtered sales data
//   const filteredSalesData = useMemo(() => {
//     const dateFiltered = getFilteredDataByDate(salesList, selectedMonth);

//     if (!searchQuery.trim()) return dateFiltered;

//     return dateFiltered.filter(
//       (item) =>
//         item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.medicine.toLowerCase().includes(searchQuery.toLowerCase()),
//     );
//   }, [salesList, selectedMonth, searchQuery]);

//   //table columns
//   const columns: Column<SalesData>[] = [
//     { key: "name", label: "Name" },
//     { key: "medicine", label: "Medicine" },
//     { key: "quantity", label: "Qty" },
//     {
//       key: "totalPrice",
//       label: "Price",
//       render: (row) => `₹ ${(row.totalPrice as number).toFixed(2)}`,
//     },
//     { key: "date", label: "Date" },
//     { key: "time", label: "Time" },
//     { key: ACTION_KEY, label: "Actions" },
//   ];
//   //handle edit
// const handleEdit = async (row: SalesData) => {
//   try {
//     const items = await getRetailInvoiceItemsByInvoiceId(row.id);

//     setEditingRow({
//       ...row,
//       items,
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };

// const handleCloseEditDialog = () => setEditingRow(null);
//   //handle save edit
// // const handleSaveEdit = async (data: SalesData) => {
// //   try {
// //     const existing = await getRetailInvoiceById(data.id);

// //     const payload = {
// //       ...existing,
// //       customerName: data.name,
// //       totalAmount: data.totalPrice,
// //       invoiceDate: `${data.date}T${data.time}`,
// //     };

// //     //Update invoice
// //     await updateRetailInvoice(data.id, payload);

// //     //Recreate items
// //     if (data.items?.length) {
// //       await createRetailInvoiceItems(
// //         data.items.map((item) => ({
// //           retailInvoiceId: data.id,
// //           medicineId: item.medicineId,
// //           quantity: item.quantity,
// //           price: item.price || 0,
// //           gstPercent: item.gstPercent || 0,
// //           discount: item.discount || 0,
// //         }))
// //       );
// //     }

// //     await fetchSales();

// //     showSnackbar("success", "Sales updated successfully");
// //     handleCloseEditDialog();

// //   } catch (error) {
// //     console.error(error);
// //     showSnackbar("error", "Update failed");
// //   }
// // };

// const handleSaveEdit = async (data: SalesData) => {
//   try {
//     const existing = await getRetailInvoiceById(data.id);

//     // const payload = {
//     //   ...existing,
//     //   customerName: data.name,
//     //   totalAmount: data.totalPrice,
//     //   invoiceDate: `${data.date}T${data.time}`,
//     // };


//    //const safeTime = data.time || "00:00";

// const safeTime = data.time?.slice(0,5) || "00:00";

// const payload = {
//   ...existing,
//   customerName: data.name,
//   totalAmount: data.totalPrice,
//   invoiceDate: `${data.date}T${safeTime}:00`,
// };

//     //  1. Update invoice
//     await updateRetailInvoice(data.id, payload);

//     //  2. DELETE old items first (VERY IMPORTANT)
//     await deleteRetailInvoiceItemsByInvoiceId(data.id);

//     //  3. CREATE new items
//     if (data.items?.length) {
//       await createRetailInvoiceItems(
//         data.items.map((item, index) => ({
//           retailInvoiceId: data.id,
//           medicineId: item.medicineId,
//           quantity: item.quantity,
//           price: item.price || 0,
//           gstPercent: item.gstPercent || 0,
//           discount: item.discount || 0,
//           SrNo: index + 1,
//         }))
//       );
//     }

//     //  4. Refresh table
//     await fetchSales();

//     showSnackbar("success", "Sales updated successfully");
//     handleCloseEditDialog();

//   } catch (error) {
//     console.error(error);
//     showSnackbar("error", "Update failed");
//   }
// };


//   //handle delete
// const handleDelete = async (row: SalesData) => {
//   const ok = await showConfirmation(
//     `Delete ${row.name}?`,
//     "Confirm Delete"
//   );

//   if (!ok) return;

//   try {
//     await deleteRetailInvoice(row.id);   

//     setSalesList((prev) => prev.filter((item) => item.id !== row.id));

//     showSnackbar("success", "Deleted successfully");
//   } catch (error) {
//     console.error(error);
//     showSnackbar("error", "Delete failed");
//   }
// };
//   //handle delete selected
// const handleDeleteSelected = async (rows: SalesData[]) => {
//   const ok = await showConfirmation(
//     `Delete ${rows.length} records?`,
//     "Confirm Delete"
//   );

//   if (!ok) return;

//   try {
//     await Promise.all(rows.map((r) => deleteRetailInvoice(r.id))); //  multiple delete

//     const ids = rows.map((r) => r.id);

//     setSalesList((prev) =>
//       prev.filter((item) => !ids.includes(item.id))
//     );

//     showSnackbar("success", "Selected records deleted");
//   } catch (error) {
//     console.error(error);
//     showSnackbar("error", "Delete failed");
//   }
// };

//   return (
//     <>
//       <Slide direction="up" in timeout={600}>
//         <Card
//           sx={{ borderRadius: 3, boxShadow: "0 6px 24px rgba(0,0,0,0.08)" }}
//         >
//           <CardContent>
//             <FormProvider {...methods}>
//               <Box
//                 display="flex"
//                 flexDirection={{ xs: "column", md: "row" }}
//                 justifyContent="space-between"
//                 alignItems={{ xs: "stretch", md: "center" }}
//                 gap={2}
//                 mb={3}
//               >
//                 <Typography variant="h6" fontWeight={600}>
//                   Recent Sales List
//                 </Typography>

//                 <Box sx={{ width: { xs: "100%", sm: 180 } }}>
//                   <DropdownField
//                     name="filter"
//                     options={filterOptions}
//                     onChangeCallback={(value) => setSelectedMonth(value)}
//                   />
//                 </Box>
//               </Box>
//             </FormProvider>

//             <Chip label={`Filter: ${selectedMonth}`} sx={{ mb: 2 }} />

//             <UniversalTable
//               showSearch={true}
//               data={filteredSalesData}
//               columns={columns}
//               rowsPerPage={5}
//               enableCheckbox
//               getRowId={(row) => row.id}
//               onDeleteSelected={handleDeleteSelected}
//               actions={{
//                 view: setViewRow,
//                 edit: handleEdit,
//                 delete: handleDelete,
//               }}
//             />
//           </CardContent>
//         </Card>
//       </Slide>

//       <EditSalesForm
//         editingRow={editingRow}
//         onClose={handleCloseEditDialog}
//         onSave={handleSaveEdit}
//       />

//       <ViewSalesDialog viewRow={viewRow} onClose={() => setViewRow(null)} />
//     </>
//   );
// };

// export default SalesTable;
