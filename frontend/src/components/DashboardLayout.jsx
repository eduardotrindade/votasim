import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, CssBaseline, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from '../contexts/AuthContext';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  const { logout, user } = useContext(AuthContext);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, height: '100vh', overflow: 'auto', bgcolor: 'background.default' }}>
        <AppBar position="sticky" color="inherit" elevation={1} sx={{ zIndex: (theme) => theme.zIndex.drawer - 1 }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.secondary' }}>
              Painel Diretoria
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{user?.nome}</Typography>
                <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
              </Box>
              <Button color="error" onClick={logout} endIcon={<LogoutIcon />} sx={{ textTransform: 'none' }}>
                Sair
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 4 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}