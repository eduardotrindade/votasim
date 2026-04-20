import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardActions, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

export default function AgrupamentosPage() {
  const navigate = useNavigate();
  const [agrupamentos, setAgrupamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarAgrupamentos();
  }, []);

  const carregarAgrupamentos = async () => {
    try {
      const { data } = await api.get('/agrupamentos');
      setAgrupamentos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">Agrupamentos</Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => navigate('/agrupamentos/novo')}>
            Novo Agrupamento
          </Button>
        </Box>

        {loading ? (
          <Typography>Carregando...</Typography>
        ) : agrupamentos.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">Nenhum agrupamento cadastrado.</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/agrupamentos/novo')}>
              Criar Primeiro Agrupamento
            </Button>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.05)' }}>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Nome</strong></TableCell>
                  <TableCell><strong>Região</strong></TableCell>
                  <TableCell><strong>Endereço</strong></TableCell>
                  <TableCell align="center"><strong>Ações</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {agrupamentos.map((agr) => (
                  <TableRow key={agr.id} hover>
                    <TableCell>{agr.id}</TableCell>
                    <TableCell>{agr.nome}</TableCell>
                    <TableCell>{agr.regiao_nome || '-'}</TableCell>
                    <TableCell>{agr.endereco || '-'}</TableCell>
                    <TableCell align="center">
                      <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/agrupamentos/novo?id=${agr.id}`)}>
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </DashboardLayout>
  );
}