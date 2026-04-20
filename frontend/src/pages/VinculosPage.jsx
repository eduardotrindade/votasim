import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

export default function VinculosPage() {
  const [vinculos, setVinculos] = useState([]);
  const [pessoas, setPessoas] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ pessoa_id: '', pessoa_relacionada_id: '', tipo: '' });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [v, p] = await Promise.all([
        api.get('/vinculos'),
        api.get('/pessoas')
      ]);
      setVinculos(v.data);
      setPessoas(p.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await api.post('/vinculos', formData);
      setOpen(false);
      setFormData({ pessoa_id: '', pessoa_relacionada_id: '', tipo: '' });
      carregarDados();
    } catch (err) {
      alert('Erro ao criar vínculo');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remover este vínculo?')) return;
    try {
      await api.delete(`/vinculos/${id}`);
      carregarDados();
    } catch (err) {
      alert('Erro ao remover');
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">Vínculos entre Pessoas</Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Novo Vínculo
          </Button>
        </Box>

        {loading ? (
          <Typography>Carregando...</Typography>
        ) : vinculos.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">Nenhum vínculo cadastrado.</Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.05)' }}>
                <TableRow>
                  <TableCell><strong>Pessoa</strong></TableCell>
                  <TableCell><strong>Relacionada</strong></TableCell>
                  <TableCell><strong>Tipo</strong></TableCell>
                  <TableCell align="center"><strong>Ações</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vinculos.map((v) => (
                  <TableRow key={v.id} hover>
                    <TableCell>{v.pessoa_nome}</TableCell>
                    <TableCell>{v.pessoa_relacionada_nome}</TableCell>
                    <TableCell>{v.tipo}</TableCell>
                    <TableCell align="center">
                      <IconButton color="error" onClick={() => handleDelete(v.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Novo Vínculo</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                select
                label="Pessoa"
                value={formData.pessoa_id}
                onChange={(e) => setFormData({ ...formData, pessoa_id: e.target.value })}
                fullWidth
              >
                {pessoas.map(p => (
                  <MenuItem key={p.id} value={p.id}>{p.nome}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Relacionada"
                value={formData.pessoa_relacionada_id}
                onChange={(e) => setFormData({ ...formData, pessoa_relacionada_id: e.target.value })}
                fullWidth
              >
                {pessoas.map(p => (
                  <MenuItem key={p.id} value={p.id}>{p.nome}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Tipo"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                fullWidth
              >
                <MenuItem value="ASSESSOR">Assessor</MenuItem>
                <MenuItem value="LIDER">Líder</MenuItem>
                <MenuItem value="CANDIDATO">Candidato</MenuItem>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleCreate}>Criar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}