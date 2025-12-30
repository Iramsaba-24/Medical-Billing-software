import React from 'react';
import { Select, MenuItem, type SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <Select
      value={i18n.language}
      onChange={handleChange}
      size="small"
      sx={{
        border: 'none',
        '&:hover': {
          boxShadow: 3,
          border: 'none'
        }
      }}
    >
      <MenuItem value="en">English</MenuItem>
      <MenuItem value="kn">ಕನ್ನಡ</MenuItem>
    </Select>
  );
};

export default LanguageSwitcher;
