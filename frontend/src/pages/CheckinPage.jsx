import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Button, Grid, Card, CardContent, Alert, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

export default function CheckinPage() {
  const { eventoId } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [localizacao, setLocalizacao] = useState(null);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);
  const [checkinloading, setCheckinLoading] = useState(false);

  useEffect(() => {
    loadEvento();
    getLocalizacao();
  }, [eventoId]);

  const loadEvento = async () => {
    try {
      const res = await api.get(`/eventos/${eventoId}`);
      setEvento(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizacao = () => {
    if (!navigator.geolocation) {
      setErro('Geolocalização não suportada pelo navegador');
      return;
    }

    setErro(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocalizacao({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (err) => {
        setErro('Não foi possível obter localização: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const fazerCheckin = async () => {
    if (!localizacao) {
      alert('Aguarde a localização ser capturada');
      return;
    }

    setCheckinLoading(true);
    try {
      await api.post(`/eventos/${eventoId}/checkin`, {
        latitude: localizacao.latitude,
        longitude: localizacao.longitude
      });
      setSucesso(true);
      setTimeout(() => navigate('/eventos'), 2000);
    } catch (err) {
      alert('Erro ao fazer check-in');
    } finally {
      setCheckinLoading(false);
    }
  };

  if (loading) return <Typography>Carregando...</Typography>;

  return (
    <DashboardLayout>
      <Container maxWidth="sm">
        <Box sx={{ mb: 3 }}>
          <Button variant="outlined" onClick={() => navigate('/eventos')}>
            Voltar aos Eventos
          </Button>
        </Box>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Check-in: {evento?.titulo}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Data: {evento?.data} | Local: {evento?.regiao_nome}
          </Typography>

          {sucesso ? (
            <Alert severity="success" icon={<CheckCircleIcon />}>
              Check-in realizado com sucesso! Redirecionando...
            </Alert>
          ) : (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Localização Atual
                </Typography>
                
                {localizacao ? (
                  <Card variant="outlined">
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <LocationOnIcon color="primary" sx={{ fontSize: 40 }} />
                        </Grid>
                        <Grid item xs>
                          <Typography variant="body2">
                            <strong>Latitude:</strong> {localizacao.latitude.toFixed(6)}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Longitude:</strong> {localizacao.longitude.toFixed(6)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Precisão: ±{Math.round(localizacao.accuracy)}m
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ) : erro ? (
                  <Alert severity="error">{erro}</Alert>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} />
                    <Typography>Obtendo localização...</Typography>
                  </Box>
                )}
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={fazerCheckin}
                disabled={!localizacao || checkinloading}
                startIcon={<CheckCircleIcon />}
              >
                {checkinloading ? 'Processando...' : 'Confirmar Check-in'}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 1 }}
                onClick={getLocalizacao}
              >
                Atualizar Localização
              </Button>
            </>
          )}
        </Paper>
      </Container>
    </DashboardLayout>
  );
}