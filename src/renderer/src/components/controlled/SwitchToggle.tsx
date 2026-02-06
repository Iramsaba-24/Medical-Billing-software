import { useController, useFormContext } from "react-hook-form";
import { Switch } from "@mui/material";

type SwitchToggleProps = {
  name: string;
}; 

const SwitchToggle = ({ name }: SwitchToggleProps) => {
  const { control } = useFormContext();
  const { field } = useController({
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
  }}} 
     
    />
  );
};

export default SwitchToggle;