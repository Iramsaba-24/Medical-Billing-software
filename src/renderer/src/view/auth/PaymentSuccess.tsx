import { Box, Typography, Button } from "@mui/material";
import BgImage from "@/assets/bgloginpage.svg";
import LogoImage from "@/assets/logoimg.svg";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const handleClick = () => { 
    navigate(URL_PATH.Dashboard);
  };
  return (
    <Box
      sx={{
        minHeight: "98vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${BgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        px: { xs: 2, sm: 0 },
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          maxWidth: 700,
          width: "100%",
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src={LogoImage}
          alt="Medi Logo"
          sx={{
            width: 160,
            mb: 3,
          }}
        />

        {/* Heading */}
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            color: "#1b7f6b",
            mb: 3,
            fontSize: { xs: 20, sm: 22, md: 25 }
          }}
        >
          🎉 Payment Successful & Account Activated!
        </Typography>

        {/* Sub Text */}
        <Typography
          sx={{
            color: "#555",
            fontSize: { xs: 16, sm: 18, md: 20 },
            mb: 2,
          }}
        >
          Thank you for purchasing our software.
        </Typography>

        <Typography
          sx={{
            color: "#555",
            fontSize: { xs: 16, sm: 18, md: 20 },
            mb: 2,
          }}
        >
          Your account is now active and ready to use.
        </Typography>

        <Typography
          sx={{
            color: "#777",
            fontSize: { xs: 12, sm: 14, md: 16 },
            mb: 2,
          }}
        >
          📧 A confirmation email has been sent to your registered email address.
        </Typography>

        {/* Button */}
        <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: { xs: 3, sm: 5 },
              fontWeight: 600,
              fontSize: { xs: "1rem", sm: "1.05rem" },
              backgroundColor: "#1b7f6b",
              textTransform: "none",
              border: "2px solid #1b7f6b",
              boxShadow: "0 0 0 1.5px #ffffff, 0 6px 14px rgba(0,0,0,0.25)",
              transition: "all 0.25s ease",
              "&:hover": {
                backgroundColor: "#fff",
                color: "#1b7f6b",
              },
            }}
            onClick={handleClick}
          >
            Next Step
          </Button>
      </Box>
    </Box>
  );
}

export default PaymentSuccess;






