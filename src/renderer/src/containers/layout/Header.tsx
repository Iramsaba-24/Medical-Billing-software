import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box, Drawer, AppBar, Toolbar, List, CssBaseline, Typography,
  IconButton, ListItem, Tooltip, InputBase, Button, useMediaQuery,
} from '@mui/material';
 
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import RedoRoundedIcon from '@mui/icons-material/RedoRounded';
import { Home } from '@mui/icons-material';
  import PaymentsIcon from '@mui/icons-material/Payments';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { URL_PATH } from '../../constants/UrlPath';
import Setting, { SettingRef } from './Setting';
import { useEffect } from 'react';
 
const MINI_WIDTH = 90;
const FULL_WIDTH = 240;
 
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#238878',
  zIndex: theme.zIndex.drawer + 1,
}));
 
 const DrawerHeader = styled('div')(({ theme }) => ({
   ...theme.mixins.toolbar,
 }));
 
const SearchBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#fff',
  borderRadius: 20,
  padding: '4px 12px',
  width: '100%',
}));
 
const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Billing', icon: <PaymentsIcon />, path: URL_PATH.Billing },
  { text: 'Customers', icon: <PeopleIcon />, path: URL_PATH.Customer },
  { text: 'Doctors', icon: <LocalHospitalIcon />, path: URL_PATH.Doctors },
  { text: 'Distributors', icon: <LocalShippingIcon />, path: URL_PATH.DistributorsPage },
  { text: 'Inventory', icon: <Inventory2Icon />, path: URL_PATH.Inventory },
  { text: 'Invoices', icon: <ReceiptLongIcon />, path: URL_PATH.Invoices },
  { text: 'Reports', icon: <AssessmentIcon />, path: URL_PATH.ReportPage },
  { text: 'Settings', icon: <SettingsIcon />, path: URL_PATH.Setting },
];
 
const Sidebar = ({ open }: { open: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const settingRef = React.useRef<SettingRef>(null);

  useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
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
        
      const isSettings = item.text === 'Settings';
      const active = isSettings ? location.pathname.startsWith(item.path) : location.pathname === item.path;
       
      return (
          <Tooltip key={item.text} title={!open ? item.text : ''} placement="right" arrow>
            <ListItem disablePadding sx={{ mb: 2 }}>
              <Button
                fullWidth
                startIcon={item.icon}
                variant={active ? 'contained' : 'contained'}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (isSettings) {
                    settingRef.current?.openDropdown(e);
                  } else {
                    navigate(item.path);
                  }
                }}
                sx={{
                  justifyContent: open ? 'flex-start' : 'center',
                  minHeight: 44,
                  px: open ? 4 : 0,
                  py: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  background: active ? '#238878' : '#D9D9D9',
                  color: active ? '#fff' : 'black',
                  '& .MuiButton-startIcon': {
                    margin: open ? '0 12px 0 0' : 0,
                  },
                  '&:hover': {
                    background: '#1FA38A'
                  },
                }}
              >
                {open && item.text}
              </Button>
            </ListItem>
          </Tooltip>
        );
      })}
      <Setting ref={settingRef} />
    </List>
  );
};
 
const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);

 
  return (
    <Box sx={{ display: 'flex' }}>
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
      <Typography
        sx={{
          fontSize: { xs: 16, md: 22 },
          flexGrow: 1,
        }} >
        ERP Billing Software
      </Typography>

      <Home
        sx={{ cursor: "pointer" }}
        onClick={() => navigate(URL_PATH.Landing)}
      />

      <Box
        sx={{
          width: { xs: '100%', md: 'auto' }, 
          order: { xs: 1, md: 0 }, 
        }}
      >

{isMobile ? (
  <IconButton color="inherit" onClick={() => setShowSearch(!showSearch)}>
    <SearchIcon />
  </IconButton>
) : (
  <SearchBox>
    <SearchIcon sx={{ mr: 1, color: '#666' }} />
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
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? open : true}
        onClose={() => setOpen(false)}
        sx={{
          width: isMobile ? FULL_WIDTH : open ? FULL_WIDTH : MINI_WIDTH,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          '& .MuiDrawer-paper': {
            width: isMobile ? FULL_WIDTH : open ? FULL_WIDTH : MINI_WIDTH,
            transition: 'width 0.3s',
            boxSizing: 'border-box',
            paddingTop: isMobile
    ? showSearch
      ? 10
      : 5
    : 0,
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
    overflowY: "auto"
  }}
>
  <Outlet />
</Box>
    </Box>
  );
 };
 
export default Header;