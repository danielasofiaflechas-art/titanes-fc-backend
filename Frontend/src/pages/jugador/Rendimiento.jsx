import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import Loading from '../../components/common/Loading';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaHeartbeat, FaRunning, FaCalendarCheck, FaChartLine } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Rendimiento = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get(`/rendimiento/dashboard/${user?.id}`);
        if (res.data?.success) {
          setDashboard(res.data.data);
        }
      } catch (error) {
        console.error('Error al cargar el dashboard de rendimiento:', error);
        Swal.fire({
          icon: 'error',
          title: 'No se pudo cargar el rendimiento',
          text: 'Verifica tu conexión o intenta nuevamente más tarde.',
          background: '#09090b',
          color: '#fff',
          confirmButtonColor: '#E50914',
        });
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboard();
    }
  }, [user]);

  if (loading) return <Loading />;

  const chartData = dashboard?.evolucion_graficas?.map((item) => ({
    name: new Date(item.fecha_evaluacion).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' }),
    valor: Number(item.puntuacion_fisica || item.puntuacion_tecnica || item.puntuacion_mental || item.puntuacion_tactica || 0)
  })) || [];

  const renderMetric = (label, value) => (
    <div className="glass-card p-5 rounded-3xl border border-zinc-900 bg-zinc-950/80 shadow-red-glow-sm">
      <div className="flex items-center justify-between gap-3 text-zinc-400 text-xs uppercase tracking-[0.3em] font-bold">
        <span>{label}</span>
        <FaHeartbeat className="text-titanes-red" />
      </div>
      <div className="mt-4 text-3xl font-black text-white tracking-tight">{value}</div>
    </div>
  );

  const resumen = dashboard?.resumen_global || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="glass-card relative overflow-hidden rounded-[32px] border border-zinc-900 bg-gradient-to-r from-zinc-950 via-zinc-950 to-titanes-red/10 p-8 shadow-red-glow-md">
        <div className="absolute -top-8 -right-8 h-44 w-44 rounded-full bg-titanes-red/10 blur-3xl"></div>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="premium-tag">Rendimiento del Jugador</span>
            <h1 className="text-4xl font-black text-white tracking-tight">Tu evolución deportiva</h1>
            <p className="text-sm text-zinc-400 leading-7">
              Monitorea tu rendimiento real con métricas de entrenador, evolución de evaluaciones y resultados recientes.
              Este panel te permite mantener foco en tu preparación física, táctica y técnica.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-3xl border border-zinc-900/70 bg-zinc-950/80 px-5 py-4 text-white">
            <FaChartLine className="text-2xl text-titanes-red" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">Última evaluación</p>
              <p className="text-xl font-black text-white">{chartData.length ? chartData[chartData.length - 1].name : 'Sin datos'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {renderMetric('Táctica', resumen?.promedios_rendimiento?.avg_tactica ? `${Number(resumen.promedios_rendimiento.avg_tactica).toFixed(1)}` : 'N/A')}
        {renderMetric('Física', resumen?.promedios_rendimiento?.avg_fisica ? `${Number(resumen.promedios_rendimiento.avg_fisica).toFixed(1)}` : 'N/A')}
        {renderMetric('Mental', resumen?.promedios_rendimiento?.avg_mental ? `${Number(resumen.promedios_rendimiento.avg_mental).toFixed(1)}` : 'N/A')}
      </div>

      <section className="glass-card rounded-[32px] border border-zinc-900 bg-zinc-950/75 p-6 shadow-red-glow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-black text-white">Evolución de evaluaciones</h2>
            <p className="text-sm text-zinc-400">Observa la tendencia de tus resultados y el progreso continuo en el club.</p>
          </div>
          <span className="premium-tag">{chartData.length} puntos de datos</span>
        </div>

        <div className="mt-6 h-[320px] w-full rounded-[28px] bg-zinc-950/70 p-4">
          {chartData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E50914" stopOpacity={0.75}/>
                    <stop offset="95%" stopColor="#E50914" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#171717" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: '#888888', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#888888', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0b0b0d', borderColor: '#2e2e2e', color: '#fff' }} />
                <Area type="monotone" dataKey="valor" stroke="#E50914" fillOpacity={1} fill="url(#colorValor)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-500">No hay evaluaciones disponibles.</div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.6fr] gap-6">
        <div className="glass-card rounded-[32px] border border-zinc-900 bg-zinc-950/75 p-6 shadow-red-glow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white">Últimos resultados</h2>
              <p className="text-sm text-zinc-400">Tus pruebas más recientes con historial y evaluación.</p>
            </div>
            <div className="top-pill">Actualizado</div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[28px] border border-zinc-900 bg-zinc-950/80">
            <table className="premium-table min-w-full">
              <thead>
                <tr>
                  <th>Prueba</th>
                  <th>Fecha</th>
                  <th>Valor</th>
                  <th>Evaluador</th>
                </tr>
              </thead>
              <tbody>
                {dashboard?.ultimos_test?.length > 0 ? (
                  dashboard.ultimos_test.map((item) => (
                    <tr key={item.id} className="border-b border-zinc-900 last:border-none">
                      <td>{item.nombre_test || 'N/A'}</td>
                      <td>{new Date(item.fecha_test).toLocaleDateString('es-CO')}</td>
                      <td>{item.resultado_valor || '0'}</td>
                      <td>{item.evaluador_nombre || 'Sin registro'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-zinc-500">No hay resultados cargados aún.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card rounded-[32px] border border-zinc-900 bg-zinc-950/75 p-6 shadow-red-glow-sm">
          <div className="flex items-center gap-3 text-white">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-titanes-red text-white shadow-red-glow-sm">
              <FaCalendarCheck />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Asistencia</p>
              <h3 className="text-2xl font-black">{dashboard?.resumen_global?.estadisticas_asistencia?.reduce((sum, item) => sum + item.cantidad, 0) || 0}</h3>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {(dashboard?.resumen_global?.estadisticas_asistencia || []).map((item, index) => (
              <div key={index} className="rounded-2xl border border-zinc-900/70 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-300">
                <div className="flex items-center justify-between gap-3">
                  <span className="capitalize">{item.estado || 'Indefinido'}</span>
                  <span className="text-white font-black">{item.cantidad}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Rendimiento;
