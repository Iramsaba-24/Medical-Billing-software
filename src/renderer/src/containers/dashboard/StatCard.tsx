import React from 'react';
import {Box,Typography,Card,CardContent,} from '@mui/material';
import Revenue from '@/assets/revenue.svg';
import Inventory from '@/assets/inventory.svg';
import Medicines from '@/assets/medicines.svg';
import Shortage from '@/assets/shortage.svg';

import { useEffect, useState } from "react";
import { DashboardCardsResponse, getDashboardCards } from "@/service/dashboardService";
const Dashboard: React.FC = () => {
const [data, setData] = useState<DashboardCardsResponse | null>(null);

useEffect(() => {
  const fetchData = async () => {
    const res = await getDashboardCards();
    console.log("DASHBOARD API RESPONSE:", res);
    setData(res);
  };
  fetchData();
}, []);

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
value={`₹ ${Number(data?.totalRevenue ?? 0).toLocaleString("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})}`}    title="Total Revenue"
    icon={Revenue}
  />
)}
 
{visibleKpis.includes("inventoryStatus") && (
    <StackCard value={data?.inventoryStatus ?? "—"} title="Inventory Status" icon={Inventory} />
  )}
  {visibleKpis.includes("medicinesAvailable") && (
    <StackCard value={(data?.medicineAvailableCount ?? 0).toString()} title="Medicines Available" icon={Medicines} />
  )}
  {visibleKpis.includes("medicinesShortage") && (
    <StackCard value={(data?.medicineShortageCount ?? 0).toString()} title="Medicine Shortage" icon={Shortage} />
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
 
 
 