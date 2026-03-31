// import React, { useState } from "react";
// import { Card, Typography, Box, useTheme, useMediaQuery } from "@mui/material";
// import { PieChart } from "@mui/x-charts/PieChart";
// import { useDrawingArea } from "@mui/x-charts/hooks";
// import { FormProvider, useForm } from "react-hook-form";
// import DropdownField from "@/components/controlled/DropdownField";

// function CenterLabel({ children }: { children: React.ReactNode }) {
//   const { width, height, left, top } = useDrawingArea();

//   return (
//     <text
//       x={left + width / 2}
//       y={top + height / 2}
//       textAnchor="middle"
//       dominantBaseline="central"
//       style={{
//         fontSize: width < 180 ? 12 : width < 260 ? 15 : 18,
//         fontWeight: 700,
//       }}
//     >
//       {children}
//     </text>
//   );
// }

// type FilterType = "Today" | "6 Days" | "This Month";

// const chartDataMap = {
//   Today: [
//     { label: "Purchases", value: 20, color: "#6EE700" },
//     { label: "Suppliers", value: 30, color: "#8B5CF6" },
//     { label: "Sales", value: 25, color: "#00F5C8" },
//     { label: "No Sales", value: 25, color: "#FFD200" },
//   ],
//   "6 Days": [
//     { label: "Purchases", value: 35, color: "#6EE700" },
//     { label: "Suppliers", value: 25, color: "#8B5CF6" },
//     { label: "Sales", value: 30, color: "#00F5C8" },
//     { label: "No Sales", value: 10, color: "#FFD200" },
//   ],
//   "This Month": [
//     { label: "Purchases", value: 42, color: "#6EE700" },
//     { label: "Suppliers", value: 28, color: "#8B5CF6" },
//     { label: "Sales", value: 18, color: "#00F5C8" },
//     { label: "No Sales", value: 12, color: "#FFD200" },
//   ],
// };

// const filterOptions = [
//   { label: "Today", value: "Today" },
//   { label: "6 Days", value: "6 Days" },
//   { label: "This Month", value: "This Month" },
// ];

// const StockDonutChart = ({
//   title,
//   isOnlyDonutSelected = false,
// }: {
//   title: string;
//   isOnlyDonutSelected?: boolean;
// }) => {
//   const [filter, setFilter] = useState<FilterType>("This Month");

//   const methods = useForm({
//     defaultValues: {
//       filterSelect: "This Month",
//     },
//   });

//   const total = chartDataMap[filter].reduce((sum, d) => sum + d.value, 0);

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const isSmallMobile = useMediaQuery("(max-width:360px)");

//   const chartSize = isOnlyDonutSelected
//     ? isSmallMobile
//       ? 240
//       : isMobile
//       ? 290
//       : 360
//     : isSmallMobile
//     ? 160
//     : isMobile
//     ? 180
//     : 260;

//   const innerRadius = isOnlyDonutSelected
//     ? isSmallMobile
//       ? 58
//       : isMobile
//       ? 72
//       : 92
//     : isSmallMobile
//     ? 40
//     : isMobile
//     ? 45
//     : 70;

//   const outerRadius = isOnlyDonutSelected
//     ? isSmallMobile
//       ? 95
//       : isMobile
//       ? 118
//       : 145
//     : isSmallMobile
//     ? 68
//     : isMobile
//     ? 75
//     : 110;

//   const handleFilterChange = (value: string) => {
//     setFilter(value as FilterType);
//   };

//   return (
//     <Card
//       variant="outlined"
//       sx={{
//         p: { xs: 1, sm: 2 },
//         overflow: "hidden",
//         boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
//         borderRadius: 3,
//         width: "100%",
//       }}
//     >
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={isOnlyDonutSelected ? 1.5 : 0.5}
//         flexWrap="wrap"
//         gap={1}
//       >
//         <Typography
//           fontSize={{ xs: 16, md: 18 }}
//           fontWeight={600}
//           mb={{ xs: 1, md: 5 }}
//         >
//           {title}
//         </Typography>

//         <FormProvider {...methods}>
//           <Box sx={{ width: { xs: "100%", sm: 200 }, mr: { sm: 1 } }}>
//             <DropdownField
//               name="filterSelect"
//               options={filterOptions}
//               onChangeCallback={handleFilterChange}
//             />
//           </Box>
//         </FormProvider>
//       </Box>

//       {isOnlyDonutSelected ? (
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: { xs: "column", lg: "row" },
//             justifyContent: "center",
//             alignItems: "center",
//             width: "100%",
//             gap: { xs: 2.5, md: 5 },
//             py: { xs: 1, md: 2 },
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               width: { xs: "100%", lg: "auto" },
//             }}
//           >
//             <PieChart
//               margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
//               series={[
//                 {
//                   data: chartDataMap[filter],
//                   innerRadius,
//                   outerRadius,
//                   paddingAngle: 3,
//                   cornerRadius: 5,
//                 },
//               ]}
//               width={chartSize}
//               height={chartSize}
//               hideLegend
//             >
//               <CenterLabel>{total}%</CenterLabel>
//             </PieChart>
//           </Box>

//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr" },
//               columnGap: 3.5,
//               rowGap: 2,
//               minWidth: { xs: "100%", md: 280 },
//               maxWidth: { xs: "100%", md: 320 },
//               justifyContent: "center",
//             }}
//           >
//             {chartDataMap[filter].map((item) => (
//               <Box
//                 key={item.label}
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 1,
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 <Box
//                   sx={{
//                     width: 11,
//                     height: 11,
//                     borderRadius: "50%",
//                     backgroundColor: item.color,
//                     flexShrink: 0,
//                   }}
//                 />
//                 <Typography fontSize={13.5} color="text.secondary">
//                   {item.label}
//                 </Typography>
//               </Box>
//             ))}
//           </Box>
//         </Box>
//       ) : (
//         <Box
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           width="100%"
//         >
//           <PieChart
//             margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
//             series={[
//               {
//                 data: chartDataMap[filter],
//                 innerRadius,
//                 outerRadius,
//                 paddingAngle: 2,
//                 cornerRadius: 4,
//               },
//             ]}
//             width={chartSize}
//             height={chartSize}
//           >
//             <CenterLabel>{total}%</CenterLabel>
//           </PieChart>
//         </Box>
//       )}
//     </Card>
//   );
// };

// export default StockDonutChart;


import React, { useState } from "react";
import { Card, Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { FormProvider, useForm } from "react-hook-form";
import DropdownField from "@/components/controlled/DropdownField";
 
function CenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
 
  return (
    <text
      x={left + width / 2}
      y={top + height / 2}
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fontSize: width < 180 ? 12 : width < 260 ? 15 : 18,
        fontWeight: 700,
      }}
    >
      {children}
    </text>
  );
}
 
type FilterType = "Today" | "6 Days" | "This Month";
 
const chartDataMap = {
  Today: [
    { label: "Purchases", value: 20, color: "#6EE700" },
    { label: "Suppliers", value: 30, color: "#8B5CF6" },
    { label: "Sales", value: 25, color: "#00F5C8" },
    { label: "No Sales", value: 25, color: "#FFD200" },
  ],
  "6 Days": [
    { label: "Purchases", value: 35, color: "#6EE700" },
    { label: "Suppliers", value: 25, color: "#8B5CF6" },
    { label: "Sales", value: 30, color: "#00F5C8" },
    { label: "No Sales", value: 10, color: "#FFD200" },
  ],
  "This Month": [
    { label: "Purchases", value: 42, color: "#6EE700" },
    { label: "Suppliers", value: 28, color: "#8B5CF6" },
    { label: "Sales", value: 18, color: "#00F5C8" },
    { label: "No Sales", value: 12, color: "#FFD200" },
  ],
};
 
const filterOptions = [
  { label: "Today", value: "Today" },
  { label: "6 Days", value: "6 Days" },
  { label: "This Month", value: "This Month" },
];
 
const StockDonutChart = ({
  title,
  isOnlyDonutSelected = false,
}: {
  title: string;
  isOnlyDonutSelected?: boolean;
}) => {
  const [filter, setFilter] = useState<FilterType>("This Month");
 
  const methods = useForm({
    defaultValues: {
      filterSelect: "This Month",
    },
  });
 
  const total =
    chartDataMap[filter]?.reduce((sum, d) => sum + d.value, 0) || 0;
 
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery("(max-width:360px)");
 
  const chartSize = isOnlyDonutSelected
    ? isSmallMobile
      ? 240
      : isMobile
      ? 290
      : 360
    : isSmallMobile
    ? 160
    : isMobile
    ? 180
    : 260;
 
  const innerRadius = isOnlyDonutSelected
    ? isSmallMobile
      ? 58
      : isMobile
      ? 72
      : 92
    : isSmallMobile
    ? 40
    : isMobile
    ? 45
    : 70;
 
  const outerRadius = isOnlyDonutSelected
    ? isSmallMobile
      ? 95
      : isMobile
      ? 118
      : 145
    : isSmallMobile
    ? 68
    : isMobile
    ? 75
    : 110;
 
  const handleFilterChange = (value: string) => {
    if (!value || !(value in chartDataMap)) return;
    setFilter(value as FilterType);
  };
 
  return (
    <Card
      variant="outlined"
      sx={{
        p: { xs: 1, sm: 2 },
        overflow: "hidden",
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
        borderRadius: 3,
        width: "100%",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={isOnlyDonutSelected ? 1.5 : 0.5}
        flexWrap="wrap"
        gap={1}
      >
        <Typography
          fontSize={{ xs: 16, md: 18 }}
          fontWeight={600}
          mb={{ xs: 1, md: 5 }}
        >
          {title}
        </Typography>
 
        <FormProvider {...methods}>
          <Box sx={{ width: { xs: "100%", sm: 200 }, mr: { sm: 1 } }}>
            <DropdownField
              name="filterSelect"
              options={filterOptions}
              onChangeCallback={handleFilterChange}
            />
          </Box>
        </FormProvider>
      </Box>
 
      {isOnlyDonutSelected ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            gap: { xs: 2.5, md: 5 },
            py: { xs: 1, md: 2 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: { xs: "100%", lg: "auto" },
            }}
          >
            <PieChart
              margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
              series={[
                {
                  data: chartDataMap[filter],
                  innerRadius,
                  outerRadius,
                  paddingAngle: 3,
                  cornerRadius: 5,
                },
              ]}
              width={chartSize}
              height={chartSize}
              hideLegend
            >
              <CenterLabel>{total}%</CenterLabel>
            </PieChart>
          </Box>
 
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr" },
              columnGap: 3.5,
              rowGap: 2,
              minWidth: { xs: "100%", md: 280 },
              maxWidth: { xs: "100%", md: 320 },
              justifyContent: "center",
            }}
          >
            {chartDataMap[filter].map((item) => (
              <Box
                key={item.label}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  whiteSpace: "nowrap",
                }}
              >
                <Box
                  sx={{
                    width: 11,
                    height: 11,
                    borderRadius: "50%",
                    backgroundColor: item.color,
                    flexShrink: 0,
                  }}
                />
                <Typography fontSize={13.5} color="text.secondary">
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <PieChart
            margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
            series={[
              {
                data: chartDataMap[filter],
                innerRadius,
                outerRadius,
                paddingAngle: 2,
                cornerRadius: 4,
              },
            ]}
            width={chartSize}
            height={chartSize}
          >
            <CenterLabel>{total}%</CenterLabel>
          </PieChart>
        </Box>
      )}
    </Card>
  );
};
 
export default StockDonutChart;