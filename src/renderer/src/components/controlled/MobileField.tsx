import React from "react";
import { TextField,Select,MenuItem,  InputAdornment, type SxProps, type Theme, type TextFieldProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { SanitizeMobileRegex } from '@/utils/RegexPattern';
import { useTranslation } from 'react-i18next';
import { getComponentTranslations } from '@/helpers/useTranslations';

type MobileFieldProps = TextFieldProps & {
  label: string;
  name: string;
  required?: boolean;
  sx?: SxProps<Theme>;
  countryCode?: string;
};

const countryCodes = [
 { code: "+91", label: "India", digits: 10 },
 { code: "+1", label: "USA", digits: 10 },
 { code: "+44", label: "UK", digits: 10 },
 { code: "+971", label: "UAE", digits: 9 },
 { code: "+61", label: "Australia", digits: 9 },
 { code: "+81", label: "Japan", digits: 10 },
 { code: "+49", label: "Germany", digits: 11 },
 { code: "+33", label: "France", digits: 9 }
];

const MobileField: React.FC<MobileFieldProps> = ({ label, name, required = false, sx = {}, ...rest }) => {
  const {
    control,
    formState: { errors }
  } = useFormContext();

  const { t } = useTranslation();
  const trans = getComponentTranslations(t);
  const [selectedCode, setSelectedCode] = React.useState("+91");
  const selectedCountry = countryCodes.find(
  (c) => c.code === selectedCode
);


  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? trans.mobileField.requiredError(label) : undefined,
       validate: (value: string = '') => {
  if (!value && required) return label ? `${label} is required` : 'Field is required';

  const sanitized = value.replace(/\D/g,'');

if (selectedCountry && sanitized.length !== selectedCountry.digits) {
  return `Mobile number must be ${selectedCountry.digits} digits`;
}

  return true;
}
      }}
      render={({ field }) => (
        <TextField
          {...field}
          {...rest}
          fullWidth
          label={label}
          value={field.value || ''}
          error={!!errors[name]}
          helperText={String(errors[name]?.message || ' ')}
         onChange={(e) => {
  const input = SanitizeMobileRegex(e.target.value);
  const digitsOnly = input.replace(/\D/g, '');

 if (selectedCountry && digitsOnly.length <= selectedCountry.digits) {
    field.onChange(input);
  }
}}
          InputProps={{
           startAdornment: (
  <InputAdornment position="start">
    <Select
      value={selectedCode}
     onChange={(e) => setSelectedCode(e.target.value as string)}
      variant="standard"
      disableUnderline
      sx={{ minWidth: 70 }}
    >
      {countryCodes.map((c) => (
        <MenuItem key={c.code} value={c.code}>
          {c.code}
        </MenuItem>
      ))}
    </Select>
  </InputAdornment>
)
          }}
          required={required}
          sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, ...sx }}
        />
      )}
    />
  );
};

export default MobileField;
