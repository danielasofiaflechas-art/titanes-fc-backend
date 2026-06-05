import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { 
  FaClipboardList, 
  FaCalendarCheck, 
  FaUserCheck, 
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaClock
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import Loading from '../../components/common/Loading';

const Asistencia = () => {
  const [entrenamientos, setEntrenamientos] = useState([]);
  const [selectedEntrenamiento, setSelectedEntrenamiento] = useState('');
  const [players, setPlayers] = useState([]);
  const [attendance, setAttendance] = useState({}); // Mapeo de jugador_id -> estado
  const [loading, setLoading] = useState(true);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Categorías fijas de la BD para mostrar
  const categorias = [
    { id: 1, nombre: 'Sub-13' },
    { id: 2, font: 'Sub-15' },
    { id: 3, nombre: 'Sub-17' },
    { id: 4, nombre: 'Sub-20' }
  ];

  const fetchEntrenamientos = async () => {
    setLoading(true);
    try {
      const response = await API.get('/entrenamientos');
      if (response.data && response.data.success) {
        setEntrenamientos(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar entrenamientos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de carga',
        text: 'No pudimos recuperar las sesiones del servidor.',
        background: '#161616',
        color: '#fff',
        confirmButtonColor: '#E50914'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntrenamientos();
  }, []);

  const handleEntrenamientosChange = async (e) => {
    const entId = e.target.value;
    setSelectedEntrenamiento(entId);
    if (!entId) {
      setPlayers([]);
      setAttendance({});
      return;
    }

    setLoadingPlayers(true);
    try {
      const selected = entrenamientos.find(ent => ent.id === parseInt(entId));
      if (!selected) return;

      // 1. Obtener la lista de jugadores de esa categoría
      const response = await API.get('/jugadores', {
        params: {
          limit: 100,
          categoria_id: selected.categoria_id
        }
      });

      if (response.data && response.data.success) {
        const playerList = response.data.data.jugadores;
        setPlayers(playerList);

        // 2. Inicializar mapeo de asistencia con 'Presente' por defecto
        const initialAttendance = {};
        playerList.forEach(player => {
          initialAttendance[player.usuario_id] = 'Presente';
        });

        // 3. Revisar si la asistencia ya fue grabada previamente
        try {
          const detailRes = await API.get(`/entrenamientos/${entId}`);
          if (detailRes.data && detailRes.data.success && detailRes.data.data.asistencia) {
            const recorded = detailRes.data.data.asistencia;
            if (recorded.length > 0) {
              recorded.forEach(rec => {
                initialAttendance[rec.jugador_id] = rec.estado; // Rellena con estado pre-registrado
              });
            }
          }
        } catch (detailErr) {
          console.warn('No hay registro previo de asistencia:', detailErr.message);
        }

        setAttendance(initialAttendance);
      }
    } catch (error) {
      console.error('Error al obtener jugadores de la sesión:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de carga',
        text: 'No pudimos cargar la lista de jugadores de esta categoría.',
        background: '#161616',
        color: '#fff',
        confirmButtonColor: '#E50914'
      });
    } finally {
      setLoadingPlayers(false);
    }
  };

  const handleAttendanceChange = (playerId, newStatus) => {
    setAttendance(prev => ({
      ...prev,
      [playerId]: newStatus // 'Presente', 'Ausente', 'Justificado', 'Retraso'
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEntrenamiento) return;

    setSubmitting(true);
    try {
      // Mapear al arreglo esperado por el backend
      const asistenciaArray = Object.keys(attendance).map(playerId => ({
        jugador_id: parseInt(playerId),
        estado: attendance[playerId] // Ej: 'Presente', 'Ausente', etc.
      }));

      const payload = {
        asistencia: asistenciaArray
      };

      const response = await API.post(`/entrenamientos/${selectedEntrenamiento}/asistencia`, payload);
      if (response.data && response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Asistencia Registrada',
          text: 'Se grabó la asistencia de los jugadores exitosamente.',
          background: '#161616',
          color: '#fff',
          confirmButtonColor: '#E50914'
        });
      }
    } catch (error) {
      console.error('Error al guardar asistencia:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al Guardar',
        text: error.response?.data?.message || 'Error de validación del servidor.',
        background: '#161616',
        color: '#fff',
        confirmButtonColor: '#E50914'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Control de Asistencias</h1>
        <p className="text-zinc-500 text-sm mt-1">Registra la puntualidad y justificaciones diarias de tu plantel por categorías.</p>
      </div>

      {/* WORKOUT SELECTOR */}
      <div className="glass-card p-6 rounded-xl flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <FaCalendarCheck className="text-titanes-red shadow-red-glow-sm" />
            1. Escoger Sesión de Entrenamiento:
          </label>
          <select
            className="sports-input py-3 text-sm bg-zinc-900 border-zinc-800"
            value={selectedEntrenamiento}
            onChange={handleEntrenamientosChange}
          >
            <option value="">-- Seleccionar Práctica Programada --</option>
            {entrenamientos.map(ent => (
              <option key={ent.id} value={ent.id}>
                {ent.objetivo_sesion} ({new Date(ent.fecha_hora).toLocaleDateString()} - Cancha: {ent.lugar})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ATTENDANCE SHIFT FORM */}
      {selectedEntrenamiento && (
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {loadingPlayers ? (
            <div className="h-48 flex items-center justify-center"><FaSpinner className="animate-spin text-2xl text-titanes-red" /></div>
          ) : players.length > 0 ? (
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="p-4 bg-zinc-950/80 border-b border-zinc-900 flex justify-between items-center">
                <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                  Listado de Jugadores de Categoría
                </span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase">{players.length} Jugadores</span>
              </div>
              <div className="overflow-x-auto">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Documento</th>
                      <th>Nombre del Jugador</th>
                      <th>Posición</th>
                      <th className="text-center w-[450px]">Toma de Asistencia (Rojo / Verde / Gris)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player) => {
                      const currentStatus = attendance[player.usuario_id];
                      return (
                        <tr key={player.usuario_id}>
                          <td className="font-mono text-zinc-500 text-xs font-bold">{player.documento_identidad}</td>
                          <td>
                            <div className="font-bold text-white text-sm">{player.nombre} {player.apellido}</div>
                          </td>
                          <td>
                            <span className="text-[10px] text-zinc-400 font-bold uppercase bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded">
                              {player.posicion}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center justify-center gap-2">
                              
                              {/* PRESENTE */}
                              <button
                                type="button"
                                onClick={() => handleAttendanceChange(player.usuario_id, 'Presente')}
                                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-150 ${
                                  currentStatus === 'Presente'
                                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 shadow-emerald-500/10'
                                    : 'bg-zinc-900 border-zinc-850 text-zinc-500 hover:text-zinc-300'
                                }`}
                              >
                                <FaUserCheck size={12} />
                                Presente
                              </button>

                              {/* RETRASO */}
                              <button
                                type="button"
                                onClick={() => handleAttendanceChange(player.usuario_id, 'Retraso')}
                                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-150 ${
                                  currentStatus === 'Retraso'
                                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-400 shadow-amber-500/10'
                                    : 'bg-zinc-900 border-zinc-850 text-zinc-500 hover:text-zinc-300'
                                }`}
                              >
                                <FaClock size={12} />
                                Retraso
                              </button>

                              {/* JUSTIFICADO */}
                              <button
                                type="button"
                                onClick={() => handleAttendanceChange(player.usuario_id, 'Justificado')}
                                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-150 ${
                                  currentStatus === 'Justificado'
                                    ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
                                    : 'bg-zinc-900 border-zinc-850 text-zinc-500 hover:text-zinc-300'
                                }`}
                              >
                                <FaExclamationTriangle size={12} />
                                Excusa
                              </button>

                              {/* AUSENTE */}
                              <button
                                type="button"
                                onClick={() => handleAttendanceChange(player.usuario_id, 'Ausente')}
                                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-150 ${
                                  currentStatus === 'Ausente'
                                    ? 'bg-red-950/40 border-red-500/40 text-red-400 shadow-red-500/10'
                                    : 'bg-zinc-900 border-zinc-850 text-zinc-500 hover:text-zinc-300'
                                }`}
                              >
                                <FaTimesCircle size={12} />
                                Ausente
                              </button>

                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* FOOTER SAVE */}
              <div className="flex justify-end p-4 border-t border-zinc-900 bg-zinc-950/40">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary py-2.5 px-6 text-xs"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Guardando Asistencia...
                    </>
                  ) : (
                    'Guardar Asistencia de Plantilla'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card py-16 text-center rounded-xl border border-zinc-900">
              <p className="text-zinc-500">No hay jugadores registrados en esta categoría aún.</p>
            </div>
          )}
        </form>
      )}

    </div>
  );
};

export default Asistencia;
