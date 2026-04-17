import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, TextField, InputAdornment 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function PessoasPage({ meOnly = false }) {
  const navigate = useNavigate();
  const [pessoas, setPessoas] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      carregarPessoas();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const carregarPessoas = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/pessoas?search=${search}${meOnly ? '&me=true' : ''}`);
      setPessoas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta pessoa?')) return;
    try {
      await api.delete(`/pessoas/${id}`);
      carregarPessoas();
    } catch (err) {
      alert('Erro ao excluir pessoa');
    }
  };

  const exportarCSV = () => {
    if (pessoas.length === 0) return;
    
    const headers = ['Nome', 'Email', 'Telefone', 'Status'];
    const rows = pessoas.map(p => [
      p.nome,
      p.email || '',
      p.telefone || '',
      p.ativo ? 'Ativo' : 'Inativo'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cadastros_votasim_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          {meOnly ? 'Meus Cadastros' : 'Todas as Pessoas'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
           <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={exportarCSV}>
             Exportar
           </Button>
           <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<PersonAddIcon />}
            onClick={() => navigate('/pessoas/nova')}
          >
            Novo Cadastro
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
         <TextField 
            fullWidth
            placeholder="Buscar por nome ou email..."
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
         />
      </Paper>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #E0E0E0' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.03)' }}>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pessoas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="textSecondary">
                    {loading ? 'Buscando...' : 'Nenhum resultado encontrado.'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              pessoas.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ fontWeight: 'bold' }}>{row.nome}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.telefone}</TableCell>
                  <TableCell>
                    <Chip label={row.ativo ? "Ativo" : "Inativo"} color={row.ativo ? "success" : "default"} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary" onClick={() => navigate(`/pessoas/editar/${row.id}`)}><EditIcon /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}