import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Button, Grid, Card, CardMedia, CardContent, IconButton, CircularProgress, Alert, TextField, InputAdornment } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

export default function FotosEventoPage() {
  const { eventoId } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [stats, setStats] = useState({ total: 0, presentes: 0, confirmados: 0 });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [urlFoto, setUrlFoto] = useState('');
  const [fileFoto, setFileFoto] = useState(null);

  useEffect(() => {
    loadData();
  }, [eventoId]);

  const loadData = async () => {
    try {
      const [eventoRes, fotosRes, statsRes] = await Promise.all([
        api.get(`/eventos/${eventoId}`),
        api.get(`/eventos/${eventoId}/fotos`),
        api.get(`/eventos/${eventoId}/estatisticas`)
      ]);
      setEvento(eventoRes.data);
      setFotos(fotosRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFoto = async () => {
    console.log('eventoId:', eventoId, 'fileFoto:', fileFoto);
    if (!urlFoto && !fileFoto) {
      alert('Selecione uma imagem ou cole uma URL');
      return;
    }

    setUploading(true);
    try {
      if (fileFoto) {
        const formData = new FormData();
        formData.append('foto', fileFoto);
        const res = await api.post(`/eventos/${eventoId}/fotos/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('Upload response:', res.data);
        setFileFoto(null);
      } else {
        await api.post(`/eventos/${eventoId}/fotos`, { foto: urlFoto });
        setUrlFoto('');
      }
      loadData();
      alert('Foto adicionada!');
    } catch (err) {
      console.error('Erro upload:', err);
      const msg = err.response?.data?.error || err.message || 'Erro ao adicionar foto';
      alert('Erro: ' + msg);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 5MB');
        return;
      }
      setFileFoto(file);
      setUrlFoto('');
    }
  };

  const handleExcluirFoto = async (fotoId) => {
    if (!confirm('Excluir esta foto?')) return;
    
    try {
      await api.delete(`/eventos/fotos/${fotoId}`);
      loadData();
    } catch (err) {
      alert('Erro ao excluir foto');
    }
  };

  if (loading) return <Typography>Carregando...</Typography>;

  return (
    <DashboardLayout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Button variant="outlined" onClick={() => navigate('/eventos')}>
            Voltar aos Eventos
          </Button>
        </Box>

        <Typography variant="h5" gutterBottom>
          Fotos do Evento: {evento?.titulo}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {evento?.data} - {evento?.regiao_nome}
        </Typography>

        {/* Estatísticas */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">{stats.total}</Typography>
                <Typography variant="body2">Total de Convidados</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success">{stats.presentes}</Typography>
                <Typography variant="body2">Presenças</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info">{stats.confirmados}</Typography>
                <Typography variant="body2">Confirmados</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Upload de foto */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            <PhotoLibraryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Adicionar Foto
          </Typography>
          
          {/* Upload por arquivo */}
          <Box sx={{ mb: 2 }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="upload-foto-input"
            />
            <label htmlFor="upload-foto-input">
              <Button 
                variant="outlined" 
                component="span"
                startIcon={<CloudUploadIcon />}
              >
                {fileFoto ? fileFoto.name : 'Escolher arquivo do dispositivo'}
              </Button>
            </label>
            {fileFoto && (
              <Typography variant="caption" sx={{ ml: 2 }}>
                {fileFoto.name} ({Math.round(fileFoto.size / 1024)} KB)
              </Typography>
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
            Ou cole uma URL:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Cole o URL da imagem (jpg, png, etc)"
              value={urlFoto}
              onChange={(e) => setUrlFoto(e.target.value)}
              size="small"
              disabled={!!fileFoto}
            />
            <Button 
              variant="contained" 
              onClick={handleUploadFoto}
              disabled={uploading || (!urlFoto && !fileFoto)}
              startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
            >
              {uploading ? 'Enviando...' : 'Adicionar'}
            </Button>
          </Box>
        </Paper>

        {/* Galeria de fotos */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Galeria de Fotos ({fotos.length})
          </Typography>
          
          {fotos.length === 0 ? (
            <Typography color="text.secondary">
              Nenhuma foto adicionada ainda.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {fotos.map((foto) => (
                <Grid item xs={6} sm={4} md={3} key={foto.id}>
                  <Card sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="150"
                      image={foto.foto}
                      alt="Foto do evento"
                      sx={{ objectFit: 'cover' }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Imagem+não+disponível'; }}
                    />
                    <IconButton
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        top: 4, 
                        right: 4, 
                        bgcolor: 'rgba(255,255,255,0.8)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                      }}
                      onClick={() => handleExcluirFoto(foto.id)}
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                    {foto.localizacao_foto && (
                      <Box sx={{ position: 'absolute', bottom: 4, left: 4, display: 'flex', alignItems: 'center' }}>
                        <LocationOnIcon fontSize="small" sx={{ color: 'white', textShadow: '1px 1px 2px black' }} />
                      </Box>
                    )}
                    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                      <Typography variant="caption" display="block">
                        {new Date(foto.cadastrado_em).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Container>
    </DashboardLayout>
  );
}