import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { 
  FaUserPlus, 
  FaEdit, 
  FaTrashAlt, 
  FaSearch, 
  FaFilter,
  FaSpinner,
  FaTimes,
  FaShieldAlt
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import Loading from '../../components/common/Loading';

const Jugadores = () => {
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [pagination, setPagination] = useState({ paginaActual: 1, totalPaginas: 1 });
  const [page, setPage] = useState(1);

  // Estados del Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Formulario
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    categoria_id: '3', // Por defecto Sub-17
    fecha_nacimiento: '',
    documento_identidad: '',
    posicion: 'Mediocentro',
    pierna_habil: 'Derecha',
    estatura_cm: '',
    peso_kg: '',
    nombre_acudiente: '',
    telefono_acudiente: '',
    eps_seguro: '',
    estado: 'activo'
  });

  // Categorías fijas coherentes con la BD
  const categorias = [
    { id: 1, nombre: 'Sub-13' },
    { id: 2, nombre: 'Sub-15' },
    { id: 3, nombre: 'Sub-17' },
    { id: 4, nombre: 'Sub-20' }
  ];

  // Posiciones oficiales de la BD
  const posiciones = [
    'Portero', 
    'Defensa Central', 
    'Lateral', 
    'Mediocentro', 
    'Extremo', 
    'Delantero Centro'
  ];

  const piernasHabiles = ['Derecha', 'Izquierda', 'Ambidiestro'];

  const formatDateValue = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value.split('T')[0];
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().split('T')[0];
    return '';
  };

  const fetchJugadores = async () => {
    setLoading(true);
    try {
      const response = await API.get('/jugadores', {
        params: {
          page,
          limit: 10,
          search,
          categoria_id: filterCategory || null
        }
      });
      if (response.data && response.data.success) {
        setJugadores(response.data.data.jugadores);
        setPagination(response.data.data.paginacion);
      }
    } catch (error) {
      console.error('Error al obtener jugadores:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de carga',
        text: error.response?.data?.message || 'No se pudieron cargar los jugadores.',
        background: '#161616',
        color: '#fff',
        confirmButtonColor: '#E50914'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJugadores();
  }, [page, filterCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJugadores();
  };

  const handleOpenAddModal = () => {
    setEditingPlayer(null);
    setForm({
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      telefono: '',
      categoria_id: '3',
      fecha_nacimiento: '',
      documento_identidad: '',
      posicion: 'Mediocentro',
      pierna_habil: 'Derecha',
      estatura_cm: '',
      peso_kg: '',
      nombre_acudiente: '',
      telefono_acudiente: '',
      eps_seguro: '',
      estado: 'activo'
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (player) => {
    setEditingPlayer(player);
    // Formatear fecha para el input date (YYYY-MM-DD)
    const formattedDate = formatDateValue(player.fecha_nacimiento);
    setForm({
      nombre: player.nombre || '',
      apellido: player.apellido || '',
      email: player.email || '',
      password: '', // Vacío para edición
      telefono: player.telefono || '',
      categoria_id: player.categoria_id?.toString() || '3',
      fecha_nacimiento: formattedDate,
      documento_identidad: player.documento_identidad || '',
      posicion: player.posicion || 'Mediocentro',
      pierna_habil: player.pierna_habil || 'Derecha',
      estatura_cm: player.estatura_cm || '',
      peso_kg: player.peso_kg || '',
      nombre_acudiente: player.nombre_acudiente || '',
      telefono_acudiente: player.telefono_acudiente || '',
      eps_seguro: player.eps_seguro || '',
      estado: player.estado || 'activo'
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
        estatura_cm: form.estatura_cm ? parseInt(form.estatura_cm) : null,
        peso_kg: form.peso_kg ? parseFloat(form.peso_kg) : null
      };

      if (editingPlayer) {
        // En edición, no es obligatorio enviar contraseña vacía
        if (!payload.password) delete payload.password;
        
        const response = await API.put(`/jugadores/${editingPlayer.usuario_id}`, payload);
        if (response.data && response.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Jugador Actualizado',
            text: 'El perfil del jugador se actualizó exitosamente.',
            background: '#161616',
            color: '#fff',
            confirmButtonColor: '#E50914'
          });
          setModalOpen(false);
          fetchJugadores();
        }
      } else {
        // Validación obligatoria para creación
        if (!payload.password || payload.password.length < 6) {
          throw new Error('La contraseña es obligatoria y debe tener al menos 6 caracteres.');
        }
        const response = await API.post('/jugadores', payload);
        if (response.data && response.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Jugador Registrado',
            text: 'El jugador ha sido creado correctamente.',
            background: '#161616',
            color: '#fff',
            confirmButtonColor: '#E50914'
          });
          setModalOpen(false);
          fetchJugadores();
        }
      }
    } catch (error) {
      console.error('Error al guardar jugador:', error);
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

  const handleToggleEstado = async (player) => {
    const nuevoEstado = player.estado === 'activo' ? 'inactivo' : 'activo';
    const actionText = nuevoEstado === 'activo' ? 'activar' : 'suspender';

    Swal.fire({
      title: `¿Deseas ${actionText} a este jugador?`,
      text: `El estado del jugador cambiará a ${nuevoEstado}.`,
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
          const response = await API.put(`/jugadores/${player.usuario_id}`, {
            ...player,
            estado: nuevoEstado
          });
          if (response.data && response.data.success) {
            Swal.fire({
              title: '¡Operación Exitosa!',
              text: `El jugador ha sido cambiado a ${nuevoEstado}.`,
              icon: 'success',
              background: '#161616',
              color: '#fff',
              confirmButtonColor: '#E50914'
            });
            fetchJugadores();
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
      
      {/* HEADER & ADD ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Gestión de Jugadores</h1>
          <p className="text-zinc-500 text-sm mt-1">Registra, edita o suspende perfiles deportivos en el club.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="btn-primary flex items-center justify-center gap-2 self-start sm:self-center"
        >
          <FaUserPlus />
          Registrar Jugador
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="glass-card p-4 rounded-xl flex flex-col md:flex-row items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o documento..."
              className="sports-input pl-10 py-2.5 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-secondary py-2.5 text-sm px-4">
            Buscar
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-zinc-500 text-xs font-bold uppercase whitespace-nowrap flex items-center gap-1.5">
            <FaFilter />
            Filtrar:
          </span>
          <select
            className="sports-input py-2.5 text-sm w-full md:w-48 bg-zinc-900 border-zinc-800"
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Todas las Categorías</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* MAIN DATA GRID */}
      {loading ? (
        <div className="h-64 flex items-center justify-center"><Loading /></div>
      ) : jugadores.length > 0 ? (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Doc. Identidad</th>
                  <th>Jugador</th>
                  <th>Categoría</th>
                  <th>Ficha Técnica</th>
                  <th>Contacto</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {jugadores.map((jugador) => (
                  <tr key={jugador.usuario_id}>
                    <td className="font-bold text-zinc-400">{jugador.documento_identidad}</td>
                    <td>
                      <div className="font-bold text-white text-sm">{jugador.nombre} {jugador.apellido}</div>
                      <span className="text-[10px] text-zinc-500 font-extrabold uppercase bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800/80">
                        {jugador.posicion}
                      </span>
                    </td>
                    <td>
                      <span className="inline-block px-2.5 py-0.5 text-xs font-bold bg-titanes-red/10 border border-titanes-red/20 text-titanes-red rounded-full">
                        {jugador.categoria_nombre || `ID: ${jugador.categoria_id}`}
                      </span>
                    </td>
                    <td className="text-xs text-zinc-400 space-y-0.5">
                      <div>Estatura: <strong className="text-zinc-200">{jugador.estatura_cm ? `${jugador.estatura_cm} cm` : '---'}</strong></div>
                      <div>Peso: <strong className="text-zinc-200">{jugador.peso_kg ? `${jugador.peso_kg} kg` : '---'}</strong></div>
                      <div>Pierna: <strong className="text-zinc-200">{jugador.pierna_habil || '---'}</strong></div>
                    </td>
                    <td className="text-xs text-zinc-400 space-y-0.5">
                      <div className="truncate max-w-[180px]">{jugador.email}</div>
                      <div className="text-zinc-200 font-bold">{jugador.telefono || 'Sin Teléfono'}</div>
                    </td>
                    <td>
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest ${
                        jugador.estado === 'activo' 
                          ? 'bg-emerald-950/40 border border-emerald-900/60 text-emerald-400' 
                          : 'bg-red-950/40 border border-red-900/60 text-red-400'
                      }`}>
                        {jugador.estado}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(jugador)}
                          className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
                          title="Editar Perfil"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleToggleEstado(jugador)}
                          className={`p-2 border rounded-lg transition-colors ${
                            jugador.estado === 'activo'
                              ? 'bg-red-950/20 border-red-900/40 text-red-400 hover:bg-red-900 hover:text-white'
                              : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400 hover:bg-emerald-900 hover:text-white'
                          }`}
                          title={jugador.estado === 'activo' ? 'Suspender Jugador' : 'Activar Jugador'}
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
          <p className="text-zinc-500">No se encontraron jugadores registrados.</p>
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
                  {editingPlayer ? 'Editar Ficha de Jugador' : 'Registrar Nuevo Jugador'}
                </h2>
                <p className="text-zinc-500 text-xs mt-0.5">Ingresa los datos personales y técnicos deportivos.</p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              {/* SECTION: DATOS DE USUARIO */}
              <div className="space-y-4">
                <h3 className="text-xs font-black tracking-widest text-titanes-red uppercase border-b border-zinc-900 pb-2">
                  1. Información de Acceso
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
                      disabled={!!editingPlayer}
                      value={form.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1.5">
                      Contraseña {editingPlayer ? '(Opcional cambio)' : '*'}
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="sports-input py-2 text-sm"
                      placeholder={editingPlayer ? 'Dejar en blanco para conservar' : 'Mínimo 6 caracteres'}
                      required={!editingPlayer}
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
                  {editingPlayer && (
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

              {/* SECTION: PERFIL DEPORTIVO */}
              <div className="space-y-4">
                <h3 className="text-xs font-black tracking-widest text-titanes-red uppercase border-b border-zinc-900 pb-2">
                  2. Ficha Técnica Deportiva
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1.5">Categoría *</label>
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
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1.5">Documento Identidad *</label>
                    <input
                      type="text"
                      name="documento_identidad"
                      className="sports-input py-2 text-sm"
                      required
                      value={form.documento_identidad}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1.5">Fecha Nacimiento *</label>
                    <input
                      type="date"
                      name="fecha_nacimiento"
                      className="sports-input py-2 text-sm"
                      required
                      value={form.fecha_nacimiento}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1.5">Posición Táctica *</label>
                    <select
                      name="posicion"
                      className="sports-input py-2 text-sm bg-zinc-900 border-zinc-800"
                      required
                      value={form.posicion}
                      onChange={handleInputChange}
                    >
                      {posiciones.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1.5">Pierna Hábil</label>
                    <select
                      name="pierna_habil"
                      className="sports-input py-2 text-sm bg-zinc-900 border-zinc-800"
                      value={form.pierna_habil}
                      onChange={handleInputChange}
                    >
                      {piernasHabiles.map(pierna => (
                        <option key={pierna} value={pierna}>{pierna}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1.5">Estatura (cm)</label>
                    <input
                      type="number"
                      name="estatura_cm"
                      className="sports-input py-2 text-sm"
                      placeholder="Ej. 175"
                      value={form.estatura_cm}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1.5">Peso (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="peso_kg"
                      className="sports-input py-2 text-sm"
                      placeholder="Ej. 65.5"
                      value={form.peso_kg}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1.5">EPS / Seguro Médico</label>
                    <input
                      type="text"
                      name="eps_seguro"
                      className="sports-input py-2 text-sm"
                      value={form.eps_seguro}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: ACUDIENTE */}
              <div className="space-y-4">
                <h3 className="text-xs font-black tracking-widest text-titanes-red uppercase border-b border-zinc-900 pb-2">
                  3. Datos de Acompañamiento / Acudiente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1.5">Nombre de Acudiente</label>
                    <input
                      type="text"
                      name="nombre_acudiente"
                      className="sports-input py-2 text-sm"
                      value={form.nombre_acudiente}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1.5">Teléfono de Acudiente</label>
                    <input
                      type="text"
                      name="telefono_acudiente"
                      className="sports-input py-2 text-sm"
                      value={form.telefono_acudiente}
                      onChange={handleInputChange}
                    />
                  </div>
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
                  ) : editingPlayer ? (
                    'Guardar Cambios'
                  ) : (
                    'Registrar Jugador'
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

export default Jugadores;
