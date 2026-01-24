import { useState } from "react";
import { createRoot, Root } from "react-dom/client";
import { toast, ToastContainer, type ToastOptions, type ToastContainerProps } from "react-toastify";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Snackbar, Alert } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

export type MessageType = "success" | "error" | "warning" | "info";

// ---------------- Toast ----------------
const toastProps: ToastContainerProps = {
  position: "top-right",
  autoClose: 3000,
  newestOnTop: true,
  pauseOnHover: true,
  closeOnClick: true,
};

let toastRoot: Root | null = null;
const ensureToast = () => {
  if (!toastRoot) {
    toastRoot = createRoot(document.body.appendChild(document.createElement("div")));
    toastRoot.render(<ToastContainer {...toastProps} />);
  }
};

export const showToast = (type: MessageType, message: string, options?: ToastOptions) => {
  ensureToast();
  toast[type](message, options);
};

// ---------------- Snackbar ----------------
let snackbarRoot: Root | null = null;
const ensureSnackbarRoot = () => {
  if (!snackbarRoot) {
    snackbarRoot = createRoot(document.body.appendChild(document.createElement("div")));
  }
};

export const showSnackbar = ( severity: MessageType = "info", message: string,duration: number = 3000) => {
  ensureSnackbarRoot();

  const Container = () => {
    const [open, setOpen] = useState(true);
    return (
      <Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setOpen(false)} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    );
  };

  snackbarRoot!.render(<Container />);
};

// ---------------- Confirmation Dialog ----------------
let confirmRoot: Root | null = null;
const ensureConfirmRoot = () => {
  if (!confirmRoot) {
    confirmRoot = createRoot(document.body.appendChild(document.createElement("div")));
  }
};

export const showConfirmation = (message: string, title?: string): Promise<boolean> => {
  ensureConfirmRoot();

  return new Promise((resolve) => {
    const Container = () => {
      const [open, setOpen] = useState(true);
      const handleClose = (result: boolean) => {
        setOpen(false);
        resolve(result);
      };

      return (
        <Dialog
          open={open}
          onClose={() => handleClose(false)}
          PaperProps={{
            sx: {
              m: 0,
              position: "absolute",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              width: { xs: "90%", sm: 400 },
            },
          }}
        >
          {title && <DialogTitle>{title}</DialogTitle>}
          <DialogContent>
            <Typography>{message}</Typography>
          </DialogContent>
          <DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
            <Button onClick={() => handleClose(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={() => handleClose(true)} variant="contained" color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      );
    };

    confirmRoot!.render(<Container />);
  });
};
