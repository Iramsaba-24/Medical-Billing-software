import { useState, useEffect } from "react";
import { Box, Button, Divider, IconButton, Paper, Typography } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { FormProvider, useForm } from "react-hook-form";
import DropdownField from "@/components/controlled/DropdownField";
import EmailField from "@/components/controlled/EmailField";
import NumericField from "@/components/controlled/NumericField";
import { UniversalTable, ACTION_KEY, type Column } from "@/components/uncontrolled/UniversalTable";
import { iconMap } from "@/utils/Icons";
import TextInputField from "@/components/controlled/TextInputField";

type MedicineRow = {
  medicineRowId: number;
  medicineId: string;
  strengthType: string;
  companyName: string;
  qty: number | "";
};

type ReorderFormValues = {
  distributor: string;
  email: string;
};

type StockRow = {
  id: number;
  supplier: string;
  medicineName: string;
  strengthType: string;
  quantity: string;
  [ACTION_KEY]: string;
};





const reorderButtonSx = {
  backgroundColor: "#238878",
  color: "#fff",
  border: "2px solid #238878",
  textTransform: "none",
  minWidth: "100px",
  height: "36px",
  "&:hover": {
    backgroundColor: "#fff",
    color: "#238878",
    border: "2px solid #238878",
  },
};



const distributorOptions = [
  { label: "PharmaCare Ltd.", value: "pharmacare" },
  { label: "MedEquip Inc.", value: "medequip" },
  { label: "HealthSupply Co.", value: "healthsupply" },
];

const medicineOptions = [
  { label: "Paracetamol", value: "paracetamol" },
  { label: "Cough Syrup", value: "cough_syrup" },
  { label: "Amoxicillin", value: "amoxicillin" },
];

const strengthOptions = [
  { label: "500mg", value: "500mg" },
  { label: "Standard", value: "standard" },
  { label: "250mg", value: "250mg" },
];

const lowStockData: StockRow[] = [
  {
    id: 1,
    supplier: "PharmaCare Ltd.",
    medicineName: "Paracetamol",
    strengthType: "500mg",
    quantity: "05",
    [ACTION_KEY]: "",
  },
  {
    id: 2,
    supplier: "MedEquip Inc.",
    medicineName: "Cough Syrup",
    strengthType: "Standard",
    quantity: "10",
    [ACTION_KEY]: "",
  },
];

const lastPurchaseData: StockRow[] = [
  {
    id: 1,
    supplier: "PharmaCare Ltd.",
    medicineName: "Paracetamol",
    strengthType: "500mg",
    quantity: "05",
    [ACTION_KEY]: "",
  },
  {
    id: 2,
    supplier: "MedEquip Inc.",
    medicineName: "Cough Syrup",
    strengthType: "Standard",
    quantity: "10",
    [ACTION_KEY]: "",
  },
];



const companyOptions = [
  { label: "PharmaCare Ltd.", value: "pharmacare_ltd" },
  { label: "MedEquip Inc.", value: "medequip_inc" },
  { label: "HealthSupply Co.", value: "healthsupply_co" },
];


const stockColumns: Column<StockRow>[] = [
  { key: "supplier", label: "Supplier" },
  { key: "medicineName", label: "Medicine Name" },
  { key: "strengthType", label: "Strength/Type" },
  { key: "quantity", label: "Quantity" },
  { key: ACTION_KEY, label: "Action" },
];



function ReorderForm() {
  const methods = useForm<ReorderFormValues>({
    defaultValues: {
      distributor: "",
      email: "",
    },
    mode: "onChange",
  });

  const [medicineRows, setMedicineRows] = useState<MedicineRow[]>([
    { medicineRowId: Date.now(), medicineId: "", strengthType: "", companyName: "", qty: 1 },
  ]);

  const selectedDistributor = methods.watch("distributor");

  useEffect(() => {
    const emailMap: Record<string, string> = {
      pharmacare: "contact@pharmacare.com",
      medequip: "orders@medequip.com",
      healthsupply: "info@healthsupply.com",
    };
    if (selectedDistributor && emailMap[selectedDistributor]) {
      methods.setValue("email", emailMap[selectedDistributor]);
    }
  }, [selectedDistributor, methods]);

 
  const addRow = () =>
    setMedicineRows((prev) => [
      ...prev,
      { medicineRowId: Date.now(), medicineId: "", strengthType: "", companyName: "", qty: 1 },
    ]);

  const removeRow = (id: number) =>
    setMedicineRows((prev) => prev.filter((r) => r.medicineRowId !== id));

  const updateRow = (id: number, field: keyof MedicineRow, value: string | number) => {
    setMedicineRows((prev) =>
      prev.map((r) => {
        if (r.medicineRowId === id) {
          if (field === "qty" && value !== "" && Number(value) < 0) return r;
          return { ...r, [field]: value };
        }
        return r;
      })
    );
  };

  const handleReorder = methods.handleSubmit((data) => {
    console.log("Reorder submitted:", { ...data, medicineRows });
   
  });

  const tableActions: Partial<Record<keyof typeof iconMap, (row: StockRow) => void>> = {
    view: (row: StockRow) => console.log("View", row),
    delete: (row: StockRow) => console.log("Delete", row),
  };

  return (
    <FormProvider {...methods}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: { xs: 1, md: 2 } }}>

        {/*  Outerpaper*/}
        <Paper elevation={3} sx={{ borderRadius: 2, p: { xs: 1.5, md: 2.5 }, display: "flex", flexDirection: "column", gap: 2 }}>

          {/*  ReorderPaper*/}
          <Paper
            elevation={1}
            sx={{
              borderRadius: 2,
              border: "1.5px solid #238878",
              p: { xs: 2, md: 3 },
            }}
          >
            <Box display="flex" justifyContent="space-between" mb={2} alignItems="center">
              <Typography fontWeight={700} fontSize={{ xs: 14, md: 16 }} color="#238878">
                Reorder
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Distributor & Email */}
            <Box display="flex" flexDirection="column" gap={1.5} mb={1}>
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                gap={2}
              >
                <Typography fontSize={13} fontWeight={500} sx={{ minWidth: 160, color: "text.primary" }}>
                  Distributor / Company
                </Typography>
                <Box sx={{ width: { xs: "100%", sm: 260 } }}>
                  <DropdownField name="distributor" label="" options={distributorOptions} required />
                </Box>
              </Box>

              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                gap={2}
              >
                <Typography fontSize={13} fontWeight={500} sx={{ minWidth: 160, color: "text.primary" }}>
                  Email Address
                </Typography>
                <Box sx={{ width: { xs: "100%", sm: 260 } }}>
                  <EmailField name="email" label="" />
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* existing medicine Paper*/}
          <Paper
            elevation={1}
            sx={{
              borderRadius: 2,
              border: "1.5px solid #238878",
              p: { xs: 2, md: 3 },
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography fontWeight={700} fontSize={{ xs: 14, md: 16 }} color="#238878">
                Existing Medicine Details
              </Typography>
              <Button startIcon={<Add />} onClick={addRow} sx={{ color: "#248a76", fontWeight: "bold" }}>
                ADD ITEM
              </Button>
            </Box>

     
            {/* Medicine rows */}
            {medicineRows.map((row) => (
              <Box
                key={row.medicineRowId}
                sx={{
                  display: "grid",
                  gridTemplateColumns: { md: "3fr 3fr 3fr 1.5fr 50px", xs: "1fr" },
                  gap: 2,
                  mb: { xs: 4, md: 2 },
                  alignItems: "start",
                }}
              >
                <DropdownField
                  name={`medicine_${row.medicineRowId}`}
                  label="Medicine Name"
                  options={medicineOptions}
                  placeholder="Select Medicine"
                  onChangeCallback={(value) => updateRow(row.medicineRowId, "medicineId", value)}
                />
                <DropdownField
                  name={`strength_${row.medicineRowId}`}
                  label="Strength / Type"
                  options={strengthOptions}
                  placeholder="Select Strength"
                  onChangeCallback={(value) => updateRow(row.medicineRowId, "strengthType", value)}
                />
                <DropdownField
                  name={`company_${row.medicineRowId}`}
                  label="Company Name"
                  options={companyOptions}
                  placeholder="Select Company"
                  onChangeCallback={(value) => updateRow(row.medicineRowId, "companyName", value)}
                />
                <NumericField name={`qty_${row.medicineRowId}`} label="Qty" min={1} max={9999} />
                <Box display="flex" justifyContent="center">
                  {medicineRows.length > 1 && (
                    <IconButton onClick={() => removeRow(row.medicineRowId)} color="error">
                      <Remove />
                    </IconButton>
                  )}
                </Box>
              </Box>
            ))}

          </Paper>


{/*new medicine paper */}
          
<Paper
  elevation={1}
  sx={{
    borderRadius: 2,
    border: "1.5px solid #238878",
    p: { xs: 2, md: 3 },
  }}
>
  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
    <Typography fontWeight={700} fontSize={{ xs: 14, md: 16 }} color="#238878">
      New Medicine Details
    </Typography>
    <Button
      startIcon={<Add />}
      onClick={addRow}
      sx={{ color: "#248a76", fontWeight: "bold" }}
    >
      ADD ITEM
    </Button>
  </Box>

  
  {/* Rows */}
  {medicineRows.map((row) => (
    <Box
      key={row.medicineRowId}
      sx={{
        display: "grid",
        gridTemplateColumns: { md: "3fr 3fr 3fr 1.5fr", xs: "1fr" },
        gap: 2,
        mb: { xs: 4, md: 2 },
      }}
    >
      <TextInputField
        name={`manual_medicine_${row.medicineRowId}`}
        label="Medicine Name"
        placeholder="Enter Medicine"
      />

      <TextInputField
        name={`manual_strength_${row.medicineRowId}`}
        label="Strength / Type"
        placeholder="Enter Strength"
      />

      <NumericField
        name={`manual_qty_${row.medicineRowId}`}
        label="Qty"
        min={1}
        max={9999}
      />
    </Box>
  ))}

  <Box display="flex" justifyContent="flex-end" mt={2}>
    <Button sx={reorderButtonSx} onClick={handleReorder}>
      Reorder
    </Button>
  </Box>
</Paper>

        </Paper>
        

        <Paper elevation={2} sx={{ borderRadius: 2, p: { xs: 1, md: 2 } }}>
          <Typography fontWeight={700} fontSize={{ xs: 13, md: 15 }} mb={1.5}>
            Low Stock List
          </Typography>
          <UniversalTable
            data={lowStockData}
            columns={stockColumns}
            getRowId={(row) => row.id}
            actions={tableActions}
            tableSize="small"
            rowsPerPage={5}
            paperSx={{ boxShadow: 0 }}
          />
        </Paper>

       
        <Paper elevation={2} sx={{ borderRadius: 2, p: { xs: 1, md: 2 } }}>
          <Typography fontWeight={700} fontSize={{ xs: 13, md: 15 }} mb={1.5}>
            Last Purchase
          </Typography>
          <UniversalTable
            data={lastPurchaseData}
            columns={stockColumns}
            getRowId={(row) => row.id}
            actions={tableActions}
            tableSize="small"
            rowsPerPage={5}
            paperSx={{ boxShadow: 0 }}
          />
        </Paper>
      </Box>
    </FormProvider>
  );
}

export default ReorderForm;
