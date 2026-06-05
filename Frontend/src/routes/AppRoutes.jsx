import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/common/Loading';
import DashboardLayout from '../layouts/DashboardLayout';

// Páginas
import Login from '../pages/auth/Login';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminJugadores from '../pages/admin/Jugadores';
import AdminEntrenadores from '../pages/admin/Entrenadores';
import AdminCampeonatos from '../pages/admin/Campeonatos';
import AdminFinanzas from '../pages/admin/Finanzas';
import AdminRendimiento from '../pages/admin/Rendimiento';

// Entrenador Pages
import EntrenadorDashboard from '../pages/entrenador/Dashboard';
import EntrenadorEntrenamientos from '../pages/entrenador/Entrenamientos';
import EntrenadorAsistencia from '../pages/entrenador/Asistencia';
import EntrenadorEvaluaciones from '../pages/entrenador/Evaluaciones';

// Jugador Pages
import JugadorDashboard from '../pages/jugador/Dashboard';
import JugadorPerfil from '../pages/jugador/Perfil';
import JugadorRendimiento from '../pages/jugador/Rendimiento';

// Protector de Rutas Privadas
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    // Redirigir al inicio correspondiente
    if (user.rol === 'Administrador') return <Navigate to="/admin/dashboard" replace />;
    if (user.rol === 'Entrenador') return <Navigate to="/entrenador/dashboard" replace />;
    if (user.rol === 'Jugador') return <Navigate to="/jugador/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Protector de Rutas Públicas (Evita entrar al Login si ya estás logueado)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (user) {
    if (user.rol === 'Administrador') return <Navigate to="/admin/dashboard" replace />;
    if (user.rol === 'Entrenador') return <Navigate to="/entrenador/dashboard" replace />;
    if (user.rol === 'Jugador') return <Navigate to="/jugador/dashboard" replace />;
  }

  return children;
};

// Redirección inteligente de raíz
const HomeRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.rol === 'Administrador') return <Navigate to="/admin/dashboard" replace />;
  if (user.rol === 'Entrenador') return <Navigate to="/entrenador/dashboard" replace />;
  if (user.rol === 'Jugador') return <Navigate to="/jugador/dashboard" replace />;

  return <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta de entrada */}
      <Route path="/" element={<HomeRedirect />} />

      {/* Ruta Pública: Login */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />

      {/* Rutas Privadas: Administrador */}
      <Route 
        path="/admin" 
        element={
          <PrivateRoute allowedRoles={['Administrador']}>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="jugadores" element={<AdminJugadores />} />
        <Route path="entrenadores" element={<AdminEntrenadores />} />
        <Route path="campeonatos" element={<AdminCampeonatos />} />
        <Route path="finanzas" element={<AdminFinanzas />} />
        <Route path="rendimiento" element={<AdminRendimiento />} />
      </Route>

      {/* Rutas Privadas: Entrenador */}
      <Route 
        path="/entrenador" 
        element={
          <PrivateRoute allowedRoles={['Entrenador']}>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<EntrenadorDashboard />} />
        <Route path="entrenamientos" element={<EntrenadorEntrenamientos />} />
        <Route path="asistencia" element={<EntrenadorAsistencia />} />
        <Route path="evaluaciones" element={<EntrenadorEvaluaciones />} />
      </Route>

      {/* Rutas Privadas: Jugador */}
      <Route 
        path="/jugador" 
        element={
          <PrivateRoute allowedRoles={['Jugador']}>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<JugadorDashboard />} />
        <Route path="perfil" element={<JugadorPerfil />} />
        <Route path="rendimiento" element={<JugadorRendimiento />} />
      </Route>

      {/* Ruta comodín de redirección */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
