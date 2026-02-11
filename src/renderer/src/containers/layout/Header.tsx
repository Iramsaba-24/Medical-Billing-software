 
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
 
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { URL_PATH } from '../../constants/UrlPath';
import Setting, { SettingRef } from './Setting';
 
const MINI_WIDTH = 80;
const FULL_WIDTH = 240;
 
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#238878',
  zIndex: theme.zIndex.drawer + 1,
}));
 
 const DrawerHeader = styled('div')(({ theme }) => ({
   ...theme.mixins.toolbar,
 }));
 
const SearchBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#fff',
  borderRadius: 20,
  padding: '4px 12px',
  width: 260,
  [theme.breakpoints.down('sm')]: {
    width: 160,
  },
}));
 
const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
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
 
  return (
    <List sx={{ px: 1, mt: { xs: 2, md: 1 } }}>
      {menuItems.map((item) => {
        const active = location.pathname === item.path;
        const isSettings = item.text === 'Settings';
 
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
 
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <StyledAppBar position="fixed">
        <Toolbar sx={{ gap: 2 }}>
          <IconButton color="inherit" onClick={() => setOpen(!open)}>
            <MenuIcon />
          </IconButton>
          <Typography sx={{ fontSize: { xs: 14, md: 22 }, flexGrow: 1 }}>
            ERP Billing Software
          </Typography>
          <Home sx={{ cursor: "pointer" }} onClick={() => navigate("/")} />
          <SearchBox>
            <SearchIcon sx={{ mr: 1, color: '#666' }} />
            <InputBase placeholder="Search" fullWidth />
          </SearchBox>
          <IconButton color="inherit" onClick={() => navigate(-1)}>
            <UndoRoundedIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate(1)}>
            <RedoRoundedIcon />
          </IconButton>
        </Toolbar>
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
            //  overflowX: 'hidden',
          },
        }}
      >
        <DrawerHeader />
        <Sidebar open={isMobile ? true : open} />
      </Drawer>
      <Box component="main" sx={{
         flex: 1, bgcolor: "#f8f9fa",
          py: { xs: 9, md: 8 },
           mt: 3,
            px:{xs:1, sm:3, md:5},
             height: "100vh"
              }}>
        <Outlet />
      </Box>
    </Box>
  );
 };
 
export default Header;
 
