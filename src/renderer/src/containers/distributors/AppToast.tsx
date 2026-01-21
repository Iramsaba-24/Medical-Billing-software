import { Snackbar, Alert,  } from "@mui/material";

type AppToastProps = {
  open: boolean;            
  message: string;         
  severity?:  "success" | "error" | "warning" ;
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
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert 
        onClose={onClose} 
        severity={severity} 
        variant="filled" 
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}