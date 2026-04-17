import React, { useContext } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, Snackbar, Alert } from '@mui/material';
import { useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

export default function ProfilePage() {
  const { user, updateUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    telefone: user?.telefone || ''
  });
  const [feedback, setFeedback] = useState({ open: false, msg: '', type: 'success' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFeedback({ open: true, msg: 'Perfil atualizado com sucesso!', type: 'success' });
    } catch (err) {
      setFeedback({ open: true, msg: 'Erro ao atualizar perfil.', type: 'error' });
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Meu Perfil
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField fullWidth label="Nome" name="nome" value={formData.nome} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" value={user?.email || ''} disabled />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button type="submit" variant="contained" color="primary" size="large" startIcon={<SaveIcon />}>
                Salvar Alterações
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar open={feedback.open} autoHideDuration={4000} onClose={() => setFeedback({...feedback, open: false})} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={feedback.type} sx={{ width: '100%' }}>{feedback.msg}</Alert>
      </Snackbar>
    </Box>
  );
}