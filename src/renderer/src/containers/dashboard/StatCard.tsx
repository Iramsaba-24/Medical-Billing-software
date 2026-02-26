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
import { InventoryItem } from '@/containers/inventory/InvetoryList';

const Dashboard: React.FC = () => {

// to fetch available medicine from inventory
const availableMedicines = () :string =>
{
  const data = localStorage.getItem("inventory")
  if(!data){
    return "0"
  }
  const parseData : InventoryItem[] = JSON.parse(data)
  const count = parseData.filter((item)=> Number(item.stockQty) >0 ).length
  return count.toString()
}

// to fetch medicine shortage 
const medicineShoratage = () : string =>
{
  const data =localStorage.getItem("inventory")
  if(!data){
    return "0"
  }
  const parseData : InventoryItem[] = JSON.parse(data)
  const count = parseData.filter((item)=> Number(item.stockQty) <5 ).length
  return count.toString()
}

//inventory status
const inventoryStatus = (): string =>
{
  const data = Number(medicineShoratage())
  if(data ===0)
  {
    return "Good"
  }
  if(data<=3)
  {
    return "Average"
  }
  return "Critical"
}

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
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 3,
        }}
      >
        <StackCard
          value="₹ 2,30,847"
          title="Total Revenue"
          icon={Revenue}
        />

        <StackCard
          value={inventoryStatus()}
          title="Inventory Status"
          icon={Inventory}
        />

        <StackCard
          value={availableMedicines()}
          title="Medicines Available"
          icon={Medicines}
        />

        <StackCard
          value={medicineShoratage()}
          title="Medicine Shortage"
          icon={Shortage}
        />
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