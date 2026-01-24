import { type FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  LocalizationProvider,
  type DatePickerProps,
  type TimePickerProps,
  type DateTimePickerProps,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  IconButton,
  InputAdornment,
  type SxProps,
  type Theme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs, { type Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import { getComponentTranslations } from "@/helpers/useTranslations";

type ViewMode = "date" | "time" | "datetime" | "month" | "year" | "month-year";

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

const DateTimeField: FC<DateFieldProps> = ({
  name,
  label,
  required = false,
  sx,
  viewMode = "date",
  useCurrentDate = false,
  ...pickerProps
}) => {
  const { t } = useTranslation();
  const translations = getComponentTranslations(t);
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const parseValue = (value: unknown): Dayjs | null => {
    if (!value) return null;
    if (dayjs.isDayjs(value)) return value;
    if (value instanceof Date) return dayjs(value);

    if (typeof value !== "string") return null;

    switch (viewMode) {
      case "year":
        return dayjs(value, "YYYY", true);
      case "month":
      case "month-year":
        return dayjs(value, "YYYY-MM", true);
      case "time":
        return dayjs(value, "HH:mm", true);
      case "datetime":
        return dayjs(value);
      case "date":
      default:
        return dayjs(value);
    }
  };

  const toStoreValue = (date: Dayjs): string => {
    switch (viewMode) {
      case "year":
        return date.format("YYYY");
      case "month":
      case "month-year":
        return date.format("YYYY-MM");
      case "time":
        return date.format("HH:mm");
      case "datetime":
      case "date":
      default:
        return date.toISOString();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required
            ? translations.dateTimeField.requiredError(label)
            : undefined,
        }}
        render={({ field }) => {
          if (useCurrentDate && !field.value) {
            field.onChange(toStoreValue(dayjs()));
          }

          const parsedValue = parseValue(field.value);
          const hasError = !!errors[name];

          const commonProps = {
            label,
            value: parsedValue,
            onChange: (value: Dayjs | null) => {
              if (value && value.isValid()) {
                field.onChange(toStoreValue(value));
              } else {
                field.onChange(null);
              }
            },

            slotProps: {
              textField: {
                fullWidth: true,
                required,
                error: hasError,
                helperText: String(errors[name]?.message || " "),
                sx: {
                  "& .MuiInputLabel-asterisk": { color: "error.main" },
                  ...sx,
                },
                InputProps: {
                  endAdornment: field.value ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          field.onChange(null);
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                },
              },
            },

            ...pickerProps,
          };

          switch (viewMode) {
            case "time":
              return <TimePicker {...commonProps} />;

            case "datetime":
              return (
                <DateTimePicker {...commonProps} format="DD-MM-YYYY HH:mm" />
              );

            case "month":
              return (
                <DatePicker {...commonProps} views={["month"]} format="MMMM" />
              );

            case "year":
              return (
                <DatePicker {...commonProps} views={["year"]} format="YYYY" />
              );

            case "month-year":
              return (
                <DatePicker
                  {...commonProps}
                  views={["year", "month"]}
                  openTo="month"
                  format="MMMM YYYY"
                />
              );

            case "date":
            default:
              return (
                <DatePicker
                  {...commonProps}
                  views={["year", "month", "day"]}
                  format="DD-MM-YYYY"
                />
              );
          }
        }}
      />
    </LocalizationProvider>
  );
};

export default DateTimeField;
