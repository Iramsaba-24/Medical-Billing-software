import { useState, useEffect } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import DropdownField from "@/components/controlled/DropdownField";
import EmailField from "@/components/controlled/EmailField";
import NumericField from "@/components/controlled/NumericField";
import { Add, Remove } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";


type MedicineRow = {
    medicineId: string;
    medicineRowId: number;
    strengthType: string;
    qty: string;
};

type ReorderFormValues = {
    distributor: string;
    email: string;
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





function ReorderForm() {

    const navigate = useNavigate();
    const methods = useForm<ReorderFormValues>({
        defaultValues: {
            distributor: "",
            email: "",
        },
        mode: "onChange",
    });

    const [medicineRows, setMedicineRows] = useState<MedicineRow[]>([
        { medicineRowId: Date.now(), medicineId: "", strengthType: "", qty: "" },
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

    const handleAddRow = () => {
        setMedicineRows((prev) => [
            ...prev,
            { medicineRowId: Date.now(), medicineId: "", strengthType: "", qty: "" },
        ]);
    };


    const handleRemoveRow = (id: number) => {
        setMedicineRows((prev) =>
            prev.filter((row) => row.medicineRowId !== id)
        );
    };

  const handleReorder = methods.handleSubmit((data) => {
    console.log("Reorder submitted:", { ...data, medicineRows });

    navigate(URL_PATH.ReorderEmail, {
        state: {
            distributor: data.distributor,
            email: data.email,
            medicines: medicineRows,
        },
    });
});



    return (
        <FormProvider {...methods}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: { xs: 1, md: 2 } }}>

                {/*Reorder Section */}
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

                    {/* Distributor & Email */}
                    <Box display="flex" flexDirection="column" gap={2} mb={2}>

                        {/* Distributor */}
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

                        {/* Email */}
                        <Box display="flex" alignItems="center" gap={2}>
                            <Typography sx={{ width: 120 }} fontWeight={600} fontSize={15}>
                                Email
                            </Typography>

                            <Box sx={{ width: 260, mt: 2 }}>
                                <EmailField name="email" label="" />
                            </Box>
                        </Box>

                    </Box>

                    <Box ml={165}>
                        <Button
                            startIcon={<Add />}
                            onClick={handleAddRow}
                            sx={{ color: "#248a76", fontWeight: "bold" }}
                        >
                            ADD ITEM
                        </Button></Box>

                    {/* Medicine rows header */}
                    <Box
                        display="flex"
                        gap={2}
                        mb={1}
                        sx={{ display: { xs: "none", md: "flex" } }}>


                        <Typography fontWeight={600} fontSize={15} sx={{ flex: 2 }}>
                            Medicine Name
                        </Typography>
                        <Typography fontWeight={600} fontSize={15} sx={{ flex: 2 }}>
                            Strength / Type
                        </Typography>
                        <Typography fontWeight={600} fontSize={15} sx={{ flex: 1 }}>
                            Qty.
                        </Typography>
                        <Box sx={{ minWidth: 88 }} />
                    </Box>

                    {/* Medicine rows */}
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
                                    options={medicineOptions}
                                    placeholder="Select Medicine"
                                    sx={{ "& .MuiFormHelperText-root": { mb: 0 } }}
                                />
                            </Box>

                            <Box sx={{ flex: 2, minWidth: { xs: "100%", md: "unset" } }}>
                                <DropdownField
                                    name={`strength_${row.medicineRowId}`}
                                    label=""
                                    options={strengthOptions}
                                    placeholder="Select Strength"
                                    sx={{ "& .MuiFormHelperText-root": { mb: 0 } }}/>
                            </Box>

                            <Box sx={{ flex: 1, minWidth: { xs: "100%", md: "unset" } }}>
                                <NumericField
                                    name={`qty_${row.medicineRowId}`}
                                    label=""
                                    min={1}
                                    max={9999}/>
                            </Box>


                            <Box
                                sx={{
                                    minWidth: 88,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}>
                                {/* Remove Button */}
                                {medicineRows.length > 1 && (
                                    <IconButton
                                        onClick={() => handleRemoveRow(row.medicineRowId)}
                                        color="error">
                                        <Remove />
                                    </IconButton>
                                )}

                            </Box>
                        </Box>
                    ))}

                    {/* Reorder button */}
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button sx={reorderButtonSx} onClick={handleReorder}>
                            Reorder
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </FormProvider>
    );
}

export default ReorderForm;