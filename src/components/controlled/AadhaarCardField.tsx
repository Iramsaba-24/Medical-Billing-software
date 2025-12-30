import { type FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextField, type SxProps, type TextFieldProps, type Theme } from '@mui/material';
import { aadharRegex, formatAadhar } from '@/utils/RegexPattern';
import { useTranslation } from 'react-i18next';
import { getComponentTranslations } from '@/helpers/useTranslations';

type AadharCardInputProps = TextFieldProps & {
  name: string;
  label: string;
  required?: boolean;
  sx?: SxProps<Theme>;
};

const AadhaarCardField: FC<AadharCardInputProps> = ({ name, label, required = false, sx, ...rest }) => {
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
        required: required ? translations.aadhaarCardField.requiredError(label) : undefined,
        validate: (value: string) => {
          if (!value) return true;
          if (!aadharRegex.test(value)) {
            return translations.aadhaarCardField.invalidError;
          }
          return true;
        }
      }}
      render={({ field }) => (
        <TextField
          {...field}
          {...rest}
          label={label}
          fullWidth
          required={required}
          value={formatAadhar(field.value || '')}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/\D/g, '').slice(0, 12);
            field.onChange(rawValue);
          }}
          error={!!errors[name]}
          helperText={String(errors[name]?.message || ' ')}
          inputProps={{
            maxLength: 14,
            onKeyDown: (e) => {
              if (!/[\d]/.test(e.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
              }
            }
          }}
          sx={{
            '& .MuiInputLabel-asterisk': { color: 'error.main' },
            ...sx
          }}
        />
      )}
    />
  );
};

export default AadhaarCardField;
