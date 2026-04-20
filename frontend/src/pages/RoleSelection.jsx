import React, { useContext } from 'react';
import { Container, Box, Typography, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

export default function RoleSelection() {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const roles = [
    { id: 1, name: 'Administrador', icon: <AdminPanelSettingsIcon sx={{ fontSize: 40 }} />, color: '#1a237e' },
    { id: 3, name: 'Assessor', icon: <AssignmentIndIcon sx={{ fontSize: 40 }} />, color: '#2e7d32' },
    { id: 2, name: 'Candidato', icon: <PersonIcon sx={{ fontSize: 40 }} />, color: '#c62828' },
    { id: 4, name: 'Líder', icon: <SupervisorAccountIcon sx={{ fontSize: 40 }} />, color: '#ef6c00' }
  ];

  const handleSelectRole = (roleId) => {
    // Para simplificar, estamos apenas navegando, mas poderiamos salvar no contexto o papel ativo
    updateUser({ papel_id: roleId });
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        Bem-vindo, {user?.nome}
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
        Selecione o perfil que deseja acessar
      </Typography>

      <Grid container spacing={3}>
        {roles.map((role) => (
          <Grid item xs={12} sm={6} md={3} key={role.id}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                borderRadius: 4,
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-10px)', bgcolor: 'rgba(0,0,0,0.02)' }
              }}
              onClick={() => handleSelectRole(role.id)}
            >
              <Box sx={{ color: role.color, mb: 2 }}>
                {role.icon}
              </Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {role.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Button variant="text" color="inherit" onClick={() => navigate('/login')}>
          Sair do Sistema
        </Button>
      </Box>
    </Container>
  );
}
