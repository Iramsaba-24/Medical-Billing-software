import { type FC } from 'react';
import { TextField, type SxProps, type TextFieldProps, type Theme } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import { emailRegex, emailDomainRegex, SanitizeEmailRegex } from '@/utils/RegexPattern';
import { getComponentTranslations } from '@/helpers/useTranslations';
import { useTranslation } from 'react-i18next';

type EmailFieldProps = TextFieldProps & {
  label: string;
  name: string;
  required?: boolean;
  sx?: SxProps<Theme>;
};

const EmailField: FC<EmailFieldProps> = ({ label, name, sx, required = false, ...rest }) => {
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
        required: required ? translations.emailField.requiredError(label) : undefined,
        validate: (value: string) => {
          if (!value) return true;
          if (!emailRegex.test(value)) return translations.emailField.invalidFormat;
          if (!emailDomainRegex.test(value)) return translations.emailField.invalidDomain;
          return true;
        }
      }}
      render={({ field }) => (
        <TextField
          {...field}
          {...rest}
          label={label}
          inputMode="email"
          type="email"
          value={field.value || ''}
          fullWidth
          required={required}
          error={!!errors[name]}
          helperText={String(errors[name]?.message || ' ')}
          onChange={(e) => field.onChange(SanitizeEmailRegex(e.target.value))}
          sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, ...sx }}
        />
      )}
    />
  );
};

export default EmailField;
