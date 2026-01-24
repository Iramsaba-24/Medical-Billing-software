import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UniversalTable, Column } from "@/components/uncontrolled/UniversalTable";


type MedicineGroupRow = {
  id: number;
  name: string;
  count: string;
};

const medicineGroups: MedicineGroupRow[] = [
  { id: 1, name: "Generic Medicines", count: "02" },
  { id: 2, name: "Diabetes", count: "32" },
  { id: 3, name: "Other", count: "01" },
];

const columns: Column<MedicineGroupRow>[] = [
  {
    key: "name",
    label: "Group Name",
  },
  {
    key: "count",
    label: "No of Medicines",
    render: (row) => (
      <Typography align="center">{row.count}</Typography>
    ),
  },
  {
    key: "actionbutton",
    label: "Action",
    render: () => null, 
  },
];

export default function MedicineGroup() {
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 2, borderRadius: 2 }}>
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
          <Chip label={medicineGroups.length} size="small" />
        </Typography>

        <Button
          size="small"
          onClick={() => navigate("/inventory/add-medicine-group")}
          sx={{
            backgroundColor: "#238878",
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "6px",
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
        caption={null}
        tableSize="small"
        rowsPerPage={5}
        actions={{
          view: (row) => navigate(`/medicine-groups/${row.id}`),
        }}
        getRowId={(row) => row.id}
        paperSx={{
          boxShadow: "none",
          borderRadius: 1,
        }}
        headerSx={{
          textAlign: "center",
        }}
      />
    </Paper>
  );
}
