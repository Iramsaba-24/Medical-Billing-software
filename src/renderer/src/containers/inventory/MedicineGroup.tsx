import { Box, Button, Paper, Typography, Dialog,DialogTitle, DialogContent,DialogActions,TextField,MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UniversalTable, Column, ACTION_KEY,
} from "@/components/uncontrolled/UniversalTable";
import { useEffect, useState } from "react";
import { showConfirmation, showSnackbar,
} from "@/components/uncontrolled/ToastMessage";
import { URL_PATH } from "@/constants/UrlPath";

type MedicineGroupRow = {
  id: number;
  groupName: string;
  category: string;
  count: string;
};

const MedicineGroup = () => {
  const [medicineGroups, setMedicineGroups] = useState<MedicineGroupRow[]>([]);
  const [editGroup, setEditGroup] = useState<MedicineGroupRow | null>(null);

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

  const handleUpdate = () => {
    if (!editGroup) return;

    const updated = medicineGroups.map((g) =>
      g.id === editGroup.id ? editGroup : g
    );

    saveGroups(updated);
    showSnackbar("success", "Group updated successfully");
    setEditGroup(null);
  };

  const columns: Column<MedicineGroupRow>[] = [
    { key: "groupName", label: "Group Name" },
    { key: "category", label: "Category" },
    { key: "count", label: "No of items",
      render: (row) => <Typography>{row.count}</Typography>,
    },
    { key: ACTION_KEY, label: "Action", },
  ];

  return (
    <>
      {/* 🔹 Back to Home Button - Right side, Paper chya baher */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
  <Button
    variant="contained"
    onClick={() => navigate(URL_PATH.Inventory)}
    sx={{
      mr: 5,   //  he important
      backgroundColor: "#238878",
      color: "#fff",
      textTransform: "none",
      border: "2px solid #238878",
      "&:hover": {
        backgroundColor: "#fff",
        color: "#238878",
        border: "2px solid #238878",
      },
    }}
  >
     Back to Home
  </Button>
</Box>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography fontWeight={600}>
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
            view: (row) =>
              navigate(`/medicine-groups/${row.groupName}`),

            edit: (row) => setEditGroup(row),

            delete: async (row) => {
              const ok = await showConfirmation(
                "Delete this group?",
                "Confirm"
              );
              if (ok) {
                saveGroups(
                  medicineGroups.filter((g) => g.id !== row.id)
                );
                showSnackbar(
                  "success",
                  "Group deleted successfully"
                );
              }
            },
          }}
        />
      </Paper>

      {/* 🔹 EDIT DIALOG */}
      <Dialog
        open={!!editGroup}
        onClose={() => setEditGroup(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Medicine Group</DialogTitle>

        <DialogContent>
          {editGroup && (
            <Box display="flex" flexDirection="column" gap={3} mt={1}>
              <TextField
                label="Group Name"
                fullWidth
                value={editGroup.groupName}
                onChange={(e) =>
                  setEditGroup({
                    ...editGroup,
                    groupName: e.target.value,
                  })
                }
              />

              <TextField
                select
                label="Category"
                fullWidth
                value={editGroup.category}
                onChange={(e) =>
                  setEditGroup({
                    ...editGroup,
                    category: e.target.value,
                  })
                }
              >
                <MenuItem value="Medicines">Medicines</MenuItem>
                <MenuItem value="Equipment">Equipment</MenuItem>
                <MenuItem value="Supplies">Supplies</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setEditGroup(null)}
            variant="contained"
            sx={{
              backgroundColor: "#238878",
              color: "#fff",
              textTransform: "none",
              border: "2px solid #238878",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleUpdate}
            variant="contained"
            sx={{
              backgroundColor: "#238878",
              color: "#fff",
              textTransform: "none",
              border: "2px solid #238878",
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MedicineGroup;