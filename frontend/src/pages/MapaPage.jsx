import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, CardActions, Button, Chip } from '@mui/material';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

const mapContainerStyle = {
  width: '100%',
  height: 'calc(100vh - 200px)',
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
  mapTypeControl: true,
  fullscreenControl: true
};

export default function MapaPage() {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [eventosComCoords, setEventosComCoords] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEventos();
  }, []);

  const loadEventos = async () => {
    try {
      const res = await api.get('/eventos');
      setEventos(res.data);
      const comCoords = res.data.filter(e => e.latitude && e.longitude);
      setEventosComCoords(comCoords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <DashboardLayout>
      <Box sx={{ height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            <LocationOnIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Mapa de Eventos
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/eventos')}>
            Ver Lista de Eventos
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Total de {eventosComCoords.length} evento(s) com localização registrada
        </Typography>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            {eventosComCoords.length === 0 ? (
              <Grid item xs={12}>
                <Typography color="text.secondary">
                  Nenhum evento com coordenadas registradas. Faça check-in nos eventos para adicionar localização.
                </Typography>
              </Grid>
            ) : (
              eventosComCoords.slice(0, 6).map((evento) => (
                <Grid item xs={12} sm={6} md={4} key={evento.id}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' }
                    }}
                    onClick={() => setSelectedEvent(evento)}
                  >
                    <CardContent sx={{ pb: 1 }}>
                      <Typography variant="subtitle2" noWrap>{evento.titulo}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <CalendarTodayIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {evento.data}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ pt: 0 }}>
                      <Chip 
                        size="small" 
                        label={evento.check_in ? 'Check-in OK' : 'Pendente'}
                        color={evento.check_in ? 'success' : 'warning'}
                      />
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Paper>

        {googleMapsKey ? (
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
                  onClick={() => setSelectedEvent(evento)}
                />
              ))}

              {selectedEvent && (
                <InfoWindow
                  position={{ lat: selectedEvent.latitude, lng: selectedEvent.longitude }}
                  onCloseClick={() => setSelectedEvent(null)}
                >
                  <Box sx={{ maxWidth: 200 }}>
                    <Typography variant="subtitle2">{selectedEvent.titulo}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Data: {selectedEvent.data}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Local: {selectedEvent.regiao_nome}
                    </Typography>
                    <Chip 
                      size="small" 
                      label={selectedEvent.check_in ? 'Finalizado' : 'Pendente'}
                      color={selectedEvent.check_in ? 'success' : 'warning'}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="error">
              API Key do Google Maps não configurada
            </Typography>
          </Paper>
        )}
      </Box>
    </DashboardLayout>
  );
}