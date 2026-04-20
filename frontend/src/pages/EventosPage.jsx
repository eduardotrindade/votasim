import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Grid, Card, CardContent, CardActions, Chip, CircularProgress, Snackbar, Alert, TextField, InputAdornment, Paper, IconButton
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RoomIcon from '@mui/icons-material/Room';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function EventosPage({ meOnly = false }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [eventos, setEventos] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState({ id: null, loading: false });
  const [feedback, setFeedback] = useState({ open: false, msg: '', type: 'info' });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      carregarEventos();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const carregarEventos = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/eventos?search=${search}${meOnly ? '&me=true' : ''}`);
      setEventos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fazerCheckin = (eventoId) => {
    if (!navigator.geolocation) {
      setFeedback({ open: true, msg: 'Seu navegador não suporta GPS.', type: 'error' });
      return;
    }

    setLoadingConfig({ id: eventoId, loading: true });
    
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        await api.post(`/eventos/${eventoId}/checkin`, { 
          pessoa_id: user?.id, 
          latitude, 
          longitude 
        });
        setFeedback({ open: true, msg: '📍 Check-in salvo com sucesso!', type: 'success' });
        carregarEventos();
      } catch (error) {
         setFeedback({ open: true, msg: 'Erro ao registrar check-in: ' + (error.response?.data?.error || error.message), type: 'error' });
      } finally {
         setLoadingConfig({ id: null, loading: false });
      }
    }, () => {
       setFeedback({ open: true, msg: 'Permissão de Localização Negada!', type: 'error' });
       setLoadingConfig({ id: null, loading: false });
    });
  };

  const exportarCSV = () => {
    if (eventos.length === 0) return;
    
    const headers = ['Titulo', 'Data', 'Regiao', 'Status Check-in'];
    const rows = eventos.map(e => [
      e.titulo,
      e.data ? new Date(e.data).toLocaleDateString() : 'N/A',
      e.regiao_nome || 'N/A',
      e.check_in ? 'Finalizado' : 'Pendente'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `eventos_votasim_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          {meOnly ? 'Meus Eventos' : 'Todos os Eventos'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
           <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={exportarCSV}>
             Exportar
           </Button>
           <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<CalendarTodayIcon />}
            onClick={() => navigate('/eventos/novo')}
          >
            Criar Evento
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
         <TextField 
            fullWidth
            placeholder="Buscar por título ou região..."
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

      {eventos.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
           <Typography color="textSecondary">
             {loading ? 'Buscando...' : 'Nenhum evento encontrado.'}
           </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {eventos.map((evento) => (
            <Grid item xs={12} sm={6} md={4} key={evento.id}>
              <Card sx={{ borderTop: '4px solid #2E7D32', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom noWrap>{evento.titulo}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 1 }}>
                    <CalendarTodayIcon fontSize="small" />
                    <Typography variant="body2">
                      {evento.data ? new Date(evento.data).toLocaleDateString() : 'Data em aberto'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 1 }}>
                    <LocationOnIcon fontSize="small" />
                    <Typography variant="body2">{evento.regiao_nome || 'Sem região'}</Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                     {evento.check_in 
                        ? <Chip size="small" label="Check-in Finalizado ✅" color="success" />
                        : <Chip size="small" label="Aguardando Check-in" color="warning" />
                     }
                  </Box>
                </CardContent>
<CardActions sx={{ bgcolor: 'rgba(0,0,0,0.02)', justifyContent: 'space-between', p: 2, gap: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      color="primary"
                      title="Convidar Pessoas"
                      onClick={() => navigate(`/eventos/${evento.id}/convite`)}
                    >
                      <HowToRegIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="secondary"
                      title="Fotos do Evento"
                      onClick={() => navigate(`/eventos/${evento.id}/fotos`)}
                    >
                      <PhotoLibraryIcon />
                    </IconButton>
                  </Box>
                  <Button 
                     variant="contained" 
                     color="primary" 
                     onClick={() => fazerCheckin(evento.id)}
                     disabled={evento.check_in || loadingConfig.id === evento.id}
                     startIcon={loadingConfig.id === evento.id ? <CircularProgress size={20} color="inherit" /> : <RoomIcon />} 
                  >
                     Check-in (GPS)
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar open={feedback.open} autoHideDuration={5000} onClose={() => setFeedback({...feedback, open: false})} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={feedback.type} sx={{ width: '100%' }}>{feedback.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
