import {ACTION_KEY,Column,UniversalTable,} from "@/components/uncontrolled/UniversalTable";
import {Box,Typography,Paper,MenuItem,Button,Select,Divider,Dialog,DialogActions,} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  showConfirmation,
  showSnackbar,
} from "@/components/uncontrolled/ToastMessage";
// import DoctorEdit from "@/containers/doctors/DoctorEdit";
import { URL_PATH } from "@/constants/UrlPath";
import { getDoctors } from "@/service/doctorService";
import { deleteDoctor } from "@/service/doctorService";
import { updateDoctor } from "@/service/doctorService";
type Doctor = {
  SrNo: number;
  doctorId: number;

  doctorName: string;

  degree: string;

  phone: string;

  email: string;

  registrationNumber: string;

  hospitalAddress: string;

  status: "Active" | "Inactive";
};

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [viewItem, setViewItem] = useState<Doctor | null>(null);

  // const [editDoctor, setEditDoctor] = useState<Doctor | null>(null);

  const navigate = useNavigate();

  //get dr list when add dr using add dr form

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await getDoctors();

      console.log("Backend response:", JSON.stringify(data[0]));

      const mappedDoctors: Doctor[] = data.map((doc,index) => {
        const activeFlag = doc.isActive ?? doc.IsActive;
        return {
          ...doc,
          SrNo: doc.SrNo ?? index + 1,
          status: activeFlag === true ? "Active" : "Inactive",
        };
      });

      setDoctors(mappedDoctors);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (
    id: number,

    status: "Active" | "Inactive",
  ) => {
    try {
      const isActive = status === "Active";

      const doctor = doctors.find((d) => d.doctorId === id);

      if (!doctor) return;

      await updateDoctor(id, {
        doctorName: doctor.doctorName,

        degree: doctor.degree,

        phone: doctor.phone,

        email: doctor.email,

        registrationNumber: doctor.registrationNumber,

        hospitalAddress: doctor.hospitalAddress,

        isActive: isActive,
      });

      // UI update
      setDoctors((prev) =>
        prev.map((doc) => (doc.doctorId === id ? { ...doc, status } : doc)),
      );

      showSnackbar("success", "Status updated");
    } catch (error) {
      console.error(error);

      showSnackbar("error", "Status update failed");
    }
  };

  const columns: Column<Doctor>[] = [
    { key: "SrNo", label: "Sr.No." },
    { key: "doctorName", label: "Name" },

    { key: "degree", label: "Degree" },

    { key: "phone", label: "Phone" },

    { key: "hospitalAddress", label: "Address" },

    {
      key: "status",
      label: "Status",

      render: (row) => (
        <Select
          size="small"
          value={row.status}
          onChange={(e) =>
            handleStatusChange(
              row.doctorId,
              e.target.value as "Active" | "Inactive",
            )
          }
          sx={{
            minWidth: 100,

            fontSize: 13,

            fontWeight: 600,

            "& .MuiSelect-select": {
              color: row.status === "Active" ? "success.main" : "error.main",
            },
          }}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </Select>
      ),
    },

    { key: ACTION_KEY, label: "Actions" },
  ];

  return (
    <>
      <Box sx={{ mb: { xs: 1, md: 4 } }}>
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 20, sm: 24, md: 28 },

              fontWeight: 700,

              color: "#111827",

              mt: { xs: 1, md: 0.5 },

              mb: 0.5,
            }}
          >
            Doctors
          </Typography>
        </Box>
        <Paper
          sx={{
            //mx:{xs:1, md:2},

            mt: 1,
            p: { xs: 1, md: 2 },
          }}
        >
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            gap={2}
            mb={2}
          >
            <Typography fontSize={{ xs: 18, md: 20 }} fontWeight={600}>
              Doctors List
            </Typography>
            <Button
              variant="contained"
              sx={{
                textTransform: "none",

                bgcolor: "#238878",

                width: { xs: "100%", sm: "auto" },

                "&:hover": {
                  backgroundColor: "#fff",

                  color: "#238878",

                  border: "2px solid #238878",
                },
              }}
              onClick={() => navigate(URL_PATH.AddDoctor)}
            >
              + Add Doctor
            </Button>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <UniversalTable
            data={doctors}
            columns={columns}
            showSearch={true}
            showExport={true}
            tableSize="small"
            actions={{
              view: setViewItem,

              edit: (doctor) => {
    navigate(URL_PATH.AddDoctor, { state: doctor });
  },

              delete: async (doctor) => {
                const ok = await showConfirmation("Delete doctor?", "Confirm");

                if (ok) {
                  try {
                    await deleteDoctor(doctor.doctorId); // backend call

                    showSnackbar("success", "Doctor deleted successfully");

                    fetchDoctors();
                  } catch (error) {
                    console.error(error);

                    showSnackbar("error", "Delete failed");
                  }
                }
              },
            }}
          />
        </Paper>

        {/* view dialog box */}
        <Dialog
          open={!!viewItem}
          onClose={() => setViewItem(null)}
          maxWidth="md"
          fullWidth
        >
          {viewItem && (
            <Paper
              sx={{
                p: { xs: 4, md: 6 },
                mx: { xs: 1, md: 10 },
                mt: { xs: 2, md: 4 },
              }}
            >
              <Typography fontSize={{ xs: 18, md: 22 }} fontWeight={600} mb={4}>
                Doctor Details
              </Typography>
              <Box
                display="flex"
                flexDirection={{ xs: "column", md: "row" }}
                gap={{ xs: 2, md: 20 }}
                mb={2}
              >
                <Typography>
                  <strong>Name:</strong>
                  <br />
                  {viewItem?.doctorName}
                </Typography>
                <Typography>
                  <strong>Degree:</strong>
                  <br />
                  {viewItem?.degree}
                </Typography>
                <Typography>
                  <strong>Registration No.:</strong>
                  <br />
                  {viewItem?.registrationNumber}
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
                  {viewItem?.phone}
                </Typography>
                <Typography>
                  <strong>Email:</strong>
                  <br />
                  {viewItem?.email}
                </Typography>
              </Box>
              <Box>
                <Typography>
                  <strong>Address:</strong>
                  <br />
                  {viewItem?.hospitalAddress}
                </Typography>
              </Box>
            </Paper>
          )}
          <DialogActions>
            <Button
              sx={{
                px: 2.5,
                minWidth: 100,
                backgroundColor: "#238878",
                color: "#fff",
                border: "2px solid #238878",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "#238878",
                },
              }}
              onClick={() => setViewItem(null)}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* edit doctor  */}
        
      </Box>
    </>
  );
};

export default Doctors;
