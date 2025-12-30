import { type FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  type DatePickerProps,
  type TimePickerProps,
  type DateTimePickerProps
} from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { type SxProps, type Theme } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import { getComponentTranslations } from '@/helpers/useTranslations';
import { useTranslation } from 'react-i18next';

dayjs.extend(customParseFormat);
dayjs.extend(localeData);

type ViewMode = 'date' | 'time' | 'datetime' | 'month' | 'year';

type DateFieldProps = {
  name: string;
  label: string;
  required?: boolean;
  sx?: SxProps<Theme>;
  viewMode?: ViewMode;
  useCurrentDate?: boolean;
} & Partial<DatePickerProps> &
  Partial<TimePickerProps> &
  Partial<DateTimePickerProps>;

const DateTimeField: FC<DateFieldProps> = ({ name, label, required = false, sx, viewMode = 'date', useCurrentDate, ...pickerProps }) => {
  const { t } = useTranslation();
  const translations = getComponentTranslations(t);
  const {
    control,
    formState: { errors }
  } = useFormContext();

  const formatOutput = (date: Dayjs): string | number => {
    switch (viewMode) {
      case 'date':
        return date.format('DD/MM/YYYY');
      case 'time':
        return date.format('hh:mm A');
      case 'datetime':
        return date.format('DD/MM/YYYY hh:mm A');
      case 'month':
        return date.format('MMMM');
      case 'year':
        return date.year();
      default:
        return date.toString();
    }
  };

  const parseValue = (rawValue: unknown): Dayjs | null => {
    if (!rawValue) return null;
    if (dayjs.isDayjs(rawValue)) return rawValue;
    if (rawValue instanceof Date) return dayjs(rawValue);

    switch (viewMode) {
      case 'month': {
        const months = dayjs().localeData().months();
        const monthIndex = months.indexOf(String(rawValue));
        return monthIndex >= 0 ? dayjs().month(monthIndex) : null;
      }
      case 'year':
        return dayjs().year(Number(rawValue));
      case 'time':
        return dayjs(String(rawValue), 'hh:mm A', true);

      case 'date':
        return dayjs(String(rawValue), 'DD/MM/YYYY', true);
      case 'datetime':
        return dayjs(String(rawValue), 'DD/MM/YYYY hh:mm A', true);
      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? translations.dateTimeField.requiredError(label) : undefined
        }}
        render={({ field }) => {
          if (useCurrentDate && !field.value) {
            const now = dayjs();
            const parsedNow = viewMode === 'month' ? now.startOf('month') : viewMode === 'year' ? now.startOf('year') : now;

            field.onChange(formatOutput(parsedNow));
          }

          const parsedValue = parseValue(field.value);

          const hasError = !!errors[name];

          const commonPickerProps = {
            label,
            value: parsedValue,
            onChange: (value: Dayjs | Date | null) => {
              if (dayjs.isDayjs(value) && value.isValid()) {
                field.onChange(formatOutput(value));
              } else if (value instanceof Date) {
                const parsed = dayjs(value);
                if (parsed.isValid()) field.onChange(formatOutput(parsed));
              } else {
                field.onChange(null);
              }
            },

            format: viewMode === 'date' ? 'DD/MM/YYYY' : viewMode === 'datetime' ? 'DD/MM/YYYY hh:mm A' : undefined,
            slotProps: {
              textField: {
                fullWidth: true,
                required,
                error: hasError,
                helperText: String(errors[name]?.message || ' '),
                sx: {
                  '& .MuiInputLabel-asterisk': { color: 'error.main' },
                  ...sx
                }
              }
            },
            timeSteps: { minutes: 1 },
            enableAccessibleFieldDOMStructure: false,
            ...pickerProps
          };

          if (viewMode === 'time') {
            return <TimePicker {...commonPickerProps} views={['hours', 'minutes']} minutesStep={1} />;
          }

          if (viewMode === 'datetime') {
            return <DateTimePicker {...commonPickerProps} />;
          }

          if (viewMode === 'month') {
            return <DatePicker {...commonPickerProps} views={['month']} />;
          }

          if (viewMode === 'year') {
            return <DatePicker {...commonPickerProps} views={['year']} />;
          }

          return <DatePicker {...commonPickerProps} />;
        }}
      />
    </LocalizationProvider>
  );
};

export default DateTimeField;
