import React, { useMemo, useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Slide
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useForm, FormProvider } from 'react-hook-form';
import DropdownField from '@/components/controlled/DropdownField';
import { UniversalTable, type Column, ACTION_KEY } from '@/components/uncontrolled/UniversalTable';
import EditSalesForm from './EditSalesForm';
import ViewSalesDialog from './ViewSalesTable';



export interface SalesData extends Record<string, unknown> {
  id: number;
  name: string;
  medicine: string;
  quantity: number;
  totalPrice: number;
  date: string;
  time: string;
}

type StoredSale = {
  name: string;
  totalPrice: number;
  invoice: string;
  date: string;
   time?: string; 
  medicines: { name: string; qty: number }[];
};



const filterOptions = [
  { value: 'Today', label: 'Today' },
  { value: '6 Days', label: '6 Days' },
  { value: 'This Month', label: 'This Month' },
  { value: 'All', label: 'All' },
];

const getFilteredDataByDate = (data: SalesData[], filter: string): SalesData[] => {
  const today = new Date();

  switch (filter) {
    case 'Today':
      return data.filter(d => new Date(d.date).toDateString() === today.toDateString());

    case '6 Days': {
      const sixDaysAgo = new Date();
      sixDaysAgo.setDate(today.getDate() - 6);
      return data.filter(d => {
        const date = new Date(d.date);
        return date >= sixDaysAgo && date <= today;
      });
    }

    case 'This Month':
      return data.filter(d => {
        const date = new Date(d.date);
        return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
      });

    default:
      return data;
  }
};



const SalesTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('This Month');
  const [salesList, setSalesList] = useState<SalesData[]>([]);
  const [editingRow, setEditingRow] = useState<SalesData | null>(null);
  const [viewRow, setViewRow] = useState<SalesData | null>(null);

  const methods = useForm({ defaultValues: { filter: 'This Month' } });


  useEffect(() => {
  const storedRetail = localStorage.getItem('currentInvoice');
  const storedDistributor = localStorage.getItem('currentNewInvoiceList');

  const retailParsed: StoredSale[] = storedRetail ? JSON.parse(storedRetail) : [];
  const distributorParsed: StoredSale[] = storedDistributor ? JSON.parse(storedDistributor) : [];

 
  const combined = [...retailParsed, ...distributorParsed];

  if (combined.length === 0) return;

  const formatted: SalesData[] = combined.map((item, index) => {
    const medicineNames =
      item.medicines && item.medicines.length > 0
        ? item.medicines.map(m => m.name).join(', ')
        : '-';

    const totalQty =
      item.medicines && item.medicines.length > 0
        ? item.medicines.reduce((sum, m) => sum + (m.qty || 0), 0)
        : 1;

    return {
      id: index + 1,
      name: item.name || '-',
      medicine: medicineNames,
      quantity: totalQty,
      totalPrice: item.totalPrice || 0,
      date: item.date || new Date().toISOString().split('T')[0],
  
     time:item.time || '-',
    };
  });

  setSalesList(formatted);
}, []);

  const saveToLocalStorage = (data: SalesData[]) => {
    const formatted: StoredSale[] = data.map(item => ({
      invoice: String(item.id),
      name: item.name as string,
      totalPrice: item.totalPrice as number,
      date: item.date as string,
      medicines:
        item.medicine !== '-'
          ? (item.medicine as string).split(', ').map(name => ({
              name,
              qty: 1, 
            }))
          : [],
    }));

    localStorage.setItem('currentInvoice', JSON.stringify(formatted));
    localStorage.setItem('currentNewInvoiceList', JSON.stringify([]));
  };

  const filteredSalesData = useMemo(() => {
    const dateFiltered = getFilteredDataByDate(salesList, selectedMonth);

    if (!searchQuery.trim()) return dateFiltered;

    return dateFiltered.filter(
      item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.medicine.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [salesList, selectedMonth, searchQuery]);


  const columns: Column<SalesData>[] = [
    { key: 'name', label: 'Name' },
    { key: 'medicine', label: 'Medicine' },
    { key: 'quantity', label: 'Qty' },
    {
      key: 'totalPrice',
      label: 'Price',
      render: row => `₹ ${(row.totalPrice as number).toFixed(2)}`,
    },
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time' },
    { key: ACTION_KEY, label: 'Actions' },
  ];

  

  const handleEdit = (row: SalesData) => setEditingRow(row);
  const handleCloseEditDialog = () => setEditingRow(null);

  const handleSaveEdit = (data: SalesData) => {
    setSalesList(prev => {
      const updated = prev.map(item =>
        item.id === data.id ? { ...item, ...data } : item
      );
      saveToLocalStorage(updated);
      return updated;
    });
    handleCloseEditDialog();
  };

  const handleDelete = (row: SalesData) => {
    if (!window.confirm(`Delete ${row.name}?`)) return;

    setSalesList(prev => {
      const updated = prev.filter(item => item.id !== row.id);
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const handleDeleteSelected = (rows: SalesData[]) => {
    if (!window.confirm(`Delete ${rows.length} records?`)) return;

    const ids = rows.map(r => r.id);

    setSalesList(prev => {
      const updated = prev.filter(item => !ids.includes(item.id));
      saveToLocalStorage(updated);
      return updated;
    });
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
                <Typography variant="h6" fontWeight={600}>
                  Recent Sales List
                </Typography>

                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
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
                  />

                  <Box sx={{ width: { xs: '100%', sm: 180 } }}>
                    <DropdownField
                      name="filter"
                      options={filterOptions}
                      onChangeCallback={value => setSelectedMonth(value)}
                    />
                  </Box>
                </Box>
              </Box>
            </FormProvider>

            <Chip label={`Filter: ${selectedMonth}`} sx={{ mb: 2 }} />

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