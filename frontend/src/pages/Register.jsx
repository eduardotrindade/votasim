import React, { useState, useContext } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '', telefone: '' });
  const [feedback, setFeedback] = useState({ open: false, msg: '', type: 'success' });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      setFeedback({ open: true, msg: 'Solicitação enviada! Aguarde ativação.', type: 'success' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setFeedback({ open: true, msg: 'Erro ao solicitar conta.', type: 'error' });
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <Typography component="h1" variant="h5" align="center" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
            Solicitar Conta
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField margin="normal" required fullWidth label="Nome Completo" name="nome" autoFocus value={formData.nome} onChange={handleChange} />
            <TextField margin="normal" required fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} />
            <TextField margin="normal" required fullWidth label="Celular" name="telefone" value={formData.telefone} onChange={handleChange} />
            <TextField margin="normal" required fullWidth label="Senha" name="senha" type="password" value={formData.senha} onChange={handleChange} />
            
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
              Enviar Solicitação
            </Button>
            
            <Button fullWidth onClick={() => navigate('/login')} sx={{ textTransform: 'none' }}>
              Voltar para Login
            </Button>
          </Box>
        </Paper>
      </Box>

      <Snackbar open={feedback.open} autoHideDuration={4000} onClose={() => setFeedback({...feedback, open: false})}>
        <Alert severity={feedback.type}>{feedback.msg}</Alert>
      </Snackbar>
    </Container>
  );
}
