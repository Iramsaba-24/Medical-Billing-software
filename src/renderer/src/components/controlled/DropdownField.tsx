
import { type FC } from 'react';
import {
  TextField,
  FormControl,
  FormHelperText,
  type SxProps,
  type Theme,
  Autocomplete,
  type AutocompleteRenderInputParams,
  type TextFieldProps
} from '@mui/material';
import { useFormContext, Controller, get } from 'react-hook-form';
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
  editable?: boolean;
};
 
const DropdownField: FC<DropdownFieldProps> = ({
  label,
  name,
  disabled,
  options,
  required = false,
  sx = {},
  onChangeCallback,
  freeSolo = false,
  placeholder,
  editable = false,
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
        const selectedOption = !freeSolo
          ? options.find((option) => option.value === value)
          : null;
 
        return (
          <FormControl
            fullWidth
            required={required}
            error={!!get(errors, name)}
            sx={{
              '& .MuiFormLabel-asterisk': {
                color: 'error.main'
              },
              ...sx
            }}
            disabled={disabled}
          >
            <Autocomplete
              freeSolo={freeSolo && editable}
              options={options}
              value={selectedOption}
              inputValue={typeof value === 'string' ? value : value?.toString() || ''}
              isOptionEqualToValue={(option, val) => {
                if (!val) return false;
                if (typeof val === 'string') {
                  return option.value === val;
                }
                return option.value === val?.value;
              }}
              onChange={(_e, newValue) => {
                let newValueStr = '';
               
                if (typeof newValue === 'string') {
                  newValueStr = newValue;
                } else if (newValue && typeof newValue === 'object') {
                  newValueStr = newValue.value;
                }
               
                onChange(newValueStr);
                onChangeCallback?.(newValueStr);
              }}
              onInputChange={(_e, newInputValue, reason) => {
                if (freeSolo && editable && reason === 'input') {
                  onChange(newInputValue);
                  onChangeCallback?.(newInputValue);
                }
              }}
              getOptionLabel={(option: Option | string) => {
                if (typeof option === 'string') {
                  return option;
                }
                return option.label || option.value || '';
              }}
              selectOnFocus={editable}
              clearOnBlur={editable}
              handleHomeEndKeys={editable}
              renderInput={(params: AutocompleteRenderInputParams) => (
                <TextField
                  {...params}
                  {...field}
                  {...rest}
                  inputRef={ref}
                  label={label}
                  placeholder={placeholder}
                  error={!!get(errors, name)}
                  required={required}
                  InputLabelProps={{
                    ...params.InputLabelProps,
                    shrink: true
                  }}
                  inputProps={{
                    ...params.inputProps,
                    readOnly: !editable,
                  }}
                />
              )}
            />
            <FormHelperText sx={{ mt: 0.5, mx: 0}}>
              {get(errors, name)?.message?.toString() || ' '}
            </FormHelperText>
          </FormControl>
        );
      }}
    />
  );
};
 
export default DropdownField;
 