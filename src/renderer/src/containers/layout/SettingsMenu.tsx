import {
  Box,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography
} from "@mui/material";

import SettingsIcon from "@mui/icons-material/Settings";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import DescriptionIcon from "@mui/icons-material/Description";
import AssessmentIcon from "@mui/icons-material/Assessment";

import { useNavigate, useLocation } from "react-router-dom";
import { URL_PATH } from "../../constants/UrlPath";

const SettingsMenu = ({ closeDrawer }: { closeDrawer?: () => void }) => {

  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <>
      {/* Sidebar Header */}
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
                  closeDrawer?.();
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
};

export default SettingsMenu;