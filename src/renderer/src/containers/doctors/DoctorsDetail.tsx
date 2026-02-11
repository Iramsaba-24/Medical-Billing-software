import { Box, Paper, Typography } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";

type Doctor = {
  id: string;
  doctorName: string;
  degree: string;
  phone: string;
  email: string;
  registrationNo: string;
  address: string;
};

const DoctorsDetail = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  let doctor: Doctor | undefined = location.state?.doctor;

  if (!doctor && id) {
    const storedDoctors: Doctor[] = JSON.parse(
      localStorage.getItem("doctors") || "[]"
    );
    doctor = storedDoctors.find((d) => d.id === id);
  }

  return (
    <Paper
      sx={{
        p: { xs:4, md:6 },
        mx: { xs:1, md:10 },
        mt: { xs:2, md:4 },
      }}
    >
      <Typography
        fontSize={{ xs:18, md:22 }}
        fontWeight={600}
        mb={4}
      >
        Doctor Details
      </Typography>

      <Box
        display="flex"
        flexDirection={{ xs:"column", md:"row" }}
        gap={{ xs:2, md:20 }}
        mb={2}
      >
        <Typography>
          <strong>Name:</strong>
          <br />
          {doctor?.doctorName}
        </Typography>

        <Typography>
          <strong>Degree:</strong>
          <br />
          {doctor?.degree}
        </Typography>

        <Typography>
          <strong>Registration No.:</strong>
          <br />
          {doctor?.registrationNo}
        </Typography>
      </Box>

      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        gap={{ xs: 2, md: 16 }}
        mb={2}
      >
        <Typography>
          <strong>Phone:</strong>
          <br />
          {doctor?.phone}
        </Typography>

        <Typography>
          <strong>Email:</strong>
          <br />
          {doctor?.email}
        </Typography>
      </Box>

      <Box>
        <Typography>
          <strong>Address:</strong>
          <br />
          {doctor?.address}
        </Typography>
      </Box>
    </Paper>
  );
};

export default DoctorsDetail;
