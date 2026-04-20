import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, Snackbar, Alert, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../services/api';

export default function PessoaForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    data_nascimento: '',
    papel_id: '',
    agrupamento_id: '',
    observacao: ''
  });
  const [papeis, setPapeis] = useState([]);
  const [agrupamentos, setAgrupamentos] = useState([]);
  const [feedback, setFeedback] = useState({ open: false, msg: '', type: 'success' });

  useEffect(() => {
    api.get('/papeis').then(res => setPapeis(res.data)).catch(() => {});
    api.get('/agrupamentos').then(res => setAgrupamentos(res.data)).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
if (!formData.nome) {
         setFeedback({ open: true, msg: 'Nome é obrigatório!', type: 'error' });
         return;
      }
    
    try {
      setFeedback({ open: true, msg: 'Salvando...', type: 'info' });
      await api.post('/pessoas', formData);
      setFeedback({ open: true, msg: 'Cadastro realizado com sucesso!', type: 'success' });
      setTimeout(() => navigate('/pessoas'), 1500);
    } catch (error) {
      const msg = error.response?.data?.error || error.message || 'Erro ao salvar';
      setFeedback({ open: true, msg: msg, type: 'error' });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/pessoas')} sx={{ mr: 2 }}>
          Voltar
        </Button>
        <Typography variant="h5" fontWeight="bold">Novo Cadastro</Typography>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Nome Completo *" name="nome" value={formData.nome} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth type="email" label="Email *" name="email" value={formData.email} onChange={handleChange} />
            </Grid>
<Grid item xs={12} md={4}>
               <TextField fullWidth label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} />
             </Grid>
             <Grid item xs={12} md={4}>
               <TextField 
                 select 
                 fullWidth 
                 label="Papel" 
                 name="papel_id" 
                 value={formData.papel_id || ''} 
                 onChange={handleChange}
               >
                 <MenuItem value="">Selecione...</MenuItem>
                 {papeis.map(p => (
                   <MenuItem key={p.id} value={p.id}>{p.papel}</MenuItem>
                 ))}
               </TextField>
             </Grid>
             <Grid item xs={12} md={4}>
               <TextField 
                 fullWidth 
                 label="Data de Nascimento" 
                 type="date" 
                 name="data_nascimento" 
                 InputLabelProps={{ shrink: true }} 
                 value={formData.data_nascimento} 
                 onChange={handleChange} 
               />
            </Grid>
            <Grid item xs={12} md={4}>
               <TextField 
                 select 
                 fullWidth 
                 label="Grupo de Pertencimento" 
                 name="agrupamento_id" 
                 value={formData.agrupamento_id || ''} 
                 onChange={handleChange}
               >
                 <MenuItem value="">Nenhum</MenuItem>
                 {agrupamentos.map(a => (
                   <MenuItem key={a.id} value={a.id}>{a.nome}</MenuItem>
                 ))}
               </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Observações" multiline rows={4} name="observacao" value={formData.observacao} onChange={handleChange} />
            </Grid>
            
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button type="submit" variant="contained" color="primary" size="large" startIcon={<SaveIcon />}>
                Salvar Cadastro
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
