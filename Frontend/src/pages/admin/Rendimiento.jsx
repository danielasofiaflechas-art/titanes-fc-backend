import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { 
  FaHeartbeat, 
  FaPlus, 
  FaSpinner, 
  FaTimes, 
  FaClipboardList, 
  FaInfoCircle
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import Loading from '../../components/common/Loading';

const Rendimiento = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Formulario
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    tipo_metrica: 'Tiempo',
    unidad_medida: 'Segundos'
  });

  const metricas = ['Tiempo', 'Distancia', 'Fuerza', 'Repeticiones', 'Índice de Masa Corporal (IMC)', 'Capacidad Pulmonar'];

  const fetchTests = async () => {
    setLoading(true);
    try {
      const response = await API.get('/rendimiento/configuracion');
      if (response.data && response.data.success) {
        setTests(response.data.data);
      }
    } catch (error) {
      console.error('Error al obtener configuraciones de tests:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de carga',
        text: 'No pudimos recuperar el catálogo de pruebas del servidor.',
        background: '#161616',
        color: '#fff',
        confirmButtonColor: '#E50914'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleCreateTest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        nombre_test: form.nombre,
        tipo_metrica: form.tipo_metrica,
        descripcion: `${form.descripcion} - Unidad: ${form.unidad_medida}`
      };
      const response = await API.post('/rendimiento/configuracion', payload);
      if (response.data && response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Configuración Guardada',
          text: 'Se ha creado el nuevo test físico en el catálogo.',
          background: '#161616',
          color: '#fff',
          confirmButtonColor: '#E50914'
        });
        setModalOpen(false);
        fetchTests();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al crear configuración de test.',
        background: '#161616',
        color: '#fff',
        confirmButtonColor: '#E50914'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Catálogo de Tests Físicos</h1>
          <p className="text-zinc-500 text-sm mt-1">Configura las métricas y pruebas físicas oficiales del club para evaluar jugadores.</p>
        </div>
        <button
          onClick={() => {
            setForm({ nombre: '', descripcion: '', tipo_metrica: 'Tiempo', unidad_medida: 'Segundos' });
            setModalOpen(true);
          }}
          className="btn-primary flex items-center justify-center gap-2 self-start sm:self-center"
        >
          <FaPlus />
          Crear Test Físico
        </button>
      </div>

      {/* DETAILED STATS BANNER */}
      <div className="glass-card p-5 rounded-xl border border-zinc-900 flex items-start gap-4">
        <div className="text-2xl text-titanes-red/80 p-3 rounded-lg bg-zinc-900 border border-zinc-800 shadow-inner">
          <FaClipboardList className="animate-pulse" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm uppercase tracking-wide">Acerca del Registro de Rendimiento</h3>
          <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
            Las pruebas que configures en esta sección estarán disponibles de inmediato para los directores técnicos y preparadores físicos. Desde sus paneles, ellos podrán registrar mediciones reales asociadas a cada jugador y realizar evaluaciones táctico-técnicas periódicas.
          </p>
        </div>
      </div>

      {/* DATA GRID */}
      {loading ? (
        <div className="h-64 flex items-center justify-center"><Loading /></div>
      ) : tests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div key={test.id} className="glass-card p-6 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-titanes-red/5 rounded-bl-full pointer-events-none transition-all group-hover:bg-titanes-red/10"></div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-black text-white text-base tracking-wide group-hover:text-titanes-red transition-colors duration-250">
                    {test.nombre}
                  </h4>
                  <span className="inline-block mt-2 px-2.5 py-0.5 text-[9px] font-extrabold bg-zinc-900 border border-zinc-800 text-zinc-300 rounded uppercase tracking-wider">
                    {test.tipo_metrica} ({test.unidad_medida})
                  </span>
                </div>
                <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-lg text-titanes-red text-base shadow-inner">
                  <FaHeartbeat />
                </div>
              </div>
              <p className="text-zinc-500 text-xs mt-4 leading-relaxed line-clamp-3">
                {test.descripcion || 'Sin descripción detallada registrada para este test físico.'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card py-16 text-center rounded-xl border border-zinc-900">
          <p className="text-zinc-500">No hay configuraciones de tests deportivos en el catálogo.</p>
        </div>
      )}

      {/* MODAL NEW TEST */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-2xl shadow-red-glow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-black text-white uppercase tracking-wider">Nuevo Test Físico</h3>
              <button onClick={() => setModalOpen(false)} className="text-zinc-500 hover:text-white"><FaTimes /></button>
            </div>

            <form onSubmit={handleCreateTest} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Nombre del Test *</label>
                <input
                  type="text"
                  className="sports-input py-2 text-sm"
                  placeholder="Ej. Test de Cooper / Salto Vertical"
                  required
                  value={form.nombre}
                  onChange={(e) => setForm(prev => ({ ...prev, nombre: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Descripción y Protocolo *</label>
                <textarea
                  className="sports-input py-2 text-sm h-24 resize-none"
                  placeholder="Instrucciones y objetivos del test..."
                  required
                  value={form.descripcion}
                  onChange={(e) => setForm(prev => ({ ...prev, descripcion: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Tipo Métrica *</label>
                  <select
                    className="sports-input py-2 text-sm bg-zinc-900 border-zinc-800"
                    required
                    value={form.tipo_metrica}
                    onChange={(e) => setForm(prev => ({ ...prev, tipo_metrica: e.target.value }))}
                  >
                    {metricas.map(met => (
                      <option key={met} value={met}>{met}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Unidad de Medida *</label>
                  <input
                    type="text"
                    className="sports-input py-2 text-sm"
                    placeholder="Ej. Metros / Segundos"
                    required
                    value={form.unidad_medida}
                    onChange={(e) => setForm(prev => ({ ...prev, unidad_medida: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary py-2 px-4 text-xs">Cancelar</button>
                <button type="submit" disabled={submitting} className="btn-primary py-2 px-4 text-xs">
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    'Guardar Test'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Rendimiento;
