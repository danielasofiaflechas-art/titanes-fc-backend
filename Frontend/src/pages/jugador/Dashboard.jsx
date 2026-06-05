import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { 
  FaCalendarAlt, 
  FaDumbbell, 
  FaMapMarkerAlt, 
  FaFileInvoiceDollar, 
  FaExclamationTriangle,
  FaCheckCircle, 
  FaRunning,
  FaShieldAlt
} from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        const res = await API.get('/dashboards/home');
        if (res.data && res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error('Error al cargar datos del jugador:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error de carga',
          text: 'No pudimos recuperar tu cartelera deportiva del servidor.',
          background: '#161616',
          color: '#fff',
          confirmButtonColor: '#E50914'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerStats();
  }, []);

  if (loading) return <Loading />;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getMonthName = (monthNumber) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[monthNumber - 1] || `Mes ${monthNumber}`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* HEADER HERO */}
      <div className="relative glass-card p-8 rounded-2xl overflow-hidden border border-zinc-900 bg-gradient-to-r from-zinc-950 via-zinc-950 to-titanes-red/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="inline-block px-3 py-1 text-[10px] font-extrabold uppercase bg-titanes-red/15 border border-titanes-red/25 text-titanes-red rounded-full tracking-widest animate-pulse">
            Portal Oficial de Jugador
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight leading-none">
            ¡HOLA, {user?.nombre?.toUpperCase()}!
          </h1>
          <p className="text-zinc-500 text-sm">
            Prepárate para dar el 100% en la cancha. Revisa tus entrenamientos y cuotas a continuación.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center font-bold text-white text-xl shadow-inner">
            {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0)}
          </div>
          <div>
            <div className="font-extrabold text-white text-sm leading-none">{user?.nombre} {user?.apellido}</div>
            <span className="text-[10px] text-titanes-red font-bold uppercase tracking-wider mt-1 inline-block">Titanes F.C.</span>
          </div>
        </div>
      </div>

      {/* DUAL CORES: ENTRENAMIENTOS & PAGOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* UPCOMING PRACTICES */}
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-4">
            <FaDumbbell className="text-titanes-red text-lg shadow-red-glow-sm" />
            <h3 className="text-base font-black text-white uppercase tracking-wider m-0">Próximos Entrenamientos</h3>
          </div>

          {stats?.proximos_entrenamientos && stats.proximos_entrenamientos.length > 0 ? (
            <div className="space-y-4">
              {stats.proximos_entrenamientos.map((ent, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl hover:border-zinc-800 transition-colors">
                  <div className="flex flex-col items-center justify-center h-14 w-14 rounded-lg bg-zinc-950 border border-zinc-850/80">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase">
                      {new Date(ent.fecha_hora).toLocaleString('es-CO', { month: 'short' })}
                    </span>
                    <span className="text-lg font-black text-white -mt-0.5 leading-none">
                      {new Date(ent.fecha_hora).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 truncate">
                    <h4 className="text-sm font-bold text-white uppercase truncate tracking-wide">
                      {ent.objetivo_sesion}
                    </h4>
                    <div className="flex items-center gap-4 text-[11px] text-zinc-500 mt-1">
                      <span className="flex items-center gap-1">
                        <FaMapMarkerAlt /> {ent.lugar}
                      </span>
                      <span className="bg-titanes-red/10 border border-titanes-red/20 text-titanes-red font-extrabold px-2 py-0.2 rounded uppercase">
                        Categoría {ent.categoria_nombre || `ID: ${ent.categoria_id}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-zinc-900 rounded-xl">
              <p className="text-zinc-500 text-sm">No tienes entrenamientos agendados próximamente.</p>
            </div>
          )}
        </div>

        {/* PENDING PAYMENTS */}
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-4">
            <FaFileInvoiceDollar className="text-titanes-red text-lg shadow-red-glow-sm" />
            <h3 className="text-base font-black text-white uppercase tracking-wider m-0">Mensualidades Pendientes</h3>
          </div>

          {stats?.pagos_pendientes && stats.pagos_pendientes.length > 0 ? (
            <div className="space-y-4">
              {stats.pagos_pendientes.map((pago, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl hover:border-zinc-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg text-amber-500 text-base shadow-inner">
                      <FaExclamationTriangle className="animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Cuota de {getMonthName(pago.mes)} {pago.anio}
                      </h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        Límite: {new Date(pago.fecha_limite_pago).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-white text-sm">{formatCurrency(pago.monto_pactado || pago.monto)}</div>
                    <span className="inline-block mt-1 text-[8px] font-extrabold uppercase bg-amber-950/20 text-amber-400 border border-amber-900/40 px-2 py-0.2 rounded">
                      {pago.estado_pago || 'Pendiente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-zinc-900 rounded-xl flex flex-col items-center justify-center space-y-3">
              <FaCheckCircle className="text-3xl text-emerald-500 shadow-emerald-500/10" />
              <p className="text-zinc-500 text-sm">¡Estás al día con tus cuotas mensuales en el club!</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
