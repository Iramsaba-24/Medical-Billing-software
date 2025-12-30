/* eslint-disable @typescript-eslint/no-explicit-any */
import { type FC, type SyntheticEvent } from 'react';
import {
  TextField,
  FormControl,
  FormHelperText,
  type SxProps,
  type Theme,
  Autocomplete,
  type AutocompleteRenderInputParams
} from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import { getComponentTranslations } from '@/helpers/useTranslations';
import { useTranslation } from 'react-i18next';

type Option = {
  label: string;
  value: string;
};

type DropdownFieldProps = {
  label?: string;
  name: string;
  options: Option[];
  required?: boolean;
  sx?: SxProps<Theme>;
  disabled?: boolean;
  onChangeCallback?: (value: string) => void;
  freeSolo?: boolean;
  placeholder?: string;
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
  placeholder
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
            <Autocomplete
              freeSolo={freeSolo}
              options={options}
              value={selectedOption || value || null}
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
                  {...params}
                  {...field}
                  inputRef={ref}
                  label={label}
                  placeholder={placeholder}
                  error={!!errors[name]}
                  required={required}
                  InputLabelProps={{
                    ...params.InputLabelProps,
                    shrink: true
                  }}
                />
              )}
            />
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