import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  IconButton,
  ListItem,
  Tooltip,
  InputBase,
  Button,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import RedoRoundedIcon from '@mui/icons-material/RedoRounded';

import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { URL_PATH } from '../../constants/UrlPath';

const MINI_WIDTH = 64;
const FULL_WIDTH = 240;

/* --STYLED -- */

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

/* -- MENU -- */

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: URL_PATH.DASHBOARD },
  { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
  { text: 'Sales', icon: <ShoppingCartIcon />, path: URL_PATH.SalesBilling },
  { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
  { text: 'Finance', icon: <AccountBalanceIcon />, path: '/accounting' },
  { text: 'Billing', icon: <ReceiptIcon />, path: '/invoices' },
  { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

/* -- SIDEBAR -- */

const Sidebar = ({ open }: { open: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <List sx={{ px: 1 }}>
      {menuItems.map((item) => {
        const active = location.pathname === item.path;

        return (
          <Tooltip
            key={item.text}
            title={!open ? item.text : ''}
            placement="right"
            arrow
          >
            <ListItem disablePadding sx={{ mb: 2 }}>
              <Button
                fullWidth
                startIcon={item.icon}
                variant={active ? 'contained' : 'contained'}
                onClick={() => navigate(item.path)}
                sx={{
                  justifyContent: open ? 'flex-start' : 'center',
                  minHeight: 44,
                  px: open ? 4 : 0,
                  py: 2,
                  borderRadius: 2,
                  textTransform: 'none',

                  background: active
                    ? 'linear-gradient(90deg, #7FE3D3 0%, #22C7A9 50%, #1FA38A 100%)'
                    : '#D9D9D9',
                  color: active ? '#fff' : 'black',

                  '& .MuiButton-startIcon': {
                    margin: open ? '0 12px 0 0' : 0,
                  },

                  '&:hover': {
                    background: 'linear-gradient(90deg, #7FE3D3 0%, #22C7A9 50%, #1FA38A 100%)',
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

/* -- MAIN LAYOUT -- */

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* APP BAR */}
      <StyledAppBar position="fixed">
        <Toolbar sx={{ gap: 2 }}>
          <IconButton color="inherit" onClick={() => setOpen(!open)}>
            <MenuIcon />
          </IconButton>

          <Typography sx={{ fontSize: { xs: 14, md: 22 }, flexGrow: 1 }}>
            ERP Billing Software
          </Typography>

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

      {/* SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: open ? FULL_WIDTH : MINI_WIDTH,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          transition: 'width 0.3s',
          '& .MuiDrawer-paper': {
            width: open ? FULL_WIDTH : MINI_WIDTH,
            transition: 'width 0.3s',
            boxSizing: 'border-box',
            overflowX: 'hidden',
          },
        }}
      >
        <DrawerHeader />
        <Sidebar open={open} />
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Header;
