import React from "react";
import {
  Dialog,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { SalesData } from "./SalesTable";

interface Props {
  viewRow: SalesData | null;
  onClose: () => void;
}

const ViewSalesTable: React.FC<Props> = ({ viewRow, onClose }) => {
  return (
    <Dialog open={Boolean(viewRow)} onClose={onClose} maxWidth="md" fullWidth>
      {viewRow && (
        <Box sx={{ p: 3 }}>
          {/* Main Inner Box */}
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: "0px 2px 8px rgba(0,0,0,0.08)", // faint shadow
              backgroundColor: "#fff",
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Sales Details
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 3,
                mb: 2,
              }}
            >
              <Box>
                <Typography fontWeight={500}>Name</Typography>
                <Typography>{viewRow.name}</Typography>
              </Box>

              <Box>
                <Typography fontWeight={500}>Medicine</Typography>
                <Typography>{viewRow.medicine}</Typography>
              </Box>

              <Box>
                <Typography fontWeight={500}>Quantity</Typography>
                <Typography>{viewRow.quantity}</Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 3,
              }}
            >
              <Box>
                <Typography fontWeight={500}>Total Price</Typography>
                <Typography>₹ {viewRow.totalPrice}</Typography>
              </Box>

              <Box>
                <Typography fontWeight={500}>Date</Typography>
                <Typography>{viewRow.date}</Typography>
              </Box>

              <Box>
                <Typography fontWeight={500}>Time</Typography>
                <Typography>{viewRow.time}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            textTransform: "none",
            backgroundColor: "#1b7f6b",
            "&:hover": {
              backgroundColor: "#15695c",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewSalesTable;