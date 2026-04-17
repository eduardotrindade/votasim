import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Button, Chip, IconButton } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

export default function ConvitePessoasPage() {
  const { eventoId } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [pessoas, setPessoas] = useState([]);
  const [convidados, setConvidados] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [eventoId]);

  const loadData = async () => {
    try {
      const [eventoRes, pessoasRes, convidadosRes] = await Promise.all([
        api.get(`/eventos/${eventoId}`),
        api.get(`/eventos/${eventoId}/pessoas-disponiveis`),
        api.get(`/eventos/${eventoId}/convidados`)
      ]);
      setEvento(eventoRes.data);
      setPessoas(pessoasRes.data);
      setConvidados(convidadosRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(pessoas.map(p => p.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleConvidar = async () => {
    try {
      await api.post(`/eventos/${eventoId}/convidar`, { pessoaIds: selected });
      alert('Pessoas convidadas com sucesso!');
      loadData();
      setSelected([]);
    } catch (err) {
      alert('Erro ao convidar pessoas');
    }
  };

  const handleRemoverConvidado = async (pessoaId) => {
    try {
      await api.delete(`/eventos/${eventoId}/convidados/${pessoaId}`);
      loadData();
    } catch (err) {
      alert('Erro ao remover convidado');
    }
  };

  const handleMarcarPresenca = async (pessoaId, presente) => {
    try {
      await api.put(`/eventos/${eventoId}/presenca/${pessoaId}`, { presente });
      loadData();
    } catch (err) {
      alert('Erro ao atualizar presença');
    }
  };

  if (loading) return <Typography>Carregando...</Typography>;

  return (
    <DashboardLayout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Convidar Pessoas para: {evento?.titulo}
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/eventos')}>
            Voltar aos Eventos
          </Button>
        </Box>

        {/* Convidados */}
        <Paper sx={{ mb: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>Convidados ({convidados.length})</Typography>
          {convidados.length === 0 ? (
            <Typography>Nenhum convidado ainda</Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Telefone</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {convidados.map(c => (
                    <TableRow key={c.pessoa_id}>
                      <TableCell>{c.nome}</TableCell>
                      <TableCell>{c.telefone}</TableCell>
                      <TableCell>
                        <Chip 
                          label={c.presente ? 'Presente' : 'Ausente'} 
                          color={c.presente ? 'success' : 'default'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="small" 
                          onClick={() => handleMarcarPresenca(c.pessoa_id, !c.presente)}
                        >
                          {c.presente ? 'Desmarcar' : 'Marcar Presença'}
                        </Button>
                        <Button 
                          size="small" 
                          color="error"
                          onClick={() => handleRemoverConvidado(c.pessoa_id)}
                        >
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Convidar */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Selecione pessoas para convidar ({selected.length} selecionadas)</Typography>
          {pessoas.length === 0 ? (
            <Typography>Todas as pessoas já foram convidadas</Typography>
          ) : (
            <>
              <Box sx={{ mb: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={handleConvidar}
                  disabled={selected.length === 0}
                >
                  Convidar Selecionados
                </Button>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={selected.length > 0 && selected.length < pessoas.length}
                          checked={pessoas.length > 0 && selected.length === pessoas.length}
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell>Nome</TableCell>
                      <TableCell>Telefone</TableCell>
                      <TableCell>Email</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pessoas.map(p => (
                      <TableRow key={p.id}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selected.includes(p.id)}
                            onChange={() => handleSelect(p.id)}
                          />
                        </TableCell>
                        <TableCell>{p.nome}</TableCell>
                        <TableCell>{p.telefone}</TableCell>
                        <TableCell>{p.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Paper>
      </Container>
    </DashboardLayout>
  );
}