import React from 'react';
import {
  TextField,
  type TextFieldProps,
  FormHelperText,
  FormControl,
} from '@mui/material';

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
  helperText?: string;
  errorMessage?: string;
}

export const Input = React.forwardRef<HTMLDivElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      errorMessage,
      fullWidth = true,
      variant = 'outlined',
      ...props
    },
    ref
  ) => {
    const displayHelperText = error ? errorMessage : helperText;

    return (
      <FormControl fullWidth={fullWidth} error={error}>
        <TextField
          ref={ref}
          label={label}
          variant={variant}
          error={error}
          fullWidth={fullWidth}
          {...props}
        />
        {displayHelperText && (
          <FormHelperText>{displayHelperText}</FormHelperText>
        )}
      </FormControl>
    );
  }
);

Input.displayName = 'Input';
