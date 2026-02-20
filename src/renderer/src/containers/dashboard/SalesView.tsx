import React from "react";
import { Box, Paper, Typography, Button, Container, Stack,} from "@mui/material";
import {useLocation, useNavigate,
} from "react-router-dom";
import { SalesData } from "./SalesTable";

const SalesView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const sale = location.state?.sale as
    | SalesData
    | undefined;

  if (!sale) {
    return (
      <Container maxWidth="sm">
        <Paper
          sx={{
            p: { xs: 3, sm: 5 },
            mt: 5,
            textAlign: "center",
          }}
        >
          <Typography variant="h6">
            No Data Found
          </Typography>

          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper
        sx={{
          p: { xs: 3, sm: 5, md: 6 },
          mt: 4,
          borderRadius: 3,
        }}
      >
        <Typography
          fontSize={{ xs: 18, sm: 20, md: 22 }}
          fontWeight={600}
          mb={4}
        >
          Sales Details (ID: {sale.id})
        </Typography>

        {/* Row 1 */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          mb={3}
        >
          <Box flex={1}>
            <Typography>
              <strong>Customer Name:</strong><br />
              {sale.name}
            </Typography>
          </Box>

          <Box flex={1}>
            <Typography>
              <strong>Medicine:</strong><br />
              {sale.medicine}
            </Typography>
          </Box>

          <Box flex={1}>
            <Typography>
              <strong>Quantity:</strong><br />
              {sale.quantity}
            </Typography>
          </Box>
        </Stack>

        {/* Row 2 */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
        >
          <Box flex={1}>
            <Typography>
              <strong>Total Price:</strong><br />
              ₹ {sale.totalPrice.toFixed(2)}
            </Typography>
          </Box>

          <Box flex={1}>
            <Typography>
              <strong>Date:</strong><br />
              {sale.date}
            </Typography>
          </Box>

          <Box flex={1}>
            <Typography>
              <strong>Time:</strong><br />
              {sale.time}
            </Typography>
          </Box>
        </Stack>

        <Box textAlign="center" mt={5}>
          <Button
  variant="contained"
  onClick={() => navigate(-1)}
  sx={{
    px: 4,
    fontSize: 14,
    backgroundColor: "#238878",
    border: "2px solid #238878",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#fff",
      color: "#238878",
    },
  }}
>
  Back
</Button>

        </Box>
      </Paper>
    </Container>
  );
};

export default SalesView;




