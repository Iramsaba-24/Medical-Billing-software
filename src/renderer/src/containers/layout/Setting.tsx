import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Popover, List, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import GroupIcon from '@mui/icons-material/Group';
import DescriptionIcon from '@mui/icons-material/Description';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { URL_PATH } from '../../constants/UrlPath';
import { useNavigate } from 'react-router-dom';
 
 
export interface SettingRef {
  openDropdown: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
 
interface SettingProps {
  readonly [key: string]: unknown;
}
 
const Setting = forwardRef<SettingRef, SettingProps>((_, ref) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const navigate = useNavigate();
 
  useImperativeHandle(ref, () => ({
    openDropdown(event: React.MouseEvent<HTMLButtonElement>) {
      setAnchorEl(event.currentTarget);
    }
  }));
 
  const handleClose = () => setAnchorEl(null);
 
 
  const menuItems = [
    { text: 'General', icon: <SettingsIcon fontSize="small" />, path: "/" },
    { text: 'Pharmacy Profile', icon: <LocalPharmacyIcon fontSize="small" />, path: "/" },
    { text: 'Dashboard Settings', icon: <DashboardIcon fontSize="small" />, path: URL_PATH.DashboardSettings},
    { text: 'Customers Settings', icon: <GroupIcon fontSize="small" />, path: "/" },
    { text: 'Doctors Settings', icon: <SettingsIcon fontSize="small" />, path:"/" },
    { text: 'Distributors Settings', icon: <SettingsIcon fontSize="small" />, path: URL_PATH.DistributorsSetting },
    { text: 'Inventory Settings', icon: <InventoryIcon fontSize="small" />, path: URL_PATH.InventorySettings },
    { text: 'Invoice Settings', icon: <DescriptionIcon fontSize="small" />, path: URL_PATH.InvoiceSetting },
    { text: 'Report Settings', icon: <AssessmentIcon fontSize="small" />, path: URL_PATH.ReportSettings },
  ];
 
 
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
     
      anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
      transformOrigin={{ vertical: 'center', horizontal: 'left' }}
      PaperProps={{
        sx: {
          ml: 1,
          width: 280,
          borderRadius: '12px',
          backgroundColor: '#ffffff',
          boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        },
      }}
    >
     
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        bgcolor: '#f8f9fa',
        gap: 1.5,
        borderBottom: '1px solid #eee'
      }}>
        <SettingsIcon sx={{ fontSize: 20, color: '#546e7a' }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
          Settings
        </Typography>
      </Box>
 
   
      <List sx={{ p: 0.5 }}>
        {menuItems.map((item) => (
          <ListItemButton
               key={item.text}
               onClick={() => {
               navigate(item.path);
               handleClose(); }}
        sx={{borderRadius: '8px', my: 0.2,  py: 1, px: 2, '&:hover': { bgcolor: '#f0f2f5' } }}>
        <ListItemIcon sx={{ minWidth: 38, color: '#546e7a' }}>
           {item.icon}
        </ListItemIcon>
        <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
        />
         </ListItemButton>
          ))}
       </List>
 
    </Popover>
  );
});
 
Setting.displayName = 'Setting';
 
export default Setting;
 
 