import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { 
  FaHeartbeat, 
  FaUser, 
  FaRunning, 
  FaAward, 
  FaSpinner, 
  FaTimes, 
  FaPlusCircle,
  FaArrowRight
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import Loading from '../../components/common/Loading';

const Evaluaciones = () => {
  const [activeTab, setActiveTab] = useState('tests');
  
  // Catálogos cargados
  const [players, setPlayers] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Formulario Test Físico
  const [formTest, setFormTest] = useState({
    test_id: '',
    jugador_id: '',
    fecha_test: new Date().toISOString().split('T')[0],
    resultado_valor: '',
    nivel_asignado: 'Bueno'
  });

  // Formulario Evaluación Periódica
  const [formEval, setFormEval] = useState({
    jugador_id: '',
    fecha_evaluacion: new Date().toISOString().split('T')[0],
    puntuacion_tecnica: '7',
    puntuacion_tactica: '7',
    puntuacion_fisica: '7',
    puntuacion_mental: '7'
  });

  const niveles = ['Excelente', 'Bueno', 'Promedio', 'Bajo', 'Deficiente'];
  const puntuaciones = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  const loadData = async () => {
    setLoading(true);
    try {
      const [playRes, testRes] = await Promise.all([
        API.get('/jugadores', { params: { limit: 100 } }),
        API.get('/rendimiento/configuracion')
      ]);

      if (playRes.data?.success) setPlayers(playRes.data.data.jugadores);
      if (testRes.data?.success) setTests(testRes.data.data);

      // Pre-poblar ID del primer test y jugador si existen
      if (testRes.data?.data?.length > 0) {
        setFormTest(prev => ({ ...prev, test_id: testRes.data.data[0].id.toString() }));
      }
      if (playRes.data?.data?.jugadores?.length > 0) {
        const firstPlayerId = playRes.data.data.jugadores[0].usuario_id.toString();
        setFormTest(prev => ({ ...prev, jugador_id: firstPlayerId }));
        setFormEval(prev => ({ ...prev, jugador_id: firstPlayerId }));
      }

    } catch (error) {
      console.error('Error al precargar catálogos deportivos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de carga',
        text: 'Ocurrió un problema al obtener los jugadores y pruebas del servidor.',
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

  const handleRegisterTest = async (e) => {
    e.preventDefault();
    if (!formTest.jugador_id || !formTest.test_id) {
      return Swal.fire({
        icon: 'warning',
        title: 'Faltan Campos',
        text: 'Por favor escoge un jugador y un test válido.',
        background: '#161616',
        color: '#fff',
        confirmButtonColor: '#E50914'
      });
    }

    setSubmitting(true);
    try {
      const payload = {
        test_id: parseInt(formTest.test_id),
        jugador_id: parseInt(formTest.jugador_id),
        fecha_test: formTest.fecha_test,
        resultado_valor: formTest.resultado_valor,
        nivel_asignado: formTest.nivel_asignado
      };

      const res = await API.post('/rendimiento/tests', payload);
      if (res.data && res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Resultado Guardado',
          text: 'Se grabó la marca del test físico en el expediente del jugador.',
          background: '#161616',
          color: '#fff',
          confirmButtonColor: '#E50914'
        });
        setFormTest(prev => ({ ...prev, resultado_valor: '' }));
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al Guardar',
        text: error.response?.data?.message || 'Error de validación al asentar marca.',
        background: '#161616',
        color: '#fff',
        confirmButtonColor: '#E50914'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterEval = async (e) => {
    e.preventDefault();
    if (!formEval.jugador_id) {
      return Swal.fire({
        icon: 'warning',
        title: 'Faltan Campos',
        text: 'Por favor selecciona un jugador.',
        background: '#161616',
        color: '#fff',
        confirmButtonColor: '#E50914'
      });
    }

    setSubmitting(true);
    try {
      const payload = {
        jugador_id: parseInt(formEval.jugador_id),
        fecha_evaluacion: formEval.fecha_evaluacion,
        puntuacion_tecnica: parseInt(formEval.puntuacion_tecnica),
        puntuacion_tactica: parseInt(formEval.puntuacion_tactica),
        puntuacion_fisica: parseInt(formEval.puntuacion_fisica),
        puntuacion_mental: parseInt(formEval.puntuacion_mental)
      };

      const res = await API.post('/rendimiento/evaluaciones', payload);
      if (res.data && res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Evaluación Completada',
          text: 'La ficha técnica de rendimiento se grabó con éxito.',
          background: '#161616',
          color: '#fff',
          confirmButtonColor: '#E50914'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al Guardar',
        text: error.response?.data?.message || 'Error al validar puntuaciones.',
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
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Evaluaciones Deportivas</h1>
        <p className="text-zinc-500 text-sm mt-1">Registra mediciones físicas de tests o califica la táctica de tus jugadores.</p>
      </div>

      {/* TABS */}
      <div className="flex border-b border-zinc-900 gap-2">
        <button
          onClick={() => setActiveTab('tests')}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-bold border-b-2 transition-all duration-200 ${
            activeTab === 'tests' 
              ? 'border-titanes-red text-white' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <FaRunning />
          Registrar Test Físico
        </button>
        <button
          onClick={() => setActiveTab('evaluaciones')}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-bold border-b-2 transition-all duration-200 ${
            activeTab === 'evaluaciones' 
              ? 'border-titanes-red text-white' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <FaAward />
          Evaluación Periódica Táctica
        </button>
      </div>

      {/* TABS CONTENT */}
      <div className="max-w-xl mx-auto">
        
        {/* TAB 1: TESTS FISICOS */}
        {activeTab === 'tests' && (
          <div className="glass-card p-6 rounded-2xl animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-titanes-red/10 text-titanes-red flex items-center justify-center border border-titanes-red/25">
                <FaRunning />
              </div>
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wider">Planilla de Test Físico</h3>
                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Asentar marca individual</p>
              </div>
            </div>

            <form onSubmit={handleRegisterTest} className="space-y-4">
              
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">1. Seleccionar Jugador *</label>
                <select
                  className="sports-input py-2 text-sm bg-zinc-900 border-zinc-800"
                  required
                  value={formTest.jugador_id}
                  onChange={(e) => setFormTest(prev => ({ ...prev, jugador_id: e.target.value }))}
                >
                  <option value="">-- Seleccionar Jugador --</option>
                  {players.map(p => (
                    <option key={p.usuario_id} value={p.usuario_id}>
                      {p.nombre} {p.apellido} ({p.categoria_nombre} - Posición: {p.posicion})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">2. Seleccionar Test Físico *</label>
                <select
                  className="sports-input py-2 text-sm bg-zinc-900 border-zinc-800"
                  required
                  value={formTest.test_id}
                  onChange={(e) => setFormTest(prev => ({ ...prev, test_id: e.target.value }))}
                >
                  <option value="">-- Seleccionar Test --</option>
                  {tests.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre} ({t.tipo_metrica})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Fecha de la Prueba *</label>
                  <input
                    type="date"
                    className="sports-input py-2 text-sm"
                    required
                    value={formTest.fecha_test}
                    onChange={(e) => setFormTest(prev => ({ ...prev, fecha_test: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Rendimiento / Nivel *</label>
                  <select
                    className="sports-input py-2 text-sm bg-zinc-900 border-zinc-800"
                    required
                    value={formTest.nivel_assigned}
                    onChange={(e) => setFormTest(prev => ({ ...prev, nivel_asignado: e.target.value }))}
                  >
                    {niveles.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Resultado Obtenido (Valor de Marca) *</label>
                <input
                  type="text"
                  className="sports-input py-2 text-sm font-semibold text-white"
                  placeholder="Ej: 11.2 segundos / 2400 metros"
                  required
                  value={formTest.resultado_valor}
                  onChange={(e) => setFormTest(prev => ({ ...prev, resultado_valor: e.target.value }))}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-wider mt-4"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin text-lg" />
                    Registrando Test...
                  </>
                ) : (
                  'Guardar Marca de Test'
                )}
              </button>

            </form>
          </div>
        )}

        {/* TAB 2: EVALUACIONES PERIODICAS */}
        {activeTab === 'evaluaciones' && (
          <div className="glass-card p-6 rounded-2xl animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-titanes-red/10 text-titanes-red flex items-center justify-center border border-titanes-red/25">
                <FaAward />
              </div>
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wider">Ficha de Evaluación Periódica</h3>
                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Puntajes tácticos (Escala 1 - 10)</p>
              </div>
            </div>

            <form onSubmit={handleRegisterEval} className="space-y-4">
              
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">1. Seleccionar Jugador Evaluado *</label>
                <select
                  className="sports-input py-2 text-sm bg-zinc-900 border-zinc-800"
                  required
                  value={formEval.jugador_id}
                  onChange={(e) => setFormEval(prev => ({ ...prev, jugador_id: e.target.value }))}
                >
                  <option value="">-- Seleccionar Jugador --</option>
                  {players.map(p => (
                    <option key={p.usuario_id} value={p.usuario_id}>
                      {p.nombre} {p.apellido} ({p.categoria_nombre} - Posición: {p.posicion})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Fecha de la Evaluación *</label>
                <input
                  type="date"
                  className="sports-input py-2 text-sm"
                  required
                  value={formEval.fecha_evaluacion}
                  onChange={(e) => setFormEval(prev => ({ ...prev, fecha_evaluacion: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-zinc-900 pt-4">
                
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Puntuación Técnica *</label>
                  <select
                    className="sports-input py-2 text-sm bg-zinc-900 border-zinc-800"
                    required
                    value={formEval.puntuacion_tecnica}
                    onChange={(e) => setFormEval(prev => ({ ...prev, puntuacion_tecnica: e.target.value }))}
                  >
                    {puntuaciones.map(p => (
                      <option key={p} value={p}>{p} / 10</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Puntuación Táctica *</label>
                  <select
                    className="sports-input py-2 text-sm bg-zinc-900 border-zinc-800"
                    required
                    value={formEval.puntuacion_tactica}
                    onChange={(e) => setFormEval(prev => ({ ...prev, puntuacion_tactica: e.target.value }))}
                  >
                    {puntuaciones.map(p => (
                      <option key={p} value={p}>{p} / 10</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Puntuación Física *</label>
                  <select
                    className="sports-input py-2 text-sm bg-zinc-900 border-zinc-800"
                    required
                    value={formEval.puntuacion_fisica}
                    onChange={(e) => setFormEval(prev => ({ ...prev, puntuacion_fisica: e.target.value }))}
                  >
                    {puntuaciones.map(p => (
                      <option key={p} value={p}>{p} / 10</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Puntuación Mental *</label>
                  <select
                    className="sports-input py-2 text-sm bg-zinc-900 border-zinc-800"
                    required
                    value={formEval.puntuacion_mental}
                    onChange={(e) => setFormEval(prev => ({ ...prev, puntuacion_mental: e.target.value }))}
                  >
                    {puntuaciones.map(p => (
                      <option key={p} value={p}>{p} / 10</option>
                    ))}
                  </select>
                </div>

              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-wider mt-4"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin text-lg" />
                    Registrando Evaluación...
                  </>
                ) : (
                  'Registrar Puntuaciones'
                )}
              </button>

            </form>
          </div>
        )}

      </div>

    </div>
  );
};

export default Evaluaciones;
