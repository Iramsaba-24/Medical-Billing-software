import React from 'react';
import * as MuiIcons from '@mui/icons-material';
import { IconButton, type SvgIconProps, type IconButtonProps, type SxProps, type Theme } from '@mui/material';

interface ReusableIconProps extends IconButtonProps {
  name: keyof typeof MuiIcons;
  iconProps?: SvgIconProps;
  sx?: SxProps<Theme>;
}

const ReuseIcon: React.FC<ReusableIconProps> = ({ name, iconProps, sx, ...props }) => {
  const Icon = MuiIcons[name];
  if (!Icon) return null;

  if (props.component === 'span') {
    return <Icon {...iconProps} sx={sx} />;
  }

  return (
    <IconButton
      {...props}
      sx={{
        '&:focus, &:active': {
          outline: 0
        },
        ...sx
      }}
    >
      <Icon {...iconProps} />
    </IconButton>
  );
};

export default ReuseIcon;
