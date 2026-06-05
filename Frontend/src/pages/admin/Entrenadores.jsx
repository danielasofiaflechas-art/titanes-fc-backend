import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { 
  FaUserPlus, 
  FaEdit, 
  FaTrashAlt, 
  FaSearch, 
  FaSpinner,
  FaTimes,
  FaShieldAlt,
  FaCheckSquare,
  FaSquare
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import Loading from '../../components/common/Loading';

const Entrenadores = () => {
  const [entrenadores, setEntrenadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ paginaActual: 1, totalPaginas: 1 });
  const [page, setPage] = useState(1);

  // Estados del Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Formulario
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    licencia: '',
    especialidad: '',
    experiencia_anos: '',
    categorias: [], // Arreglo de IDs de categorías asignadas
    estado: 'activo'
  });

  // Categorías fijas de la BD para asignar a entrenadores
  const categoriasDisponibles = [
    { id: 1, nombre: 'Sub-13' },
    { id: 2, nombre: 'Sub-15' },
    { id: 3, nombre: 'Sub-17' },
    { id: 4, nombre: 'Sub-20' }
  ];

  const fetchEntrenadores = async () => {
    setLoading(true);
    try {
      const response = await API.get('/entrenadores', {
        params: {
          page,
          limit: 10,
          search
        }
      });
      if (response.data && response.data.success) {
        setEntrenadores(response.data.data.entrenadores);
        setPagination(response.data.data.paginacion);
      }
    } catch (error) {
      console.error('Error al obtener entrenadores:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de carga',
        text: error.response?.data?.message || 'No se pudieron cargar los entrenadores.',
        background: '#161616',
        color: '#fff',
        confirmButtonColor: '#E50914'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntrenadores();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEntrenadores();
  };

  const handleOpenAddModal = () => {
    setEditingCoach(null);
    setForm({
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      telefono: '',
      licencia: '',
      especialidad: '',
      experiencia_anos: '',
      categorias: [],
      estado: 'activo'
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (coach) => {
    setEditingCoach(coach);
    
    // Si el entrenador ya tiene categorías en formato string separadas por coma
    // o tiene un arreglo pre-cargado
    let assignedCats = [];
    if (coach.categorias_ids) {
      // Si la API devuelve un string separado por comas: "1,3"
      assignedCats = coach.categorias_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    } else if (Array.isArray(coach.categorias)) {
      // Si devuelve un array de objetos
      assignedCats = coach.categorias.map(c => c.id);
    }

    setForm({
      nombre: coach.nombre || '',
      apellido: coach.apellido || '',
      email: coach.email || '',
      password: '', // Vacío para edición
      telefono: coach.telefono || '',
      licencia: coach.licencia || '',
      especialidad: coach.especialidad || '',
      experiencia_anos: coach.experiencia_anos?.toString() || '',
      categorias: assignedCats,
      estado: coach.estado || 'activo'
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Toggle selección de categorías
  const handleCategoryCheckboxChange = (catId) => {
    setForm(prev => {
      const isSelected = prev.categorias.includes(catId);
      const newCats = isSelected
        ? prev.categorias.filter(id => id !== catId)
        : [...prev.categorias, catId];
      return { ...prev, categorias: newCats };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        experiencia_anos: form.experiencia_anos ? parseInt(form.experiencia_anos) : 0,
        categorias: form.categorias // Arreglo de IDs numéricos
      };

      if (editingCoach) {
        if (!payload.password) delete payload.password;
        const response = await API.put(`/entrenadores/${editingCoach.usuario_id}`, payload);
        if (response.data && response.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Entrenador Actualizado',
            text: 'Los datos del entrenador se actualizaron correctamente.',
            background: '#161616',
            color: '#fff',
            confirmButtonColor: '#E50914'
          });
          setModalOpen(false);
          fetchEntrenadores();
        }
      } else {
        if (!payload.password || payload.password.length < 6) {
          throw new Error('La contraseña es obligatoria y debe tener al menos 6 caracteres.');
        }
        const response = await API.post('/entrenadores', payload);
        if (response.data && response.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Entrenador Registrado',
            text: 'El entrenador ha sido creado con éxito.',
            background: '#161616',
            color: '#fff',
            confirmButtonColor: '#E50914'
          });
          setModalOpen(false);
          fetchEntrenadores();
        }
      }
    } catch (error) {
      console.error('Error al guardar entrenador:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al Guardar',
        text: error.response?.data?.message || error.message || 'Ocurrió un error inesperado.',
        background: '#161616',
        color: '#fff',
        confirmButtonColor: '#E50914'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleEstado = async (coach) => {
    const nuevoEstado = coach.estado === 'activo' ? 'inactivo' : 'activo';
    const actionText = nuevoEstado === 'activo' ? 'activar' : 'suspender';

    Swal.fire({
      title: `¿Deseas ${actionText} a este entrenador?`,
      text: `El estado cambiará a ${nuevoEstado}.`,
      icon: 'warning',
      showCancelButton: true,
      background: '#161616',
      color: '#fff',
      confirmButtonColor: '#E50914',
      cancelButtonColor: '#3f3f46',
      confirmButtonText: `Sí, ${actionText}`,
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // El backend de entrenadores también actualiza el estado general en la tabla usuarios al usar PUT
          const response = await API.put(`/entrenadores/${coach.usuario_id}`, {
            ...coach,
            estado: nuevoEstado
          });
          if (response.data && response.data.success) {
            Swal.fire({
              title: '¡Operación Exitosa!',
              text: `El entrenador ahora está ${nuevoEstado}.`,
              icon: 'success',
              background: '#161616',
              color: '#fff',
              confirmButtonColor: '#E50914'
            });
            fetchEntrenadores();
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'No se pudo cambiar el estado.',
            background: '#161616',
            color: '#fff',
            confirmButtonColor: '#E50914'
          });
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Cuerpo Técnico / Entrenadores</h1>
          <p className="text-zinc-500 text-sm mt-1">Registra directores técnicos, preparadores físicos y asigna sus categorías.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="btn-primary flex items-center justify-center gap-2 self-start sm:self-center"
        >
          <FaUserPlus />
          Registrar Entrenador
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="glass-card p-4 rounded-xl">
        <form onSubmit={handleSearchSubmit} className="w-full flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Buscar por nombre, especialidad o licencia..."
              className="sports-input pl-10 py-2.5 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-secondary py-2.5 text-sm px-5">
            Buscar
          </button>
        </form>
      </div>

      {/* DATA GRID */}
      {loading ? (
        <div className="h-64 flex items-center justify-center"><Loading /></div>
      ) : entrenadores.length > 0 ? (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Nombre Entrenador</th>
                  <th>Licencia</th>
                  <th>Especialidad / Exp.</th>
                  <th>Categorías Asignadas</th>
                  <th>Contacto</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {entrenadores.map((coach) => (
                  <tr key={coach.usuario_id}>
                    <td>
                      <div className="font-bold text-white text-sm">{coach.nombre} {coach.apellido}</div>
                      <span className="text-[9px] text-zinc-500 font-extrabold uppercase bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded mt-0.5 inline-block">
                        Cuerpo Técnico
                      </span>
                    </td>
                    <td className="font-semibold text-red-400 text-xs tracking-wider">
                      {coach.licencia || 'Sin Licencia'}
                    </td>
                    <td>
                      <div className="font-medium text-white text-xs">{coach.especialidad || 'General'}</div>
                      <span className="text-[10px] text-zinc-500">
                        {coach.experiencia_anos ? `${coach.experiencia_anos} años exp.` : '---'}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {coach.categorias_nombres ? (
                          coach.categorias_nombres.split(',').map((name, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-[9px] font-extrabold bg-zinc-900 border border-zinc-800 text-zinc-300 rounded uppercase">
                              {name.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-zinc-600 font-medium italic">Sin categorías</span>
                        )}
                      </div>
                    </td>
                    <td className="text-xs text-zinc-400 space-y-0.5">
                      <div className="truncate max-w-[180px]">{coach.email}</div>
                      <div className="text-zinc-200 font-bold">{coach.telefono || 'Sin Teléfono'}</div>
                    </td>
                    <td>
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest ${
                        coach.estado === 'activo' 
                          ? 'bg-emerald-950/40 border border-emerald-900/60 text-emerald-400' 
                          : 'bg-red-950/40 border border-red-900/60 text-red-400'
                      }`}>
                        {coach.estado}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(coach)}
                          className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
                          title="Editar Perfil"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleToggleEstado(coach)}
                          className={`p-2 border rounded-lg transition-colors ${
                            coach.estado === 'activo'
                              ? 'bg-red-950/20 border-red-900/40 text-red-400 hover:bg-red-900 hover:text-white'
                              : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400 hover:bg-emerald-900 hover:text-white'
                          }`}
                          title={coach.estado === 'activo' ? 'Suspender Entrenador' : 'Activar Entrenador'}
                        >
                          <FaTrashAlt size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between px-6 py-4 bg-zinc-950/60 border-t border-zinc-900">
            <span className="text-xs text-zinc-500 font-bold">
              Página {pagination.paginaActual} de {pagination.totalPaginas || 1}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="btn-secondary py-1.5 px-3 text-xs"
              >
                Anterior
              </button>
              <button
                disabled={page >= pagination.totalPaginas}
                onClick={() => setPage(page + 1)}
                className="btn-secondary py-1.5 px-3 text-xs"
              >
                Siguiente
              </button>
            </div>
          </div>

        </div>
      ) : (
        <div className="glass-card py-16 text-center rounded-xl border border-zinc-900">
          <p className="text-zinc-500">No se encontraron entrenadores registrados.</p>
        </div>
      )}

      {/* CRUD MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-900 rounded-2xl shadow-red-glow p-6 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white rounded-lg focus:outline-none"
            >
              <FaTimes size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-titanes-red to-red-700 flex items-center justify-center text-white">
                <FaShieldAlt />
              </div>
              <div>
                <h2 className="text-xl font-black text-white m-0 leading-tight">
                  {editingCoach ? 'Editar Entrenador' : 'Registrar Entrenador'}
                </h2>
                <p className="text-zinc-500 text-xs mt-0.5">Ingresa las credenciales y el perfil técnico profesional.</p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              {/* SECTION: CREDENTIALS */}
              <div className="space-y-4">
                <h3 className="text-xs font-black tracking-widest text-titanes-red uppercase border-b border-zinc-900 pb-2">
                  1. Datos de Cuenta / Usuario
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1.5">Nombre *</label>
                    <input
                      type="text"
                      name="nombre"
                      className="sports-input py-2 text-sm"
                      required
                      value={form.nombre}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1.5">Apellido *</label>
                    <input
                      type="text"
                      name="apellido"
                      className="sports-input py-2 text-sm"
                      required
                      value={form.apellido}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1.5">Correo Electrónico *</label>
                    <input
                      type="email"
                      name="email"
                      className="sports-input py-2 text-sm"
                      required
                      disabled={!!editingCoach}
                      value={form.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1.5">
                      Contraseña {editingCoach ? '(Opcional cambio)' : '*'}
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="sports-input py-2 text-sm"
                      placeholder={editingCoach ? 'Dejar en blanco para conservar' : 'Mínimo 6 caracteres'}
                      required={!editingCoach}
                      value={form.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1.5">Teléfono Celular</label>
                    <input
                      type="text"
                      name="telefono"
                      className="sports-input py-2 text-sm"
                      value={form.telefono}
                      onChange={handleInputChange}
                    />
                  </div>
                  {editingCoach && (
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1.5">Estado</label>
                      <select
                        name="estado"
                        className="sports-input py-2 text-sm bg-zinc-900 border-zinc-800"
                        value={form.estado}
                        onChange={handleInputChange}
                      >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        <option value="suspendido">Suspendido</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION: ACADEMIC */}
              <div className="space-y-4">
                <h3 className="text-xs font-black tracking-widest text-titanes-red uppercase border-b border-zinc-900 pb-2">
                  2. Perfil Técnico y Licencias
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1.5">Licencia Oficial</label>
                    <input
                      type="text"
                      name="licencia"
                      className="sports-input py-2 text-sm"
                      placeholder="Ej. CONMEBOL PRO / A"
                      value={form.licencia}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1.5">Especialidad</label>
                    <input
                      type="text"
                      name="especialidad"
                      className="sports-input py-2 text-sm"
                      placeholder="Ej. Prep. Físico / Táctico"
                      value={form.especialidad}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1.5">Años de Experiencia</label>
                    <input
                      type="number"
                      name="experiencia_anos"
                      className="sports-input py-2 text-sm"
                      value={form.experiencia_anos}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: CATEGORIES ASSIGNED */}
              <div className="space-y-4">
                <h3 className="text-xs font-black tracking-widest text-titanes-red uppercase border-b border-zinc-900 pb-2">
                  3. Asignación de Categorías Deportivas
                </h3>
                <p className="text-zinc-500 text-xs">Selecciona cuáles categorías estarán a cargo de este entrenador.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  {categoriasDisponibles.map(cat => {
                    const isChecked = form.categorias.includes(cat.id);
                    return (
                      <div 
                        key={cat.id}
                        onClick={() => handleCategoryCheckboxChange(cat.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer select-none transition-all duration-200 ${
                          isChecked 
                            ? 'bg-titanes-red/10 border-titanes-red/45 text-white shadow-red-glow-sm' 
                            : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {isChecked ? (
                          <FaCheckSquare className="text-titanes-red text-base" />
                        ) : (
                          <FaSquare className="text-zinc-700 text-base" />
                        )}
                        <span className="text-xs font-bold uppercase tracking-wider">{cat.nombre}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary py-2 px-5 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary py-2 px-5 text-sm"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Procesando...
                    </>
                  ) : editingCoach ? (
                    'Guardar Cambios'
                  ) : (
                    'Registrar Entrenador'
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

export default Entrenadores;
