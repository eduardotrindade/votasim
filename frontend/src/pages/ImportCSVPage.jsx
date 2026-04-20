import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Snackbar, Alert, Card, CardContent, Divider, Grid } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from '../services/api';

export default function ImportCSVPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, msg: '', type: 'success' });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setFeedback({ open: true, msg: 'Selecione um arquivo CSV primeiro!', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await api.post('/import/pessoas', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFeedback({ open: true, msg: response.data.message, type: 'success' });
      setFile(null);
    } catch (err) {
      setFeedback({ open: true, msg: 'Erro ao importar arquivo.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Importar via CSV</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Envie uma lista de pessoas para cadastramento massivo no sistema.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
            <Box sx={{ 
              border: '2px dashed #ccc', 
              p: 6, 
              borderRadius: 2, 
              bgcolor: 'rgba(0,0,0,0.01)',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' }
            }} component="label">
              <input type="file" accept=".csv" hidden onChange={handleFileChange} />
              <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6">
                {file ? file.name : 'Clique para selecionar o arquivo CSV'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                O arquivo deve conter cabeçalhos como Nome, Email e Telefone.
              </Typography>
            </Box>

            <Button 
              variant="contained" 
              fullWidth 
              size="large" 
              sx={{ mt: 4 }} 
              onClick={handleUpload}
              disabled={loading || !file}
            >
              {loading ? 'Importando...' : 'Iniciar Importação'}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Instruções de Formatação</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" paragraph>
                Para uma importação bem-sucedida, organize seu CSV com as seguintes colunas (a ordem não importa):
              </Typography>
              <ul>
                <li><strong>nome</strong>: Nome completo da pessoa.</li>
                <li><strong>email</strong>: Endereço de e-mail.</li>
                <li><strong>telefone</strong>: Número de contato.</li>
              </ul>
              <Typography variant="body2" color="text.secondary">
                Dica: Verifique se o arquivo não possui linhas em branco e se o separador é vírgula ( , ).
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar open={feedback.open} autoHideDuration={6000} onClose={() => setFeedback({...feedback, open: false})}>
        <Alert severity={feedback.type}>{feedback.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
