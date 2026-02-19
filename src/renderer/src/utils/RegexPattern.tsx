/* eslint-disable react-refresh/only-export-components */
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const emailDomainRegex = /^[^\s@]+@[^\s@.]+\.(com|org|net)$/;

export const SanitizeEmailRegex = (value: string) => value.replace(/[^A-Za-z0-9@.+-]/g, '').trim();

export const aadharRegex = /^[2-9]{1}[0-9]{11}$/;
export const formatAadhar = (value: string) => value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');

export const TextRegexPattern = {
  string: {
    regex: /^[A-Za-z]+$/,
    allowed: /[A-Za-z]/g,
    message: 'Only letters without spaces are allowed.'
  },
 numbers: {
  regex: /^[0-9%.]+$/,
  allowed: /[0-9%.]/g,
  message: 'Only numbers and percentage sign are allowed.'
},
  alphabet: {
    regex: /^[A-Za-z ]+$/,
    allowed: /[A-Za-z ]/g,
    message: 'Only alphabets and spaces are allowed.'
  },
  alphanumeric: {
    regex: /^[a-zA-Z0-9@_#$.*-]*$/,
    allowed: /[a-zA-Z0-9@_#$.*-]/g,
    message: 'Only alphabets, numbers and symbols (@ _ # $ . * -) are allowed.'
  },
  textarea: {
    regex: /^[\x20-\x7E\r\n]+$/,
    allowed: /[\x20-\x7E\r\n]/g,
    message: 'Only valid text characters are allowed.'
  },
  all: {
    regex: /^[\s\S]*$/,
    allowed: /[\s\S]/g,
    message: 'All characters are allowed.'
  }
} as const;

export type InputType = keyof typeof TextRegexPattern;

export const mobileRegex = /^[+]*[0-9]{10}$/;
export const SanitizeMobileRegex = (value: string) => value.replace(/[^\d+]/g, '').trim();

export const numericRegex = /^[0-9]+$/;
export const decimalRegex = /^[0-9]*\.?[0-9]*$/;

export const emojiRegex = /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/gu;
export const removeEmojis = (text: string): string => text.replace(emojiRegex, '');

export const PasswordRegex = {
  basic: {
    regex: /^.{8,32}$/,
    message: 'Password must be 8-32 characters'
  },
  withCase: {
    regex: /^(?=.*[a-z])(?=.*[A-Z]).{8,32}$/,
    message: 'Must include upper and lower case letters'
  },
  withNumber: {
    regex: /^(?=.*\d).{8,32}$/,
    message: 'Must include at least one number'
  },
  withSpecialChar: {
    regex: /^(?=.*[^A-Za-z0-9]).{8,32}$/,
    message: 'Must include at least one special character'
  },
  strong: {
    regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,32}$/,
    message: 'Password must meet all requirements'
  },
  match: (value: string, compareValue: string) => ({
    valid: value === compareValue,
    message: 'Passwords do not match'
  })
} as const;

export const checkPasswordStrength = (password: string): number => {
  if (!password) return 0;
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/\d/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  return strength;
};

export const PasswordStrengthLevels = [
  { label: 'Very Weak', color: 'error.main', minScore: 0 },
  { label: 'Weak', color: 'warning.main', minScore: 1 },
  { label: 'Moderate', color: 'info.main', minScore: 2 },
  { label: 'Strong', color: 'success.main', minScore: 3 },
  { label: 'Very Strong', color: 'success.dark', minScore: 4 }
];
