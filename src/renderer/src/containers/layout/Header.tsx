import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import RedoRoundedIcon from "@mui/icons-material/RedoRounded";
import { Home } from "@mui/icons-material";
import PaymentsIcon from "@mui/icons-material/Payments";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { URL_PATH } from "../../constants/UrlPath";
import LogoImage from "@/assets/icons.svg";
import { useEffect } from "react";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItem,
  styled,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";

const MINI_WIDTH = 90;
const FULL_WIDTH = 240;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#238878",
  zIndex: theme.zIndex.drawer + 1,
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const SearchBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: 20,
  padding: "4px 12px",
  width: "100%",
}));

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Billing", icon: <PaymentsIcon />, path: URL_PATH.Billing },
  { text: "Customers", icon: <PeopleIcon />, path: URL_PATH.Customer },
  { text: "Doctors", icon: <LocalHospitalIcon />, path: URL_PATH.Doctors },
  {
    text: "Distributors",
    icon: <LocalShippingIcon />,
    path: URL_PATH.DistributorsPage,
  },
  { text: "Inventory", icon: <Inventory2Icon />, path: URL_PATH.Inventory },
  { text: "Invoices", icon: <ReceiptLongIcon />, path: URL_PATH.Invoices },
  { text: "Reports", icon: <AssessmentIcon />, path: URL_PATH.ReportPage },
  { text: "Settings", icon: <SettingsIcon />, path: URL_PATH.Setting },
];

const Sidebar = ({ open }: { open: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // First check settings
      const savedSettings = localStorage.getItem("generalSettings");

      if (!savedSettings) return;

      try {
        const settings = JSON.parse(savedSettings);

        if (!settings.keyboardShortcuts) return;
      } catch (error) {
        console.error("Error parsing settings", error);
        return;
      }

      if (!event.ctrlKey) return;

      const key = event.key.toLowerCase();

      const shortcutMap: Record<string, string> = {
        b: URL_PATH.Billing,
        i: URL_PATH.Invoices,
        r: URL_PATH.ReportPage,
        c: URL_PATH.Customer,
      };

      if (shortcutMap[key]) {
        event.preventDefault();
        navigate(shortcutMap[key]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  return (
    <List sx={{ px: 1, mt: { xs: 6, md: 2 } }}>
      {menuItems.map((item) => {
        const isSettings = item.text === "Settings";
        const active = isSettings
          ? location.pathname.startsWith(item.path)
          : location.pathname === item.path;

        return (
          <Tooltip
            key={item.text}
            title={!open ? item.text : ""}
            placement="right"
            arrow
          >
            <ListItem disablePadding sx={{ mb: 2 }}>
              <Button
                fullWidth
                startIcon={item.icon}
                variant="contained"
                onClick={() => navigate(item.path)}
                sx={{
                  justifyContent: open ? "flex-start" : "center",
                  minHeight: 44,
                  px: open ? 4 : 0,
                  py: 2,
                  borderRadius: 2,
                  textTransform: "none",
                  background: active ? "#238878" : "#D9D9D9",
                  color: active ? "#fff" : "black",
                  "& .MuiButton-startIcon": {
                    margin: open ? "0 12px 0 0" : 0,
                  },
                  "&:hover": {
                    background: "#1FA38A",
                  },
                }}
              >
                {open && item.text}
              </Button>
            </ListItem>
          </Tooltip>
        );
      })}
    </List>
  );
};

const Header: React.FC = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const isSettingsPage = location.pathname.startsWith(URL_PATH.Setting);
  const [open, setOpen] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);

  const [pharmacyName, setPharmacyName] = React.useState(
    "ERP Billing Software",
  ); // NEW
  const [pharmacyLogo, setPharmacyLogo] = React.useState<string | null>(null); // NEW

  //Load pharmacy data
  useEffect(() => {
    const savedName = localStorage.getItem("pharmacyName");
    const savedLogo = localStorage.getItem("pharmacyLogo");

    if (savedName) {
      setPharmacyName(savedName);
    }

    if (savedLogo) {
      setPharmacyLogo(savedLogo);
    }
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <StyledAppBar position="fixed">
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
            minHeight: 64,
          }}
        >
          <IconButton color="inherit" onClick={() => setOpen(!open)}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Typography
              sx={{
                fontSize: { xs: 16, md: 22 },
                mr: 1,
              }}
            >
              {pharmacyName}
            </Typography>
            <img
              src={pharmacyLogo || LogoImage}
              alt="logo"
              style={{ width: 50 }}
            />
          </Box>

          <Home
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(URL_PATH.Landing)}
          />

          <Box
            sx={{
              width: { xs: "100%", md: "auto" },
              order: { xs: 1, md: 0 },
            }}
          >
            {isMobile ? (
              <IconButton
                color="inherit"
                onClick={() => setShowSearch(!showSearch)}
              >
                <SearchIcon />
              </IconButton>
            ) : (
              <SearchBox>
                <SearchIcon sx={{ mr: 1, color: "#666" }} />
                <InputBase placeholder="Search" fullWidth />
              </SearchBox>
            )}
          </Box>

          <IconButton color="inherit" onClick={() => navigate(-1)}>
            <UndoRoundedIcon />
          </IconButton>

          <IconButton color="inherit" onClick={() => navigate(1)}>
            <RedoRoundedIcon />
          </IconButton>
        </Toolbar>
        {isMobile && showSearch && (
          <Box
            sx={{
              width: "100%",
              backgroundColor: "#238878",
              px: 0,
              pb: 1,
            }}
          >
            <SearchBox sx={{ width: "100%" }}>
              <SearchIcon
                sx={{ mr: 1, color: "#666", cursor: "pointer" }}
                onClick={() => setShowSearch(false)}
              />
              <InputBase
                placeholder="Search"
                fullWidth
                autoFocus
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 5,
                  px: 1,
                }}
              />
            </SearchBox>
          </Box>
        )}
      </StyledAppBar>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? open : !isSettingsPage}
        onClose={() => setOpen(false)}
        sx={{
          width: isSettingsPage
            ? 0
            : isMobile
              ? FULL_WIDTH
              : open
                ? FULL_WIDTH
                : MINI_WIDTH,

          flexShrink: 0,
          whiteSpace: "nowrap",

          "& .MuiDrawer-paper": {
            width: isSettingsPage
              ? 0
              : isMobile
                ? FULL_WIDTH
                : open
                  ? FULL_WIDTH
                  : MINI_WIDTH,

            overflowX: "hidden",
            transition: "width 0.3s",
            boxSizing: "border-box",
            paddingTop: isMobile ? (showSearch ? 10 : 5) : 0,
          },
        }}
      >
        {!isMobile && <DrawerHeader />}
        <Sidebar open={isMobile ? true : open} />
      </Drawer>
      <Box
        component="main"
        sx={{
          flex: 1,
          bgcolor: "#f8f9fa",
          pt: { xs: showSearch ? 16 : 10, md: 10 },
          px: { xs: 1, sm: 3, md: 5 },
          overflowY: "auto",
          ml: isSettingsPage ? 0 : undefined,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Header;
