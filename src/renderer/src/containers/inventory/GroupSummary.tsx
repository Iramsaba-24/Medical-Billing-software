import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";

type GroupSummaryProps = {
  id: number;
  groupName: string;
  category: string;
  itemCount: number;
};
const GroupSummary = () => {
    const [groups, setGroups] = useState<GroupSummaryProps[]>([]);

    useEffect(() => {
        const storedGroups = JSON.parse(localStorage.getItem("medicineGroups") || "[]");
        setGroups(storedGroups.slice(-3));
    }, []);


  return (
    <>
     <Paper sx={{ px: 3, py:1, borderRadius: 2 }}>
      <Box display="flex" flexDirection="column" gap={2}>
        {groups.map((group) => (
          <Box
            key={group.id}
            display="flex"
            justifyContent="space-between"
            borderBottom="1px solid #eee"
            pb={1}
          >
            <Typography>{group.groupName}</Typography>
            <Typography>{group.itemCount}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
    </>
  )
}

export default GroupSummary