// import React, { useMemo, useState } from 'react';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   InputAdornment,
//   Chip,
//   Slide,
// } from '@mui/material';
// import { Search as SearchIcon } from '@mui/icons-material';
// import { useForm, FormProvider } from 'react-hook-form';
// import DropdownField from '@/components/controlled/DropdownField';
// import { UniversalTable, type Column, ACTION_KEY } from '@/components/uncontrolled/UniversalTable';
// import EditSalesForm from './EditSalesForm';

// interface SalesData { 
//   id: number;
//   name: string;
//   medicine: string;
//   quantity: number;
//   totalPrice: number;
//   date: string;
//   time: string;
//   [key: string]: string | number;
// }

// const initialSalesData: SalesData[] = [
//   { id: 1, name: 'Kishor Kedar', medicine: 'Medicine Two', quantity: 1, totalPrice: 152, date: 'Jan 05, 2026', time: '10:00AM' },
//   { id: 2, name: 'Rohit Raut', medicine: 'Paracetamol', quantity: 5, totalPrice: 57, date: 'Jan 05, 2026', time: '11:00AM' },
//   { id: 3, name: 'Smita Rao', medicine: 'Honitus', quantity: 1, totalPrice: 125, date: 'Jan 04, 2026', time: '04:00PM' },
//   { id: 4, name: 'Shilpa Rathod', medicine: 'Eladi', quantity: 1, totalPrice: 160, date: 'Jan 03, 2026', time: '12:00PM' },
//   { id: 5, name: 'Kanta Jain', medicine: 'Insulin', quantity: 10, totalPrice: 1799, date: 'Jan 01, 2026', time: '10:00AM' },
//   { id: 6, name: 'Amit Sharma', medicine: 'Aspirin', quantity: 3, totalPrice: 45, date: 'Dec 30, 2025', time: '02:00PM' },
// ];

// const filterOptions = [
//   { value: 'Today', label: 'Today' },
//   { value: '6 Days', label: '6 Days' },
//   { value: 'This Month', label: 'This Month' },
//   { value: 'All', label: 'All' },
// ];

// const parseDate = (dateStr: string): Date => {
//   const months: Record<string ,number> = {
//     Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
//     Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
//   };

//   const [month, day, year] = dateStr.replace(',', '').split(' ');
//   return new Date(Number(year), months[month], Number(day));
// };

// const getFilteredDataByDate = (data: SalesData[], filter: string) => {
//   const today = new Date(2026, 0, 6);

//   switch (filter) {
//     case 'Today':
//       return data.filter(d =>
//         parseDate(d.date).toDateString() === new Date(2026, 0, 5).toDateString()
//       );
//     case '6 Days':
//       return data.filter(d => {
//         const date = parseDate(d.date);
//         return date >= new Date(2026, 0, 1) && date <= today;
//       });
//     case 'This Month':
//       return data.filter(d => parseDate(d.date).getMonth() === 0);
//     case 'All':
//       return data;
//     default:
//       return data;
//   }
// };

// const SalesTable: React.FC = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedMonth, setSelectedMonth] = useState('This Month');
//   const [salesData, setSalesData] = useState<SalesData[]>(initialSalesData);
//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [editingRow, setEditingRow] = useState<SalesData | null>(null);

//   const methods = useForm({
//     defaultValues: {
//       filter: 'This Month',
//     },
//   });

//   const filteredSalesData = useMemo(() => {
//     const dateFiltered = getFilteredDataByDate(salesData, selectedMonth);

//     if (!searchQuery.trim()) return dateFiltered;

//     return dateFiltered.filter(
//       item =>
//         item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.medicine.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [searchQuery, selectedMonth, salesData]);

//   const columns: Column<SalesData>[] = [
//     {
//       key: 'name',
//       label: 'Name',
//     },
//     {
//       key: 'medicine',
//       label: 'Medicine',
//     },
//     {
//       key: 'quantity',
//       label: 'Qty',
//     },
//     {
//       key: 'totalPrice',
//       label: 'Price',
//       render: (row) => row.totalPrice.toFixed(2),
//     },
//     {
//       key: 'date',
//       label: 'Date',
//     },
//     {
//       key: 'time',
//       label: 'Time',
//     },
//     {
//       key: ACTION_KEY,
//       label: 'Actions',
//     },
//   ];

//   const handleEdit = (row: SalesData) => {
//     setEditingRow(row);
//     setOpenEditDialog(true);
//   };

//   const handleCloseEditDialog = () => {
//     setOpenEditDialog(false);
//     setEditingRow(null);
//   };

//   const handleSaveEdit = (data: SalesData) => {
//     setSalesData(prevData => {
//       const newData = prevData.map(item =>
//         item.id === data.id ? { ...item, ...data } : item
//       );
//       const updatedFiltered = getFilteredDataByDate(newData, selectedMonth);
//       if (!updatedFiltered.some(item => item.id === data.id)) {
//         setSelectedMonth('All');
//       }
//       return newData;
//     });
//     handleCloseEditDialog();
//   };

//   const handleDelete = (row: SalesData) => {
//     if (window.confirm(`Are you sure you want to delete ${row.name}'s record?`)) {
//       setSalesData(prevData => prevData.filter(item => item.id !== row.id));
//       console.log('Deleted:', row);
//     }
//   };

//   const handleDeleteSelected = (rows: SalesData[]) => {
//     if (window.confirm(`Are you sure you want to delete ${rows.length} selected record(s)?`)) {
//       const selectedIds = rows.map(row => row.id);
//       setSalesData(prevData => prevData.filter(item => !selectedIds.includes(item.id)));
//       console.log('Deleted selected:', rows);
//     }
//   };

//   return (
//     <>
//       <Slide direction="up" in timeout={600}>
//         <Card sx={{ borderRadius: 3, boxShadow: '0 6px 24px rgba(0,0,0,0.08)' ,  }}>
//           <CardContent>
//             <FormProvider {...methods}>
//               <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}  >
//                 <Typography variant="h6" fontWeight={600} >
//                   Recent Sales List
//                 </Typography>

//                 <Box display="flex" alignItems="center" gap={2}>
//                   <TextField
//                     size="small"
//                     placeholder="Search"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <SearchIcon />
//                         </InputAdornment>
//                       ),
//                     }}
//                     sx={{
//                       width: 300,
//                       '& .MuiOutlinedInput-root': {
//                        height: 50,
//                         //borderRadius: 2,
                        
//                       },
//                     }}
//                   />

//                   <Box sx={{ width: 180 }}>
//                     <DropdownField
//                       name="filter"
//                       options={filterOptions}
//                       isStatic={true}
//                       onChangeCallback={(value) => setSelectedMonth(value)}
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
//               enableCheckbox={true}
//               getRowId={(row) => row.id}
//               onDeleteSelected={handleDeleteSelected}
//               actions={{
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
//               }} caption={undefined}            />
//           </CardContent>
//         </Card>
//       </Slide>

//       <EditSalesForm
//         open={openEditDialog}
//         editingRow={editingRow}
//         onClose={handleCloseEditDialog}
//         onSave={handleSaveEdit}
//       />
//     </>
//   );
// };
 
// export default SalesTable;


import React, { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Slide,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useForm, FormProvider } from 'react-hook-form';
import DropdownField from '@/components/controlled/DropdownField';
import { UniversalTable, type Column, ACTION_KEY } from '@/components/uncontrolled/UniversalTable';
import EditSalesForm from './EditSalesForm';

interface SalesData {
  id: number;
  name: string;
  medicine: string;
  quantity: number;
  totalPrice: number;
  date: string;
  time: string;
  [key: string]: string | number;
}

const initialSalesData: SalesData[] = [
  { id: 1, name: 'Kishor Kedar', medicine: 'Medicine Two', quantity: 1, totalPrice: 152, date: 'Jan 05, 2026', time: '10:00AM' },
  { id: 2, name: 'Rohit Raut', medicine: 'Paracetamol', quantity: 5, totalPrice: 57, date: 'Jan 05, 2026', time: '11:00AM' },
  { id: 3, name: 'Smita Rao', medicine: 'Honitus', quantity: 1, totalPrice: 125, date: 'Jan 04, 2026', time: '04:00PM' },
  { id: 4, name: 'Shilpa Rathod', medicine: 'Eladi', quantity: 1, totalPrice: 160, date: 'Jan 03, 2026', time: '12:00PM' },
  { id: 5, name: 'Kanta Jain', medicine: 'Insulin', quantity: 10, totalPrice: 1799, date: 'Jan 01, 2026', time: '10:00AM' },
  { id: 6, name: 'Amit Sharma', medicine: 'Aspirin', quantity: 3, totalPrice: 45, date: 'Dec 30, 2025', time: '02:00PM' },
];

const filterOptions = [
  { value: 'Today', label: 'Today' },
  { value: '6 Days', label: '6 Days' },
  { value: 'This Month', label: 'This Month' },
  { value: 'All', label: 'All' },
];

const parseDate = (dateStr: string): Date => {
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };

  const [month, day, year] = dateStr.replace(',', '').split(' ');
  return new Date(Number(year), months[month], Number(day));
};

const getFilteredDataByDate = (data: SalesData[], filter: string) => {
  const today = new Date(2026, 0, 6);

  switch (filter) {
    case 'Today':
      return data.filter(
        d =>
          parseDate(d.date).toDateString() ===
          new Date(2026, 0, 5).toDateString()
      );
    case '6 Days':
      return data.filter(d => {
        const date = parseDate(d.date);
        return date >= new Date(2026, 0, 1) && date <= today;
      });
    case 'This Month':
      return data.filter(d => parseDate(d.date).getMonth() === 0);
    case 'All':
    default:
      return data;
  }
};

const SalesTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('This Month');
  const [salesData, setSalesData] = useState<SalesData[]>(initialSalesData);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingRow, setEditingRow] = useState<SalesData | null>(null);

  const methods = useForm({
    defaultValues: {
      filter: 'This Month',
    },
  });

  const filteredSalesData = useMemo(() => {
    const dateFiltered = getFilteredDataByDate(salesData, selectedMonth);

    if (!searchQuery.trim()) return dateFiltered;

    return dateFiltered.filter(
      item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.medicine.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, selectedMonth, salesData]);

  const columns: Column<SalesData>[] = [
    { key: 'name', label: 'Name' },
    { key: 'medicine', label: 'Medicine' },
    { key: 'quantity', label: 'Qty' },
    {
      key: 'totalPrice',
      label: 'Price',
      render: row => row.totalPrice.toFixed(2),
    },
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time' },
    { key: ACTION_KEY, label: 'Actions' },
  ];

  const handleEdit = (row: SalesData) => {
    setEditingRow(row);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingRow(null);
  };

  const handleSaveEdit = (data: SalesData) => {
    setSalesData(prevData => {
      const newData = prevData.map(item =>
        item.id === data.id ? { ...item, ...data } : item
      );

      const updatedFiltered = getFilteredDataByDate(
        newData,
        selectedMonth
      );

      if (!updatedFiltered.some(item => item.id === data.id)) {
        setSelectedMonth('All');
      }

      return newData;
    });

    handleCloseEditDialog();
  };

  const handleDelete = (row: SalesData) => {
    if (window.confirm(`Are you sure you want to delete ${row.name}'s record?`)) {
      setSalesData(prevData =>
        prevData.filter(item => item.id !== row.id)
      );
    }
  };

  const handleDeleteSelected = (rows: SalesData[]) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${rows.length} selected record(s)?`
      )
    ) {
      const selectedIds = rows.map(row => row.id);
      setSalesData(prevData =>
        prevData.filter(item => !selectedIds.includes(item.id))
      );
    }
  };

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
                      isStatic
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
        open={openEditDialog}
        editingRow={editingRow}
        onClose={handleCloseEditDialog}
        onSave={handleSaveEdit}
      />
    </>
  );
};

export default SalesTable;
