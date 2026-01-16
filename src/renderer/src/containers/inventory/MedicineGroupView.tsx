import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { UniversalTable, Column } from "@/components/uncontrolled/UniversalTable";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckIcon from "@mui/icons-material/Check";

type MedicineRow = {
  id: number;
  name: string;
  qty: string;
  isEditing?: boolean;
};

const medicineGroupData: Record<string, MedicineRow[]> = {
  "1": [
    { id: 1, name: "Paracetamol 500mg", qty: "22" },
    { id: 2, name: "Cough Syrup", qty: "08" },
  ],
  "2": [{ id: 3, name: "Insulin Injection", qty: "15" }],
  "3": [],
};

export default function MedicineGroupView() {
  const { id } = useParams();

  const [medicines, setMedicines] = useState<MedicineRow[]>(
    medicineGroupData[id ?? ""] || []
  );

  const handleAddMedicine = () => {
    setMedicines((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        qty: "",
        isEditing: true,
      },
    ]);
  };

  const handleChange = (
    rowId: number,
    field: keyof MedicineRow,
    value: string
  ) => {
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === rowId ? { ...m, [field]: value } : m
      )
    );
  };

  const handleSave = (rowId: number) => {
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === rowId ? { ...m, isEditing: false } : m
      )
    );
  };

  const handleEdit = (rowId: number) => {
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === rowId ? { ...m, isEditing: true } : m
      )
    );
  };

  const handleDelete = (row: MedicineRow) => {
    setMedicines((prev) => prev.filter((m) => m.id !== row.id));
  };

  const columns: Column<MedicineRow>[] = [
    {
      key: "name",
      label: "Item",
      render: (row) =>
        row.isEditing ? (
          <TextField
            size="small"
            value={row.name}
            placeholder="Medicine name"
            onChange={(e) =>
              handleChange(row.id, "name", e.target.value)
            }
          />
        ) : (
          row.name
        ),
    },
    {
      key: "qty",
      label: "Qty",
      render: (row) =>
        row.isEditing ? (
          <TextField
            size="small"
            value={row.qty}
            placeholder="Qty"
            sx={{ width: 80 }}
            onChange={(e) =>
              handleChange(row.id, "qty", e.target.value)
            }
          />
        ) : (
          <Typography align="center">{row.qty}</Typography>
        ),
    },
    {
      key: "actionbutton",
      label: "Action",
      render: (row) => (
        <Box display="flex" justifyContent="center" gap={1}>
          {row.isEditing ? (
            <IconButton
              size="small"
              color="success"
              onClick={() => handleSave(row.id)}
            >
              <CheckIcon fontSize="small" />
            </IconButton>
          ) : (
            <IconButton
              size="small"
              onClick={() => handleEdit(row.id)}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          )}

          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(row)}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Paper sx={{ p: 2, borderRadius: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography fontWeight={600}>
            Generic Medicines
          </Typography>

          <Button
            size="small"
            onClick={handleAddMedicine}
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
            + Add Medicine
          </Button>
        </Box>

        <UniversalTable<MedicineRow>
          data={medicines}
          columns={columns}
          caption={null}
          tableSize="small"
          rowsPerPage={5}
          getRowId={(row) => row.id}
          paperSx={{ boxShadow: "none" }}
        />
      </Paper>

      <Button
        startIcon={<DeleteOutlineIcon />}
        sx={{
          border: "1px solid #ff4d4f",
          color: "#ff4d4f",
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "6px",
          px: 2,
          "&:hover": {
            backgroundColor: "#fff5f5",
          },
        }}
      >
        Delete Group
      </Button>
    </>
  );
}
