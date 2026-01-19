import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

const baseData = [
  { day: 'Mon', value: 6000 },
  { day: 'Tue', value: 10000 },
  { day: 'Wed', value: 30000 },
  { day: 'Thu', value: 10000 },
  { day: 'Fri', value: 15000 },
  { day: 'Sat', value: 16000 },
];

const MAX_VALUE = 45000;

const BarChart: React.FC = () => {
  const [data, setData] = useState(baseData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev =>
        prev.map(item => ({
          ...item,
          value: Math.floor(Math.random() * 30000) + 5000,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
        width: '100%',
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography fontWeight={600} fontSize={{ xs: 14, sm: 18 }} mb={2}>
          Total Sales Overview
        </Typography>

        <Box display="flex" width="100%">
         
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            height={{ xs: 150, sm: 260 }}
            mr={1}
            width={30}
            flexShrink={0}
          >
            {['45K', '40K', '30K', '15K', '10K', '5K', '0K'].map(label => (
              <Typography
                key={label}
                fontSize={{ xs: 9, sm: 12 }}
                color="#6B7280"
                textAlign="right"
                lineHeight={1}
              >
                {label}
              </Typography>
            ))}
          </Box>

          <Box
            flex={1}
            display="flex"
            justifyContent="space-between"
            alignItems="flex-end"
            minWidth={0}
          >
            {data.map(item => {
              const heightPercent = (item.value / MAX_VALUE) * 100;

              return (
                <Box
                  key={item.day}
                  flex={1}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Box
                    sx={{
                      height: { xs: 150, sm: 260 },
                      width: { xs: 10, sm: 22 },
                      backgroundColor: '#E5E7EB',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'flex-end',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: `${heightPercent}%`,
                        background:
                          'linear-gradient(180deg, #2EF2D0 0%, #00A991 100%)',
                        borderRadius: 2,
                        transition: 'height 0.8s ease',
                      }}
                    />
                  </Box>

                  <Typography
                    mt={1}
                    fontSize={{ xs: 9, sm: 12 }}
                    fontWeight={500}
                    color="#374151"
                  >
                    {item.day}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BarChart;
