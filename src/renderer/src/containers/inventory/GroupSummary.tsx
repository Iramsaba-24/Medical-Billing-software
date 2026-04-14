import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getMedicineGroups } from "@/service/medicineGroupService";

type GroupSummaryProps = {
  groupId: number;
  groupName: string;
  category: string;
  // itemCount: number;
};
const GroupSummary = () => {
    const [groups, setGroups] = useState<GroupSummaryProps[]>([]);
    useEffect(() => {
    const fetchGroups = async () => {
    try {
      const res = await getMedicineGroups();
      // last 3 groups
          setGroups(res.slice(-3));
        } catch (err) {
          console.error(err);
        }
      };
      fetchGroups();
    }, []);
  return (
    <>
     <Paper sx={{ px: 3, py:1, borderRadius: 2 }}>
      <Box display="flex" flexDirection="column" gap={2}>
        {groups.map((group) => (
          <Box
            key={group.groupId}
            display="flex"
            justifyContent="space-between"
            borderBottom="1px solid #eee"
            pb={1}
          >
            <Typography>{group.groupName}</Typography>
            {/* <Typography>{group.itemCount}</Typography> */}
          </Box>
        ))}
      </Box>
    </Paper>
    </>
  )
}

export default GroupSummary