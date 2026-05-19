import DropdownField from "@/components/controlled/DropdownField";
import TextInputField from "@/components/controlled/TextInputField";
import { URL_PATH } from "@/constants/UrlPath";
import { Box, Button, Paper, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { addMedicineGroup } from "@/service/medicineGroupService";
import { useAutoSave } from "@/hooks/Useautosave";
export interface AddMedicineGroupFormValues {
  groupId: number;
  groupName: string;
  category: string;
}

const AddMedicineGroup = () => {
  const methods = useForm<AddMedicineGroupFormValues>({
    defaultValues: {
      groupName: "",
      category: "",
    },
    mode: "onChange",
  });

  const { clearData } = useAutoSave({
    storageKey: "add_medicine_group_form",
    methods,
  });

  const navigate = useNavigate();

  const onSubmit = async (data: AddMedicineGroupFormValues) => {
    try {
      await addMedicineGroup({
        groupName: data.groupName,
        category: data.category,
      });

      clearData();
      navigate(URL_PATH.MedicineGroup);
    } catch (error) {
      console.error(error);
    }
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
              mb: { xs: 1, md: 4 },
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
                inputType="string"
                maxLength={20}
                minLength={3}
                rows={1}
                rules={{
                  required: "Group name is required",
                }}
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
                editable={true}
                freeSolo={false}
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
                onClick={() => {
                  clearData();
                  navigate(-1);
                }}
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
};

export default AddMedicineGroup;
