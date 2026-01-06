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


// import * as React from "react";
// import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
// import Box from "@mui/material/Box";
// import MuiDrawer from "@mui/material/Drawer";
// import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import List from "@mui/material/List";
// import CssBaseline from '@mui/material/CssBaseline';
// import Typography from "@mui/material/Typography";
// import Divider from "@mui/material/Divider";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";

// // Material UI Icons for sidebar
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import ReceiptIcon from "@mui/icons-material/Receipt";
// import PeopleIcon from "@mui/icons-material/People";
// import InventoryIcon from "@mui/icons-material/Inventory";
// import LocalAtmIcon from "@mui/icons-material/LocalAtm";
// import AssessmentIcon from "@mui/icons-material/Assessment";
// import SettingsIcon from "@mui/icons-material/Settings";
// import BusinessIcon from "@mui/icons-material/Business";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// import CategoryIcon from "@mui/icons-material/Category";
// import SupportAgentIcon from "@mui/icons-material/SupportAgent";
// import PaymentsIcon from "@mui/icons-material/Payments";
// import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
// import { URL_PATH } from "../../constants/UrlPath";
// import { Outlet, useNavigate } from "react-router-dom";

// const drawerWidth = 240;

// const openedMixin = (theme: Theme): CSSObject => ({
//   width: drawerWidth,
//   background: "#238878",
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.enteringScreen,
//   }),
//   overflowX: "hidden",
// });

// const closedMixin = (theme: Theme): CSSObject => ({
//   background: "#238878",
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   overflowX: "hidden",
//   width: `calc(${theme.spacing(7)} + 1px)`,
//   [theme.breakpoints.up("sm")]: {
//     width: `calc(${theme.spacing(8)} + 1px)`,
//   },
// });

// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "flex-end",
//   padding: theme.spacing(0, 1),
//   ...theme.mixins.toolbar,
// }));

// interface AppBarProps extends MuiAppBarProps {
//   open?: boolean;
// }

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== "open",
// })<AppBarProps>(({ theme, open }) => ({
//   background: "#238878",
//   zIndex: theme.zIndex.drawer + 1,
//   transition: theme.transitions.create(["width", "margin"], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   ...(open && {
//     marginLeft: drawerWidth,
//     width: `calc(100% - ${drawerWidth}px)`,
//     transition: theme.transitions.create(["width", "margin"], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
// }));

// const Drawer = styled(MuiDrawer, {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme, open }) => ({
//   width: drawerWidth,
//   flexShrink: 0,

//   whiteSpace: "nowrap",
//   boxSizing: "border-box",
//   ...(open && {
//     ...openedMixin(theme),
//     "& .MuiDrawer-paper": openedMixin(theme),
//   }),
//   ...(!open && {
//     ...closedMixin(theme),
//     "& .MuiDrawer-paper": closedMixin(theme),
//   }),
// }));

// // Menu Items Array for ERP Billing Software
// const menuItems = [
//   // Dashboard Section
//   {
//     text: "Dashboard",
//     icon: <DashboardIcon />,
//     path: URL_PATH.DASHBOARD,
//   },

//   // Sales & Invoicing Section
//   {
//     text: "Invoices",
//     icon: <ReceiptIcon />,
//     path: "/invoices",
//   },
//   {
//     text: "Sales/Billing ",
//     icon: <ShoppingCartIcon />,
//     path: URL_PATH.SalesBilling,
//   },
//   {
//     text: "Quotations",
//     icon: <AttachMoneyIcon />,
//     path: "/quotations",
//   },

//   // Customers Section
//   {
//     text: "Customers",
//     icon: <PeopleIcon />,
//     path: "/customers",
//   },
//   {
//     text: "Customer Support",
//     icon: <SupportAgentIcon />,
//     path: "/support",
//   },

//   // Inventory Section
//   {
//     text: "Inventory",
//     icon: <InventoryIcon />,
//     path: "/inventory",
//   },
//   {
//     text: "Products",
//     icon: <CategoryIcon />,
//     path: "/products",
//   },
//   {
//     text: "Suppliers",
//     icon: <BusinessIcon />,
//     path: "/suppliers",
//   },

//   // Financial Section
//   {
//     text: "Payments",
//     icon: <PaymentsIcon />,
//     path: "/payments",
//   },
//   {
//     text: "Expenses",
//     icon: <LocalAtmIcon />,
//     path: "/expenses",
//   },
//   {
//     text: "Accounting",
//     icon: <AccountBalanceIcon />,
//     path: "/accounting",
//   },

//   // Reports Section
//   {
//     text: "Reports",
//     icon: <AssessmentIcon />,
//     path: "/reports",
//   },

//   // Settings Section
//   {
//     text: "Settings",
//     icon: <SettingsIcon />,
//     path: "/settings",
//   },
// ];

// const MiniDrawer: React.FC = () => {
//   const theme = useTheme();
//   const [open, setOpen] = React.useState(true);

//   const navigate = useNavigate();

//   const handleDrawerOpen = () => {
//     setOpen(true);
//   };

//   const handleDrawerClose = () => {
//     setOpen(false);
//   };

//   return (
//     <Box sx={{ display: "flex", background: "#f0f0f0" }}>
//       <CssBaseline />

//       {/* Navbar (AppBar) */}
//       <AppBar position="fixed" open={open}>
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             onClick={handleDrawerOpen}
//             edge="start"
//             sx={{
//               marginRight: 5,
//               ...(open && { display: "none" }),
//             }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" noWrap component="div">
//             ERP Billing Software
//           </Typography>
//         </Toolbar>
//       </AppBar>

//       {/* Sidebar (Drawer) */}
//       <Drawer
//         variant="permanent"
//         open={open}
//         sx={{
//           overflow: "hidden",
//           "& .MuiDrawer-paper": {
//             overflowY: "auto",
//             scrollbarWidth: "none",
//             "&::-webkit-scrollbar": {
//               display: "none",
//             },
//           },
//         }}
//       >
//         <DrawerHeader>
//           <Typography
//             variant="subtitle1"
//             sx={{ mr: 2, opacity: open ? 1 : 0, color: "#ffffff" }}
//           >
//             ERP Billing Software
//           </Typography>
//           <IconButton  onClick={handleDrawerClose}>
//             {theme.direction === "rtl" ? (
//               <ChevronRightIcon color="inherit"/>
//             ) : (
//               <ChevronLeftIcon />
//             )}
//           </IconButton>
//         </DrawerHeader>
//         <Divider />

//         {/* Main Menu Items */}
//         <List>
//           {menuItems.slice(0, 1).map(
//             (
//               item // Dashboard
//             ) => (
//               <ListItem
//                 key={item.text}
//                 disablePadding
//                 sx={{ display: "block" }}
//               >
//                 <ListItemButton
//                   onClick={() => navigate(item.path)}
//                   sx={{
//                     minHeight: 48,
//                     justifyContent: open ? "initial" : "center",
//                     px: 2.5,
//                     color: "#ffffff",
//                   }}
//                 >
//                   <ListItemIcon
//                     sx={{
//                       minWidth: 0,
//                       mr: open ? 3 : "auto",
//                       justifyContent: "center",
//                       color: "#ffffff",
//                     }}
//                   >
//                     {item.icon}
//                   </ListItemIcon>
//                   <ListItemText
//                     primary={item.text}
//                     sx={{ opacity: open ? 1 : 0 , color: "#ffffff"}}
//                   />
//                 </ListItemButton>
//               </ListItem>
//             )
//           )}
//         </List>

//         <Divider />
//         <Typography
//           variant="inherit"
//           sx={{ pl: 2, pt: 2, opacity: open ? 1 : 0 , color: "#ffffff"}}
//         >
//           Sales & Invoicing
//         </Typography>
//         <List>
//           {menuItems.slice(1, 4).map(
//             (
//               item
//             ) => (
//               <ListItem
//                 key={item.text}
//                 disablePadding
//                 sx={{ display: "block" }}
//               >
//                 <ListItemButton
//                   onClick={() => navigate(item.path)}
//                   sx={{
//                     minHeight: 48,
//                     justifyContent: open ? "initial" : "center",
//                     px: 2.5,
//                   }}
//                 >
//                   <ListItemIcon
//                     sx={{
//                       minWidth: 0,
//                       mr: open ? 3 : "auto",
//                       justifyContent: "center",
//                       color:'#ffffff'
//                     }}
//                   >
//                     {item.icon}
//                   </ListItemIcon>
//                   <ListItemText
//                     primary={item.text}
//                     sx={{ opacity: open ? 1 : 0, color:'#ffffff' }}
//                   />
//                 </ListItemButton>
//               </ListItem>
//             )
//           )}
//         </List>

//         <Divider />
//         <Typography
//           variant="inherit"
//           sx={{ pl: 2, pt: 2, opacity: open ? 1 : 0, color:'#ffffff' }}
//         >
//           Customers
//         </Typography>
//         <List>
//           {menuItems.slice(4, 6).map(
//             (
//               item // Customers, Support
//             ) => (
//               <ListItem
//                 key={item.text}
//                 disablePadding
//                 sx={{ display: "block" }}
//               >
//                 <ListItemButton
//                   onClick={() => navigate(item.path)}
//                   sx={{
//                     minHeight: 48,
//                     justifyContent: open ? "initial" : "center",
//                     px: 2.5,
//                     color:'#ffffff'
//                   }}
//                 >
//                   <ListItemIcon
//                     sx={{
//                       minWidth: 0,
//                       mr: open ? 3 : "auto",
//                       justifyContent: "center",
//                       color:'#ffffff'
//                     }}
//                   >
//                     {item.icon}
//                   </ListItemIcon>
//                   <ListItemText
//                     primary={item.text}
//                     sx={{ opacity: open ? 1 : 0, color:'#ffffff' }}
//                   />
//                 </ListItemButton>
//               </ListItem>
//             )
//           )}
//         </List>

//         <Divider />
//         <Typography
//           variant="inherit"
//           sx={{ pl: 2, pt: 2, opacity: open ? 1 : 0 , color:'#ffffff'}}
//         >
//           Inventory
//         </Typography>
//         <List>
//           {menuItems.slice(6, 9).map(
//             (
//               item // Inventory, Products, Suppliers
//             ) => (
//               <ListItem
//                 key={item.text}
//                 disablePadding
//                 sx={{ display: "block", color:'#ffffff' }}
//               >
//                 <ListItemButton
//                   onClick={() => navigate(item.path)}
//                   sx={{
//                     minHeight: 48,
//                     justifyContent: open ? "initial" : "center",
//                     px: 2.5,
//                   }}
//                 >
//                   <ListItemIcon
//                     sx={{
//                       minWidth: 0,
//                       mr: open ? 3 : "auto",
//                       justifyContent: "center",
//                       color:'#ffffff'
//                     }}
//                   >
//                     {item.icon}
//                   </ListItemIcon>
//                   <ListItemText
//                     primary={item.text}
//                     sx={{ opacity: open ? 1 : 0, color:'#ffffff' }}
//                   />
//                 </ListItemButton>
//               </ListItem>
//             )
//           )}
//         </List>

//         <Divider />
//         <Typography
//           variant="inherit"
//           sx={{ pl: 2, pt: 2, opacity: open ? 1 : 0 , color:'#ffffff'}}
//         >
//           Financial
//         </Typography>
//         <List>
//           {menuItems.slice(9, 12).map(
//             (
//               item // Payments, Expenses, Accounting
//             ) => (
//               <ListItem
//                 key={item.text}
//                 disablePadding
//                 sx={{ display: "block", color:'#ffffff' }}
//               >
//                 <ListItemButton
//                   onClick={() => navigate(item.path)}
//                   sx={{
//                     minHeight: 48,
//                     justifyContent: open ? "initial" : "center",
//                     px: 2.5,
//                   }}
//                 >
//                   <ListItemIcon
//                     sx={{
//                       minWidth: 0,
//                       mr: open ? 3 : "auto",
//                       justifyContent: "center",
//                       color:'#ffffff'
//                     }}
//                   >
//                     {item.icon}
//                   </ListItemIcon>
//                   <ListItemText
//                     primary={item.text}
//                     sx={{ opacity: open ? 1 : 0, color:'#ffffff' }}
//                   />
//                 </ListItemButton>
//               </ListItem>
//             )
//           )}
//         </List>

//         <Divider />
//         <List>
//           {menuItems.slice(12).map(
//             (
//               item
//             ) => (
//               <ListItem
//                 key={item.text}
//                 disablePadding
//                 sx={{ display: "block" , color:'#ffffff'}}
//               >
//                 <ListItemButton
//                   onClick={() => navigate(item.path)}
//                   sx={{
//                     minHeight: 48,
//                     justifyContent: open ? "initial" : "center",
//                     px: 2.5,
//                     color:'#ffffff'
//                   }}
//                 >
//                   <ListItemIcon
//                     sx={{
//                       minWidth: 0,
//                       mr: open ? 3 : "auto",
//                       justifyContent: "center",
//                       color:'#ffffff'
//                     }}
//                   >
//                     {item.icon}
//                   </ListItemIcon>
//                   <ListItemText
//                     primary={item.text}
//                     sx={{ opacity: open ? 1 : 0, color:'#ffffff' }}
//                   />
//                 </ListItemButton>
//               </ListItem>
//             )
//           )}
//         </List>
//       </Drawer>

//       {/* Main Content Area */}
//       <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//         <DrawerHeader />
//         {/* This is where your routed pages will be rendered by AppRouter */}
//         <Outlet />
//       </Box>
//     </Box>
//   );
// };

// export default MiniDrawer;
