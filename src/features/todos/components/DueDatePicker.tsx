import React from 'react';
import { TextField, InputAdornment, IconButton, Box, Chip } from '@mui/material';
import { CalendarToday, Clear } from '@mui/icons-material';
import { isToday, isTomorrow, isPast, isThisWeek } from 'date-fns';

interface DueDatePickerProps {
  value?: string;
  onChange: (date: string | undefined) => void;
  error?: boolean;
  helperText?: string;
}

export const DueDatePicker: React.FC<DueDatePickerProps> = ({
  value,
  onChange,
  error,
  helperText,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value || undefined);
  };

  const handleClear = () => {
    onChange(undefined);
  };

  const getDueDateLabel = (dateStr: string | undefined): React.ReactNode => {
    if (!dateStr) return null;

    const date = new Date(dateStr);
    
    if (isPast(date) && !isToday(date)) {
      return (
        <Chip
          label="Overdue"
          size="small"
          color="error"
          sx={{ ml: 1 }}
        />
      );
    }

    if (isToday(date)) {
      return (
        <Chip
          label="Today"
          size="small"
          color="warning"
          sx={{ ml: 1 }}
        />
      );
    }

    if (isTomorrow(date)) {
      return (
        <Chip
          label="Tomorrow"
          size="small"
          color="info"
          sx={{ ml: 1 }}
        />
      );
    }

    if (isThisWeek(date)) {
      return (
        <Chip
          label="This week"
          size="small"
          color="default"
          sx={{ ml: 1 }}
        />
      );
    }

    return null;
  };

  return (
    <Box>
      <TextField
        fullWidth
        type="date"
        label="Due Date"
        value={value ? value.split('T')[0] : ''}
        onChange={handleChange}
        error={error}
        helperText={helperText}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CalendarToday />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear}>
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {getDueDateLabel(value)}
    </Box>
  );
};
