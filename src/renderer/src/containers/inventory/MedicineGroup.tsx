import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UniversalTable, Column, ACTION_KEY } from "@/components/uncontrolled/UniversalTable";
import { useEffect, useState } from "react";
import { showConfirmation, showSnackbar } from "@/components/uncontrolled/ToastMessage";
import { URL_PATH } from "@/constants/UrlPath";

type MedicineGroupRow = {
  id: number;
  groupName: string;
  category: string;
  count: string;
};

const MedicineGroup = () => {
  const [medicineGroups, setMedicineGroups] = useState<MedicineGroupRow[]>([]);

  const navigate = useNavigate();

 useEffect(() => {
  const groups = JSON.parse(
    localStorage.getItem("medicineGroups") || "[]"
  );

  const inventory = JSON.parse(
    localStorage.getItem("inventory") || "[]"
  );

  const updatedGroups = groups.map(
    (group: { id: number; groupName: string; category: string }) => {
      const count = inventory.filter(
        (item: { medicineGroup: string }) =>
          item.medicineGroup === group.groupName
      ).length;

      return {
        ...group,
        count: count.toString(),
      };
    }
  );

  setMedicineGroups(updatedGroups);
}, []);

  const saveGroups = (updated: MedicineGroupRow[]) => {
    localStorage.setItem("medicineGroups", JSON.stringify(updated));
    setMedicineGroups(updated);
  };

  const columns: Column<MedicineGroupRow>[] = [
  { key: "groupName", label: "Group Name" },
  { key: "category", label: "Category",},
  { key: "count", label: "No of items",
    render: (row) => (
      <Typography>{row.count}</Typography>
    ),
  },
  { key: ACTION_KEY,  label: "Action",
  },
];

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography
          fontWeight={600}
          display="flex"
          alignItems="center"
          gap={1}
        >
          Medicine Groups
        </Typography>

        <Button
          onClick={() => navigate(URL_PATH.AddMedicineGroup)}
          sx={{
            backgroundColor: "#238878",
            color: "#fff",
            textTransform: "none",
            px: 2,
            "&:hover": {
              backgroundColor: "#1f7669",
            },
          }}
        >
          + Add New Group
        </Button>
      </Box>

      <UniversalTable<MedicineGroupRow>
        data={medicineGroups}
        columns={columns}
        tableSize="small"
        rowsPerPage={5}
        actions={{
          view: (row) => navigate(`/medicine-groups/${row.groupName}`),
          delete: async (row) => {
            const ok = await showConfirmation("Delete this group?", "Confirm");
            if (ok) {
              saveGroups(medicineGroups.filter((g) => g.id !== row.id));
              showSnackbar("success", "Group deleted successfully");
            }
        }
      }}
      />
    </Paper>
  );
}
export default  MedicineGroup;
