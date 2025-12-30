import { type FC } from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  type SxProps,
  type Theme,
  type RadioGroupProps
} from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getComponentTranslations } from '@/helpers/useTranslations';

type RadioFieldProps = RadioGroupProps & {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  required?: boolean;
  sx?: SxProps<Theme>;
  disabled?: boolean;
};

const RadioField: FC<RadioFieldProps> = ({ label, name, options, required = false, disabled = false, sx, ...rest }) => {
  const { t } = useTranslation();
  const translations = getComponentTranslations(t);
  const {
    control,
    formState: { errors }
  } = useFormContext();

  return (
    <FormControl
      component="fieldset"
      error={!!errors[name]}
      required={required}
      disabled={disabled}
      sx={{
        '& .MuiFormLabel-asterisk': { color: 'error.main' },
        ...sx
      }}
    >
      <FormLabel component="legend">{label}</FormLabel>

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? translations.radioField.requiredError(label) : undefined
        }}
        render={({ field }) => (
          <RadioGroup {...field} {...rest} row>
            {options.map((option) => (
              <FormControlLabel disabled={disabled} key={option.value} value={option.value} control={<Radio />} label={option.label} />
            ))}
          </RadioGroup>
        )}
      />

      <FormHelperText>{String(errors[name]?.message || ' ')}</FormHelperText>
    </FormControl>
  );
};

export default RadioField;
