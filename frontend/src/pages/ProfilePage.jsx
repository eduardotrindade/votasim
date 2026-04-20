import React, { useState, useContext } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, Snackbar, Alert, Divider } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import SaveIcon from '@mui/icons-material/Save';
import LockResetIcon from '@mui/icons-material/LockReset';
import api from '../services/api';

export default function ProfilePage() {
  const { user, updateUser } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    telefone: user?.telefone || ''
  });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [feedback, setFeedback] = useState({ open: false, msg: '', type: 'success' });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/usuarios/perfil', profileData);
      updateUser(profileData);
      setFeedback({ open: true, msg: 'Perfil atualizado com sucesso!', type: 'success' });
    } catch (err) {
      setFeedback({ open: true, msg: 'Erro ao atualizar perfil.', type: 'error' });
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setFeedback({ open: true, msg: 'As senhas não coincidem!', type: 'error' });
      return;
    }
    try {
      await api.put('/usuarios/perfil/senha', { 
        senhaAntiga: passwords.current, 
        novaSenha: passwords.new 
      });
      setFeedback({ open: true, msg: 'Senha alterada com sucesso!', type: 'success' });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      setFeedback({ open: true, msg: 'Erro ao alterar senha. Verifique a senha atual.', type: 'error' });
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Meu Perfil</Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Dados Pessoais</Typography>
            <Divider sx={{ mb: 3 }} />
            <form onSubmit={updateProfile}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Nome" name="nome" value={profileData.nome} onChange={handleProfileChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Email" name="email" value={profileData.email} disabled />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Telefone" name="telefone" value={profileData.telefone} onChange={handleProfileChange} />
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
                    Salvar Alterações
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Alterar Senha</Typography>
            <Divider sx={{ mb: 3 }} />
            <form onSubmit={updatePassword}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth type="password" label="Senha Atual" name="current" value={passwords.current} onChange={handlePasswordChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth type="password" label="Nova Senha" name="new" value={passwords.new} onChange={handlePasswordChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth type="password" label="Confirmar Nova Senha" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} />
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Button type="submit" variant="outlined" color="primary" startIcon={<LockResetIcon />}>
                    Alterar Senha
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={feedback.open} autoHideDuration={4000} onClose={() => setFeedback({...feedback, open: false})}>
        <Alert severity={feedback.type}>{feedback.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
