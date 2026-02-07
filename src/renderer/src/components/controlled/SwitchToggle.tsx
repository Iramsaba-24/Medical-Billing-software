import { useController, useFormContext } from "react-hook-form"; 
import { Switch } from "@mui/material";

type SwitchToggleProps = {
  name: string;
} ; // checked and onChange are handled internally 

const SwitchToggle = ({name}: SwitchToggleProps) => {
  const { control } = useFormContext(); // whole form controlled by react-hook-form(page): form provider
  
  const { field } = useController({     // only field object controlled by react-hook-form(fields)
    name,
    control,
  });

  return (
    <Switch
      checked={field.value} //current state 
      onChange={(e) => field.onChange(e.target.checked)} // onchange state
      sx={{  "& .MuiSwitch-switchBase": {
      "&.Mui-checked": {
      color: "#238878",
      "+ .MuiSwitch-track": {
        backgroundColor: "#238878",
      },
    },
  },}} 
    />
  );
};

export default SwitchToggle;;