import {Box,Button,List,ListItemButton,ListItemIcon,ListItemText,Paper,Typography,Drawer,IconButton,} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
// import GroupIcon from "@mui/icons-material/Group";
import DescriptionIcon from "@mui/icons-material/Description";
import AssessmentIcon from "@mui/icons-material/Assessment";

import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { URL_PATH } from "../../constants/UrlPath";
import { useState } from "react";

const Setting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);

  const menuItems = [
    {
      text: "General",
      icon: <SettingsIcon fontSize="small" />,
      path: URL_PATH.GeneralSettings,
    },
    {
      text: "Pharmacy Profile",
      icon: <LocalPharmacyIcon fontSize="small" />,
      path: URL_PATH.PharmacyProfile,
    },
    {
      text: "Dashboard Settings",
      icon: <DashboardIcon fontSize="small" />,
      path: URL_PATH.DashboardSettings,
    },
    // {
    //   text: "Customer Settings",
    //   icon: <GroupIcon fontSize="small" />,
    //   path: URL_PATH.CustomerSettings,
    // },
    // {
    //   text: "Doctors Settings",
    //   icon: <SettingsIcon fontSize="small" />,
    //   path: URL_PATH.DoctorSettings,
    // },
    {
      text: "Distributors Settings",
      icon: <SettingsIcon fontSize="small" />,
      path: URL_PATH.DistributorsSetting,
    },
    {
      text: "Inventory Settings",
      icon: <InventoryIcon fontSize="small" />,
      path: URL_PATH.InventorySettings,
    },
    {
      text: "Invoice Settings",
      icon: <DescriptionIcon fontSize="small" />,
      path: URL_PATH.InvoiceSetting,
    },
    {
      text: "Report Settings",
      icon: <AssessmentIcon fontSize="small" />,
      path: URL_PATH.ReportSettings,
    },
  ];

  const menuContent = (
    <>
      {/* Sidebar Header (Desktop only) */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          borderRadius: 3,
          gap: 1,
          p: 2,
          mb: 1,
          backgroundColor: "#D9D9D9",
        }}
      >
        <SettingsIcon />
        <Typography fontWeight={600}>Settings</Typography>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        <List sx={{ p: 0 }}>
          {menuItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <ListItemButton
                key={item.text}
                onClick={() => {
                  navigate(item.path);
                  setOpen(false);
                }}
                sx={{
                  py: 1.2,
                  px: 2,
                  borderBottom: "1px solid #eee",
                  backgroundColor: "#D9D9D9",
                  color: active ? "#238878" : "black",
                  transition: "0.2s",

                  "&:hover": {
                    color: "#238878",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 35,
                    color: active ? "#238878" : "black",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Paper>

      {/* Back Button */}
      <Button
        variant="contained"
        onClick={() => navigate("/dashboard")}
        sx={{
          mt: 2,
          width: "100%",
          backgroundColor: "#D9D9D9",
          color: "black",
          boxShadow: "none",

          "&:hover": {
            backgroundColor: "#238878",
            color: "#fff",
            boxShadow: "none",
          },
        }}
      >
        ↑ Back
      </Button>
    </>
  );

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
          gap: 1,
          px: 1,
          mt: 0,
          mb:-5
        }}
      >
        <IconButton onClick={toggleDrawer} >
          <MenuIcon />
        </IconButton>

        <Typography fontWeight={600} sx={{ fontSize: "1.2rem" }}>Settings</Typography>
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
        <Box sx={{ width: 260, p: 2 ,mt:10}}>{menuContent}</Box>
      </Drawer>

      {/* Desktop Sidebar */}
      <Box
        sx={{
          width: 260,
          display: { xs: "none", md: "block" },
        }}
      >
        {menuContent}
      </Box>

      {/* Content Area */}
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
