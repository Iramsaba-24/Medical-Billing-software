 import { Snackbar, Alert } from "@mui/material";

type AppToastProps = {
  open: boolean;             
  message: string;          
  severity?: "success" | "error" | "warning" | "info"; 
  onClose: () => void;      
};
 
export default function AppToast({
  open,
  message,
  severity = "success",  
  onClose,
}: AppToastProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}  
      onClose={onClose}
      // Position of the toast on the screen
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      
      <Alert 
        onClose={onClose} 
        severity={severity} 
        sx={{ width: "100%", boxShadow: 3 }} 
      >
        {message}
      </Alert>
    </Snackbar>
  );
}