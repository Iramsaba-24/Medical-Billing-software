

import { useForm, FormProvider } from "react-hook-form";
import { Box, Typography, Paper, Divider, Grid } from "@mui/material";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import DropdownField from "@/components/controlled/DropdownField"; 

// Type for sales data
type SalesRecord = { name: string; sales: number };

// Sample datasets for different date ranges
const allData: Record<string, SalesRecord[]> = {
  "01 December 2021 - 31 December 2021": [
    { name: "1 Dec", sales: 45 },
    { name: "8 Dec", sales: 165 },
    { name: "16 Dec", sales: 60 },
    { name: "24 Dec", sales: 146 },
    { name: "31 Dec", sales: 150 },
  ],
  "01 January 2022 - 31 January 2022": [
    { name: "1 Jan", sales: 80 },
    { name: "8 Jan", sales: 120 },
    { name: "16 Jan", sales: 90 },
    { name: "24 Jan", sales: 180 },
    { name: "31 Jan", sales: 200 },
  ],
  "01 February 2022 - 28 February 2022": [
    { name: "1 Feb", sales: 70 },
    { name: "8 Feb", sales: 130 },
    { name: "16 Feb", sales: 110 },
    { name: "24 Feb", sales: 160 },
    { name: "28 Feb", sales: 190 },
  ],
};

const SalesGraph = () => {
  // Initialize react-hook-form
  const methods = useForm({
    defaultValues: {
      dateRange: "01 December 2021 - 31 December 2021",
      medicineGroup: "Generic",
    },
  });

  const { watch } = methods;
  const range = watch("dateRange") as keyof typeof allData;  // ensures TS  valid key
  

  // Safe fallback in case range is invalid
  const data: SalesRecord[] = allData[range] ?? [];

  return (
    <FormProvider {...methods}>
      <form>
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Sales Reports
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* Filters */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Date Range Dropdown */}
            <Grid size= {{xs:12 ,md:6}}>
              <DropdownField
                name="dateRange"
                label="Date Range"
                options={Object.keys(allData).map((key) => ({
                  label: key,
                  value: key,
                }))}
                required
                  // isStatic={true} // behaves like a normal select
                onChangeCallback={(val) => console.log("Selected Range:", val)}
              />
            </Grid>

            {/* Medicine Group Dropdown */}
            <Grid  size= {{xs:12 ,md:6}}>
              <DropdownField
                name="medicineGroup"
                label="Medicine Group"
                //placeholder="- Select Group -"
                options={[
                  { label: "Generic Medicines", value: "Generic" },
                  { label: "Diabetes", value: "Diabetes" },
                  { label: "Others", value: "Others" },
                ]}
   
                isStatic={true}
                onChangeCallback={(val) => console.log("Selected Group:", val)}
              />
            </Grid>
          </Grid>

          {/* Chart */}
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 2, bgcolor: "#fafafa", borderBottom: "1px solid #e0e0e0" }}>
              <Typography variant="subtitle2" fontWeight="bold">
                Sales Statistics
              </Typography>
            </Box>

            <Box sx={{ p: 2, height: 350, width: "100%", minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#03A9F4"
                    fill="#e1f5fe"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Paper>
      </form>
    </FormProvider>
  );
};

export default SalesGraph;




