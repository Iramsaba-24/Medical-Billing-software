 import { Snackbar, Alert } from "@mui/material";

type AppToastProps = {
  open: boolean;             
  message: string;          
  severity?: "success" | "error" | "warning" ; 
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
      open={open}//toast show or hide based on this prop
      autoHideDuration={2000}  
      onClose={onClose} //toast close after 2 seconds or when user clicks close button
      // Position of the toast on the screen
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      
      <Alert 
        onClose={onClose} // Allow users to manually close the toast
        severity={severity} // Set the color and icon based on the severity
        sx={{ width: "100%", boxShadow: 3 }} 
      >
        {message}
      </Alert>
    </Snackbar>
  );
}