import { useState, type FC } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  LinearProgress,
  Box,
  Typography,
  type TextFieldProps,
  type SxProps,
  type Theme,
  Tooltip
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { PasswordRegex, checkPasswordStrength, PasswordStrengthLevels } from '@/utils/RegexPattern';
import { useTranslation } from 'react-i18next';
import { getComponentTranslations } from '@/helpers/useTranslations';

type PasswordFieldProps = TextFieldProps & {
  name: string;
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  sx?: SxProps<Theme>;
  showStrengthIndicator?: boolean;
  confirmFieldName?: string;
};
const PasswordField: FC<PasswordFieldProps> = ({
  name,
  label,
  required = false,
  minLength = 8,
  maxLength = 32,
  sx,
  showStrengthIndicator = true,
  confirmFieldName,
  ...rest
}) => {
  const { t } = useTranslation();
  const translations = getComponentTranslations(t);
  const {
    control,
    formState: { errors },
    watch,
    clearErrors
  } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const confirmValue = confirmFieldName ? watch(confirmFieldName) : undefined;
  const validatePassword = (value: string) => {
    if (!value) return required ? translations.passwordField.requiredError(label) : true;
    if (value.length < minLength) return translations.passwordField.minLength(minLength);
    if (value.length > maxLength) return translations.passwordField.maxLength(maxLength);
    if (!PasswordRegex.withCase.regex.test(value)) return PasswordRegex.withCase.message;
    if (!PasswordRegex.withNumber.regex.test(value)) return PasswordRegex.withNumber.message;
    if (!PasswordRegex.withSpecialChar.regex.test(value)) return PasswordRegex.withSpecialChar.message;
    if (confirmFieldName && value !== confirmValue) return translations.passwordField.mismatch;

    return true;
  };

  const getStrengthLevel = (password: string) => {
    const strength = checkPasswordStrength(password);
    return [...PasswordStrengthLevels].reverse().find((level) => strength >= level.minScore) || PasswordStrengthLevels[0];
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? `${label} is required` : undefined,
        validate: validatePassword
      }}
      render={({ field }) => {
        const hasError = !!errors[name];
        const strengthLevel = getStrengthLevel(field.value);
        const showStrength = showStrengthIndicator && field.value && !hasError;

        return (
          <Tooltip
            title="Must contain uppercase, lowercase, number, and special character"
            open={focused && !hasError}
            placement="right"
            arrow
          >
            <Box sx={{ mb: 2 }}>
              <TextField
                {...field}
                {...rest}
                fullWidth
                required={required}
                label={label}
                type={showPassword ? 'text' : 'password'}
                value={field.value || ''}
                onFocus={() => setFocused(true)}
                onBlur={() => {
                  setFocused(false);
                  if (field.value) clearErrors(name);
                }}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                error={hasError}
                helperText={errors[name]?.message?.toString() || ' '}
                inputProps={{ maxLength }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiInputLabel-asterisk': { color: 'error.main' },
                  ...sx
                }}
              />

              {showStrength && (
                <Box sx={{ mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(strengthLevel.minScore / PasswordStrengthLevels.length) * 100}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'action.disabledBackground',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: strengthLevel.color,
                        borderRadius: 3
                      }
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: strengthLevel.color,
                      display: 'block',
                      textAlign: 'right',
                      mt: 0.5
                    }}
                  >
                    {strengthLevel.label}
                  </Typography>
                </Box>
              )}
            </Box>
          </Tooltip>
        );
      }}
    />
  );
};

export default PasswordField;
