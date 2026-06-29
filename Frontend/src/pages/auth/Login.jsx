import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { FaEnvelope, FaLock, FaShieldAlt, FaSpinner } from 'react-icons/fa';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Detectar si la sesión expiró (interceptor de Axios redirige aquí con ?expired=true)
  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      Swal.fire({
        icon: 'warning',
        title: 'Sesión Expirada',
        text: 'Tu sesión ha vencido. Por favor, inicia sesión de nuevo.',
        background: '#161616',
        color: '#fff',
        confirmButtonColor: '#E50914',
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor, ingresa tu correo y contraseña.',
        background: '#161616',
        color: '#fff',
        confirmButtonColor: '#E50914',
      });
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: `¡Bienvenido, ${result.usuario.nombre}!`,
          text: 'Acceso autorizado correctamente.',
          background: '#161616',
          color: '#fff',
          showConfirmButton: false,
          timer: 1500
        });

        // Redirección inteligente por rol
        const rol = result.usuario.rol;
        if (rol === 'Administrador') {
          navigate('/admin/dashboard');
        } else if (rol === 'Entrenador') {
          navigate('/entrenador/dashboard');
        } else if (rol === 'Jugador') {
          navigate('/jugador/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de acceso',
        text: error.message || 'Credenciales incorrectas.',
        background: '#161616',
        color: '#fff',
        confirmButtonColor: '#E50914',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-black relative overflow-hidden sports-grid px-4">
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-titanes-red/10 rounded-full blur-[125px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[34rem] h-[34rem] bg-titanes-red/10 rounded-full blur-[125px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-5xl rounded-[2rem] border border-zinc-900/80 bg-[#060608]/90 shadow-[0_24px_70px_rgba(0,0,0,0.35)] overflow-hidden relative z-10"
      >
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-400">
                <span className="h-2 w-2 rounded-full bg-titanes-red"></span>
                Gestión integral
              </div>
              <h2 className="mt-6 text-3xl font-black tracking-[0.18em] text-white uppercase">
                Titanes F.C.
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-7 text-zinc-400">
                Plataforma deportiva orientada a la operación diaria del club: jugadores, entrenamientos, campeonatos y finanzas con una experiencia clara y profesional.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500">Módulos operativos</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-zinc-300">
                <span className="rounded-full border border-zinc-800 px-2.5 py-1">Jugadores</span>
                <span className="rounded-full border border-zinc-800 px-2.5 py-1">Entrenamientos</span>
                <span className="rounded-full border border-zinc-800 px-2.5 py-1">Campeonatos</span>
                <span className="rounded-full border border-zinc-800 px-2.5 py-1">Finanzas</span>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10 lg:p-12">
            <div className="flex flex-col items-center justify-center text-center mb-8">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-titanes-red to-red-700 shadow-red-glow-md mb-4 border border-red-500/25">
                <FaShieldAlt className="text-3xl text-white" />
              </div>
              <h1 className="text-2xl font-black tracking-[0.22em] text-white uppercase m-0 leading-none">
                Acceso seguro
              </h1>
              <span className="text-[11px] font-bold tracking-[0.24em] text-titanes-red mt-2 uppercase">
                Portal oficial del club
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold tracking-[0.24em] text-zinc-400 uppercase mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    className="sports-input pl-11"
                    placeholder="usuario@titanesfc.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-[0.24em] text-zinc-400 uppercase mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500">
                    <FaLock />
                  </span>
                  <input
                    type="password"
                    className="sports-input pl-11"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-4 mt-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin text-lg" />
                    Validando credenciales...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            <div className="text-center mt-8 pt-6 border-t border-zinc-900">
              <p className="text-[10px] font-bold text-zinc-500 tracking-[0.24em] uppercase leading-relaxed">
                © 2026 Titanes F.C. Todos los derechos reservados.<br />
                Sistema de Gestión Integral Deportiva.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
