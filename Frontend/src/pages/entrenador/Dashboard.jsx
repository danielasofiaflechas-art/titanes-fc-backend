import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUsers, 
  FaDumbbell, 
  FaClipboardList, 
  FaHeartbeat, 
  FaMapMarkerAlt, 
  FaCalendarCheck,
  FaArrowRight
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Loading from '../../components/common/Loading';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoachStats = async () => {
      try {
        const res = await API.get('/dashboards/home');
        if (res.data && res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error('Error al cargar métricas del entrenador:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error de carga',
          text: 'No pudimos recuperar tus estadísticas técnicas del servidor.',
          background: '#161616',
          color: '#fff',
          confirmButtonColor: '#E50914'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCoachStats();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Cuerpo Técnico: Portal de {user?.nombre}
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Director Técnico • Control de escuadras y valoraciones deportivas.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Asigned Players */}
        <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-titanes-red/5 rounded-bl-full pointer-events-none transition-all group-hover:bg-titanes-red/10"></div>
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-titanes-red shadow-inner text-xl">
              <FaUsers />
            </div>
            <div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Jugadores Asignados</p>
              <h3 className="text-3xl font-black text-white mt-1">
                {stats?.total_jugadores_asignados || 0}
              </h3>
            </div>
          </div>
        </div>

        {/* Scheduled workouts count */}
        <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-titanes-red/5 rounded-bl-full pointer-events-none transition-all group-hover:bg-titanes-red/10"></div>
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-titanes-red shadow-inner text-xl">
              <FaDumbbell />
            </div>
            <div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Prácticas Programadas</p>
              <h3 className="text-3xl font-black text-white mt-1">
                {stats?.proximos_entrenamientos?.length || 0}
              </h3>
            </div>
          </div>
        </div>

        {/* Dynamic instructions panel */}
        <div className="glass-card p-6 rounded-xl relative overflow-hidden border-dashed border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-titanes-red font-bold text-xs uppercase tracking-wider">
            <FaCalendarCheck />
            Asistencia y Rendimiento
          </div>
          <p className="text-zinc-500 text-xs mt-2 leading-relaxed">
            Recuerda tomar asistencia al finalizar cada sesión de entrenamiento y registrar los resultados de los tests físicos periódicamente.
          </p>
          <div className="mt-4 flex gap-2">
            <Link to="/entrenador/asistencia" className="text-[11px] font-bold text-white hover:text-titanes-red transition-colors flex items-center gap-1">
              Tomar Asistencia <FaArrowRight />
            </Link>
          </div>
        </div>

      </div>

      {/* QUICK LINK PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* UPCOMING PRACTICES */}
        <div className="glass-card p-6 rounded-xl lg:col-span-2">
          <div className="flex items-center justify-between mb-6 border-b border-zinc-900 pb-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Sesiones de Entrenamiento Próximas</h3>
            <span className="text-[9px] bg-titanes-red/15 border border-titanes-red/25 text-titanes-red font-bold px-2 py-0.5 rounded uppercase">Agenda Oficial</span>
          </div>

          {stats?.proximos_entrenamientos && stats.proximos_entrenamientos.length > 0 ? (
            <div className="space-y-4">
              {stats.proximos_entrenamientos.map((ent, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-900 rounded-lg hover:border-zinc-800 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center h-14 w-14 rounded-lg bg-zinc-950 border border-zinc-850/80">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase">
                        {new Date(ent.fecha_hora).toLocaleString('es-CO', { month: 'short' })}
                      </span>
                      <span className="text-lg font-black text-white -mt-1 leading-none">
                        {new Date(ent.fecha_hora).getDate()}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                        {ent.objetivo_sesion}
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-1">
                        <span className="flex items-center gap-1">
                          <FaMapMarkerAlt /> {ent.lugar}
                        </span>
                        <span className="bg-titanes-red/10 border border-titanes-red/20 text-titanes-red font-extrabold px-2 py-0.2 rounded uppercase">
                          {ent.categoria_nombre || `ID: ${ent.categoria_id}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/entrenador/asistencia"
                    className="p-2.5 px-4 bg-zinc-950 hover:bg-titanes-red hover:text-white border border-zinc-850 text-zinc-400 font-bold rounded-lg text-xs transition-all duration-200"
                  >
                    Tomar Asistencia
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-zinc-900 rounded-lg">
              <p className="text-zinc-500 text-sm">No has programado entrenamientos próximamente.</p>
              <Link to="/entrenador/entrenamientos" className="btn-secondary py-2 px-4 text-xs mt-4 inline-block">
                Programar Sesión
              </Link>
            </div>
          )}
        </div>

        {/* QUICK MANAGEMENT LINKS */}
        <div className="glass-card p-6 rounded-xl space-y-6">
          <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-zinc-900 pb-4">
            Gestión Rápida
          </h3>
          <div className="space-y-3">
            <Link 
              to="/entrenador/entrenamientos"
              className="flex items-center gap-4 p-4 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded-xl transition-all"
            >
              <div className="p-3 bg-zinc-950 rounded-lg text-titanes-red text-base border border-zinc-850">
                <FaDumbbell />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Cronograma</h4>
                <p className="text-zinc-500 text-[10px] mt-0.5">Programar prácticas y calendarizaciones.</p>
              </div>
            </Link>

            <Link 
              to="/entrenador/asistencia"
              className="flex items-center gap-4 p-4 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded-xl transition-all"
            >
              <div className="p-3 bg-zinc-950 rounded-lg text-titanes-red text-base border border-zinc-850">
                <FaClipboardList />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Asistencia</h4>
                <p className="text-zinc-500 text-[10px] mt-0.5">Listar y tomar asistencia diaria.</p>
              </div>
            </Link>

            <Link 
              to="/entrenador/evaluaciones"
              className="flex items-center gap-4 p-4 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded-xl transition-all"
            >
              <div className="p-3 bg-zinc-950 rounded-lg text-titanes-red text-base border border-zinc-850">
                <FaHeartbeat />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Evaluación Física</h4>
                <p className="text-zinc-500 text-[10px] mt-0.5">Registrar tests y calificar técnica.</p>
              </div>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
