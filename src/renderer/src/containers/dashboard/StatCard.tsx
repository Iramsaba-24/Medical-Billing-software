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

const Dashboard: React.FC = () => {
  // Function to generate and download the report
//   const handleDownloadReport = () => {
//     // Demo data for the report
//     const reportData = {
//       reportTitle: 'Inventory Dashboard Report',
//       generatedDate: new Date().toLocaleString(),
//       statistics: [
//         { title: 'Total Revenue', value: '₹ 2,30,847' },
//         { title: 'Inventory Status', value: 'Good' },
//         { title: 'Medicines Available', value: '298' },
//         { title: 'Medicine Shortage', value: '01' },
//       ],
//       summary: {
//         totalRevenue: '₹ 2,30,847',
//         inventoryStatus: 'Good',
//         availableMedicines: '298 types',
//         criticalShortage: '1 medicine',
//       },
//     };

//     // Create report content in text format
//     let reportContent = `
// ═══════════════════════════════════════════════════
//           INVENTORY DASHBOARD REPORT
// ═══════════════════════════════════════════════════

// Generated On: ${reportData.generatedDate}

// ───────────────────────────────────────────────────
//                  QUICK STATISTICS
// ───────────────────────────────────────────────────

// - Total Revenue: ${reportData.statistics[0].value}
// - Inventory Status: ${reportData.statistics[1].value}
// - Medicines Available: ${reportData.statistics[2].value}
// - Medicine Shortage: ${reportData.statistics[3].value}

// ───────────────────────────────────────────────────
//                  DETAILED SUMMARY
// ───────────────────────────────────────────────────

// Total Revenue: ${reportData.summary.totalRevenue}
// Inventory Status: ${reportData.summary.inventoryStatus}
// Available Medicines: ${reportData.summary.availableMedicines}
// Critical Shortage: ${reportData.summary.criticalShortage}

// ───────────────────────────────────────────────────
//                   RECOMMENDATIONS
// ───────────────────────────────────────────────────

// 1. Restock medicines with shortage immediately
// 2. Monitor inventory levels regularly
// 3. Review revenue trends weekly
// 4. Update medicine database monthly

// ═══════════════════════════════════════════════════
//               END OF REPORT
// ═══════════════════════════════════════════════════
//     `.trim();

//     // Create a Blob from the report content
//     const blob = new Blob([reportContent], { type: 'text/plain' });
    
//     // Create a download link
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `Inventory_Report_${new Date().getTime()}.txt`;
    
//     // Trigger the download
//     document.body.appendChild(link);
//     link.click();
    
//     // Cleanup
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//   };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#111827',
            }}
          >
            Dashboard
          </Typography>
          <Typography
            sx={{
              fontSize: '15px',
              mt: 0.5,
            }}
          >
            A quick data overview of the inventory.
          </Typography>
        </Box>

        {/* <Button
          variant="contained"
          onClick={handleDownloadReport}
         sx={{
              px:4,
              width:"14%",          
              textTransform:"none",
              backgroundColor:"#1b7f6b",
              "&:hover": {
                backgroundColor:"#fff",
                color:"#1b7f6b",
                border:"2px solid #1b7f6b",
              },
            }}
        >
          Download Report
        </Button> */}
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
          value="Good"
          title="Inventory Status"
          icon={Inventory}
        />

        <StackCard
          value="298"
          title="Medicines Available"
          icon={Medicines}
        />

        <StackCard
          value="01"
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