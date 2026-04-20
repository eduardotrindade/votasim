import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress } from '@mui/material';
import api from '../services/api';

export default function RankingPage() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/ranking')
      .then(res => {
        setRanking(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <LinearProgress />;

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Ranking de Cadastros</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Acompanhe os usuários que mais contribuíram com novos cadastros no sistema.
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Posição</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Usuário</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total de Cadastros</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ranking.map((row, index) => (
              <TableRow key={index} hover>
                <TableCell>{index + 1}º</TableCell>
                <TableCell sx={{ fontWeight: '500' }}>{row.nome}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {row.total}
                </TableCell>
              </TableRow>
            ))}
            {ranking.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">Nenhum dado disponível no momento.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
