import React, { useState, useContext } from 'react';
import { Container, Box, Typography, TextField, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await login(email, senha);
      navigate('/');
    } catch (err) {
      setError('Credenciais inválidas');
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
            Entrar
          </Typography>
          
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Senha"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
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
              Entrar
            </Button>

            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={() => googleLogin({ email: 'google@user.com', nome: 'Google User', id: '123' })}
              sx={{ mb: 2 }}
            >
              Entrar com Google
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Button onClick={() => navigate('/registro')} sx={{ textTransform: 'none' }}>
                Não tem conta? Solicite uma agora
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
