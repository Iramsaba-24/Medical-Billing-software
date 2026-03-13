import { Box, Drawer, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import SettingsMenu from "./SettingsMenu";

const Setting = () => {

  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        width: "100%",
        flexDirection: { xs: "column", md: "row" },
        ml: { xs: 0, md: -3 },
      }}
    >

      {/* Mobile Header */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          alignItems: "center",
          px: 1,
          mt: 0,
          mb: -5
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <SettingsIcon />
        </IconButton>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        sx={{
          display: { xs: "block", md: "none" },
        }}
      >
        <Box sx={{ width: 260, p: 1, mt: 10 }}>
          <SettingsMenu closeDrawer={toggleDrawer} />
        </Box>
      </Drawer>

      {/* Desktop Sidebar */}
      <Box
        sx={{
          width: 260,
          display: { xs: "none", md: "block" },
        }}
      >
        <SettingsMenu />
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          mt: { xs: 1, md: 0 },
        }}
      >
        <Outlet />
      </Box>

    </Box>
  );
};

export default Setting;