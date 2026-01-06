import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  InputBase,
  useMediaQuery,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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



import { Outlet, useNavigate } from 'react-router-dom';
import { URL_PATH } from '../../constants/UrlPath';

const drawerWidth = 240;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#238878',
  zIndex: theme.zIndex.drawer + 1,
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
}));

const MenuButton = styled(ListItemButton)(() => ({
  minHeight: 48,
  margin: '6px 10px',
  borderRadius: 12,
  backgroundColor: '#e0e0e0',
  '&:hover': {
    backgroundColor: '#f1f1f1',
  },
}));

const SearchBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#fff',
  borderRadius: 20,
  padding: '4px 12px',
  width: 350,
}));

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


const DrawerContent = ({ onClose }: { onClose?: () => void }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <>
      <DrawerHeader>
        <Typography fontWeight={600}>ERP Billing</Typography>
        {onClose && (
          <IconButton onClick={onClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        )}
      </DrawerHeader>

      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <MenuButton
              onClick={() => {
                navigate(item.path);
                onClose?.();
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </MenuButton>
          </ListItem>
        ))}
      </List>
    </>
  );
};


const Header: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const match = menuItems.find(item =>
        item.text.toLowerCase().includes(search.toLowerCase())
      );

      if (match) {
        navigate(match.path);
        setSearch('');
      }
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <StyledAppBar position="fixed">
        <Toolbar sx={{ gap: 2 }}>
          {isMobile && (
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" sx={{ mr: 40 }}>
            ERP Billing Software
          </Typography>

          <IconButton color="inherit" onClick={() => navigate(-1)}>
            <UndoRoundedIcon />
          </IconButton>

          <IconButton color="inherit" onClick={() => navigate(1)} sx={{mr: 20}}>
            <RedoRoundedIcon />
          </IconButton>

          <SearchBox>
            <SearchIcon sx={{ mr: 1, color: '#666' }} />
            <InputBase
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              fullWidth
            />
          </SearchBox>
        </Toolbar>
      </StyledAppBar>

      {isMobile && (
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: drawerWidth } }}
        >
          <DrawerContent onClose={() => setDrawerOpen(false)} />
        </Drawer>
      )}

      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <DrawerContent />
        </Drawer>
      )}

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Header;
