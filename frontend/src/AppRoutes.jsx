import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';

import Dashboard from './pages/Dashboard';
import PessoasPage from './pages/PessoasPage';
import PessoaForm from './pages/PessoaForm';
import EventosPage from './pages/EventosPage';
import EventoForm from './pages/EventoForm';
import UsuariosPage from './pages/UsuariosPage';
import Register from './pages/Register';
import RoleSelection from './pages/RoleSelection';
import AgrupamentoForm from './pages/AgrupamentoForm';
import AgrupamentosPage from './pages/AgrupamentosPage';
import VinculosPage from './pages/VinculosPage';
import RankingPage from './pages/RankingPage';
import ImportCSVPage from './pages/ImportCSVPage';
import ProfilePage from './pages/ProfilePage';
import ConvitePessoasPage from './pages/ConvitePessoasPage';
import CheckinPage from './pages/CheckinPage';
import FotosEventoPage from './pages/FotosEventoPage';
import MapaPage from './pages/MapaPage';
import AdministrativoPage from './pages/AdministrativoPage';
import EventoDetalhePage from './pages/EventoDetalhePage';

// Wrappers para páginas protegidas
const papelMap = {
  'administrador': 1,
  'assessor': 2,
  'líder': 3,
  'usuário': 4
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { signed, user, loading } = useContext(AuthContext);

  if (loading) return <div>Carregando...</div>;
  if (!signed) return <Navigate to="/login" replace />;
  
  // Support both string (papel name) and number (papel_id)
  const userPapel = user.papel || 'usuário';
  const userPapelId = user.papel_id || 4;
  
  if (allowedRoles && allowedRoles.length > 0) {
    const hasAccess = allowedRoles.some(role => {
      if (typeof role === 'number') {
        return role === userPapelId;
      }
      return role === userPapel;
    });
    if (!hasAccess) {
      return <div>Acesso Negado - Sem permissão</div>;
    }
  }

  return children;
};

// Componentes temporarios
const StagingPage = () => <div>Seu cadastro está pendente de aprovação.</div>;

function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/selecionar-perfil" element={
        <ProtectedRoute>
          <RoleSelection />
        </ProtectedRoute>
      } />
      
      {/* Rota raiz condicional baseada no papel */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={['administrador', 'assessor', 'líder', 'usuário']}>
          <DashboardLayout>
             <Dashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/pessoas" element={
        <ProtectedRoute allowedRoles={['administrador', 'assessor', 'líder', 'usuário']}>
          <DashboardLayout>
            <PessoasPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/pessoas/nova" element={
        <ProtectedRoute allowedRoles={['administrador', 'assessor', 'líder', 'usuário']}>
          <DashboardLayout>
            <PessoaForm />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/pessoas/:id" element={
        <ProtectedRoute allowedRoles={['administrador', 'assessor', 'líder', 'usuário']}>
          <DashboardLayout>
            <PessoaForm />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/agrupamentos" element={
        <ProtectedRoute allowedRoles={['administrador', 'assessor', 'líder', 'usuário']}>
          <DashboardLayout>
            <AgrupamentosPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/agrupamentos/novo" element={
        <ProtectedRoute allowedRoles={['administrador', 'assessor', 'líder', 'usuário']}>
          <DashboardLayout>
            <AgrupamentoForm />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/meus-cadastros" element={
        <ProtectedRoute allowedRoles={['administrador', 'assessor', 'líder', 'usuário']}>
          <DashboardLayout>
            <PessoasPage meOnly={true} />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/meus-eventos" element={
        <ProtectedRoute allowedRoles={['administrador', 'assessor', 'líder', 'usuário']}>
          <DashboardLayout>
            <EventosPage meOnly={true} />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/eventos" element={
        <ProtectedRoute allowedRoles={['administrador', 'assessor', 'líder', 'usuário']}>
          <DashboardLayout>
            <EventosPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/eventos/novo" element={
        <ProtectedRoute allowedRoles={['administrador', 'assessor', 'líder', 'usuário']}>
          <DashboardLayout>
            <EventoForm />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/eventos/:eventoId/convite" element={
        <ProtectedRoute allowedRoles={['administrador', 'assessor', 'líder', 'usuário']}>
          <DashboardLayout>
            <ConvitePessoasPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/eventos/:eventoId/checkin" element={
        <ProtectedRoute allowedRoles={['administrador', 'assessor', 'líder', 'usuário']}>
          <DashboardLayout>
            <CheckinPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/eventos/:eventoId/fotos" element={
        <ProtectedRoute allowedRoles={['administrador', 'assessor', 'líder', 'usuário']}>
          <DashboardLayout>
            <FotosEventoPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/eventos/:id" element={
        <ProtectedRoute allowedRoles={['administrador', 'assessor', 'líder', 'usuário']}>
          <DashboardLayout>
            <EventoDetalhePage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/mapa" element={
        <ProtectedRoute allowedRoles={['administrador', 'assessor', 'líder', 'usuário']}>
          <DashboardLayout>
            <MapaPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/ranking" element={
        <ProtectedRoute allowedRoles={['administrador', 'assessor', 'líder', 'usuário']}>
          <DashboardLayout>
            <RankingPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/importar" element={
        <ProtectedRoute allowedRoles={['administrador', 'assessor', 'líder', 'usuário']}>
          <DashboardLayout>
            <ImportCSVPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/perfil" element={
        <ProtectedRoute allowedRoles={['administrador', 'assessor', 'líder', 'usuário']}>
          <DashboardLayout>
            <ProfilePage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/configuracoes/usuarios" element={
        <ProtectedRoute allowedRoles={['administrador']}>
          <DashboardLayout>
            <UsuariosPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/administrativo" element={
        <ProtectedRoute allowedRoles={['administrador']}>
          <DashboardLayout>
            <AdministrativoPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/vinculos" element={
        <ProtectedRoute allowedRoles={['administrador', 'assessor', 'líder']}>
          <DashboardLayout>
            <VinculosPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default AppRoutes;
