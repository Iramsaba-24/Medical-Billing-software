import { TextField, InputAdornment, type SxProps, type Theme, type TextFieldProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { mobileRegex, SanitizeMobileRegex } from '@/utils/RegexPattern';
import { useTranslation } from 'react-i18next';
import { getComponentTranslations } from '@/helpers/useTranslations';

type MobileFieldProps = TextFieldProps & {
  label: string;
  name: string;
  required?: boolean;
  sx?: SxProps<Theme>;
};

const MobileField: React.FC<MobileFieldProps> = ({ label, name, required = false, sx = {}, ...rest }) => {
  const {
    control,
    formState: { errors }
  } = useFormContext();

  const { t } = useTranslation();
  const trans = getComponentTranslations(t);

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? trans.mobileField.requiredError(label) : undefined,
        validate: (value: string = '') => {
          if (!value && required) return label ? `${label} is required` : 'Field is required';
          const sanitized = value.replace(/\D/g, '');
          if (!mobileRegex.test(value)) return trans.mobileField.invalidFormat;
          if (sanitized.length > 10) return trans.mobileField.maxDigits;
          if (sanitized.length < 10) return trans.mobileField.minDigits;
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
            if (digitsOnly.length <= 10) {
              field.onChange(input);
            }
          }}
          InputProps={{
            startAdornment: <InputAdornment position="start">+91</InputAdornment>
          }}
          required={required}
          sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, ...sx }}
        />
      )}
    />
  );
};

export default MobileField;
