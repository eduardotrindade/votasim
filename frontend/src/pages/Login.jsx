import React, { useState, useContext } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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

  const handleGoogleLogin = () => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Login Google não configurado. Configure VITE_GOOGLE_CLIENT_ID no arquivo .env');
      return;
    }
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/google/callback');
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=email profile&prompt=select_account`;
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

            {GOOGLE_CLIENT_ID && (
              <>
                <Divider sx={{ my: 2 }}>ou</Divider>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleGoogleLogin}
                  sx={{ mb: 1, bgcolor: '#4285f4', color: 'white', '&:hover': { bgcolor: '#357ae8' } }}
                >
                  Entrar com Google
                </Button>
              </>
            )}

            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/registro')}
              sx={{ mb: 2 }}
            >
              Criar Conta
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