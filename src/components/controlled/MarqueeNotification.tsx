import React from 'react';
import { Typography, Box } from '@mui/material';
import newBadge from '@/assets/images/new.jpg';

type NotificationItem = {
  id: string;
  text: string;
  isNew: boolean;
  viewed: boolean;
  titleColor?: string;
};

type MarqueeNotificationProps = {
  items: NotificationItem[];
  textColor?: string;
  backgroundColor?: string;
  height?: string | number;
  onItemClick?: (id: string) => void;
};

const MarqueeNotification: React.FC<MarqueeNotificationProps> = ({
  items,
  backgroundColor = 'transparent',
  height = '300px',
  onItemClick
}) => {
  const itemHeight = 60;

  const sortedItems = [...items].sort((a, b) => {
    if (a.isNew === b.isNew) return 0;
    return a.isNew ? -1 : 1;
  });

  return (
    <Box
      sx={{
        backgroundColor,
        overflowY: 'auto',
        position: 'relative',
        height,
        width: '100%',
        WebkitOverflowScrolling: 'touch',

        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          width: '6px'
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent !important'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'transparent',
          borderRadius: '10px',
          transition: 'background-color 0.3s ease'
        },
        '&:hover::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(255,255,255,0.6)'
        }
      }}
    >
      {sortedItems.map((item) => (
        <Box
          key={item.id}
          onClick={() => onItemClick?.(item.id)}
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            py: 1.5,
            px: 2,
            cursor: 'pointer',
            borderBottom: '1px dashed rgba(255,255,255,0.3)',
            opacity: item.viewed ? 0.7 : 1,
            height: `${itemHeight}px`,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          {item.isNew && (
            <Box
              sx={{
                width: { xs: 40, md: 55 },
                height: { xs: 40, md: 55 },
                overflow: 'hidden',
                flexShrink: 0
              }}
            >
              <img src={newBadge} width="100%" height="100%" style={{ objectFit: 'contain' }} />
            </Box>
          )}

          <Typography
            sx={{
              color: item.titleColor || '#FFFFFF',
              fontSize: { xs: '0.8rem', sm: '1rem', md: '1.1rem' },
              fontWeight: item.isNew ? 700 : 500,
              fontStyle: item.viewed ? 'italic' : 'normal',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: { xs: 'block', sm: '-webkit-box' },
              WebkitLineClamp: { xs: 'unset', sm: 2 },
              WebkitBoxOrient: 'vertical',
              whiteSpace: { xs: 'normal', sm: 'normal' }
            }}
          >
            {item.text}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default MarqueeNotification;
