import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Snackbar, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from '../services/api';

export default function ImportCSVPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, msg: '', type: 'info' });

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
      const { data } = await api.post('/import/pessoas', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFeedback({ open: true, msg: data.message, type: 'success' });
      setFile(null);
    } catch (err) {
      setFeedback({ open: true, msg: 'Erro ao importar arquivo.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Importar Pessoas via CSV
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Selecione um arquivo CSV com as colunas: <strong>nome, email, telefone</strong>
        </Typography>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="csv-input"
        />
        <label htmlFor="csv-input">
          <Button variant="outlined" component="span" sx={{ mb: 2 }}>
            {file ? file.name : 'Selecionar Arquivo'}
          </Button>
        </label>

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            onClick={handleUpload}
            disabled={loading || !file}
          >
            {loading ? 'Importando...' : 'Importar'}
          </Button>
        </Box>
      </Paper>

      <Snackbar open={feedback.open} autoHideDuration={5000} onClose={() => setFeedback({...feedback, open: false})} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={feedback.type} sx={{ width: '100%' }}>{feedback.msg}</Alert>
      </Snackbar>
    </Box>
  );
}