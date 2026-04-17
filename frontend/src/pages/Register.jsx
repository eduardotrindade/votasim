import React, { useState, useContext } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setError('');
      if (!nome || !email || !senha) {
        setError('Preencha todos os campos obrigatórios');
        return;
      }
      await register({ nome, email, senha, telefone });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg = err.response?.data?.error || 'Erro ao registrar';
      setError(msg.includes('já cadastrado') ? 'Este email já está cadastrado no sistema.' : msg);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <Typography component="h1" variant="h4" align="center" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
            Vota.Sim
          </Typography>
          <Typography component="h2" variant="h6" align="center" gutterBottom>
            Criar Conta
          </Typography>
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Conta criada! Redirecionando...
            </Alert>
          )}

          <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Nome Completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
            
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 1 }}
            >
              Criar Conta
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button onClick={() => navigate('/login')} startIcon={<ArrowBackIcon />} sx={{ textTransform: 'none' }}>
                Voltar
              </Button>
              <Button onClick={() => navigate('/login')} sx={{ textTransform: 'none' }}>
                Já tem conta? Entrar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}