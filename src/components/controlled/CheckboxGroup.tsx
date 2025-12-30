import { type FC } from 'react';
import { FormControl, FormControlLabel, Checkbox, FormHelperText, FormLabel, type CheckboxProps } from '@mui/material';
import { type SxProps, type Theme } from '@mui/system';
import { useFormContext, Controller } from 'react-hook-form';
import { getComponentTranslations } from '@/helpers/useTranslations';
import { useTranslation } from 'react-i18next';

type CheckboxOption = CheckboxProps & {
  label: string;
  value: string;
};

type CheckboxGroupFieldProps = {
  name: string;
  label: string;
  required?: boolean;
  options: CheckboxOption[];
  sx?: SxProps<Theme>;
  onChange?: (checkedValues: string[]) => void;
};

const CheckboxGroup: FC<CheckboxGroupFieldProps> = ({ name, label, required = false, options, sx, onChange, ...rest }) => {
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
        required: required ? translations.checkboxGroup.requiredError(label) : undefined
      }}
      render={({ field }) => {
        const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
          const newValue = event.target.checked ? [...(field.value || []), value] : field.value?.filter((v: string) => v !== value);

          field.onChange(newValue);
          onChange?.(newValue);
        };

        return (
          <FormControl component="fieldset" required={required} error={!!errors[name]} sx={sx}>
            <FormLabel component="legend">{label}</FormLabel>
            {options.map((option, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    {...rest}
                    checked={field.value?.includes(option.value) || false}
                    onChange={(e) => handleCheckboxChange(e, option.value)}
                  />
                }
                label={option.label}
              />
            ))}
            <FormHelperText>{String(errors[name]?.message || ' ')}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
};

export default CheckboxGroup;
