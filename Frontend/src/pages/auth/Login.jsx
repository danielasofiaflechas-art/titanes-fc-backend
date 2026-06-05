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
      {/* Red decorative glowing orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-titanes-red/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[35rem] h-[35rem] bg-titanes-red/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-card rounded-2xl p-8 relative z-10"
      >
        {/* Header - Brand Shield */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-titanes-red to-red-700 shadow-red-glow-md mb-4 border border-red-500/25">
            <FaShieldAlt className="text-3xl text-white animate-pulse" />
          </div>
          <h1 className="text-3xl font-black tracking-wider text-white uppercase m-0 leading-none">
            TITANES
          </h1>
          <span className="text-xs font-bold tracking-widest text-titanes-red mt-1 uppercase">
            FÚTBOL CLUB • PORTAL OFICIAL
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">
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
            <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">
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
            className="btn-primary w-full py-4 text-sm font-bold tracking-wider uppercase mt-4"
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

        {/* Footer info */}
        <div className="text-center mt-8 pt-6 border-t border-zinc-900">
          <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase leading-relaxed">
            © 2026 Titanes F.C. Todos los derechos reservados.<br />
            Sistema de Gestión Integral Deportiva.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
