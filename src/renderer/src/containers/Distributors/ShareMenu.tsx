import { useState } from "react";
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { WhatsApp, Sms, Send, Email } from '@mui/icons-material';

const ShareMenu = ({ itemName }: { itemName: string }) => {
const [menuBtn, setMenuBtn] = useState<null | HTMLElement>(null);

  const shareLink = "https://yourwebsite.com";
  const text = encodeURIComponent(`Check this: ${itemName} - ${shareLink}`);

  const close = () => setMenuBtn(null);

  return (
    <>
    {/* share icon button */}
      <IconButton onClick={(e) => setMenuBtn(e.currentTarget)}>
        <Send sx={{ fontSize: 20, transform: "rotate(-30deg)", color: "gray" }} />
      </IconButton>

      <Menu anchorEl={menuBtn} open={Boolean(menuBtn)} onClose={close}>
        
        {/* WhatsApp */}
        <MenuItem onClick={() => { window.open(`https://wa.me/?text=${text}`); close(); }}>
          <ListItemIcon><WhatsApp fontSize="small" sx={{ color: '#25D366' }} /></ListItemIcon>
          <ListItemText>WhatsApp</ListItemText>
        </MenuItem>

        {/* SMS */}
        <MenuItem onClick={() => { window.location.href = `sms:?body=${text}`; close(); }}>
          <ListItemIcon><Sms fontSize="small" sx={{ color: '#1976d2' }} /></ListItemIcon>
          <ListItemText>SMS</ListItemText>
        </MenuItem>

        {/* Gmail */}
        <MenuItem onClick={() => { window.location.href = `mailto:?subject=Item Share&body=${text}`; close(); }}>
          <ListItemIcon><Email fontSize="small" sx={{ color: '#EA4335' }} /></ListItemIcon>
          <ListItemText>Gmail</ListItemText>
        </MenuItem>

      </Menu>
    </>
  );
};

export default ShareMenu;