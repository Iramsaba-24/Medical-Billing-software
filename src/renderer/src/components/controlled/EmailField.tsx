// import { type FC } from "react";
// import {
//   TextField,
//   type SxProps,
//   type TextFieldProps,
//   type Theme
// } from "@mui/material";
// import { useFormContext, Controller } from "react-hook-form";
// import {
//   emailRegex,
//   emailDomainRegex,
//   SanitizeEmailRegex
// } from "@/utils/RegexPattern";
// import { getComponentTranslations } from "@/helpers/useTranslations";
// import { useTranslation } from "react-i18next";
 
// type EmailFieldProps = TextFieldProps & {
//   label: string;
//   name: string;
//   required?: boolean;
//   sx?: SxProps<Theme>;
//   maxLength?: number;
//   minLength?: number;
//   preventDuplicate?: boolean;
// };
 
// type Customer = {
//   email?: string;
// };
 
// type Doctor = {
//   email?: string;
// };
 
// const EmailField: FC<EmailFieldProps> = ({
//   label,
//   name,
//   sx,
//   required = false,
//   maxLength,
//   minLength,
//   preventDuplicate,
//   ...rest
// }) => {
//   const { t } = useTranslation();
//   const translations = getComponentTranslations(t);
 
//   const {
//     control,
//     formState: { errors }
//   } = useFormContext();
 
//   // ✅ GLOBAL email fetch
//   const getAllStoredEmails = (): string[] => {
//     const emails: string[] = [];
 
//     const customers: Customer[] = JSON.parse(
//       localStorage.getItem("customers") || "[]"
//     );
 
//     customers.forEach((c) => {
//       if (c.email) {
//         emails.push(c.email.toLowerCase());
//       }
//     });
 
//     const doctors: Doctor[] = JSON.parse(
//       localStorage.getItem("doctors") || "[]"
//     );
 
//     doctors.forEach((d) => {
//       if (d.email) {
//         emails.push(d.email.toLowerCase());
//       }
//     });
 
//     return emails;
//   };
 
//   return (
//     <Controller
//       name={name}
//       control={control}
//       rules={{
//         required: required
//           ? translations.emailField.requiredError(label)
//           : undefined,
//         minLength: minLength
//           ? {
//               value: minLength,
//               message: `Email must be at least ${minLength} characters`
//             }
//           : undefined,
//         maxLength: maxLength
//           ? {
//               value: maxLength,
//               message: `Email must be at most ${maxLength} characters`
//             }
//           : undefined,
//         validate: (value: string) => {
//           if (!value) return true;
 
//           const sanitized = value.toLowerCase();
 
//           if (!emailRegex.test(sanitized))
//             return "Please enter a proper email like abc@gmail.com";
 
//           if (!emailDomainRegex.test(sanitized))
//             return "Email should be in gmail.com domain only";
 
       
//           if (preventDuplicate) {
//             const allEmails = getAllStoredEmails();
 
//             if (allEmails.includes(sanitized)) {
//               return "Email already exists";
//             }
//           }
 
//           return true;
//         }
//       }}
//       render={({ field }) => (
//         <TextField
//           {...field}
//           {...rest}
//           label={label}
//           inputMode="email"
//           type="email"
//           value={field.value || ""}
//           fullWidth
//           required={required}
//           error={!!errors[name]}
//           helperText={String(errors[name]?.message || " ")}
//           onChange={(e) =>
//             field.onChange(SanitizeEmailRegex(e.target.value). toLowerCase())
//           }
//           inputProps={{
//             maxLength: maxLength,
//             minLength: minLength
//           }}
//           sx={{ "& .MuiInputLabel-asterisk": { color: "error.main" }, ...sx }}
//         />
//       )}
//     />
//   );
// };
 
// export default EmailField;
 
 




import { type FC } from "react";
import {
  TextField,
  type SxProps,
  type TextFieldProps,
  type Theme
} from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import {
  emailRegex,
  emailDomainRegex,
  SanitizeEmailRegex
} from "@/utils/RegexPattern";
import { getComponentTranslations } from "@/helpers/useTranslations";
import { useTranslation } from "react-i18next";
 
type EmailFieldProps = TextFieldProps & {
  label: string;
  name: string;
  required?: boolean;
  sx?: SxProps<Theme>;
  maxLength?: number;
  minLength?: number;
  preventDuplicate?: boolean;
};
 
type Customer = {
  email?: string;
};
 
type Doctor = {
  email?: string;
};
 
const EmailField: FC<EmailFieldProps> = ({
  label,
  name,
  sx,
  required = false,
  maxLength,
  minLength,
  preventDuplicate,
  ...rest
}) => {
  const { t } = useTranslation();
  const translations = getComponentTranslations(t);
 
  const {
    control,
    formState: { errors }
  } = useFormContext();
 
  // ✅ GLOBAL email fetch
  const getAllStoredEmails = (): string[] => {
    const emails: string[] = [];
 
    const customers: Customer[] = JSON.parse(
      localStorage.getItem("customers") || "[]"
    );
 
    customers.forEach((c) => {
      if (c.email) {
        emails.push(c.email.toLowerCase());
      }
    });
 
    const doctors: Doctor[] = JSON.parse(
      localStorage.getItem("doctors") || "[]"
    );
 
    doctors.forEach((d) => {
      if (d.email) {
        emails.push(d.email.toLowerCase());
      }
    });
 
    return emails;
  };
 
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required
          ? translations.emailField.requiredError(label)
          : undefined,
        minLength: minLength
          ? {
              value: minLength,
              message: `Email must be at least ${minLength} characters`
            }
          : undefined,
        maxLength: maxLength
          ? {
              value: maxLength,
              message: `Email must be at most ${maxLength} characters`
            }
          : undefined,
        validate: (value: string) => {
          if (!value) return true;
 
          const sanitized = value.toLowerCase();
 
          if (!emailRegex.test(sanitized))
            return "Please enter a proper email like abc@gmail.com";
 
          if (!emailDomainRegex.test(sanitized))
            return "Email should be in gmail.com domain only";
 
       
          if (preventDuplicate) {
            const allEmails = getAllStoredEmails();
 
            if (allEmails.includes(sanitized)) {
              return "Email already exists";
            }
          }
 
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
          value={field.value || ""}
          fullWidth
          required={required}
          error={!!errors[name]}
          helperText={String(errors[name]?.message || " ")}
          onChange={(e) =>
            field.onChange(SanitizeEmailRegex(e.target.value). toLowerCase())
          }
          inputProps={{
            maxLength: maxLength,
            minLength: minLength
          }}
          sx={{ "& .MuiInputLabel-asterisk": { color: "error.main" }, ...sx }}
        />
      )}
    />
  );
};
 
export default EmailField;
 
 
 
 
 
 
 
 
 
 
 
 
 




