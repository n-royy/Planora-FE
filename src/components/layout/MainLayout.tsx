import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { AccountCircle, ImportExport } from '@mui/icons-material';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ThemeToggle } from '../common/ThemeToggle';
import { ExportImportDialog } from '@/features/todos/components/ExportImportDialog';
import { useThemeStore } from '@/stores/themeStore';
import LightLogo from '../../assets/lightLogo.svg';
import DarkLogo from '../../assets/darkLogo.svg';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { mode } = useThemeStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [exportImportOpen, setExportImportOpen] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="static"
        sx={{
          bgcolor: mode === 'dark' ? '#1e1e1e' : '#a3c4d4', // Custom background color
          color: mode === 'dark' ? '#fff' : '#164c94',
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Box
              component="img"
              sx={{
                height: 50,
                width: 'auto',
                display: 'flex',
              }}
              alt="my-logo"
              src={mode === 'dark' ? DarkLogo : LightLogo} // Đường dẫn ảnh
            />
          </Typography>

          <Tooltip title="Export / Import">
            <IconButton
              color="inherit"
              onClick={() => setExportImportOpen(true)}
            >
              <ImportExport />
            </IconButton>
          </Tooltip>

          <ThemeToggle />

          {user && (
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2">{user.name}</Typography>
              <IconButton size="large" onClick={handleMenu} color="inherit">
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {children}
      </Container>

      <ExportImportDialog
        open={exportImportOpen}
        onClose={() => setExportImportOpen(false)}
      />
    </Box>
  );
};
