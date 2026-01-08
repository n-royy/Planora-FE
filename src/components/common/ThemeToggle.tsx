import React from 'react';
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  SettingsBrightness,
  Check,
} from '@mui/icons-material';
import { useThemeStore } from '@/stores/themeStore';

export const ThemeToggle: React.FC = () => {
  const { mode, setMode } = useThemeStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModeSelect = (selectedMode: 'light' | 'dark' | 'system') => {
    setMode(selectedMode);
    handleClose();
  };

  const getIcon = () => {
    switch (mode) {
      case 'light':
        return <Brightness7 />;
      case 'dark':
        return <Brightness4 />;
      case 'system':
      default:
        return <SettingsBrightness />;
    }
  };

  const getTooltip = () => {
    switch (mode) {
      case 'light':
        return 'Light Mode';
      case 'dark':
        return 'Dark Mode';
      case 'system':
      default:
        return 'System Mode';
    }
  };

  return (
    <>
      <Tooltip title={getTooltip()}>
        <IconButton color="inherit" onClick={handleClick}>
          {getIcon()}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleModeSelect('light')}>
          <ListItemIcon>
            {mode === 'light' ? <Check /> : <Brightness7 />}
          </ListItemIcon>
          <ListItemText>Light</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleModeSelect('dark')}>
          <ListItemIcon>
            {mode === 'dark' ? <Check /> : <Brightness4 />}
          </ListItemIcon>
          <ListItemText>Dark</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleModeSelect('system')}>
          <ListItemIcon>
            {mode === 'system' ? <Check /> : <SettingsBrightness />}
          </ListItemIcon>
          <ListItemText>System</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
