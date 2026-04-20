import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Grid, Card, CardContent, CardHeader, 
  Chip, CircularProgress, Snackbar, Alert, TextField, InputAdornment,
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Avatar, Select, MenuItem, FormControl, InputLabel, Tabs, Tab,
  Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, 
  ListItemAvatar, ListItemText, Checkbox, Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import GroupIcon from '@mui/icons-material/Group';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ p: 3 }}>{children}</Box> : null;
}

export default function AdministrativoPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, msg: '', type: 'success' });
  
  const [eventos, setEventos] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [convidados, setConvidados] = useState([]);
  const [search, setSearch] = useState('');
  
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosLoading, setUsuariosLoading] = useState(false);
  
  const [pessoas, setPessoas] = useState([]);
  const [pessoasLoading, setPessoasLoading] = useState(false);

  useEffect(() => {
    if (tab === 0 || tab === 2) {
      carregarEventos();
    }
  }, [tab]);

  useEffect(() => {
    if (eventoSelecionado) {
      carregarConvidados();
    }
  }, [eventoSelecionado]);

  const carregarEventos = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/eventos');
      setEventos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const carregarConvidados = async () => {
    if (!eventoSelecionado) return;
    try {
      setLoading(true);
      const { data } = await api.get(`/eventos/${eventoSelecionado}/convidados`);
      setConvidados(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const carregarUsuarios = async () => {
    try {
      setUsuariosLoading(true);
      const { data } = await api.get('/auth/usuarios');
      setUsuarios(data);
    } catch (err) {
      console.error(err);
    } finally {
      setUsuariosLoading(false);
    }
  };

  const carregarPessoas = async () => {
    try {
      setPessoasLoading(true);
      const { data } = await api.get('/pessoas');
      setPessoas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setPessoasLoading(false);
    }
  };

  const marcarPresenca = async (pessoaId, presente) => {
    try {
      await api.post(`/eventos/${eventoSelecionado}/presenca`, {
        pessoa_id: pessoaId,
        presente: !presente
      });
      setFeedback({ open: true, msg: presente ? 'Presença removida!' : 'Presença confirmada!', type: 'success' });
      carregarConvidados();
    } catch (err) {
      setFeedback({ open: true, msg: 'Erro ao atualizar presença', type: 'error' });
    }
  };

  const atualizarPapel = async (usuarioId, papelId) => {
    try {
      await api.put(`/auth/usuarios/${usuarioId}`, { papel_id: papelId });
      setFeedback({ open: true, msg: 'Perfil atualizado!', type: 'success' });
      carregarUsuarios();
    } catch (err) {
      setFeedback({ open: true, msg: 'Erro ao atualizar perfil', type: 'error' });
    }
  };

  const ativarUsuario = async (usuarioId, ativo) => {
    try {
      await api.put(`/auth/usuarios/${usuarioId}`, { ativo: ativo ? 1 : 0 });
      setFeedback({ open: true, msg: ativo ? 'Usuário ativado!' : 'Usuário inativado!', type: 'success' });
      carregarUsuarios();
    } catch (err) {
      setFeedback({ open: true, msg: 'Erro ao atualizar status', type: 'error' });
    }
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    if (newValue === 1) {
      carregarUsuarios();
    } else if (newValue === 2) {
      carregarPessoas();
    }
  };

  const filteredConvidados = convidados.filter(c => 
    c.nome?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsuarios = usuarios.filter(u => 
    u.nome?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPessoas = pessoas.filter(p => 
    p.nome?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
       Painel Administrativo
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={handleTabChange} variant="fullwidth" centered>
          <Tab icon={<EventIcon />} label="Eventos & Presença" />
          <Tab icon={<PeopleIcon />} label="Gerenciar Usuários" />
          <Tab icon={<GroupIcon />} label="Todas as Pessoas" />
        </Tabs>
      </Paper>

      <TabPanel value={tab} index={0}>
        <Card sx={{ mb: 3 }}>
          <CardHeader title="Selecione um Evento" subheader="Escolha o evento para gerenciar convidados" />
          <CardContent>
            <FormControl fullWidth>
              <InputLabel>Evento</InputLabel>
              <Select
                value={eventoSelecionado || ''}
                label="Evento"
                onChange={(e) => setEventoSelecionado(e.target.value)}
              >
                {eventos.map(e => (
                  <MenuItem key={e.id} value={e.id}>
                    {e.titulo} - {e.data ? new Date(e.data).toLocaleDateString() : 'Data indefinida'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
        </Card>

        {eventoSelecionado && (
          <>
            <Paper sx={{ p: 2, mb: 3 }}>
              <TextField 
                fullWidth
                placeholder="Buscar convidado..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                }}
              />
            </Paper>

            <Card>
              <CardHeader 
                title="Lista de Convidados" 
                subtitle={`${filteredConvidados.length} pessoa(s) encontrada(s)`}
                action={
                  <Chip 
                    label={`${convidados.filter(c => c.presente).length} presente(s)`} 
                    color="success" 
                    icon={<CheckCircleIcon />}
                  />
                }
              />
              <Divider />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Nome</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Telefone</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : filteredConvidados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          Nenhum convidado encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredConvidados.map((convocado, index) => (
                        <TableRow key={convocado.pessoa_id || index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{convocado.nome}</TableCell>
                          <TableCell>{convocado.email || '-'}</TableCell>
                          <TableCell>{convocado.telefone || '-'}</TableCell>
                          <TableCell>
                            {convocado.presente ? (
                              <Chip size="small" color="success" label="Presente" icon={<CheckCircleIcon />} />
                            ) : (
                              <Chip size="small" color="default" label="Ausente" />
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton 
                              color={convocado.presente ? "error" : "success"}
                              onClick={() => marcarPresenca(convocado.pessoa_id, convocado.presente)}
                              title={convocado.presente ? "Remover presença" : "Confirmar presença"}
                            >
                              {convocado.presente ? <CancelIcon /> : <CheckCircleIcon />}
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </>
        )}
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField 
            fullWidth
            placeholder="Buscar usuário..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            }}
          />
        </Paper>

        <Card>
          <CardHeader 
            title="Gerenciar Usuários" 
            subtitle="Controle de acesso e permissões"
          />
          <Divider />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Usuário</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Perfil</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuariosLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredUsuarios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsuarios.map((usuario, index) => (
                    <TableRow key={usuario.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                            {usuario.nome?.charAt(0).toUpperCase()}
                          </Avatar>
                          {usuario.nome}
                        </Box>
                      </TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>
                        <Select
                          size="small"
                          value={usuario.papel_id || 4}
                          onChange={(e) => atualizarPapel(usuario.id, e.target.value)}
                          disabled={usuario.id === 1}
                        >
                          <MenuItem value={1}>Administrador</MenuItem>
                          <MenuItem value={2}>Assessor</MenuItem>
                          <MenuItem value={3}>Líder</MenuItem>
                          <MenuItem value={4}>Usuário</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {usuario.ativo ? (
                          <Chip size="small" color="success" label="Ativo" />
                        ) : (
                          <Chip size="small" color="error" label="Inativo" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          color={usuario.ativo ? "error" : "success"}
                          onClick={() => ativarUsuario(usuario.id, !usuario.ativo)}
                          disabled={usuario.id === 1}
                          title={usuario.ativo ? "Inativar" : "Ativar"}
                        >
                          {usuario.ativo ? <CancelIcon /> : <CheckCircleIcon />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </TabPanel>

      <TabPanel value={tab} index={2}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField 
            fullWidth
            placeholder="Buscar pessoa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            }}
          />
        </Paper>

        <Card>
          <CardHeader 
            title="Todas as Pessoas Cadastradas" 
            subtitle={`${filteredPessoas.length} pessoa(s) no sistema`}
          />
          <Divider />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell>Papel</TableCell>
                  <TableCell>Agrupamento</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pessoasLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredPessoas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Nenhuma pessoa cadastrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPessoas.map((pessoa, index) => (
                    <TableRow key={pessoa.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{pessoa.nome}</TableCell>
                      <TableCell>{pessoa.email || '-'}</TableCell>
                      <TableCell>{pessoa.telefone || '-'}</TableCell>
                      <TableCell>
                        <Chip size="small" label={pessoa.papel || 'Usuário'} />
                      </TableCell>
                      <TableCell>{pessoa.agrupamento_nome || '-'}</TableCell>
                      <TableCell align="center">
                        <IconButton 
                          color="primary"
                          onClick={() => navigate(`/pessoas/${pessoa.id}`)}
                          title="Editar"
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </TabPanel>

      <Snackbar open={feedback.open} autoHideDuration={4000} onClose={() => setFeedback({...feedback, open: false})}>
        <Alert severity={feedback.type}>{feedback.msg}</Alert>
      </Snackbar>
    </Box>
  );
}