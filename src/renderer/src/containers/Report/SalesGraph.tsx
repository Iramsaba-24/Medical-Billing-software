import { useForm, FormProvider } from "react-hook-form";
import { Box, Typography, Paper, Divider, Grid } from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import DropdownField from "@/components/controlled/DropdownField";

import {
  getAllRetailInvoices,
  RetailInvoiceResponse,
  getRetailInvoiceItemsByInvoiceId,
} from "@/service/retailInvoiceService";

import {
  getMedicineGroups,
  MedicineGroupResponse,
} from "@/service/medicineGroupService";

import { getMedicines, MedicineResponse } from "@/service/medicineService";

type SalesRecord = {
  name: string;
  sales: number;
};

type FormValues = {
  dateRange: string;
  medicineGroup: string;
};

type RetailInvoiceItem = {
  medicineId: number;
  quantity: number;
  price: number;
};

const getDateRanges = (selected?: string): string[] => {
  const months = [
    { name: "January", days: 31 },
    { name: "February", days: 28 },
    { name: "March", days: 31 },
    { name: "April", days: 30 },
    { name: "May", days: 31 },
    { name: "June", days: 30 },
    { name: "July", days: 31 },
    { name: "August", days: 31 },
    { name: "September", days: 30 },
    { name: "October", days: 31 },
    { name: "November", days: 30 },
    { name: "December", days: 31 },
  ];

  const ranges: string[] = [];

  if (!selected) {
    for (let i = 2; i < months.length; i++) {
      const m = months[i];
      ranges.push(`01 ${m.name} 2026 - ${m.days} ${m.name} 2026`);
    }
    return ranges;
  }

  const [startStr] = selected.split(" - ");
  const selectedDate = new Date(startStr);

  let monthIndex = selectedDate.getMonth();
  let year = selectedDate.getFullYear();

  const selectedMonth = months[monthIndex];
  ranges.push(
    `01 ${selectedMonth.name} ${year} - ${selectedMonth.days} ${selectedMonth.name} ${year}`
  );

  monthIndex++;

  if (monthIndex > 11) {
    monthIndex = 0;
    year += 1;
  }

  for (let i = monthIndex; i < months.length; i++) {
    const m = months[i];
    ranges.push(`01 ${m.name} ${year} - ${m.days} ${m.name} ${year}`);
  }

  return ranges;
};

const parseDateRange = (range: string): { start: Date; end: Date } => {
  const [startStr, endStr] = range.split(" - ");
  return {
    start: new Date(startStr),
    end: new Date(endStr),
  };
};

const SalesGraph = () => {
  const [dateRanges, setDateRanges] = useState<string[]>(getDateRanges());

  const methods = useForm<FormValues>({
    defaultValues: {
      dateRange: dateRanges[0],
      medicineGroup: "",
    },
  });

  const { watch, setValue } = methods;
  const selectedRange = watch("dateRange");
  const selectedGroup = watch("medicineGroup");

  const [groups, setGroups] = useState<MedicineGroupResponse[]>([]);
  const [data, setData] = useState<SalesRecord[]>([]);

  useEffect(() => {
    const newRanges = getDateRanges(selectedRange);
    setDateRanges(newRanges);

    if (!newRanges.includes(selectedRange)) {
      setValue("dateRange", newRanges[0]);
    }
  }, [selectedRange, setValue]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await getMedicineGroups();
        setGroups(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const invoices: RetailInvoiceResponse[] =
          await getAllRetailInvoices();

        const medicines: MedicineResponse[] = await getMedicines();

        const medicineGroupMap = new Map<number, string>();
        medicines.forEach((m) => {
          medicineGroupMap.set(
            m.medicineId,
            (m.groupName || "").trim().toLowerCase()
          );
        });

        const { start, end } = parseDateRange(selectedRange);

        const filteredInvoices = invoices.filter((inv) => {
          const date = new Date(inv.invoiceDate);
          return date >= start && date <= end;
        });

        const weeklyData: Record<string, number> = {
          "Week 1": 0,
          "Week 2": 0,
          "Week 3": 0,
          "Week 4": 0,
        };

        const normalizedSelectedGroup = selectedGroup
          ? selectedGroup.trim().toLowerCase()
          : "";

        if (!normalizedSelectedGroup) {
          setData([
            { name: "Week 1", sales: 0 },
            { name: "Week 2", sales: 0 },
            { name: "Week 3", sales: 0 },
            { name: "Week 4", sales: 0 },
          ]);
          return;
        }

        for (const invoice of filteredInvoices) {
          const invoiceDate = new Date(invoice.invoiceDate);
          const day = invoiceDate.getDate();

          let week: keyof typeof weeklyData = "Week 1";
          if (day > 7 && day <= 14) week = "Week 2";
          else if (day > 14 && day <= 21) week = "Week 3";
          else if (day > 21) week = "Week 4";

          const items: RetailInvoiceItem[] =
            await getRetailInvoiceItemsByInvoiceId(
              invoice.retailInvoiceId
            );

          const groupTotal = items.reduce(
            (sum: number, item: RetailInvoiceItem) => {
              const itemGroup =
                medicineGroupMap.get(item.medicineId) || "";

              if (itemGroup !== normalizedSelectedGroup) return sum;

              return sum + item.quantity * item.price;
            },
            0
          );

          weeklyData[week] += groupTotal;
        }

        const formatted: SalesRecord[] = Object.keys(weeklyData).map(
          (key) => ({
            name: key,
            sales: weeklyData[key],
          })
        );

        setData(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSales();
  }, [selectedRange, selectedGroup]);

  return (
    <FormProvider {...methods}>
      <form>
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Sales Reports
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <DropdownField
                name="dateRange"
                label="Date Range"
                options={dateRanges.map((d) => ({
                  label: d,
                  value: d,
                }))}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <DropdownField
                name="medicineGroup"
                label="Medicine Group"
                options={groups.map((g) => ({
                  label: g.groupName,
                  value: g.groupName,
                }))}
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: "#fafafa",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                Sales Statistics
              </Typography>
            </Box>

            <Box sx={{ p: 2, height: 350, width: "100%", minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
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