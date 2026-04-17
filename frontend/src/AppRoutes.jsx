import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import api from './services/api';

import Dashboard from './pages/Dashboard';
import PessoasPage from './pages/PessoasPage';
import PessoaForm from './pages/PessoaForm';
import EventosPage from './pages/EventosPage';
import EventoForm from './pages/EventoForm';
import UsuariosPage from './pages/UsuariosPage';
import Register from './pages/Register';
import RoleSelection from './pages/RoleSelection';
import AgrupamentoForm from './pages/AgrupamentoForm';
import RankingPage from './pages/RankingPage';
import ImportCSVPage from './pages/ImportCSVPage';
import ProfilePage from './pages/ProfilePage';
import ConvitePessoasPage from './pages/ConvitePessoasPage';
import CheckinPage from './pages/CheckinPage';
import FotosEventoPage from './pages/FotosEventoPage';
import MapaPage from './pages/MapaPage';

// Wrappers para páginas protegidas
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { signed, user, loading } = useContext(AuthContext);

  if (loading) return <div>Carregando...</div>;
  if (!signed) return <Navigate to="/login" replace />;
  
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.papel_id)) {
      return <div>Acesso Negado</div>;
  }

  return children;
};

// Componentes temporarios
const StagingPage = () => <div>Seu cadastro está pendente de aprovação.</div>;

// Página de Callback do Google OAuth
const GoogleCallback = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      if (accessToken) {
        fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`)
          .then(res => res.json())
          .then(async (googleData) => {
            try {
              await api.post('/auth/google', { googleData });
              navigate('/');
            } catch (err) {
              navigate('/login');
            }
          })
          .catch(() => navigate('/login'));
      } else {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, []);

  return <div>Processando login Google...</div>;
};

function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/selecionar-perfil" element={
        <ProtectedRoute>
          <RoleSelection />
        </ProtectedRoute>
      } />
      
      {/* Rota raiz condicional baseada no papel */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={[1, 2, 3, 4, 5]}>
          <DashboardLayout>
             <Dashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/pessoas" element={
        <ProtectedRoute allowedRoles={[1, 2, 3, 4, 5]}>
          <DashboardLayout>
            <PessoasPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/pessoas/nova" element={
        <ProtectedRoute allowedRoles={[1, 2, 3, 4, 5]}>
          <DashboardLayout>
            <PessoaForm />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/agrupamentos/novo" element={
        <ProtectedRoute allowedRoles={[1, 2, 3, 4, 5]}>
          <DashboardLayout>
            <AgrupamentoForm />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/meus-cadastros" element={
        <ProtectedRoute allowedRoles={[1, 2, 3, 4, 5]}>
          <DashboardLayout>
            <PessoasPage meOnly={true} />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/meus-eventos" element={
        <ProtectedRoute allowedRoles={[1, 2, 3, 4, 5]}>
          <DashboardLayout>
            <EventosPage meOnly={true} />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/eventos" element={
        <ProtectedRoute allowedRoles={[1, 2, 3, 4, 5]}>
          <DashboardLayout>
            <EventosPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/eventos/novo" element={
        <ProtectedRoute allowedRoles={[1, 2, 3, 4, 5]}>
          <DashboardLayout>
            <EventoForm />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/eventos/:eventoId/convite" element={
        <ProtectedRoute allowedRoles={[1, 2, 3, 4, 5]}>
          <DashboardLayout>
            <ConvitePessoasPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/eventos/:eventoId/checkin" element={
        <ProtectedRoute allowedRoles={[1, 2, 3, 4, 5]}>
          <DashboardLayout>
            <CheckinPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/eventos/:eventoId/fotos" element={
        <ProtectedRoute allowedRoles={[1, 2, 3, 4, 5]}>
          <DashboardLayout>
            <FotosEventoPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/mapa" element={
        <ProtectedRoute allowedRoles={[1, 2, 3, 4, 5]}>
          <DashboardLayout>
            <MapaPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/ranking" element={
        <ProtectedRoute allowedRoles={[1, 2, 3, 4, 5]}>
          <DashboardLayout>
            <RankingPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/importar" element={
        <ProtectedRoute allowedRoles={[1, 2, 3, 4, 5]}>
          <DashboardLayout>
            <ImportCSVPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/perfil" element={
        <ProtectedRoute allowedRoles={[1, 2, 3, 4, 5]}>
          <DashboardLayout>
            <ProfilePage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/configuracoes/usuarios" element={
        <ProtectedRoute allowedRoles={[1]}>
          <DashboardLayout>
            <UsuariosPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default AppRoutes;