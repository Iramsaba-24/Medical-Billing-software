import {
    Box,
    Button,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddMedicineGroup() {
    const navigate = useNavigate();

    const [groupName, setGroupName] = useState("");
    const [category, setCategory] = useState("Medicines");

    const handleSave = () => {
        const payload = {
            groupName,
            category,
        };

        console.log("SAVE GROUP:", payload);
       
    };

    return (
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

                <Box mb={3}>
                    <Typography fontSize={14} mb={0.5}>
                        Group Name
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Enter group name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                </Box>

                <Box mb={4}>
                    <Typography fontSize={14} mb={0.5}>
                        Category
                    </Typography>
                    <Select
                        fullWidth
                        size="small"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <MenuItem value="Medicines">Medicines</MenuItem>
                        <MenuItem value="Diabetes">Diabetes</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </Select>
                </Box>

                <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button
                        variant="outlined"
                        sx={{
                            minWidth: 100,
                            backgroundColor: "#fff",
                            color: "#238878",
                            border: "2px solid #238878",
                            borderRadius: "10px",
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            textTransform: "none",
                            transition: "all 0.25s ease",
                            "&:hover": {
                                backgroundColor: "#238878",
                                color: "#fff",
                                border: "2px solid #238878",
                                boxShadow: "0 6px 18px rgba(35, 136, 120, 0.35)",
                                transform: "translateY(-1px)",
                            },
                            "&:active": {
                                transform: "scale(0.98)",
                            },
                        }}
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        sx={{
                            minWidth: 100,
                            backgroundColor: "#238878",
                            color: "#fff",
                            border: "2px solid #238878",
                            borderRadius: "10px",
                            fontWeight: 600,
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
                            "&:active": {
                                transform: "scale(0.98)",
                            },
                        }}
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
