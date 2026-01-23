import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Divider,
} from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import DropdownField from '@/components/controlled/DropdownField';

type FilterType = 'Today' | '6 Days' | 'This Month';

interface CardInfo {
  title: string;
  data: Record<
    FilterType,
    {
      leftValue: string;
      leftLabel: string;
      rightValue: string;
      rightLabel: string;
    }
  >;
}

const cardsConfig: CardInfo[] = [
  {
    title: 'Inventory',
    data: {
      Today: {
        leftValue: '290',
        leftLabel: 'Total no of Medicines',
        rightValue: '22',
        rightLabel: 'Medicines Group',
      },
      '6 Days': {
        leftValue: '295',
        leftLabel: 'Total no of Medicines',
        rightValue: '23',
        rightLabel: 'Medicines Group',
      },
      'This Month': {
        leftValue: '298',
        leftLabel: 'Total no of Medicines',
        rightValue: '24',
        rightLabel: 'Medicines Group',
      },
    },
  },
  {
    title: 'Quick Report',
    data: {
      Today: {
        leftValue: '5,200',
        leftLabel: 'Qty of Medicines Sold',
        rightValue: '410',
        rightLabel: 'Invoices Generated',
      },
      '6 Days': {
        leftValue: '32,500',
        leftLabel: 'Qty of Medicines Sold',
        rightValue: '2,180',
        rightLabel: 'Invoices Generated',
      },
      'This Month': {
        leftValue: '70,856',
        leftLabel: 'Qty of Medicines Sold',
        rightValue: '5,288',
        rightLabel: 'Invoices Generated',
      },
    },
  },
  {
    title: 'My Pharmacy',
    data: {
      Today: {
        leftValue: '03',
        leftLabel: 'Total no of Suppliers',
        rightValue: '04',
        rightLabel: 'Total no of Users',
      },
      '6 Days': {
        leftValue: '04',
        leftLabel: 'Total no of Suppliers',
        rightValue: '05',
        rightLabel: 'Total no of Users',
      },
      'This Month': {
        leftValue: '04',
        leftLabel: 'Total no of Suppliers',
        rightValue: '05',
        rightLabel: 'Total no of Users',
      },
    },
  },
  {
    title: 'Customers',
    data: {
      Today: {
        leftValue: '120',
        leftLabel: 'Total no of Customers',
        rightValue: 'Paracetamol 500mg',
        rightLabel: 'Frequently bought Item',
      },
      '6 Days': {
        leftValue: '560',
        leftLabel: 'Total no of Customers',
        rightValue: 'Vitamin C',
        rightLabel: 'Frequently bought Item',
      },
      'This Month': {
        leftValue: '845',
        leftLabel: 'Total no of Customers',
        rightValue: 'Paracetamol 500mg',
        rightLabel: 'Frequently bought Item',
      },
    },
  },
];

const filterOptions = [
  { label: 'Today', value: 'Today' },
  { label: '6 Days', value: '6 Days' },
  { label: 'This Month', value: 'This Month' },
];

const Cards: React.FC = () => {
  const [filters, setFilters] = useState<Record<number, FilterType>>({
    0: 'This Month',
    1: 'This Month',
    2: 'This Month',
    3: 'This Month',
  });

  // Create separate form methods for each card with correct types
  const methodsArray = [
    useForm<{ filter: string }>({ defaultValues: { filter: 'This Month' } }),
    useForm<{ filter: string }>({ defaultValues: { filter: 'This Month' } }),
    useForm<{ filter: string }>({ defaultValues: { filter: 'This Month' } }),
    useForm<{ filter: string }>({ defaultValues: { filter: 'This Month' } }),
  ];

  const handleFilterChange = (index: number) => (value: string) => {
    setFilters((prev) => ({
      ...prev,
      [index]: value as FilterType,
    }));
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Responsive Cards Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',                    // Mobile: 1 column
            sm: 'repeat(2, 1fr)',         // Tablet: 2 columns
            md: 'repeat(2, 1fr)',         // Laptop: 2 columns
            lg: 'repeat(2, 1fr)',         // Desktop: 2 columns
          },
          gap: {
            xs: 2,      // Mobile: smaller gap
            sm: 2.5,    // Tablet: medium gap
            md: 3,      // Laptop+: larger gap
          },
        }}
      >
        {cardsConfig.map((card, index) => {
          const filter = filters[index];
          const info = card.data[filter];
          const methods = methodsArray[index];

          return (
            <Card
              key={index}
              sx={{
                borderRadius: {
                  xs: '8px',
                  sm: '10px',
                  md: '12px',
                },
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                padding: {
                  xs: '16px',     // Mobile: smaller padding
                  sm: '18px 20px', // Tablet: medium padding
                  md: '20px 24px', // Laptop+: larger padding
                },
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: {
                    xs: 1.5,
                    sm: 2,
                  },
                  flexWrap: {
                    xs: 'wrap',
                    sm: 'nowrap',
                  },
                  gap: 1,
                }}
              >
                <Typography 
                  sx={{
                    fontSize: {
                      xs: '13px',
                      sm: '14px',
                      md: '14px',
                    },
                    fontWeight: 500,
                    color: '#111827',
                  }}
                >
                  {card.title}
                </Typography>

                {/* Using DropdownField Component */}
                <FormProvider {...methods}>
                  <Box 
                    sx={{ 
                      minWidth: {
                        xs: '100px',
                        sm: '110px',
                      },
                    }}
                  >
                    <DropdownField
                      name="filter"
                      options={filterOptions}
                      onChangeCallback={handleFilterChange(index)}
                      sx={{
                        height: {
                          xs: 30,
                          sm: 32,
                        },
                        '& .MuiOutlinedInput-root': {
                          height: {
                            xs: 30,
                            sm: 32,
                          },
                        },
                        '& .MuiSelect-select': {
                          fontSize: {
                            xs: '12px',
                            sm: '13px',
                          },
                          padding: {
                            xs: '4px 28px 4px 10px',
                            sm: '6px 32px 6px 12px',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          display: 'none',
                        },
                        '& .MuiFormHelperText-root': {
                          display: 'none',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#D1D5DB',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#9CA3AF',
                        },
                      }}
                    />
                  </Box>
                </FormProvider>
              </Box>

              <Divider 
                sx={{ 
                  mb: {
                    xs: 1.5,
                    sm: 2,
                    md: 2.5,
                  },
                  borderColor: '#E5E7EB',
                }} 
              />

              {/* Content - Responsive Layout */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: {
                    xs: 'column',    // Mobile: stack vertically
                    sm: 'row',       // Tablet+: side by side
                  },
                  justifyContent: 'space-between',
                  alignItems: {
                    xs: 'flex-start',
                    sm: 'flex-start',
                  },
                  gap: {
                    xs: 2,
                    sm: 1,
                  },
                }}
              >
                {/* Left Value */}
                <Box 
                  sx={{ 
                    flex: 1,
                    minWidth: 0, // Allow text truncation if needed
                  }}
                >
                  <Typography 
                    sx={{
                      fontSize: {
                        xs: '20px',
                        sm: '22px',
                        md: '24px',
                      },
                      fontWeight: 700,
                      color: '#111827',
                      mb: 0.5,
                      lineHeight: 1.2,
                    }}
                  >
                    {info.leftValue}
                  </Typography>
                  <Typography 
                    sx={{
                      fontSize: {
                        xs: '11px',
                        sm: '12px',
                      },
                      color: '#6B7280',
                      lineHeight: 1.4,
                    }}
                  >
                    {info.leftLabel}
                  </Typography>
                </Box>

                {/* Right Value */}
                <Box 
                  sx={{ 
                    flex: 1,
                    textAlign: {
                      xs: 'left',
                      sm: 'left',
                    },
                    pl: {
                      xs: 0,
                      sm: 2,
                    },
                    minWidth: 0,
                  }}
                >
                  <Typography 
                    sx={{
                      fontSize: {
                        xs: '20px',
                        sm: '22px',
                        md: '24px',
                      },
                      fontWeight: 700,
                      color: '#111827',
                      mb: 0.5,
                      lineHeight: 1.2,
                    }}
                  >
                    {info.rightValue}
                  </Typography>
                  <Typography 
                    sx={{
                      fontSize: {
                        xs: '11px',
                        sm: '12px',
                      },
                      color: '#6B7280',
                      lineHeight: 1.4,
                    }}
                  >
                    {info.rightLabel}
                  </Typography>
                </Box>
              </Box>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default Cards;