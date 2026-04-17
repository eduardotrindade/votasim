import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Paper, List, ListItem, ListItemText, ListItemIcon, Divider, Chip } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MapIcon from '@mui/icons-material/Map';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import api from '../services/api';

const mapContainerStyle = {
  width: '100%',
  height: 200,
  borderRadius: 8
};

const center = {
  lat: -15.7801,
  lng: -47.9292
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalPessoas: 0, totalEventos: 0, totalPresencas: 0 });
  const [eventos, setEventos] = useState([]);
  const [eventosComCoords, setEventosComCoords] = useState([]);
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [dashboardRes, eventosRes, heatmapRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/eventos'),
        api.get('/dashboard/heatmap').catch(() => ({ data: [] }))
      ]);
      
      setStats(dashboardRes.data);
      setEventos(eventosRes.data.slice(0, 5));
      
      // Filtrar eventos com coordenadas para o mapa
      const comCoords = eventosRes.data.filter(e => e.latitude && e.longitude);
      setEventosComCoords(comCoords);
      
      // Dados simulados para gráfico (em produção viria do backend)
      const graf = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        graf.push({
          data: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          eventos: Math.floor(Math.random() * 5),
          cadastros: Math.floor(Math.random() * 20)
        });
      }
      setDadosGrafico(graf);
    } catch (err) {
      console.error(err);
      // Fallback
      setStats({ totalPessoas: 0, totalEventos: 0, totalPresencas: 0 });
    } finally {
      setLoading(false);
    }
  };

  const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      {/* Cards de Indicadores */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderLeft: '5px solid #1976d2' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total de Pessoas</Typography>
                  <Typography variant="h3" fontWeight="bold">{stats.totalPessoas}</Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 50, color: '#1976d2' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderLeft: '5px solid #2e7d32' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total de Eventos</Typography>
                  <Typography variant="h3" fontWeight="bold">{stats.totalEventos}</Typography>
                </Box>
                <EventIcon sx={{ fontSize: 50, color: '#2e7d32' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderLeft: '5px solid #ed6c02' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Presenças</Typography>
                  <Typography variant="h3" fontWeight="bold">{stats.totalPresencas}</Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 50, color: '#ed6c02' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Menu de Ações Rápidas */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Ações Rápidas</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<GroupAddIcon />}
              onClick={() => navigate('/agrupamentos/novo')}
              sx={{ py: 2 }}
            >
              Criar Agrupamento
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<PersonAddIcon />}
              onClick={() => navigate('/pessoas/nova')}
              sx={{ py: 2 }}
            >
              Cadastrar Pessoa
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<ListAltIcon />}
              onClick={() => navigate('/meus-cadastros')}
              sx={{ py: 2 }}
            >
              Meus Cadastros
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<CalendarMonthIcon />}
              onClick={() => navigate('/eventos')}
              sx={{ py: 2 }}
            >
              Eventos
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Gráfico de Eventos por Data */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Eventos e Cadastros (últimos 7 dias)
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="eventos" stroke="#1976d2" strokeWidth={2} name="Eventos" />
                <Line type="monotone" dataKey="cadastros" stroke="#2e7d32" strokeWidth={2} name="Cadastros" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              <MapIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Mapa de Eventos
            </Typography>
            
            {eventosComCoords.length > 0 && googleMapsKey ? (
              <LoadScript googleMapsApiKey={googleMapsKey}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={11}
                  options={mapOptions}
                >
                  {eventosComCoords.map((evento) => (
                    <Marker
                      key={evento.id}
                      position={{ lat: evento.latitude, lng: evento.longitude }}
                      title={evento.titulo}
                    />
                  ))}
                </GoogleMap>
              </LoadScript>
            ) : (
              <Box sx={{ 
                bgcolor: '#f5f5f5', 
                height: 200, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: 1 
              }}>
                <Typography color="text.secondary" textAlign="center">
                  {eventosComCoords.length === 0 
                    ? 'Nenhum evento com localização'
                    : 'Configure a API Key do Google Maps'}
                </Typography>
              </Box>
            )}
            
            <Button 
              fullWidth 
              variant="text" 
              sx={{ mt: 1 }}
              onClick={() => navigate('/ranking')}
            >
              Ver Ranking Completo
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Lista de Eventos Recentes */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Próximos Eventos
          </Typography>
          <Button onClick={() => navigate('/eventos')}>Ver Todos</Button>
        </Box>
        
        {eventos.length === 0 ? (
          <Typography color="text.secondary">Nenhum evento agendado</Typography>
        ) : (
          <List>
            {eventos.map((evento, index) => (
              <React.Fragment key={evento.id}>
                <ListItem>
                  <ListItemIcon>
                    <EventIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={evento.titulo}
                    secondary={`${evento.data} - ${evento.regiao_nome || 'Sem região'}`}
                  />
                  <Chip 
                    size="small" 
                    label={evento.check_in ? 'Finalizado' : 'Pendente'} 
                    color={evento.check_in ? 'success' : 'warning'}
                  />
                </ListItem>
                {index < eventos.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}