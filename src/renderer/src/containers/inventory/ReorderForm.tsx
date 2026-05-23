import { useState, useEffect, useMemo } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import DropdownField from "@/components/controlled/DropdownField";
import EmailField from "@/components/controlled/EmailField";
import NumericField from "@/components/controlled/NumericField";
import { useNavigate, useLocation } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import {getDistributors,type DistributorResponse,} from "@/service/distributorService";

type MedicineRow = {
  medicineId: string;
  medicineRowId: number;
  strengthType: string;
  qty: string;
};

type ReorderFormValues = {
  distributor: string;
  email: string;
  [key: string]: string | number;
};

type IncomingMedicine = {
  id: number;
  supplier: string;
  medicineName: string;
  strengthType: string;
  quantity: string;
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

function ReorderForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const incomingMedicines = useMemo<IncomingMedicine[]>(() => {
    const s = location.state as { medicines?: IncomingMedicine[] } | undefined;
    return s?.medicines ?? [];
  }, [location.state]);
  const [distributorOptions, setDistributorOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [distributors, setDistributors] = useState<DistributorResponse[]>([]);
  const [medicineRows, setMedicineRows] = useState<MedicineRow[]>([]);

  const methods = useForm<ReorderFormValues>({
    defaultValues: { distributor: "", email: "" },
    mode: "onChange",
  });

  const selectedDistributor = methods.watch("distributor");
  const fetchDistributorData = async () => {
    try {
      const data = await getDistributors();
      setDistributors(data);
      setDistributorOptions(
        data.map((item) => ({
          label: item.companyName,
          value: item.companyName,
        })),
      );
    } catch (error) {
      console.error("Distributor fetch failed:", error);
    }
  };

  useEffect(() => {
    if (!selectedDistributor) return;
    const selected = distributors.find(
      (item) => item.companyName === selectedDistributor,
    );
    if (selected) methods.setValue("email", selected.email);
  }, [selectedDistributor, distributors, methods]);

  useEffect(() => {
    fetchDistributorData();

    if (incomingMedicines.length > 0) {
      const mappedRows: MedicineRow[] = incomingMedicines.map((item) => ({
        medicineRowId: item.id,
        medicineId: item.medicineName,
        strengthType: item.strengthType,
        qty: item.quantity,
      }));

      setMedicineRows(mappedRows);
      methods.setValue("distributor", incomingMedicines[0].supplier);

      setTimeout(() => {
        mappedRows.forEach((row) => {
          methods.setValue(`medicine_${row.medicineRowId}`, row.medicineId);
          methods.setValue(`strength_${row.medicineRowId}`, row.strengthType);
          methods.setValue(`qty_${row.medicineRowId}`, Number(row.qty));
        });
      }, 0);
    }
  }, [incomingMedicines]);

const handleReorder = methods.handleSubmit((data) => {
  const updatedMedicines = medicineRows.map((row) => ({
    medicineRowId: row.medicineRowId,
    medicineName: row.medicineId,  
    strengthType: row.strengthType,
    qty: String(data[`qty_${row.medicineRowId}`] || row.qty),
  }));

  navigate(URL_PATH.ReorderEmail, {
    state: {
      distributor: data.distributor,
      email: data.email,
      medicines: updatedMedicines,
      orderType: "reorder",
    },
  });
});

  return (
    <FormProvider {...methods}>
      <form noValidate>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          p: { xs: 1, md: 2 },
        }}
      >
        <Paper
          elevation={2}
          sx={{
            borderRadius: 2,
            border: "1.5px solid #238878",
            p: { xs: 2, md: 3 },
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography
              fontWeight={700}
              fontSize={{ xs: 14, md: 20 }}
              color="#238878"
            >
              Reorder
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" gap={2} mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography sx={{ width: 120 }} fontWeight={600} fontSize={15}>
                Distributor
              </Typography>
              <Box sx={{ width: 260, mt: 3 }}>
                <DropdownField
                  name="distributor"
                  label=""
                  options={distributorOptions}
                  required
                />
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography sx={{ width: 120 }} fontWeight={600} fontSize={15}>
                Email
              </Typography>
              <Box sx={{ width: 260, mt: 2 }}>
                <EmailField name="email" label="" />
              </Box>
            </Box>
          </Box>

          {medicineRows.map((row, index) => (
            <Box
              key={row.medicineRowId}
              display="flex"
              flexDirection={{ xs: "column", md: "row" }}
              gap={2}
              mb={1.5}
              alignItems="center"
            >
              <Box sx={{ flex: 2, minWidth: { xs: "100%", md: "unset" } }}>
                <DropdownField
                  name={`medicine_${row.medicineRowId}`}
                  label={index === 0 ? "" : ""}
                  options={[{ label: row.medicineId, value: row.medicineId }]}
                  placeholder="Select Medicine"
                  sx={{ "& .MuiFormHelperText-root": { mb: 0 } }}
                />
              </Box>

              <Box sx={{ flex: 2, minWidth: { xs: "100%", md: "unset" } }}>
                <DropdownField
                  name={`strength_${row.medicineRowId}`}
                  label=""
                  options={[
                    { label: row.strengthType, value: row.strengthType },
                  ]}
                  placeholder="Select Strength"
                  sx={{ "& .MuiFormHelperText-root": { mb: 0 } }}
                />
              </Box>

              <Box sx={{ flex: 1, minWidth: { xs: "100%", md: "unset" } }}>
                <NumericField
                  name={`qty_${row.medicineRowId}`}
                  label="qty"
                  min={1}
                  max={9999}
                />
              </Box>
            </Box>
          ))}
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button
              variant="outlined"
              sx={{
                ...reorderButtonSx,
                backgroundColor: "#fff",
                color: "#238878",
              }}
              onClick={() => navigate(URL_PATH.Reorder)}
            >
              Order History
            </Button>
            <Button sx={reorderButtonSx} onClick={handleReorder}>
              Reorder
            </Button>
          </Box>
        </Paper>
      </Box>
      </form>
    </FormProvider>
  );
}

export default ReorderForm;
