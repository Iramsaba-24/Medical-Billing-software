import { useController, useFormContext } from "react-hook-form"; 
import { Switch } from "@mui/material";

type SwitchToggleProps = {
  name: string;
} ;  

const SwitchToggle = ({name}: SwitchToggleProps) => {  //which fields i have to used in form eg: name, required
  const { control } = useFormContext(); //  form controlled by react-hook-form(page): form provider  
  const { field } = useController({     // only field object controlled by react-hook-form(fields)
    name,
    control,
  });

  return (
    <Switch
      checked={field.value} //current  
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

export default SwitchToggle;

