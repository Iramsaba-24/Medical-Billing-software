import { type FC } from 'react';
import { TextField, type TextFieldProps, type SxProps, type Theme } from '@mui/material';
import { Controller, useFormContext, type RegisterOptions, get } from 'react-hook-form';
import { TextRegexPattern, removeEmojis, type InputType } from '@/utils/RegexPattern';
import { useTranslation } from 'react-i18next';
import { getComponentTranslations } from '@/helpers/useTranslations';

type TextInputFieldProps = TextFieldProps & {
  name: string;
  label: string;
  required?: boolean;
  inputType?: InputType;
  minLength?: number;
  maxLength?: number;
  rows?: number;
  sx?: SxProps<Theme>;
  rules?: RegisterOptions;
};

const TextInputField: FC<TextInputFieldProps> = ({
  name,
  label,
  required = false,
  inputType = 'alphanumeric',
  minLength,
  maxLength,
  rows = 2,
  sx,
  rules,
  ...rest
}) => {
  const { t } = useTranslation();
  const trans = getComponentTranslations(t);

  const {
    control,
    formState: { errors },
    clearErrors
  } = useFormContext();

  const combineRules: RegisterOptions = {
    required: required ? trans.textInputField.requiredError(label) : undefined,
    ...(minLength !== undefined && {
      minLength: {
        value: minLength,
        message: trans.textInputField.minLength(minLength)
      }
    }),
    ...(maxLength !== undefined && {
      maxLength: {
        value: maxLength,
        message: trans.textInputField.maxLength(maxLength)
      }
    }),
    validate: (value: string) => {
      if (!value || inputType === 'all') return true;
      const config = TextRegexPattern[inputType];
      return config.regex.test(value) ? true : config.message;
    },
    ...rules
  };

  const sanitizeValue = (value: string) => {
    if (inputType === 'all') {
      return value;
    }
    const config = TextRegexPattern[inputType];
    const noEmoji = removeEmojis(value);
    return (noEmoji.match(config.allowed) || []).join('');
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={combineRules}
      render={({ field }) => {

const error = get(errors, name);
        const hasError = !!error;
        const helperText = hasError ? String(error?.message) : ' ';

       // const hasError = !!errors[name];
       // const helperText = hasError ? String(errors[name]?.message) : ' ';

        return (
          <TextField
            {...field}
            {...rest}
            fullWidth
            required={required}
            label={label}
            multiline={inputType === 'textarea' || inputType === 'all'}
            rows={inputType === 'textarea' || inputType === 'all' ? rows : undefined}
            value={field.value || ''}
            onChange={(e) => {
              const raw = e.target.value;
              const sanitized = sanitizeValue(raw);
              const finalValue = maxLength ? sanitized.slice(0, maxLength) : sanitized;
              field.onChange(finalValue);
              if (finalValue.trim()) clearErrors(name);
            }}
            error={hasError}
            helperText={helperText}
            inputProps={{ ...rest.inputProps, maxLength }}
            sx={{
              '& .MuiInputLabel-asterisk': { color: 'error.main' },
              ...sx
            }}
          />
        );
      }}
    />
  );
};

export default TextInputField;