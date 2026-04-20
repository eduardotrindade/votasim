import React, { useContext } from 'react';
import { 
  Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Divider, Typography, IconButton 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import BarChartIcon from '@mui/icons-material/BarChart';
import SecurityIcon from '@mui/icons-material/Security';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';
import LinkIcon from '@mui/icons-material/Link';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MapIcon from '@mui/icons-material/Map';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const drawerWidth = 240;

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/', roles: [1, 2, 3, 4] },
    { text: 'Cadastrar Pessoas', icon: <PeopleIcon />, path: '/pessoas/nova', roles: [1, 2, 3, 4] },
    { text: 'Meus Cadastros', icon: <PeopleIcon />, path: '/meus-cadastros', roles: [1, 2, 3, 4] },
    { text: 'Listar todas as pessoas', icon: <PeopleIcon />, path: '/pessoas', roles: [1, 2, 3, 4] },
    { text: 'Criar Evento', icon: <EventIcon />, path: '/eventos/novo', roles: [1, 2, 3, 4] },
    { text: 'Meus Eventos', icon: <EventIcon />, path: '/meus-eventos', roles: [1, 2, 3, 4] },
    { text: 'Mapa de Eventos', icon: <MapIcon />, path: '/mapa', roles: [1, 2, 3, 4] },
    { text: 'Ranking de Cadastros', icon: <BarChartIcon />, path: '/ranking', roles: [1, 2, 3, 4] },
    { text: 'Importar via CSV', icon: <CloudUploadIcon />, path: '/importar', roles: [1, 2, 3, 4] },
    { text: 'Configurações Usuários', icon: <SecurityIcon />, path: '/configuracoes/usuarios', roles: [1] },
    { text: 'Painel Administrativo', icon: <AdminPanelSettingsIcon />, path: '/administrativo', roles: [1] },
    { text: 'Agrupamentos', icon: <GroupIcon />, path: '/agrupamentos', roles: [1, 2, 3] },
    { text: 'Vínculos', icon: <LinkIcon />, path: '/vinculos', roles: [1, 2, 3] },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#F8FAF9', borderRight: '1px solid #E0E0E0' },
      }}
    >
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h5" fontWeight="bold">Vota.Sim</Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">NAVEGAÇÃO</Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: '8px',
              mx: 1,
              mb: 0.5,
              bgcolor: location.pathname === item.path ? 'rgba(46, 125, 50, 0.1)' : 'transparent',
              color: location.pathname === item.path ? 'primary.main' : 'text.primary',
              '&:hover': {
                bgcolor: 'rgba(46, 125, 50, 0.05)',
              }
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: location.pathname === item.path ? 'bold' : 'normal' }} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
