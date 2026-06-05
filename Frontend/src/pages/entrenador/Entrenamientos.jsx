import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { 
  FaDumbbell, 
  FaPlus, 
  FaEdit, 
  FaTimes, 
  FaSpinner, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaCheckCircle 
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import Loading from '../../components/common/Loading';

const Entrenamientos = () => {
  const [entrenamientos, setEntrenamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEnt, setEditingEnt] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Formulario
  const [form, setForm] = useState({
    categoria_id: '3',
    fecha_hora: '',
    lugar: '',
    objetivo_sesion: '',
    observaciones_generales: ''
  });

  const categorias = [
    { id: 1, nombre: 'Sub-13' },
    { id: 2, nombre: 'Sub-15' },
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
      console.error('Error al obtener entrenamientos:', error);
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

  const handleOpenAddModal = () => {
    setEditingEnt(null);
    setForm({
      categoria_id: '3',
      fecha_hora: '',
      lugar: '',
      objetivo_sesion: '',
      observaciones_generales: ''
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (ent) => {
    setEditingEnt(ent);
    // Convertir ISO string a YYYY-MM-DDThh:mm compatible con datetime-local
    const localDate = ent.fecha_hora ? new Date(ent.fecha_hora).toISOString().slice(0, 16) : '';
    setForm({
      categoria_id: ent.categoria_id?.toString() || '3',
      fecha_hora: localDate,
      lugar: ent.lugar || '',
      objetivo_sesion: ent.objetivo_sesion || '',
      observaciones_generales: ent.observaciones_generales || ''
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        categoria_id: parseInt(form.categoria_id),
        fecha_hora: new Date(form.fecha_hora).toISOString() // Convertir a ISO8601
      };

      if (editingEnt) {
        const response = await API.put(`/entrenamientos/${editingEnt.id}`, payload);
        if (response.data && response.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Sesión Actualizada',
            text: 'La sesión de entrenamiento ha sido modificada correctamente.',
            background: '#161616',
            color: '#fff',
            confirmButtonColor: '#E50914'
          });
          setModalOpen(false);
          fetchEntrenamientos();
        }
      } else {
        const response = await API.post('/entrenamientos', payload);
        if (response.data && response.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Sesión Programada',
            text: 'Se calendarizó la nueva sesión de entrenamiento.',
            background: '#161616',
            color: '#fff',
            confirmButtonColor: '#E50914'
          });
          setModalOpen(false);
          fetchEntrenamientos();
        }
      }
    } catch (error) {
      console.error('Error al guardar entrenamiento:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al Guardar',
        text: error.response?.data?.message || 'Ocurrió un error al procesar la sesión.',
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
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Cronograma de Entrenamientos</h1>
          <p className="text-zinc-500 text-sm mt-1">Calendariza las prácticas semanales, define objetivos tácticos y detalla canchas.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="btn-primary flex items-center justify-center gap-2 self-start sm:self-center"
        >
          <FaPlus />
          Programar Sesión
        </button>
      </div>

      {/* LIST OF TRAINING SESSIONS */}
      {loading ? (
        <div className="h-64 flex items-center justify-center"><Loading /></div>
      ) : entrenamientos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {entrenamientos.map((ent) => (
            <div key={ent.id} className="glass-card p-6 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-titanes-red/5 rounded-bl-full pointer-events-none transition-all group-hover:bg-titanes-red/10"></div>
              
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-lg text-titanes-red text-lg shadow-inner">
                    <FaDumbbell className="group-hover:animate-bounce" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-base tracking-wide uppercase">
                      {ent.objetivo_sesion}
                    </h3>
                    <span className="inline-block mt-1 px-2.5 py-0.5 text-[9px] font-extrabold bg-titanes-red/10 border border-titanes-red/20 text-titanes-red rounded-full uppercase tracking-wider">
                      {categorias.find(c => c.id === ent.categoria_id)?.nombre || `ID: ${ent.categoria_id}`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenEditModal(ent)}
                  className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
                  title="Editar Sesión"
                >
                  <FaEdit size={12} />
                </button>
              </div>

              {/* DETAILS ROW */}
              <div className="mt-6 pt-4 border-t border-zinc-900/60 grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-zinc-500 font-bold uppercase tracking-wider block text-[9px]">Ubicación Cancha</span>
                  <div className="flex items-center gap-1.5 text-zinc-300 font-medium truncate">
                    <FaMapMarkerAlt className="text-titanes-red" />
                    {ent.lugar}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-zinc-500 font-bold uppercase tracking-wider block text-[9px]">Fecha y Hora</span>
                  <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                    <FaCalendarAlt className="text-titanes-red" />
                    {new Date(ent.fecha_hora).toLocaleString('es-CO', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>

              {/* OBSERVACIONES */}
              {ent.observaciones_generales && (
                <div className="mt-4 p-3 bg-zinc-900/40 border border-zinc-900 rounded-lg text-zinc-500 text-xs italic leading-relaxed">
                  "{ent.observaciones_generales}"
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card py-16 text-center rounded-xl border border-zinc-900">
          <p className="text-zinc-500">No hay sesiones de entrenamiento calendarizadas.</p>
        </div>
      )}

      {/* MODAL PROGRAM SESSION */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-900 rounded-2xl shadow-red-glow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                {editingEnt ? 'Editar Sesión' : 'Programar Sesión de Práctica'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-zinc-500 hover:text-white"><FaTimes /></button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Categoría *</label>
                  <select
                    name="categoria_id"
                    className="sports-input py-2 text-sm bg-zinc-900 border-zinc-800"
                    required
                    value={form.categoria_id}
                    onChange={handleInputChange}
                  >
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Fecha y Hora *</label>
                  <input
                    type="datetime-local"
                    name="fecha_hora"
                    className="sports-input py-2 text-sm"
                    required
                    value={form.fecha_hora}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Cancha / Lugar *</label>
                <input
                  type="text"
                  name="lugar"
                  className="sports-input py-2 text-sm"
                  placeholder="Ej. Cancha Sintética Principal"
                  required
                  value={form.lugar}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Objetivo de la Sesión *</label>
                <input
                  type="text"
                  name="objetivo_sesion"
                  className="sports-input py-2 text-sm"
                  placeholder="Ej. Trabajar la resistencia y pressing alto"
                  required
                  value={form.objetivo_sesion}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Observaciones Técnicas / Materiales</label>
                <textarea
                  name="observaciones_generales"
                  className="sports-input py-2 text-sm h-24 resize-none"
                  placeholder="Ej. Traer chalecos y conos dobles. Charla de 10 min al inicio..."
                  value={form.observaciones_generales}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary py-2 px-4 text-xs">Cancelar</button>
                <button type="submit" disabled={submitting} className="btn-primary py-2 px-4 text-xs">
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Procesando...
                    </>
                  ) : editingEnt ? (
                    'Guardar Cambios'
                  ) : (
                    'Programar Sesión'
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

export default Entrenamientos;
