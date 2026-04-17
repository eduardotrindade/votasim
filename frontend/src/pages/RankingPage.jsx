import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { useEffect } from 'react';

export default function RankingPage() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    api.get('/dashboard/ranking').then(res => setRanking(res.data)).catch(err => console.error(err));
  }, []);

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Ranking de Cadastros
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 4 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.03)' }}>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Usuário</TableCell>
              <TableCell align="center">Total de Cadastros</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ranking.map((row, index) => (
              <TableRow key={row.nome}>
                <TableCell>{index + 1}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{row.nome}</TableCell>
                <TableCell align="center">{row.total_cadastros}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" sx={{ mb: 2 }}>Gráfico de Desempenho</Typography>
      <Paper sx={{ p: 2, borderRadius: 2, height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ranking} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <XAxis type="number" />
            <YAxis type="category" dataKey="nome" width={100} />
            <Tooltip />
            <Bar dataKey="total_cadastros" fill="#2E7D32" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}