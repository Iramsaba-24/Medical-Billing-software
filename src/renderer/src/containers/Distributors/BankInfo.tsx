import { Box, Typography } from "@mui/material";

type DetailItem = {
  label: string;
  value: string;
}

type BankInfoProps = {
  title: string;
  details: DetailItem[];
}

const BankInfo = ({ 
  title, 
  details 
}: BankInfoProps) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="h6" fontWeight={600} mb={3}>
      {title}
    </Typography>
     {/* for displaying details in card */}
    <Box sx={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
      {details.map((item, index) => (
        <Box 
          key={index} 
          sx={{ 
            width: { xs: "100%", sm: "50%", md: "33.33%" }, 
            mb: 3 
          }}
        >
          <Typography sx={{ fontSize: "12px", color: "gray", mb: 0.5 }}>
            {item.label}:
          </Typography>
          <Typography sx={{ fontSize: "14px", fontWeight: 500, wordBreak: "break-word" }}>
            {item.value || "N/A"}
          </Typography>
        </Box>
      ))}
    </Box>
  </Box>
);

export default BankInfo;