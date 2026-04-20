import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Grid, Card, CardContent, CardMedia, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, TextField, InputAdornment, LinearProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleIcon from '@mui/icons-material/People';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ p: 3 }}>{children}</Box> : null;
}

export default function EventoDetalhePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [evento, setEvento] = useState(null);
  const [convidados, setConvidados] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [evt, conv, chk, ft] = await Promise.all([
        api.get(`/eventos/${id}`),
        api.get(`/eventos/${id}/convidados`),
        api.get(`/eventos/${id}/convidados`),
        api.get(`/eventos/${id}/fotos`)
      ]);
      setEvento(evt.data);
      setConvidados(conv.data);
      setCheckins(chk.data.filter(c => c.presente));
      setFotos(ft.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConvocar = async (pessoaId) => {
    try {
      await api.post(`/eventos/${id}/pessoas`, { pessoa_ids: [pessoaId] });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LinearProgress />;
  if (!evento) return <Typography>Evento não encontrado</Typography>;

  const presentes = checkins.length;
  const total = convidados.length;
  const taxa = total > 0 ? Math.round((presentes / total) * 100) : 0;

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/eventos')} sx={{ mb: 2 }}>
          Voltar aos Eventos
        </Button>

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {evento.titulo}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {evento.data} • {evento.regiao_nome}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">{total}</Typography>
                <Typography variant="caption">Convidados</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success">{presentes}</Typography>
                <Typography variant="caption">Check-ins</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning">{taxa}%</Typography>
                <Typography variant="caption">Taxa</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4">{fotos.length}</Typography>
                <Typography variant="caption">Fotos</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ mb: 3 }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="fullwidth" centered>
            <Tab icon={<PeopleIcon />} label="Convidados" />
            <Tab icon={<CheckCircleIcon />} label="Check-ins" />
            <Tab icon={<PhotoLibraryIcon />} label="Fotos" />
          </Tabs>
        </Paper>

        <TabPanel value={tab} index={0}>
          <Typography variant="h6" gutterBottom>Lista de Convidados</Typography>
          {convidados.length === 0 ? (
            <Typography color="text.secondary">Nenhum convidado ainda.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Nome</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Telefone</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {convidados.map(c => (
                    <TableRow key={c.pessoa_id}>
                      <TableCell>{c.nome}</TableCell>
                      <TableCell>{c.email || '-'}</TableCell>
                      <TableCell>{c.telefone || '-'}</TableCell>
                      <TableCell>
                        {c.presente ? (
                          <Chip size="small" color="success" label="Presente" icon={<CheckCircleIcon />} />
                        ) : (
                          <Chip size="small" color="default" label="Ausente" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <Typography variant="h6" gutterBottom>Pessoas que Fizeram Check-in</Typography>
          {checkins.length === 0 ? (
            <Typography color="text.secondary">Nenhum check-in realizado.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Nome</strong></TableCell>
                    <TableCell><strong>Data/Hora</strong></TableCell>
                    <TableCell><strong>Localização</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {checkins.map(c => (
                    <TableRow key={c.pessoa_id}>
                      <TableCell>{c.nome}</TableCell>
                      <TableCell>{c.data_checkin ? new Date(c.data_checkin).toLocaleString() : '-'}</TableCell>
                      <TableCell>
                        {c.latitude && c.longitude ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationOnIcon fontSize="small" />
                            <Typography variant="caption">{c.latitude.toFixed(4)}, {c.longitude.toFixed(4)}</Typography>
                          </Box>
                        ) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        <TabPanel value={tab} index={2}>
          <Typography variant="h6" gutterBottom>Fotos do Evento</Typography>
          {fotos.length === 0 ? (
            <Typography color="text.secondary">Nenhuma foto cadastrada.</Typography>
          ) : (
            <Grid container spacing={2}>
              {fotos.map(f => (
                <Grid item xs={6} sm={4} md={3} key={f.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="150"
                      image={f.url}
                      alt="Foto"
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ p: 1 }}>
                      <Typography variant="caption">
                        {f.created_at ? new Date(f.created_at).toLocaleDateString() : ''}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
      </Box>
    </DashboardLayout>
  );
}