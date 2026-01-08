import React from 'react';
import {
  Card as MuiCard,
  type CardProps as MuiCardProps,
  CardContent,
  CardActions,
  CardHeader,
} from '@mui/material';

export interface CardProps extends MuiCardProps {
  header?: React.ReactNode;
  actions?: React.ReactNode;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

const paddingMap = {
  none: 0,
  small: 1,
  medium: 2,
  large: 3,
};

export const Card: React.FC<CardProps> = ({
  children,
  header,
  actions,
  padding = 'medium',
  ...props
}) => {
  return (
    <MuiCard {...props}>
      {header && <CardHeader title={header} />}
      <CardContent sx={{ p: paddingMap[padding] }}>{children}</CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </MuiCard>
  );
};

Card.displayName = 'Card';
