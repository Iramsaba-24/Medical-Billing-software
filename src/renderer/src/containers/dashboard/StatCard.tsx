
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import Revenue from '@/assets/revenue.svg';
import Inventory from '@/assets/inventory.svg';
import Medicines from '@/assets/medicines.svg';
import Shortage from '@/assets/shortage.svg';
import { getMedicines, MedicineResponse } from "@/service/medicineService";
import { getAllRetailInvoices, RetailInvoiceResponse } from "@/service/retailInvoiceService";
import { useEffect, useState } from "react";

const Dashboard: React.FC = () => {
const [inventory, setInventory] = useState<MedicineResponse[]>([]);// inventory data
const [invoices, setInvoices] = useState<RetailInvoiceResponse[]>([]);// fetch invoices for revenue calculation
// fetch inventory data
useEffect(() => {
  const fetchInventory = async () => {
    const data = await getMedicines(); 
    setInventory(data);
  };
  fetchInventory();
}, []);
// fetch invoices data
useEffect(() => {
  const fetchInvoices = async () => {
    const data = await getAllRetailInvoices();
    setInvoices(data);
  };

  fetchInvoices();
}, []);
// available medicines count
const availableMedicines = inventory.filter(item => item.quantity > 0).length;
// shortage count
const medicineShortage = inventory.filter(item => item.quantity < 5).length;
// inventory status
const inventoryStatus = (): string => {
  if (medicineShortage === 0) return "Good";
  if (medicineShortage <= 3) return "Average";
  return "Critical";
};
// fetch total revenue
const totalRevenue = (): string => {
  const total = invoices
    .filter((inv) => inv.paymentStatus === "Paid")
    .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

  return `₹ ${total.toLocaleString()}`;
};
// fetch visible kpis-settings
const getVisibleKpis = (): string[] => {
  const defaultKpis = [
    "totalRevenue",
    "inventoryStatus",
    "medicinesAvailable",
    "medicinesShortage",
  ];
 
  const data = localStorage.getItem("dashboardSettings") 
  if (!data) return defaultKpis;
 
  try {
    const parsed = JSON.parse(data);
    //  handle both formats
    if (Array.isArray(parsed)) return parsed;
    return parsed.visibleKpis || defaultKpis;
  } catch {
    return defaultKpis;
  }
};
const visibleKpis = getVisibleKpis();
 
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
        }}
      >
      <Box>
        <Typography
          sx={{
            fontSize: { xs: 20, sm: 24, md: 28 },  
            fontWeight: 700,
            color: '#111827',
            mt: {xs:1 , md:0.5},
            mb: 0.5,
          }}
        >
          Dashboard
        </Typography>
 
        <Typography
          sx={{
            fontSize: { xs: 13, sm: 14, md: 15 },
            mb: 1.5,
            color: "text.secondary",
          }}
        >
          A quick data overview of the inventory.
        </Typography>
      </Box>
 
      </Box>
     <Box
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, 1fr)",
      md: "repeat(4, 1fr)",
    },
    gap: 3,
  }}
>
 
{visibleKpis.includes("totalRevenue") && (
  <StackCard
    value={totalRevenue()}
    title="Total Revenue"
    icon={Revenue}
  />
)}
 
{visibleKpis.includes("inventoryStatus") && (
    <StackCard value={inventoryStatus()} title="Inventory Status" icon={Inventory} />
  )}
  {visibleKpis.includes("medicinesAvailable") && (
    <StackCard value={availableMedicines.toString()} title="Medicines Available" icon={Medicines} />
  )}
  {visibleKpis.includes("medicinesShortage") && (
    <StackCard value={medicineShortage.toString()} title="Medicine Shortage" icon={Shortage} />
  )}
 
</Box>
    </Box>
  );
};
 
export default Dashboard;
 
interface StackCardProps {
  value: string;
  title: string;
  icon: string;
}
 
const StackCard: React.FC<StackCardProps> = ({ value, title, icon }) => {
  return (
    <Card
      sx={{
        height: '110px',
        borderRadius: '12px',
        boxShadow: '0px 4px 10px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        px: 2.5,
        background: '#FFFFFF',
       
      }}
    >
      <CardContent
        sx={{
          p: 0,
          width: '100%',
          '&:last-child': { pb: 0 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#111827',
              }}
            >
              {value}
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#6B7280',
                mt: 0.5,
              }}
            >
              {title}
            </Typography>
          </Box>
 
          <img
            src={icon}
            alt={title}
            style={{ width: 48, height: 48 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
 
 
 