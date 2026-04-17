import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, MenuItem, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../services/api';

export default function EventoForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    data: '',
    regiao_id: '',
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
      if (!formData.titulo || !formData.data || !formData.regiao_id) {
         setFeedback({ open: true, msg: 'Título, Data e Região são obrigatórios!', type: 'error' });
         return;
      }
      await api.post('/eventos', formData);
      setFeedback({ open: true, msg: 'Evento criado com sucesso!', type: 'success' });
      
      setTimeout(() => navigate('/eventos'), 1500);
    } catch (error) {
      setFeedback({ open: true, msg: 'Erro ao salvar o evento.', type: 'error' });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/eventos')} sx={{ mr: 2 }}>
          Voltar
        </Button>
        <Typography variant="h5" fontWeight="bold">Novo Evento</Typography>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Título do Evento *" 
                name="titulo" 
                value={formData.titulo} 
                onChange={handleChange} 
                placeholder="Ex: Reunião de Lideranças em São Paulo"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
               <TextField 
                 fullWidth 
                 label="Data do Evento *" 
                 type="date" 
                 name="data" 
                 InputLabelProps={{ shrink: true }} 
                 value={formData.data} 
                 onChange={handleChange} 
               />
            </Grid>

            <Grid item xs={12} md={6}>
               <TextField
                 select
                 fullWidth
                 label="Região / Local *"
                 name="regiao_id"
                 value={formData.regiao_id}
                 onChange={handleChange}
               >
                 {regioes.map((option) => (
                   <MenuItem key={option.id} value={option.id}>
                     {option.nome}
                   </MenuItem>
                 ))}
               </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Observações / Pauta" 
                multiline 
                rows={4} 
                name="observacao" 
                value={formData.observacao} 
                onChange={handleChange} 
              />
            </Grid>
            
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button type="submit" variant="contained" color="primary" size="large" startIcon={<SaveIcon />}>
                Criar Evento
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar 
        open={feedback.open} 
        autoHideDuration={4000} 
        onClose={() => setFeedback({...feedback, open: false})} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={feedback.type} sx={{ width: '100%' }}>{feedback.msg}</Alert>
      </Snackbar>
    </Box>
  );
}