import React from 'react';
import Marquee from 'react-fast-marquee';
import { Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface MarqueeItem {
  text: string;
  path?: string;
}

interface MarqueeBreadcrumbsProps {
  items: (string | MarqueeItem)[];
  color?: string;
  backgroundColor?: string;
  speed?: number;
  onClick?: (item: MarqueeItem) => void;
}

const MarqueeBreadcrumbs: React.FC<MarqueeBreadcrumbsProps> = ({
  items,
  color = 'blue',
  backgroundColor = 'white',
  speed = 60,
  onClick
}) => {
  const navigate = useNavigate();

  const normalizedItems = items.map((item) => (typeof item === 'string' ? { text: item } : item));

  const handleClick = (item: MarqueeItem) => {
    if (item.path) {
      navigate(item.path);
    }
    if (onClick) {
      onClick(item);
    }
  };

  return (
    <Box sx={{ backgroundColor, py: 1 }}>
      <Marquee speed={speed} gradient={false} pauseOnHover style={{ whiteSpace: 'nowrap' }}>
        {normalizedItems.map((item, index) => (
          <Typography
            key={index}
            component="span"
            onClick={() => handleClick(item)}
            sx={{
              color,
              fontSize: {
                xs: '11px',
                sm: '12px',
                md: '18px',
                lg: '20px'
              },
              fontWeight: 200,
              mx: 2,
              cursor: item.path || onClick ? 'pointer' : 'default',
              '&:hover': {
                textDecoration: item.path || onClick ? 'underline' : 'none'
              }
            }}
          >
            {item.text}
          </Typography>
        ))}
      </Marquee>
    </Box>
  );
};

export default MarqueeBreadcrumbs;
