import SearchField from "@/components/controlled/SearchField";
import { ACTION_KEY, Column, UniversalTable } from "@/components/uncontrolled/UniversalTable";
import { Box, Typography, Paper, MenuItem, Button, Select, Divider, Dialog, DialogActions } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { showConfirmation, showSnackbar } from "@/components/uncontrolled/ToastMessage";
import DoctorEdit from "@/containers/doctors/DoctorEdit";
import { URL_PATH } from "@/constants/UrlPath";

type Doctor = {
  id: string;
  doctorName: string;
  degree: string;
  phone: string;
  email: string;
  registrationNo: string;
  address: string;
  status: "Active" | "Inactive";
};

const Doctors = () => {
  const methods = useForm({ defaultValues: { search: "" } });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [viewItem, setViewItem] = useState<Doctor | null>(null);
  const [editDoctor, setEditDoctor] = useState<Doctor | null>(null);


  const navigate = useNavigate();
  const searchValue = methods.watch("search");

  useEffect(() => {
    setDoctors(JSON.parse(localStorage.getItem("doctors") || "[]"));
  }, []);

  const saveDoctors = (updated: Doctor[]) => {
    localStorage.setItem("doctors", JSON.stringify(updated));
    setDoctors(updated);
  };

  // change status
  const handleStatusChange = (id: string, status: "Active" | "Inactive") => {
    saveDoctors(
      doctors.map((doctor) => (doctor.id === id ? { ...doctor, status } : doctor))
    );
  };

  const columns: Column<Doctor>[] = [
    { key: "doctorName", label: "Name" },
    { key: "degree", label: "Degree" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
    { key: "status", label: "Status",
      render: (row) => (
        <Select
          size="small"
          value={row.status}
          onChange={(e) =>
            handleStatusChange(row.id, e.target.value as "Active" | "Inactive")
          }
          sx={{
            minWidth: 100,
            fontSize: 13,
            fontWeight: 600,
            "& .MuiSelect-select": {
              color:
                row.status === "Active"
                  ? "success.main"
                  : "error.main",
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

  // filter doctors
  const filteredDoctors = doctors.filter((d) =>
    d.doctorName.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
    {/* search & add doctor */}
      <FormProvider {...methods}>
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 20, sm: 24, md: 28 },  
              fontWeight: 700,
              color: '#111827',
              mt: {xs:1 , md:0.5},
              mb: 0.5,
            }}
          >
            Doctors
          </Typography>
        </Box>
        <Paper sx={{ px: { xs:2, md:4 },
         pt:2,
          
          pb:{ xs:2, md:0} }}>

            
          <Box display="flex"
           flexDirection={{ xs:"column", md:"row" }} justifyContent="space-between" alignItems={{ md:"center" }} 
           sx={{
            gap: {xs:0, md:2 }
            }} >
             <SearchField
              name="search"
               label="Search" placeholder="Search by Name" size="small"
                sx={{ 
                  width: { xs:"100%", md:550 },
                   }} />
              <Button
                     variant="contained"
                      sx={{ textTransform:"none", alignItems:"center", height:36, width: { xs:"100%", md:"auto" }, bgcolor:"#238878", 
                      "&:hover": { backgroundColor:"#fff", color:"#1b7f6b", border:"2px solid #1b7f6b", },
                       }}
                       onClick={() => navigate(URL_PATH.AddDoctor)} > +Add Doctor 
                </Button>
           </Box>
     </Paper>
      </FormProvider>

      <Paper sx={{ 
        //mx:{xs:1, md:2},
         mt:2, p: { xs:1, md:2 } }}>
        <Typography fontSize={{ xs: 18, md: 20 }} mb={2} fontWeight={600}>
          Doctors List
        </Typography>
        <Divider sx={{ mb: 3 }} />
     
          <UniversalTable
            data={filteredDoctors}
            columns={columns}
            showSearch={true}         
            showExport={true}
            tableSize="small"
            actions={{
              view: setViewItem,
              edit: setEditDoctor,
              delete: async (doctor) => {
                const ok = await showConfirmation("Delete doctor?", "Confirm");
                if (ok) {
                  saveDoctors(doctors.filter((d) => d.id !== doctor.id));
                  showSnackbar("success", "Doctor deleted successfully");
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
          {viewItem?.registrationNo}
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
          {viewItem?.address}
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
      <DoctorEdit
      doctor={editDoctor}
      onClose={() => setEditDoctor(null)}
      onSave={(updatedDoctor: Doctor) => {
        saveDoctors(
          doctors.map((d) =>
            d.id === updatedDoctor.id ? updatedDoctor : d
          )
        );
        showSnackbar("info", "Doctor updated successfully");
        setEditDoctor(null);
      }}
    />  
    </>
  );
};

export default Doctors;




