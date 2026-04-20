import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Switch, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem 
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import api from '../services/api';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [papeis, setPapeis] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '', papel_id: 4 });

  useEffect(() => {
    carregarDados();
  }, []);

const carregarDados = async () => {
    try {
      const [users, p] = await Promise.all([
        api.get('/auth/usuarios'),
        api.get('/papeis')
      ]);
      setUsuarios(users.data);
      setPapeis(p.data);
    } catch (err) {
      console.error(err);
    }
  };

  const carregarUsuarios = async () => {
    try {
      const { data } = await api.get('/usuarios');
      setUsuarios(data);
    } catch (err) {
      console.error(err);
    }
  };

const handleToggle = async (user) => {
    try {
      await api.put(`/auth/usuarios/${user.id}`, { ativo: user.ativo ? 0 : 1 });
      carregarDados();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    if (!formData.nome || !formData.email || !formData.senha) {
      alert('Preencha todos os campos');
      return;
    }
    try {
      await api.post('/auth/usuarios', formData);
      setOpen(false);
      setFormData({ nome: '', email: '', senha: '', papel_id: 4 });
      carregarDados();
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao criar');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Configurações de Usuários</Typography>
        <Button variant="contained" color="primary" startIcon={<PersonAddIcon />} onClick={() => setOpen(true)}>
          Novo Usuário
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #E0E0E0' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.03)' }}>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Papel</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((user) => (
              <TableRow key={user.id}>
                <TableCell fontWeight="bold">{user.nome}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell><Chip label={user.papel_nome} size="small" /></TableCell>
                <TableCell>
                  <Chip label={user.ativo ? "Ativo" : "Inativo"} color={user.ativo ? "success" : "default"} size="small" />
                </TableCell>
                <TableCell align="center">
                  <Switch checked={user.ativo} onChange={() => handleToggle(user)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => { setOpen(false); setFormData({ nome: '', email: '', senha: '', papel_id: 4 }); }}>
        <DialogTitle>Novo Usuário do Sistema</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Nome" fullWidth value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} />
            <TextField label="Email" fullWidth value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <TextField label="Senha Temporária" type="password" fullWidth value={formData.senha} onChange={(e) => setFormData({...formData, senha: e.target.value})} />
            <TextField select label="Papel" fullWidth value={formData.papel_id} onChange={(e) => setFormData({...formData, papel_id: Number(e.target.value)})}>
              {papeis.map(p => (
                <MenuItem key={p.id} value={p.id}>{p.papel}</MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreate}>Criar Conta</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
