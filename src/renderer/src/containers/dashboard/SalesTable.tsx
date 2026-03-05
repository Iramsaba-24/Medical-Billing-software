// import React, { useMemo, useState, useEffect } from 'react';
// import {Box,Card,CardContent,Typography,TextField,InputAdornment,Chip,Slide} from '@mui/material';
// import { Search as SearchIcon } from '@mui/icons-material';
// import { useForm, FormProvider } from 'react-hook-form';
// import DropdownField from '@/components/controlled/DropdownField';
// import { UniversalTable, type Column, ACTION_KEY } from '@/components/uncontrolled/UniversalTable';
// import EditSalesForm from './EditSalesForm';
// import ViewSalesDialog from './ViewSalesTable';

// export interface SalesData {
//   id: number;
//   name: string;
//   medicine: string;
//   quantity: number;
//   totalPrice: number;
//   date: string;
//   time: string;
//   [key: string]: string | number;
// }

// const filterOptions = [
//   { value: 'Today', label: 'Today' },
//   { value: '6 Days', label: '6 Days' },
//   { value: 'This Month', label: 'This Month' },
//   { value: 'All', label: 'All' },
// ];

// const getFilteredDataByDate = (data: SalesData[], filter: string) => {
//   const today = new Date();

//   switch (filter) {
//     case 'Today':
//       return data.filter(d =>
//         new Date(d.date).toDateString() === today.toDateString()
//       );

//     case '6 Days':
//       return data.filter(d => {
//         const date = new Date(d.date);
//         const sixDaysAgo = new Date();
//         sixDaysAgo.setDate(today.getDate() - 6);
//         return date >= sixDaysAgo && date <= today;
//       });

//     case 'This Month':
//       return data.filter(d => {
//         const date = new Date(d.date);
//         return (
//           date.getMonth() === today.getMonth() &&
//           date.getFullYear() === today.getFullYear()
//         );
//       });

//     case 'All':
//     default:
//       return data;
//   }
// };

// const SalesTable: React.FC = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedMonth, setSelectedMonth] = useState('This Month');

//   //  Only one state needed for dialog
//   const [editingRow, setEditingRow] = useState<SalesData | null>(null);

//   const methods = useForm({
//     defaultValues: {
//       filter: 'This Month',
//     },
//   });
  
//   const [salesList, setSalesList] = useState<SalesData[]>([]);

//   useEffect(() => {
//     const storedSales = localStorage.getItem("salesData");
//     // console.log("Stored Sales:", storedSales); 
//     if (storedSales) {
//       setSalesList(JSON.parse(storedSales));
//     }
//   }, []);
//   const filteredSalesData = useMemo(() => {
//   const dateFiltered = getFilteredDataByDate(salesList, selectedMonth);
//     if (!searchQuery.trim()) return dateFiltered;

//     return dateFiltered.filter(
//       item =>
//         item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.medicine.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [searchQuery, selectedMonth, salesList]);

//   const columns: Column<SalesData>[] = [
//     { key: 'name', label: 'Name' },
//     { key: 'medicine', label: 'Medicine' },
//     { key: 'quantity', label: 'Qty' },
//     {
//       key: 'totalPrice',
//       label: 'Price',
//       render: row => row.totalPrice.toFixed(2),
//     },
//     { key: 'date', label: 'Date' },
//     { key: 'time', label: 'Time' },
//     { key: ACTION_KEY, label: 'Actions' },
//   ];

//   const handleEdit = (row: SalesData) => {
//     setEditingRow(row); // opens dialog
//   };

//   const handleCloseEditDialog = () => {
//     setEditingRow(null); // closes dialog
//   };

// const handleSaveEdit = (data: SalesData) => {
//   setSalesList(prevData => {
//     const updatedData = prevData.map(item =>
//       item.id === data.id ? { ...item, ...data } : item
//     );

//     localStorage.setItem("salesData", JSON.stringify(updatedData));

//     return updatedData;
//   });

//   handleCloseEditDialog();
// };

// const handleDelete = (row: SalesData) => {
//   if (window.confirm(`Are you sure you want to delete ${row.name}'s record?`)) {
//     setSalesList(prevData => {
//       const updatedData = prevData.filter(item => item.id !== row.id);

//       localStorage.setItem("salesData", JSON.stringify(updatedData));

//       return updatedData;
//     });
//   }
// };

// const handleDeleteSelected = (rows: SalesData[]) => {
//   if (
//     window.confirm(
//       `Are you sure you want to delete ${rows.length} selected record(s)?`
//     )
//   ) {
//     const selectedIds = rows.map(row => row.id);

//     setSalesList(prevData => {
//       const updatedData = prevData.filter(
//         item => !selectedIds.includes(item.id)
//       );

//       localStorage.setItem("salesData", JSON.stringify(updatedData));

//       return updatedData;
//     });
//   }
// };
// // view row
// const [viewRow, setViewRow] = useState<SalesData | null>(null);

//   return (
//     <>
//       <Slide direction="up" in timeout={600}>
//         <Card sx={{ borderRadius: 3, boxShadow: '0 6px 24px rgba(0,0,0,0.08)' }}>
//           <CardContent>
//             <FormProvider {...methods}>
//               <Box
//                 display="flex"
//                 flexDirection={{ xs: 'column', md: 'row' }}
//                 justifyContent="space-between"
//                 alignItems={{ xs: 'stretch', md: 'center' }}
//                 gap={2}
//                 mb={3}
//               >
//                 <Typography
//                   variant="h6"
//                   fontWeight={600}
//                   textAlign={{ xs: 'left', md: 'left' }}
//                 >
//                   Recent Sales List
//                 </Typography>

//                 <Box
//                   display="flex"
//                   flexDirection={{ xs: 'column', sm: 'row' }}
//                   gap={2}
//                   width={{ xs: '100%', md: 'auto' }}
//                 >
//                   <TextField
//                     size="small"
//                     placeholder="Search"
//                     value={searchQuery}
//                     onChange={e => setSearchQuery(e.target.value)}
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <SearchIcon />
//                         </InputAdornment>
//                       ),
//                     }}
//                     sx={{
//                       width: { xs: '100%', sm: 250, md: 300 },
//                       '& .MuiOutlinedInput-root': {
//                         height: 50,
//                       },
//                     }}
//                   />

//                   <Box sx={{ width: { xs: '100%', sm: 180 } }}>
//                     <DropdownField
//                       name="filter"
//                       options={filterOptions}
//                       onChangeCallback={value => setSelectedMonth(value)}
//                       sx={{
//                         '& .MuiFormHelperText-root': {
//                           display: 'none',
//                         },
//                       }}
//                     />
//                   </Box>
//                 </Box>
//               </Box>
//             </FormProvider>

//             <Chip
//               label={`Filter: ${selectedMonth}`}
//               sx={{ mb: 2 }}
//               color="primary"
//             />

//             <UniversalTable
//               data={filteredSalesData}
//               columns={columns}
//               rowsPerPage={5}
//               enableCheckbox
//               getRowId={row => row.id}
//               onDeleteSelected={handleDeleteSelected}
//               actions={{
//                 view: setViewRow,
//                 edit: handleEdit,
//                 delete: handleDelete,
//               }}
//               paperSx={{
//                 boxShadow: 'none',
//                 borderRadius: 0,
//               }}
//               headerSx={{
//                 fontWeight: 600,
//               }}
//               rowHoverSx={{
//                 '&:hover': {
//                   bgcolor: 'rgba(0, 0, 0, 0.04)',
//                 },
//               }}
//               caption={undefined}
//             />
//           </CardContent>
//         </Card>
//       </Slide>

    
//       <EditSalesForm  
//         editingRow={editingRow}
//         onClose={handleCloseEditDialog}
//         onSave={handleSaveEdit}
//       />
//       <ViewSalesDialog
//         viewRow={viewRow}
//         onClose={() => setViewRow(null)}
//       />
//     </>
//   );
// };

// export default SalesTable;

import React, { useMemo, useState, useEffect } from 'react';
import {Box,Card,CardContent,Typography,TextField,InputAdornment,Chip,Slide} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useForm, FormProvider } from 'react-hook-form';
import DropdownField from '@/components/controlled/DropdownField';
import { UniversalTable, type Column, ACTION_KEY } from '@/components/uncontrolled/UniversalTable';
import EditSalesForm from './EditSalesForm';
import ViewSalesDialog from './ViewSalesTable';

// table data
export interface SalesData {
  id: number;
  name: string;
  medicine: string;
  quantity: number;
  totalPrice: number;
  date: string;
  time: string;
  [key: string]: string | number;
}
// local storage
type StoredSale = {
  invoice: string;
  patient: string;
  date: string;
  price: number;
  medicines: { name: string }[];
};

const filterOptions = [
  { value: 'Today', label: 'Today' },
  { value: '6 Days', label: '6 Days' },
  { value: 'This Month', label: 'This Month' },
  { value: 'All', label: 'All' },
];

const getFilteredDataByDate = (data: SalesData[], filter: string) => {
  const today = new Date();

  switch (filter) {
    case 'Today':
      return data.filter(d =>
        new Date(d.date).toDateString() === today.toDateString()
      );

    case '6 Days':
      return data.filter(d => {
        const date = new Date(d.date);
        const sixDaysAgo = new Date();
        sixDaysAgo.setDate(today.getDate() - 6);
        return date >= sixDaysAgo && date <= today;
      });

    case 'This Month':
      return data.filter(d => {
        const date = new Date(d.date);
        return (
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );
      });

    case 'All':
    default:
      return data;
  }
};

const SalesTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('This Month');

  //  Only one state needed for dialog
  const [editingRow, setEditingRow] = useState<SalesData | null>(null);

  const methods = useForm({
    defaultValues: {
      filter: 'This Month',
    },
  });
  // local storage function
  const saveToLocalStorage = (data: SalesData[]) => {
    const formatted = data.map(item => ({
      invoice: String(item.id),
      patient: item.name,
      date: item.date,
      price: Number(item.totalPrice) || 0,
      medicines:
        item.medicine && item.medicine !== "-"
          ? item.medicine.split(", ").map(name => ({ name }))
          : []
    }));

    localStorage.setItem("salesData", JSON.stringify(formatted));
  };
  
  const [salesList, setSalesList] = useState<SalesData[]>([]);

  useEffect(() => {
    const storedSales = localStorage.getItem("salesData");
    if (!storedSales) return;

    const parsed: StoredSale[] = JSON.parse(storedSales);

    const onlyPaymentData = parsed.filter(
      (item) => item.invoice
    );

    const formatted: SalesData[] = onlyPaymentData.map(
      (item, index) => ({
        id: Number(item.invoice) || index + 1,
        name: item.patient || "-",
        medicine:
          item.medicines && item.medicines.length > 0
            ? item.medicines.map((m) => m.name).join(", ")
            : "-",
        quantity: 1,
        totalPrice: Number(item.price) || 0,
        date: item.date || "-",
        time: new Date().toLocaleTimeString(),
      })
    );

    setSalesList(formatted);
  }, []);

  const filteredSalesData = useMemo(() => {
  const dateFiltered = getFilteredDataByDate(salesList, selectedMonth);
    if (!searchQuery.trim()) return dateFiltered;

    return dateFiltered.filter(
      item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.medicine.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, selectedMonth, salesList]);

  const columns: Column<SalesData>[] = [
    { key: 'name', label: 'Name' },
    { key: 'medicine', label: 'Medicine' },
    { key: 'quantity', label: 'Qty' },
    {
      key: 'totalPrice',
      label: 'Price',
      render: (row) => {
        const price = Number(row.totalPrice) || 0;
        return `₹ ${price.toFixed(2)}`;
      },
    },
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time' },
    { key: ACTION_KEY, label: 'Actions' },
  ];

  const handleEdit = (row: SalesData) => {
    setEditingRow(row); // opens dialog
  };

  const handleCloseEditDialog = () => {
    setEditingRow(null); // closes dialog
  };
  //edit
  const handleSaveEdit = (data: SalesData) => {
    setSalesList(prev => {
      const updated = prev.map(item =>
        item.id === data.id
          ? { ...item, ...data, totalPrice: Number(data.totalPrice) || 0 }
          : item
      );

      saveToLocalStorage(updated);
      return updated;
    });

    handleCloseEditDialog();
  };
  // delete single row
  const handleDelete = (row: SalesData) => {
    if (!window.confirm(`Delete ${row.name}?`)) return;

    setSalesList(prev => {
      const updated = prev.filter(item => item.id !== row.id);
      saveToLocalStorage(updated);
      return updated;
    });
  };

  // delete selected rows
  const handleDeleteSelected = (rows: SalesData[]) => {
    if (!window.confirm(`Delete ${rows.length} records?`)) return;

    const ids = rows.map(r => r.id);

    setSalesList(prev => {
      const updated = prev.filter(item => !ids.includes(item.id));
      saveToLocalStorage(updated);
      return updated;
    });
  };
  // view row
  const [viewRow, setViewRow] = useState<SalesData | null>(null);

  return (
    <>
      <Slide direction="up" in timeout={600}>
        <Card sx={{ borderRadius: 3, boxShadow: '0 6px 24px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <FormProvider {...methods}>
              <Box
                display="flex"
                flexDirection={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'stretch', md: 'center' }}
                gap={2}
                mb={3}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  textAlign={{ xs: 'left', md: 'left' }}
                >
                  Recent Sales List
                </Typography>

                <Box
                  display="flex"
                  flexDirection={{ xs: 'column', sm: 'row' }}
                  gap={2}
                  width={{ xs: '100%', md: 'auto' }}
                >
                  <TextField
                    size="small"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      width: { xs: '100%', sm: 250, md: 300 },
                      '& .MuiOutlinedInput-root': {
                        height: 50,
                      },
                    }}
                  />

                  <Box sx={{ width: { xs: '100%', sm: 180 } }}>
                    <DropdownField
                      name="filter"
                      options={filterOptions}
                      onChangeCallback={value => setSelectedMonth(value)}
                      sx={{
                        '& .MuiFormHelperText-root': {
                          display: 'none',
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </FormProvider>

            <Chip
              label={`Filter: ${selectedMonth}`}
              sx={{ mb: 2 }}
              color="primary"
            />

            <UniversalTable
              data={filteredSalesData}
              columns={columns}
              rowsPerPage={5}
              enableCheckbox
              getRowId={row => row.id}
              onDeleteSelected={handleDeleteSelected}
              actions={{
                view: setViewRow,
                edit: handleEdit,
                delete: handleDelete,
              }}
              paperSx={{
                boxShadow: 'none',
                borderRadius: 0,
              }}
              headerSx={{
                fontWeight: 600,
              }}
              rowHoverSx={{
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
              caption={undefined}
            />
          </CardContent>
        </Card>
      </Slide>

    
      <EditSalesForm  
        editingRow={editingRow}
        onClose={handleCloseEditDialog}
        onSave={handleSaveEdit}
      />
      <ViewSalesDialog
        viewRow={viewRow}
        onClose={() => setViewRow(null)}
      />
    </>
  );
};

export default SalesTable;