import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaTachometerAlt,
  FaUsers,
  FaUserTie,
  FaTrophy,
  FaDollarSign,
  FaHeartbeat,
  FaDumbbell,
  FaClipboardList,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaShieldAlt
} from 'react-icons/fa';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getMenuItems = () => {
    switch (user?.rol) {
      case 'Administrador':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
          { name: 'Jugadores', path: '/admin/jugadores', icon: <FaUsers /> },
          { name: 'Entrenadores', path: '/admin/entrenadores', icon: <FaUserTie /> },
          { name: 'Campeonatos', path: '/admin/campeonatos', icon: <FaTrophy /> },
          { name: 'Finanzas', path: '/admin/finanzas', icon: <FaDollarSign /> },
          { name: 'Rendimiento', path: '/admin/rendimiento', icon: <FaHeartbeat /> },
        ];
      case 'Entrenador':
        return [
          { name: 'Dashboard', path: '/entrenador/dashboard', icon: <FaTachometerAlt /> },
          { name: 'Entrenamientos', path: '/entrenador/entrenamientos', icon: <FaDumbbell /> },
          { name: 'Asistencia', path: '/entrenador/asistencia', icon: <FaClipboardList /> },
          { name: 'Evaluaciones', path: '/entrenador/evaluaciones', icon: <FaHeartbeat /> },
        ];
      case 'Jugador':
        return [
          { name: 'Dashboard', path: '/jugador/dashboard', icon: <FaTachometerAlt /> },
          { name: 'Mi Perfil', path: '/jugador/perfil', icon: <FaUser /> },
          { name: 'Rendimiento', path: '/jugador/rendimiento', icon: <FaHeartbeat /> },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen flex text-zinc-100 bg-zinc-950 sports-grid">
      <div
        className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-zinc-950 border-r border-zinc-900 transition-transform duration-300 lg:translate-x-0 lg:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-900/70">
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setSidebarOpen(false)}>
            <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-gradient-to-br from-titanes-red to-red-700 shadow-red-glow-sm transition-all duration-200 group-hover:shadow-red-glow-md">
              <FaShieldAlt className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-[0.3em] text-white uppercase leading-none">
                TITANES
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-[0.45em] text-titanes-red">
                F.C.
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-zinc-400 hover:text-white lg:hidden focus:outline-none"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="px-6 py-6 border-b border-zinc-900/70 bg-zinc-950/40">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-base font-bold text-white shadow-inner">
              {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0)}
            </div>
            <div className="truncate">
              <h2 className="text-sm font-bold text-white truncate leading-tight">
                {user?.nombre} {user?.apellido}
              </h2>
              <span className="inline-block rounded-full border border-titanes-red/20 bg-titanes-red/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.35em] text-titanes-red">
                {user?.rol}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3.5 rounded-3xl border px-4 py-3.5 text-sm font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'border-titanes-red/35 bg-gradient-to-r from-titanes-red/20 to-transparent text-white shadow-red-glow-sm'
                    : 'border-transparent bg-transparent text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/70 hover:text-white'
                }`}
              >
                <span className={`text-base transition-colors ${isActive ? 'text-titanes-red text-shadow-red' : 'text-zinc-400'}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-900/70">
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-900/80 bg-zinc-900/60 px-4 py-3 text-sm font-bold text-zinc-200 transition-all duration-200 hover:border-titanes-red/40 hover:bg-red-950/25 hover:text-white"
          >
            <FaSignOutAlt className="text-base" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="sticky top-0 z-10 border-b border-zinc-900/70 bg-black/45 backdrop-blur-xl px-6 py-4 shadow-sm shadow-zinc-950/50 lg:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/70 text-zinc-400 transition-all duration-200 hover:border-titanes-red/50 hover:text-white lg:hidden"
              >
                <FaBars size={20} />
              </button>
              <div className="hidden md:flex items-center gap-2 rounded-2xl border border-zinc-900/80 bg-zinc-950/80 px-4 py-2 text-xs uppercase tracking-[0.32em] text-zinc-400">
                <span>Club Deportivo</span>
                <span className="text-zinc-700">•</span>
                <span className="text-titanes-red">Titanes F.C.</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-zinc-900/80 bg-zinc-950/80 px-4 py-2 text-xs uppercase tracking-[0.32em] text-zinc-300">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Online</span>
                <span className="text-zinc-600">API</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-zinc-900/80 bg-zinc-950/80 px-4 py-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-red-700 to-titanes-red text-white shadow-red-glow">
                  {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0)}
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white leading-tight">{user?.nombre}</p>
                  <p className="text-[10px] uppercase tracking-[0.36em] text-titanes-red/80">{user?.rol}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-b from-zinc-950 via-zinc-950 to-black p-6 md:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
