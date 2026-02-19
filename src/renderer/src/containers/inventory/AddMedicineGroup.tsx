import DropdownField from "@/components/controlled/DropdownField";
import TextInputField from "@/components/controlled/TextInputField";
import { URL_PATH } from "@/constants/UrlPath";
import {
    Box,
    Button,
    Paper,
    Typography,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export interface AddMedicineGroupFormValues {
    id: number;
    groupName: string;
    category: string;
}

const AddMedicineGroup = () => {
    const methods = useForm<AddMedicineGroupFormValues>({
        defaultValues: {
            groupName: "",
            category: "",
        },
    });

    const navigate = useNavigate();

    const onSubmit = (data: AddMedicineGroupFormValues) => {
        const existingGroups = JSON.parse(
            localStorage.getItem("medicineGroups") || "[]"
        );

        const newGroup = {
            id: Date.now(),
            groupName: data.groupName,
            category: data.category,
        };

        localStorage.setItem(
            "medicineGroups",
            JSON.stringify([...existingGroups, newGroup])
        );
        navigate(URL_PATH.MedicineGroup);
    };


    return (
        <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <Box display="flex" justifyContent="center" mt={4}>
            <Paper
                elevation={3}
                sx={{
                    width: 520,
                    p: 3,
                    borderRadius: 2,
                }}
            >
                <Typography fontWeight={600} mb={3}>
                    Add New Group
                </Typography>

                    <Box display="flex" flexDirection="column" gap={3} mb={4}>  
                        <TextInputField 
                            name="groupName"
                            label="Group Name"
                            required
                            inputType="all"
                            rows={1}
                        />
                        <DropdownField
                        name="category"
                        label="Category"
                        placeholder="Category"
                        required
                        options={[
                            { label: "Medicines", value: "Medicines" },
                            { label: "Equipment", value: "Equipment" },
                            { label: "Supplies", value: "Supplies" },
                            { label: "Other", value: "Other" },
                        ]}
                        />
                    </Box>

                <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button
                        variant="outlined"
                        sx={{
                            minWidth: 100,
                            backgroundColor: "#fff",
                            color: "#238878",
                            border: "2px solid #238878",
                            fontSize: "0.95rem",
                            textTransform: "none",
                            transition: "all 0.25s ease",
                            "&:hover": {
                                backgroundColor: "#238878",
                                color: "#fff",
                                border: "2px solid #238878",
                                boxShadow: "0 6px 18px rgba(35, 136, 120, 0.35)",
                               
                            },
                    
                        }}
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>

                    <Button
                    type="submit"
                        variant="contained"
                        sx={{
                            minWidth: 100,
                            backgroundColor: "#238878",
                            color: "#fff",
                            border: "2px solid #238878",
                            fontSize: "0.95rem",
                            textTransform: "none",
                            transition: "all 0.25s ease",
                            "&:hover": {
                                backgroundColor: "#fff",
                                color: "#238878",
                                border: "2px solid #238878",
                                boxShadow: "0 6px 18px rgba(35, 136, 120, 0.35)",
                                transform: "translateY(-1px)",
                            },
                        }}
                    >
                        Save
                    </Button>
                </Box>
            </Paper>
        </Box>
        </form>
        </FormProvider>
    );
}

export default AddMedicineGroup;
