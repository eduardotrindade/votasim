import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, MenuItem, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../services/api';

export default function AgrupamentoForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    regiao_id: '',
    endereco: '',
    cep: '',
    observacao: ''
  });
  const [regioes, setRegioes] = useState([]);
  const [feedback, setFeedback] = useState({ open: false, msg: '', type: 'success' });

  useEffect(() => {
    api.get('/regioes').then(res => setRegioes(res.data)).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.nome || !formData.regiao_id) {
        setFeedback({ open: true, msg: 'Nome e Região são obrigatórios!', type: 'error' });
        return;
      }
      await api.post('/agrupamentos', formData);
      setFeedback({ open: true, msg: 'Agrupamento criado com sucesso!', type: 'success' });
      setTimeout(() => navigate('/agrupamentos'), 1500);
    } catch (error) {
      setFeedback({ open: true, msg: 'Erro ao salvar o agrupamento.', type: 'error' });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mr: 2 }}>
          Voltar
        </Button>
        <Typography variant="h5" fontWeight="bold">Novo Agrupamento</Typography>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Nome *" name="nome" value={formData.nome} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField select fullWidth label="Região *" name="regiao_id" value={formData.regiao_id} onChange={handleChange}>
                {regioes.map(r => (
                  <MenuItem key={r.id} value={r.id}>{r.nome}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Endereço" name="endereco" value={formData.endereco} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="CEP" name="cep" value={formData.cep} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Observações" multiline rows={3} name="observacao" value={formData.observacao} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button type="submit" variant="contained" color="primary" size="large" startIcon={<SaveIcon />}>
                Criar Agrupamento
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