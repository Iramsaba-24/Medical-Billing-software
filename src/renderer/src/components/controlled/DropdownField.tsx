/* eslint-disable @typescript-eslint/no-explicit-any */
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { type FC, type SyntheticEvent } from 'react';
import {
  TextField,
  FormControl,
  FormHelperText,
  type SxProps,
  type Theme,
  Autocomplete,
  type AutocompleteRenderInputParams,
  MenuItem,
  TextFieldProps
} from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import { getComponentTranslations } from '@/helpers/useTranslations';
import { useTranslation } from 'react-i18next';


type Option = {
  label: string;
  value: string;
};

type DropdownFieldProps = TextFieldProps & {
  label?: string;
  name: string;
  options: Option[];
  required?: boolean;
  sx?: SxProps<Theme>;
  disabled?: boolean;
  onChangeCallback?: (value: string) => void;
  freeSolo?: boolean;
  placeholder?: string;
  floatLabel?: boolean;
  isStatic?: boolean
};

const DropdownField: FC<DropdownFieldProps> = ({ 
  label, 
  name, 
  disabled, 
  options, 
  required = false, 
  sx = {}, 
  onChangeCallback,
  freeSolo = true,
  placeholder,
  floatLabel = false,
  isStatic=  false,
  ...rest
}) => {
  const { t } = useTranslation();
  const translations = getComponentTranslations(t);
  const {
    control,
    formState: { errors }
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? translations.dropdownField.requiredError(label || name) : undefined,
        validate: (value: string) => {
          if (!required && !value) return true;
          if (!value) return translations.dropdownField.emptyError;
          return true;
        }
      }}
      render={({ field: { onChange, value, ref, ...field } }) => {
        // Find the selected option or use string value
        const selectedOption = options.find(option => option.value === value);
        
        return (
          <FormControl
            fullWidth
            required={required}
            error={!!errors[name]}
            sx={{
              '& .MuiFormLabel-asterisk': {
                color: 'error.main'
              },
              ...sx
            }}
            disabled={disabled}
          >
          {isStatic ? (
              <TextField
                select
                fullWidth
                value={value || ''}
                onChange={(e) => {
                  onChange(e.target.value);
                }}
                label={floatLabel ? label : undefined}
                placeholder={!floatLabel ? placeholder : undefined}
                error={!!errors[name]}
                required={required}
              >
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            ):(
            <Autocomplete
              freeSolo={freeSolo}
              options={options}
              value={selectedOption || value || null}
              popupIcon={<KeyboardArrowDownIcon />}
              forcePopupIcon  
              onChange={(_event: SyntheticEvent<Element, Event>, newValue: any) => {
                let newValueStr = '';
                
                if (typeof newValue === 'string') {
                  // User typed a free text value
                  newValueStr = newValue;
                } else if (newValue && newValue.value) {
                  // User selected an option
                  newValueStr = newValue.value;
                }
                
                onChange(newValueStr);
                if (onChangeCallback) {
                  onChangeCallback(newValueStr);
                }
              }}
              getOptionLabel={(option: any) => {
                if (typeof option === 'string') {
                  return option;
                }
                return option.label || '';
              }}
              renderInput={(params: AutocompleteRenderInputParams) => (
                <TextField
                  {...rest}
                  {...params}
                  {...field}
                  inputRef={ref}
                  label={floatLabel ? label : undefined}
                  placeholder={!floatLabel ? placeholder : undefined}
                  error={!!errors[name]}
                  required={required}
                />
              )}
            />)}
            <FormHelperText sx={{ mt: 0.5, mx: 0 }}>
              {errors[name]?.message?.toString() || ' '}
            </FormHelperText>
          </FormControl>
        );
      }}
    />
  );
};

export default DropdownField;


// import { FC } from "react";
// import {
//   TextField,
//   MenuItem,
//   SxProps,
//   Theme
// } from "@mui/material";

// export type DropdownOption = {
//   label: string;
//   value: string;
// };

// type DropdownInputProps = {
//   placeholder?: string;
//   value: string;
//   options: DropdownOption[];
//   onChange: (value: string) => void;
//   disabled?: boolean;
//   sx?: SxProps<Theme>;
// };

// const DropdownInput: FC<DropdownInputProps> = ({
//   placeholder = "Select",
//   value,
//   options,
//   onChange,
//   disabled,
//   sx
// }) => {
//   return (
//     <TextField
//       select
//       fullWidth
//       value={value}
//       disabled={disabled}
//       onChange={(e) => onChange(e.target.value)}
//       sx={sx}
//     >
//       <MenuItem value="" disabled>
//         {placeholder}
//       </MenuItem>

//       {options.map((option) => (
//         <MenuItem key={option.value} value={option.value}>
//           {option.label}
//         </MenuItem>
//       ))}
//     </TextField>
//   );
// };

// export default DropdownInput;
