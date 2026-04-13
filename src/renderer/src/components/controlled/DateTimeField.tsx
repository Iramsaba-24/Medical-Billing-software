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

function getDateFormat(): string {
  try {
    const saved = localStorage.getItem("generalSettings");
    if (saved) {
      const settings = JSON.parse(saved);
      return settings.dateFormat || "DD/MM/YYYY";
    }
  } catch {
    // ignore
  }
  return "DD/MM/YYYY";
}

function getTimeFormat(): string {
  try {
    const saved = localStorage.getItem("generalSettings");
    if (saved) {
      const settings = JSON.parse(saved);
      
      
      const timeZone = settings.timeZone || "India (IST)";
      
      const twelveHourZones = ["US (EST)", "US (PST)", "Australia (AEST)"];
      
      if (twelveHourZones.includes(timeZone)) {
        return "hh:mm A";  // 12-hour
      }
      return "HH:mm";  // 24-hour
    }
  } catch {
    // ignore
  }
  return "HH:mm"; // default
}

const allowPastCurrentFuture = (): Dayjs => {
  return dayjs("1900-01-01");
};


const allowCurrentFutureOnly = (): Dayjs => {
  return dayjs().startOf("day");
};
type ViewMode = "date" | "time" | "datetime" | "month" | "year" | "month-year";
 
type DateFieldProps = {
  name: string;
  label: string;
  required?: boolean;
  sx?: SxProps<Theme>;
  viewMode?: ViewMode;
  useCurrentDate?: boolean;
  dateRestriction?: "past-current-future" | "current-future-only"; 
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
  dateRestriction = "current-future-only", // Default: block past
  ...pickerProps
}) => {
  const { t } = useTranslation();
  const translations = getComponentTranslations(t);
  const {
    control,
    formState: { errors },
  } = useFormContext();

  
  // Parse field value into Dayjs
  
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
        return dayjs(value, "YYYY-MM-DD", true);
      default:
        return dayjs(value);
    }
  };

  // Format value for storage
  
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
        return date.toISOString();
      case "date":
        return date.format("YYYY-MM-DD");
      default:
        return date.toISOString();
    }
  };

  

  
  const getMinDate = (): Dayjs => {
    if (dateRestriction === "past-current-future") {
      return allowPastCurrentFuture();
    } else if (dateRestriction === "current-future-only") {
      return allowCurrentFutureOnly();
    }
    return allowCurrentFutureOnly(); // default fallback
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
          const savedFormat = getDateFormat();
          
  const muiFormat = savedFormat.replace(/\//g, "-");
   const timeFormat = getTimeFormat();
        
         
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

          
           
            minDate: getMinDate(),

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
              return <TimePicker {...commonProps} format={timeFormat}  />;
 
            case "datetime":
              return (
                <DateTimePicker {...commonProps} format={`${muiFormat} ${timeFormat}`}/>
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
                    format={muiFormat}
                />
              );
          }
        }}
      />
    </LocalizationProvider>
  );
};
 
export default DateTimeField;
 
 