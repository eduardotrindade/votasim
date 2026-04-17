import React, { useState } from 'react';
import { Box, Typography, Select, MenuItem, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Switch, Chip } from '@mui/material';
import api from '../services/api';
import { useEffect } from 'react';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [papeis, setPapeis] = useState([
    { id: 1, nome: 'Administrador' },
    { id: 2, nome: 'Coordenador' },
    { id: 3, nome: 'Assessor' },
    { id: 4, nome: 'Líder' }
  ]);

  useEffect(() => {
    api.get('/usuarios').then(res => setUsuarios(res.data)).catch(err => console.error(err));
  }, []);

  const atualizarUsuario = async (usuarioId, papelId, ativo) => {
    try {
      await api.put(`/usuarios/${usuarioId}/papel`, { papel_id: Number(papelId), ativo });
      const { data } = await api.get('/usuarios');
      setUsuarios(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Gerenciar Usuários
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
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
            {usuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="textSecondary">Nenhum usuário encontrado.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              usuarios.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ fontWeight: 'bold' }}>{row.nome}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={row.papel_id}
                      onChange={(e) => atualizarUsuario(row.id, e.target.value, row.ativo)}
                    >
                      {papeis.map(p => (
                        <MenuItem key={p.id} value={p.id}>{p.nome}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={row.ativo ? 'Ativo' : 'Inativo'} 
                      color={row.ativo ? 'success' : 'default'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Switch 
                      checked={row.ativo}
                      onChange={(e) => atualizarUsuario(row.id, row.papel_id, e.target.checked)}
                    />
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