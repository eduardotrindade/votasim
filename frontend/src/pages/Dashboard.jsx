import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import api from '../services/api';

function StatCard({ title, value, icon, color, loading }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            {loading ? (
               <Skeleton width={60} height={40} />
            ) : (
              <Typography variant="h4" color="textPrimary">
                {value}
              </Typography>
            )}
          </Box>
          <Box sx={{ bgcolor: `${color}15`, p: 1.5, borderRadius: 2 }}>
            {React.cloneElement(icon, { sx: { color, fontSize: 32 } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      const { data } = await api.get('/dashboard/stats');
      setStats(data);
    } catch (error) {
      console.error("Erro ao carregar dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Visão Geral
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="TOTAL DE CADASTROS" 
            value={stats?.totalPessoas || 0} 
            icon={<PeopleIcon />} 
            color="#2E7D32" 
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="EVENTOS NO MÊS" 
            value={stats?.eventosMes || 0} 
            icon={<EventIcon />} 
            color="#1976D2" 
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="TOTAL CHECK-INS" 
            value={stats?.totalCheckins || 0} 
            icon={<LocationOnIcon />} 
            color="#ED6C02" 
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="ENGAJAMENTO" 
            value={stats?.engajamento || "0%"} 
            icon={<TrendingUpIcon />} 
            color="#9C27B0" 
            loading={loading}
          />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Crescimento de Cadastros (Histórico)
          </Typography>
          <Box sx={{ height: 300, mt: 2 }}>
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height={300} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.graph || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCadastros" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="cadastros" stroke="#2E7D32" strokeWidth={3} fillOpacity={1} fill="url(#colorCadastros)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
