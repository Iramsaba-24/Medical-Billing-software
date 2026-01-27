import { type FC } from 'react';
import { TextField, InputAdornment, type SxProps, type TextFieldProps, type Theme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Controller, useFormContext } from 'react-hook-form';
import { getComponentTranslations } from '@/helpers/useTranslations';
import { useTranslation } from 'react-i18next';

type SearchFieldProps = TextFieldProps & {
  label: string;
  name: string;
  required?: boolean;
  sx?: SxProps<Theme>;
  placeholder?: string;
  floatLabel?: boolean;

};

const SearchField: FC<SearchFieldProps> = ({ label, name, sx, placeholder, floatLabel = false, required = false, ...rest }) => {
  const { t } = useTranslation();
  const trans = getComponentTranslations(t);
  const {
    control,
    formState: { errors }
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? trans.searchField.requiredError(label) : undefined
      }}
      render={({ field }) => (
        <TextField
          {...field}
          {...rest}
          label={floatLabel ? label : undefined}
          value={field.value || ''}
          fullWidth
          required={required}
          placeholder={!floatLabel ? placeholder : undefined}
          error={!!errors[name]}
          helperText={String(errors[name]?.message || ' ')}
          onChange={(e) => field.onChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, ...sx }}
        />
      )}
    />
  );
};

export default SearchField;



