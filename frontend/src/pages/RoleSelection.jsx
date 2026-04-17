import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Grid, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function RoleSelection() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({ open: false, msg: '', type: 'info' });

  const handleRoleSelect = async (papelId) => {
    try {
      setFeedback({ open: true, msg: 'Perfil selecionado com sucesso!', type: 'success' });
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setFeedback({ open: true, msg: 'Erro ao selecionar perfil.', type: 'error' });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" sx={{ mb: 4 }}>
        Selecione seu Perfil
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {[1, 2, 3, 4].map((papel) => (
          <Grid item xs={12} sm={6} md={3} key={papel}>
            <Paper 
              sx={{ p: 4, textAlign: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
              onClick={() => handleRoleSelect(papel)}
            >
              <Typography variant="h6">
                {papel === 1 ? 'Administrador' : papel === 2 ? 'Coordenador' : papel === 3 ? 'Assessor' : 'Líder'}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Snackbar open={feedback.open} autoHideDuration={3000} onClose={() => setFeedback({...feedback, open: false})} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={feedback.type} sx={{ width: '100%' }}>{feedback.msg}</Alert>
      </Snackbar>
    </Box>
  );
}