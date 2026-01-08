import React from 'react';
import {
  Button as MuiButton,
  type ButtonProps as MuiButtonProps,
  CircularProgress,
} from '@mui/material';

export interface ButtonProps extends Omit<MuiButtonProps, 'size'> {
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      loading = false,
      disabled,
      variant = 'contained',
      size = 'medium',
      fullWidth = false,
      startIcon,
      endIcon,
      ...props
    },
    ref
  ) => {
    return (
      <MuiButton
        ref={ref}
        variant={variant}
        size={size}
        disabled={disabled || loading}
        fullWidth={fullWidth}
        startIcon={loading ? undefined : startIcon}
        endIcon={loading ? undefined : endIcon}
        {...props}
      >
        {loading ? (
          <>
            <CircularProgress
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
              sx={{ mr: 1 }}
            />
            {children}
          </>
        ) : (
          children
        )}
      </MuiButton>
    );
  }
);

Button.displayName = 'Button';
