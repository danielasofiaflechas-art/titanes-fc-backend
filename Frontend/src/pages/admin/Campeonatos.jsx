import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { 
  FaTrophy, 
  FaShieldAlt, 
  FaCalendarAlt, 
  FaFutbol, 
  FaPlus, 
  FaEdit, 
  FaSpinner, 
  FaTimes, 
  FaUserFriends
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import Loading from '../../components/common/Loading';

const Campeonatos = () => {
  const [activeTab, setActiveTab] = useState('campeonatos');
  
  // Datos
  const [campeonatos, setCampeonatos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de Modales y Submitting
  const [modalType, setModalType] = useState(null); // 'campeonato', 'equipo', 'partido', 'resultado', 'inscripcion'
  const [submitting, setSubmitting] = useState(false);
  const [selectedPartido, setSelectedPartido] = useState(null);

  // Formulario Campeonatos
  const [formCampeonato, setFormCampeonato] = useState({
    nombre: '',
    organizador: '',
    temporada_ano: '2026',
    valor_inscripcion: '',
    fecha_inicio: '',
    fecha_fin: ''
  });

  // Formulario Equipos
  const [formEquipo, setFormEquipo] = useState({
    categoria_id: '3',
    nombre_equipo_completo: '',
    identificacion_unica_club: ''
  });

  // Formulario Inscribir Equipo
  const [formInscripcion, setFormInscripcion] = useState({
    campeonato_id: '',
    equipo_titanes_id: ''
  });

  // Formulario Partidos
  const [formPartido, setFormPartido] = useState({
    campeonato_id: '',
    equipo_titanes_id: '',
    rival_nombre: '',
    fase_campeonato: 'Fase de Grupos',
    fecha_hora_partido: '',
    lugar_cancha: ''
  });

  // Formulario Resultados
  const [formResultado, setFormResultado] = useState({
    goles_titanes: '0',
    goles_rival: '0',
    resultado_final: 'Victoria'
  });

  // Categorías estáticas
  const categorias = [
    { id: 1, nombre: 'Sub-13' },
    { id: 2, nombre: 'Sub-15' },
    { id: 3, nombre: 'Sub-17' },
    { id: 4, nombre: 'Sub-20' }
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const [campRes, eqRes, partRes] = await Promise.all([
        API.get('/campeonatos'),
        API.get('/campeonatos/equipos'),
        API.get('/campeonatos/partidos')
      ]);

      if (campRes.data && campRes.data.success) {
        setCampeonatos(campRes.data.data?.campeonatos || campRes.data.data || []);
      }
      if (eqRes.data && eqRes.data.success) setEquipos(eqRes.data.data);
      if (partRes.data && partRes.data.success) setPartidos(partRes.data.data);
    } catch (error) {
      console.error('Error al cargar datos deportivos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de carga',
        text: 'Ocurrió un problema al sincronizar con el servidor de campeonatos.',
        background: '#161616',
        color: '#fff',
        confirmButtonColor: '#E50914'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCampeonato = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formCampeonato,
        valor_inscripcion: parseFloat(formCampeonato.valor_inscripcion) || 0
      };
      const res = await API.post('/campeonatos', payload);
      if (res.data && res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Torneo Creado',
          text: 'El campeonato ha sido configurado con éxito.',
          background: '#161616',
          color: '#fff',
          confirmButtonColor: '#E50914'
        });
        setModalType(null);
        loadData();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al crear campeonato.',
        background: '#161616',
        color: '#fff',
        confirmButtonColor: '#E50914'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateEquipo = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formEquipo,
        categoria_id: parseInt(formEquipo.categoria_id)
      };
      const res = await API.post('/campeonatos/equipos', payload);
      if (res.data && res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Equipo Creado',
          text: 'El equipo representativo se registró correctamente.',
          background: '#161616',
          color: '#fff',
          confirmButtonColor: '#E50914'
        });
        setModalType(null);
        loadData();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al crear equipo.',
        background: '#161616',
        color: '#fff',
        confirmButtonColor: '#E50914'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInscribirEquipo = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        campeonato_id: parseInt(formInscripcion.campeonato_id),
        equipo_titanes_id: parseInt(formInscripcion.equipo_titanes_id)
      };
      const res = await API.post('/campeonatos/inscribir', payload);
      if (res.data && res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Inscripción Exitosa',
          text: 'El equipo ya está participando oficialmente en el campeonato.',
          background: '#161616',
          color: '#fff',
          confirmButtonColor: '#E50914'
        });
        setModalType(null);
        loadData();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al inscribir equipo.',
        background: '#161616',
        color: '#fff',
        confirmButtonColor: '#E50914'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSchedulePartido = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        campeonato_id: parseInt(formPartido.campeonato_id),
        equipo_titanes_id: parseInt(formPartido.equipo_titanes_id),
        rival_nombre: formPartido.rival_nombre,
        fase_campeonato: formPartido.fase_campeonato,
        fecha_hora_partido: new Date(formPartido.fecha_hora_partido).toISOString(),
        lugar_cancha: formPartido.lugar_cancha
      };
      const res = await API.post('/campeonatos/partidos', payload);
      if (res.data && res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Partido Programado',
          text: 'El partido ha sido calendarizado en el sistema.',
          background: '#161616',
          color: '#fff',
          confirmButtonColor: '#E50914'
        });
        setModalType(null);
        loadData();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al agendar partido.',
        background: '#161616',
        color: '#fff',
        confirmButtonColor: '#E50914'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenMarcadorModal = (partido) => {
    setSelectedPartido(partido);
    setFormResultado({
      goles_titanes: partido.goles_titanes?.toString() || '0',
      goles_rival: partido.goles_rival?.toString() || '0',
      resultado_final: partido.resultado_final || 'Victoria'
    });
    setModalType('resultado');
  };

  const handleUpdateMarcador = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        goles_titanes: parseInt(formResultado.goles_titanes),
        goles_rival: parseInt(formResultado.goles_rival),
        resultado_final: formResultado.resultado_final
      };

      const res = await API.patch(`/campeonatos/partidos/${selectedPartido.id}/resultado`, payload);
      if (res.data && res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Marcador Registrado',
          text: 'El marcador final se ha publicado correctamente.',
          background: '#161616',
          color: '#fff',
          confirmButtonColor: '#E50914'
        });
        setModalType(null);
        loadData();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al actualizar marcador.',
        background: '#161616',
        color: '#fff',
        confirmButtonColor: '#E50914'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Gestión Deportiva</h1>
          <p className="text-zinc-500 text-sm mt-1">Planifica torneos, configura escuadras representativas y edita el fixture.</p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-zinc-900 gap-2">
        <button
          onClick={() => setActiveTab('campeonatos')}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-bold border-b-2 transition-all duration-200 ${
            activeTab === 'campeonatos' 
              ? 'border-titanes-red text-white' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <FaTrophy />
          Campeonatos
        </button>
        <button
          onClick={() => setActiveTab('equipos')}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-bold border-b-2 transition-all duration-200 ${
            activeTab === 'equipos' 
              ? 'border-titanes-red text-white' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <FaShieldAlt />
          Equipos Club
        </button>
        <button
          onClick={() => setActiveTab('partidos')}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-bold border-b-2 transition-all duration-200 ${
            activeTab === 'partidos' 
              ? 'border-titanes-red text-white' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <FaCalendarAlt />
          Fixture y Programación
        </button>
      </div>

      {/* TABS CONTENT */}
      {loading ? (
        <div className="h-64 flex items-center justify-center"><Loading /></div>
      ) : (
        <>
          {/* TAB 1: CAMPEONATOS */}
          {activeTab === 'campeonatos' && (
            <div className="space-y-6">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setFormCampeonato({ nombre: '', organizador: '', temporada_ano: '2026', valor_inscripcion: '', fecha_inicio: '', fecha_fin: '' });
                    setModalType('campeonato');
                  }}
                  className="btn-primary py-2 px-4 text-xs"
                >
                  <FaPlus /> Nuevo Campeonato
                </button>
                <button
                  onClick={() => {
                    setFormInscripcion({ campeonato_id: campeonatos[0]?.id?.toString() || '', equipo_titanes_id: equipos[0]?.id?.toString() || '' });
                    setModalType('inscripcion');
                  }}
                  className="btn-secondary py-2 px-4 text-xs"
                >
                  <FaFutbol /> Inscribir Equipo
                </button>
              </div>

              {campeonatos.length > 0 ? (
                <div className="glass-card rounded-xl overflow-hidden">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre Torneo</th>
                        <th>Organizador</th>
                        <th>Temporada</th>
                        <th>Inscripción</th>
                        <th>Vigencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campeonatos.map(camp => (
                        <tr key={camp.id}>
                          <td className="text-zinc-500 font-bold">{camp.id}</td>
                          <td className="font-bold text-white text-sm">{camp.nombre}</td>
                          <td>{camp.organizador}</td>
                          <td>
                            <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold px-2.5 py-0.5 rounded text-xs">
                              {camp.temporada_ano}
                            </span>
                          </td>
                          <td className="text-emerald-400 font-semibold">{formatCurrency(camp.valor_inscripcion)}</td>
                          <td className="text-xs text-zinc-400">
                            Del {new Date(camp.fecha_inicio).toLocaleDateString()} al {new Date(camp.fecha_fin).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="glass-card py-16 text-center rounded-xl border border-zinc-900">
                  <p className="text-zinc-500">No hay campeonatos creados en el sistema.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EQUIPOS */}
          {activeTab === 'equipos' && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => {
                    setFormEquipo({ categoria_id: '3', nombre_equipo_completo: '', identificacion_unica_club: '' });
                    setModalType('equipo');
                  }}
                  className="btn-primary py-2 px-4 text-xs"
                >
                  <FaPlus /> Crear Equipo Titanes
                </button>
              </div>

              {equipos.length > 0 ? (
                <div className="glass-card rounded-xl overflow-hidden">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>ID Equipo</th>
                        <th>Escuadra Club</th>
                        <th>ID Único Club</th>
                        <th>Categoría</th>
                      </tr>
                    </thead>
                    <tbody>
                      {equipos.map(eq => (
                        <tr key={eq.id}>
                          <td className="text-zinc-500 font-bold">{eq.id}</td>
                          <td className="font-bold text-white text-sm">{eq.nombre_equipo_completo}</td>
                          <td className="font-mono text-zinc-400 text-xs">{eq.identificacion_unica_club}</td>
                          <td>
                            <span className="inline-block px-2.5 py-0.5 text-xs font-bold bg-titanes-red/10 border border-titanes-red/20 text-titanes-red rounded-full">
                              {categorias.find(c => c.id === eq.categoria_id)?.nombre || `ID: ${eq.categoria_id}`}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="glass-card py-16 text-center rounded-xl border border-zinc-900">
                  <p className="text-zinc-500">No hay equipos representativos registrados aún.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PARTIDOS */}
          {activeTab === 'partidos' && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => {
                    setFormPartido({
                      campeonato_id: campeonatos[0]?.id?.toString() || '',
                      equipo_titanes_id: equipos[0]?.id?.toString() || '',
                      rival_nombre: '',
                      fase_campeonato: 'Fase de Grupos',
                      fecha_hora_partido: '',
                      lugar_cancha: ''
                    });
                    setModalType('partido');
                  }}
                  className="btn-primary py-2 px-4 text-xs"
                >
                  <FaPlus /> Programar Partido
                </button>
              </div>

              {partidos.length > 0 ? (
                <div className="glass-card rounded-xl overflow-hidden">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>Fase</th>
                        <th>Club Rival</th>
                        <th>Equipo Titanes</th>
                        <th>Fecha y Hora</th>
                        <th>Cancha</th>
                        <th>Marcador</th>
                        <th className="text-center">Resultado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partidos.map(part => (
                        <tr key={part.id}>
                          <td>
                            <div className="font-bold text-white text-xs">{part.fase_campeonato}</div>
                          </td>
                          <td className="text-red-400 font-bold uppercase text-xs">{part.rival_nombre}</td>
                          <td className="text-white text-xs font-medium">{part.nombre_equipo_completo}</td>
                          <td className="text-xs text-zinc-400">
                            {new Date(part.fecha_hora_partido).toLocaleString('es-CO', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="text-xs">{part.lugar_cancha}</td>
                          <td>
                            <div className="flex items-center gap-2">
                              <span className="font-mono bg-zinc-900 border border-zinc-800 text-white px-2 py-0.5 rounded font-black text-xs">
                                {part.goles_titanes ?? 0} - {part.goles_rival ?? 0}
                              </span>
                              <button
                                onClick={() => handleOpenMarcadorModal(part)}
                                className="p-1 bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded"
                                title="Editar Marcador"
                              >
                                <FaEdit size={10} />
                              </button>
                            </div>
                          </td>
                          <td className="text-center">
                            <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest ${
                              part.resultado_final === 'Victoria' 
                                ? 'bg-emerald-950/40 border border-emerald-900/60 text-emerald-400' 
                                : part.resultado_final === 'Derrota'
                                ? 'bg-red-950/40 border border-red-900/60 text-red-400'
                                : part.resultado_final === 'Empate'
                                ? 'bg-zinc-900 border border-zinc-800 text-zinc-400'
                                : 'bg-titanes-red/10 border border-titanes-red/20 text-titanes-red'
                            }`}>
                              {part.resultado_final}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="glass-card py-16 text-center rounded-xl border border-zinc-900">
                  <p className="text-zinc-500">No hay fixture programado.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* MODAL CAMPEONATO */}
      {modalType === 'campeonato' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-900 rounded-2xl shadow-red-glow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Nuevo Campeonato</h3>
              <button onClick={() => setModalType(null)} className="text-zinc-500 hover:text-white"><FaTimes /></button>
            </div>
            <form onSubmit={handleCreateCampeonato} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Nombre Campeonato *</label>
                <input
                  type="text"
                  className="sports-input py-2 text-sm"
                  required
                  value={formCampeonato.nombre}
                  onChange={(e) => setFormCampeonato(prev => ({ ...prev, nombre: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Organizador *</label>
                <input
                  type="text"
                  className="sports-input py-2 text-sm"
                  required
                  value={formCampeonato.organizador}
                  onChange={(e) => setFormCampeonato(prev => ({ ...prev, organizador: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Temporada / Año *</label>
                  <input
                    type="text"
                    className="sports-input py-2 text-sm"
                    required
                    value={formCampeonato.temporada_ano}
                    onChange={(e) => setFormCampeonato(prev => ({ ...prev, temporada_ano: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Costo Inscripción *</label>
                  <input
                    type="number"
                    className="sports-input py-2 text-sm"
                    required
                    placeholder="COP"
                    value={formCampeonato.valor_inscripcion}
                    onChange={(e) => setFormCampeonato(prev => ({ ...prev, valor_inscripcion: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Fecha Inicio *</label>
                  <input
                    type="date"
                    className="sports-input py-2 text-sm"
                    required
                    value={formCampeonato.fecha_inicio}
                    onChange={(e) => setFormCampeonato(prev => ({ ...prev, fecha_inicio: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Fecha Fin *</label>
                  <input
                    type="date"
                    className="sports-input py-2 text-sm"
                    required
                    value={formCampeonato.fecha_fin}
                    onChange={(e) => setFormCampeonato(prev => ({ ...prev, fecha_fin: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setModalType(null)} className="btn-secondary py-2 px-4 text-xs">Cancelar</button>
                <button type="submit" disabled={submitting} className="btn-primary py-2 px-4 text-xs">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EQUIPO */}
      {modalType === 'equipo' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-900 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Nuevo Equipo Representativo</h3>
              <button onClick={() => setModalType(null)} className="text-zinc-500 hover:text-white"><FaTimes /></button>
            </div>
            <form onSubmit={handleCreateEquipo} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Categoría *</label>
                <select
                  className="sports-input py-2 text-sm bg-zinc-900 border-zinc-800"
                  value={formEquipo.categoria_id}
                  onChange={(e) => setFormEquipo(prev => ({ ...prev, categoria_id: e.target.value }))}
                >
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Nombre Equipo Completo *</label>
                <input
                  type="text"
                  className="sports-input py-2 text-sm"
                  placeholder="Ej. Titanes F.C. Sub-17 A"
                  required
                  value={formEquipo.nombre_equipo_completo}
                  onChange={(e) => setFormEquipo(prev => ({ ...prev, nombre_equipo_completo: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">ID Único Club *</label>
                <input
                  type="text"
                  className="sports-input py-2 text-sm"
                  placeholder="Ej. TITANES-S17-2026"
                  required
                  value={formEquipo.identificacion_unica_club}
                  onChange={(e) => setFormEquipo(prev => ({ ...prev, identificacion_unica_club: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setModalType(null)} className="btn-secondary py-2 px-4 text-xs">Cancelar</button>
                <button type="submit" disabled={submitting} className="btn-primary py-2 px-4 text-xs">Registrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL INSCRIPCION */}
      {modalType === 'inscripcion' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-900 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Inscribir Equipo en Torneo</h3>
              <button onClick={() => setModalType(null)} className="text-zinc-500 hover:text-white"><FaTimes /></button>
            </div>
            <form onSubmit={handleInscribirEquipo} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Seleccionar Campeonato *</label>
                <select
                  className="sports-input py-2 text-sm bg-zinc-900 border-zinc-800"
                  required
                  value={formInscripcion.campeonato_id}
                  onChange={(e) => setFormInscripcion(prev => ({ ...prev, campeonato_id: e.target.value }))}
                >
                  <option value="">-- Escoger Campeonato --</option>
                  {campeonatos.map(camp => (
                    <option key={camp.id} value={camp.id}>{camp.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Seleccionar Equipo Club *</label>
                <select
                  className="sports-input py-2 text-sm bg-zinc-900 border-zinc-800"
                  required
                  value={formInscripcion.equipo_titanes_id}
                  onChange={(e) => setFormInscripcion(prev => ({ ...prev, equipo_titanes_id: e.target.value }))}
                >
                  <option value="">-- Escoger Equipo --</option>
                  {equipos.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.nombre_equipo_completo}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setModalType(null)} className="btn-secondary py-2 px-4 text-xs">Cancelar</button>
                <button type="submit" disabled={submitting} className="btn-primary py-2 px-4 text-xs">Inscribir</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PARTIDO */}
      {modalType === 'partido' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-900 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Programar Partido</h3>
              <button onClick={() => setModalType(null)} className="text-zinc-500 hover:text-white"><FaTimes /></button>
            </div>
            <form onSubmit={handleSchedulePartido} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Campeonato *</label>
                  <select
                    className="sports-input py-2 text-sm bg-zinc-900 border-zinc-800"
                    required
                    value={formPartido.campeonato_id}
                    onChange={(e) => setFormPartido(prev => ({ ...prev, campeonato_id: e.target.value }))}
                  >
                    <option value="">-- Campeonato --</option>
                    {campeonatos.map(camp => (
                      <option key={camp.id} value={camp.id}>{camp.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Equipo Titanes *</label>
                  <select
                    className="sports-input py-2 text-sm bg-zinc-900 border-zinc-800"
                    required
                    value={formPartido.equipo_titanes_id}
                    onChange={(e) => setFormPartido(prev => ({ ...prev, equipo_titanes_id: e.target.value }))}
                  >
                    <option value="">-- Equipo Club --</option>
                    {equipos.map(eq => (
                      <option key={eq.id} value={eq.id}>{eq.nombre_equipo_completo}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Club Rival *</label>
                <input
                  type="text"
                  className="sports-input py-2 text-sm"
                  required
                  placeholder="Ej. Millonarios F.C. Sub-17"
                  value={formPartido.rival_nombre}
                  onChange={(e) => setFormPartido(prev => ({ ...prev, rival_nombre: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Fase Campeonato *</label>
                  <input
                    type="text"
                    className="sports-input py-2 text-sm"
                    required
                    placeholder="Ej. Semifinal / Grupos"
                    value={formPartido.fase_campeonato}
                    onChange={(e) => setFormPartido(prev => ({ ...prev, fase_campeonato: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Fecha y Hora *</label>
                  <input
                    type="datetime-local"
                    className="sports-input py-2 text-sm"
                    required
                    value={formPartido.fecha_hora_partido}
                    onChange={(e) => setFormPartido(prev => ({ ...prev, fecha_hora_partido: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Cancha / Ubicación *</label>
                <input
                  type="text"
                  className="sports-input py-2 text-sm"
                  required
                  placeholder="Ej. Cancha Sintética Norte 3"
                  value={formPartido.lugar_cancha}
                  onChange={(e) => setFormPartido(prev => ({ ...prev, lugar_cancha: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setModalType(null)} className="btn-secondary py-2 px-4 text-xs">Cancelar</button>
                <button type="submit" disabled={submitting} className="btn-primary py-2 px-4 text-xs">Programar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL RESULTADOS */}
      {modalType === 'resultado' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-red-glow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-black text-white uppercase tracking-wider">Reportar Marcador</h3>
              <button onClick={() => setModalType(null)} className="text-zinc-500 hover:text-white"><FaTimes /></button>
            </div>
            
            <div className="text-center mb-4 pb-4 border-b border-zinc-900">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{selectedPartido?.fase_campeonato}</span>
              <h4 className="text-sm font-bold text-white mt-1">
                {selectedPartido?.nombre_equipo_completo} <span className="text-red-500">vs</span> {selectedPartido?.rival_nombre}
              </h4>
            </div>

            <form onSubmit={handleUpdateMarcador} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Goles Titanes *</label>
                  <input
                    type="number"
                    min="0"
                    className="sports-input text-center py-2 font-mono font-bold text-lg"
                    required
                    value={formResultado.goles_titanes}
                    onChange={(e) => setFormResultado(prev => ({ ...prev, goles_titanes: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Goles Rival *</label>
                  <input
                    type="number"
                    min="0"
                    className="sports-input text-center py-2 font-mono font-bold text-lg"
                    required
                    value={formResultado.goles_rival}
                    onChange={(e) => setFormResultado(prev => ({ ...prev, goles_rival: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Veredicto Final *</label>
                <select
                  className="sports-input py-2 text-sm bg-zinc-900 border-zinc-800"
                  required
                  value={formResultado.resultado_final}
                  onChange={(e) => setFormResultado(prev => ({ ...prev, resultado_final: e.target.value }))}
                >
                  <option value="Victoria">Victoria Titanes</option>
                  <option value="Empate">Empate</option>
                  <option value="Derrota">Derrota Titanes</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setModalType(null)} className="btn-secondary py-2 px-4 text-xs">Cancelar</button>
                <button type="submit" disabled={submitting} className="btn-primary py-2 px-4 text-xs">Guardar Marcador</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Campeonatos;
