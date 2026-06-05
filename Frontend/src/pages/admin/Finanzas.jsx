import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { 
  FaDollarSign, 
  FaMoneyBillWave, 
  FaPlus, 
  FaHistory, 
  FaFileInvoiceDollar, 
  FaSpinner, 
  FaTimes, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaTrophy
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import Loading from '../../components/common/Loading';

const Finanzas = () => {
  const [activeTab, setActiveTab] = useState('mensualidades');
  
  // Datos
  const [mensualidades, setMensualidades] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de Modales y Submitting
  const [modalType, setModalType] = useState(null); // 'lote', 'pago-mensualidad', 'pago-inscripcion'
  const [submitting, setSubmitting] = useState(false);
  const [selectedMensualidad, setSelectedMensualidad] = useState(null);

  // Formulario Generar Lote
  const [formLote, setFormLote] = useState({
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear(),
    monto_base: '150000'
  });

  // Formulario Registrar Pago Mensualidad
  const [formPago, setFormPago] = useState({
    metodo_pago: 'transferencia',
    referencia: ''
  });

  // Formulario Registrar Pago Inscripcion Campeonato
  const [formPagoInscripcion, setFormPagoInscripcion] = useState({
    campeonato_id: '',
    equipo_id: '',
    monto: '',
    metodo_pago: 'transferencia'
  });

  // Torneos y equipos cargados para el selector de inscripciones
  const [campeonatos, setCampeonatos] = useState([]);
  const [equipos, setEquipos] = useState([]);

  const loadFinanzas = async () => {
    setLoading(true);
    try {
      const [mensRes, histRes, inscRes] = await Promise.all([
        API.get('/finanzas/mensualidades'),
        API.get('/finanzas/historial'),
        API.get('/finanzas/inscripciones')
      ]);

      if (mensRes.data && mensRes.data.success) setMensualidades(mensRes.data.data);
      if (histRes.data && histRes.data.success) setHistorial(histRes.data.data);
      if (inscRes.data && inscRes.data.success) setInscripciones(inscRes.data.data);

      // Cargar campeonatos y equipos para registrar pagos de inscripción
      const campRes = await API.get('/campeonatos');
      const eqRes = await API.get('/campeonatos/equipos');
      if (campRes.data?.success) {
        setCampeonatos(campRes.data.data?.campeonatos || campRes.data.data || []);
      }
      if (eqRes.data?.success) setEquipos(eqRes.data.data);

    } catch (error) {
      console.error('Error al sincronizar finanzas:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error Financiero',
        text: 'No se pudo sincronizar la caja general y mensualidades con el servidor.',
        background: '#161616',
        color: '#fff',
        confirmButtonColor: '#E50914'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinanzas();
  }, []);

  const handleGenerarLote = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        mes: parseInt(formLote.mes),
        anio: parseInt(formLote.anio),
        monto_base: parseFloat(formLote.monto_base)
      };

      const res = await API.post('/finanzas/mensualidades/lote', payload);
      if (res.data && res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Mensualidades Generadas',
          text: 'Se facturó el lote mensual a todos los jugadores activos.',
          background: '#161616',
          color: '#fff',
          confirmButtonColor: '#E50914'
        });
        setModalType(null);
        loadFinanzas();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en lote',
        text: error.response?.data?.message || 'Error al generar lote.',
        background: '#161616',
        color: '#fff',
        confirmButtonColor: '#E50914'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenPagoModal = (mens) => {
    setSelectedMensualidad(mens);
    setFormPago({ metodo_pago: 'transferencia', referencia: '' });
    setModalType('pago-mensualidad');
  };

  const handlePagarMensualidad = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.post(`/finanzas/mensualidades/${selectedMensualidad.id}/pago`, formPago);
      if (res.data && res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Pago Registrado',
          text: 'La cuota del jugador se ha marcado como PAGADA en el sistema.',
          background: '#161616',
          color: '#fff',
          confirmButtonColor: '#E50914'
        });
        setModalType(null);
        loadFinanzas();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al registrar pago.',
        background: '#161616',
        color: '#fff',
        confirmButtonColor: '#E50914'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegistrarPagoInscripcion = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        campeonato_id: parseInt(formPagoInscripcion.campeonato_id),
        equipo_id: parseInt(formPagoInscripcion.equipo_id),
        monto: parseFloat(formPagoInscripcion.monto),
        metodo_pago: formPagoInscripcion.metodo_pago
      };
      
      const res = await API.post('/finanzas/inscripciones', payload);
      if (res.data && res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Pago de Inscripción Registrado',
          text: 'Se asentó en caja el pago de matrícula del campeonato.',
          background: '#161616',
          color: '#fff',
          confirmButtonColor: '#E50914'
        });
        setModalType(null);
        loadFinanzas();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al registrar inscripción.',
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

  const getMonthName = (monthNumber) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[monthNumber - 1] || `Mes ${monthNumber}`;
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Módulo de Tesorería</h1>
          <p className="text-zinc-500 text-sm mt-1">Administra el cobro de mensualidades, pagos de torneos e historial contable.</p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-zinc-900 gap-2">
        <button
          onClick={() => setActiveTab('mensualidades')}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-bold border-b-2 transition-all duration-200 ${
            activeTab === 'mensualidades' 
              ? 'border-titanes-red text-white' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <FaFileInvoiceDollar />
          Mensualidades Jugadores
        </button>
        <button
          onClick={() => setActiveTab('inscripciones')}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-bold border-b-2 transition-all duration-200 ${
            activeTab === 'inscripciones' 
              ? 'border-titanes-red text-white' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <FaTrophy />
          Inscripciones Campeonatos
        </button>
        <button
          onClick={() => setActiveTab('historial')}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-bold border-b-2 transition-all duration-200 ${
            activeTab === 'historial' 
              ? 'border-titanes-red text-white' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <FaHistory />
          Caja e Historial
        </button>
      </div>

      {/* TABS CONTENT */}
      {loading ? (
        <div className="h-64 flex items-center justify-center"><Loading /></div>
      ) : (
        <>
          {/* TAB 1: MENSUALIDADES */}
          {activeTab === 'mensualidades' && (
            <div className="space-y-6">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setFormLote({ mes: new Date().getMonth() + 1, anio: new Date().getFullYear(), monto_base: '150000' });
                    setModalType('lote');
                  }}
                  className="btn-primary py-2 px-4 text-xs"
                >
                  <FaPlus /> Generar Lote de Cobros
                </button>
              </div>

              {mensualidades.length > 0 ? (
                <div className="glass-card rounded-xl overflow-hidden">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>Jugador</th>
                        <th>Periodo</th>
                        <th>Monto Pactado</th>
                        <th>Monto Pagado</th>
                        <th>Vencimiento</th>
                        <th>Estado Pago</th>
                        <th className="text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mensualidades.map((mens) => (
                        <tr key={mens.id}>
                          <td>
                            <div className="font-bold text-white text-sm">{mens.nombre_completo || `${mens.nombre} ${mens.apellido}`}</div>
                            <span className="text-[9px] text-zinc-500 font-extrabold uppercase bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded mt-0.5 inline-block">
                              Jugador ID: {mens.jugador_id}
                            </span>
                          </td>
                          <td className="text-xs font-semibold text-zinc-300">
                            {getMonthName(mens.mes)} / {mens.anio}
                          </td>
                          <td className="text-zinc-300 font-medium text-sm">{formatCurrency(mens.monto_pactado || mens.monto)}</td>
                          <td className="text-emerald-400 font-bold text-sm">{formatCurrency(mens.monto_pagado || 0)}</td>
                          <td className="text-xs text-zinc-400">
                            {new Date(mens.fecha_limite_pago || mens.fecha_pago).toLocaleDateString()}
                          </td>
                          <td>
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${
                              mens.estado_pago === 'Pagado' || mens.estado === 'pagado'
                                ? 'bg-emerald-950/40 border border-emerald-900/60 text-emerald-400' 
                                : mens.estado_pago === 'Pendiente' || mens.estado === 'pendiente'
                                ? 'bg-amber-950/40 border border-amber-900/60 text-amber-400 animate-pulse'
                                : 'bg-red-950/40 border border-red-900/60 text-red-400'
                            }`}>
                              {mens.estado_pago || mens.estado}
                            </span>
                          </td>
                          <td className="text-center">
                            {(mens.estado_pago !== 'Pagado' && mens.estado !== 'pagado') ? (
                              <button
                                onClick={() => handleOpenPagoModal(mens)}
                                className="p-2 px-3.5 bg-zinc-900 hover:bg-emerald-950/20 hover:text-emerald-400 border border-zinc-800 hover:border-emerald-800/40 text-zinc-400 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1 mx-auto"
                              >
                                <FaDollarSign size={10} />
                                Recibir Pago
                              </button>
                            ) : (
                              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 justify-center">
                                <FaCheckCircle />
                                Saldado
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="glass-card py-16 text-center rounded-xl border border-zinc-900">
                  <p className="text-zinc-500">No hay mensualidades facturadas en el sistema.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INSCRIPCIONES */}
          {activeTab === 'inscripciones' && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => {
                    setFormPagoInscripcion({ campeonato_id: campeonatos[0]?.id?.toString() || '', equipo_id: equipos[0]?.id?.toString() || '', monto: '', metodo_pago: 'transferencia' });
                    setModalType('pago-inscripcion');
                  }}
                  className="btn-primary py-2 px-4 text-xs"
                >
                  <FaPlus /> Pagar Inscripción Campeonato
                </button>
              </div>

              {inscripciones.length > 0 ? (
                <div className="glass-card rounded-xl overflow-hidden">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>Torneo / Liga</th>
                        <th>Equipo Inscrito</th>
                        <th>Costo de Registro</th>
                        <th>Fecha de Pago</th>
                        <th>Método</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inscripciones.map((insc, index) => (
                        <tr key={index}>
                          <td className="font-bold text-white text-xs">{insc.campeonato_nombre || `Campeonato ID: ${insc.campeonato_id}`}</td>
                          <td className="text-zinc-300 font-medium text-xs">{insc.nombre_equipo_completo || `Equipo ID: ${insc.equipo_id}`}</td>
                          <td className="text-emerald-400 font-bold text-sm">{formatCurrency(insc.monto)}</td>
                          <td className="text-xs text-zinc-400">
                            {new Date(insc.fecha_pago).toLocaleDateString()}
                          </td>
                          <td>
                            <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-2.5 py-0.5 rounded font-bold uppercase">
                              {insc.metodo_pago}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="glass-card py-16 text-center rounded-xl border border-zinc-900">
                  <p className="text-zinc-500">No hay pagos de inscripción registrados aún.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CAJA CONTABLE */}
          {activeTab === 'historial' && (
            <div className="space-y-6">
              {historial.length > 0 ? (
                <div className="glass-card rounded-xl overflow-hidden">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>Código Transacción</th>
                        <th>Concepto / Descripción</th>
                        <th>Método</th>
                        <th>Fecha Registro</th>
                        <th className="text-right">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historial.map((trx) => {
                        const isIncome = trx.tipo_transaccion?.toLowerCase().includes('ingreso') || trx.tipo?.toLowerCase().includes('ingreso');
                        return (
                          <tr key={trx.id}>
                            <td className="text-zinc-500 font-bold text-xs font-mono">TRX-{trx.id}</td>
                            <td>
                              <div className="font-bold text-white text-xs leading-snug">{trx.concepto}</div>
                              <span className={`inline-block px-1.5 py-0.2 mt-1 rounded text-[8px] font-extrabold uppercase ${
                                isIncome 
                                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/60' 
                                  : 'bg-red-950/40 text-red-400 border border-red-900/60'
                              }`}>
                                {trx.tipo_transaccion || trx.tipo || 'Movimiento'}
                              </span>
                            </td>
                            <td>
                              <span className="text-zinc-300 text-xs font-medium uppercase">
                                {trx.metodo_pago || 'Caja Directa'}
                              </span>
                            </td>
                            <td className="text-xs text-zinc-400">
                              {new Date(trx.fecha_transaccion || trx.fecha).toLocaleString()}
                            </td>
                            <td className={`text-right font-black text-sm ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}>
                              {isIncome ? '+' : '-'}{formatCurrency(trx.monto_transaccion || trx.monto)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="glass-card py-16 text-center rounded-xl border border-zinc-900">
                  <p className="text-zinc-500">No hay movimientos contables en el libro de caja.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* MODAL LOTE */}
      {modalType === 'lote' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-red-glow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-black text-white uppercase tracking-wider">Facturar Lote Mensual</h3>
              <button onClick={() => setModalType(null)} className="text-zinc-500 hover:text-white"><FaTimes /></button>
            </div>
            <form onSubmit={handleGenerarLote} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Mes de Facturación *</label>
                  <select
                    className="sports-input py-2 text-sm bg-zinc-900 border-zinc-800"
                    required
                    value={formLote.mes}
                    onChange={(e) => setFormLote(prev => ({ ...prev, mes: e.target.value }))}
                  >
                    {[...Array(12)].map((_, idx) => (
                      <option key={idx + 1} value={idx + 1}>{getMonthName(idx + 1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Año de Facturación *</label>
                  <input
                    type="number"
                    className="sports-input py-2 text-sm"
                    required
                    value={formLote.anio}
                    onChange={(e) => setFormLote(prev => ({ ...prev, anio: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Monto Mensual Base (COP) *</label>
                <input
                  type="number"
                  className="sports-input py-2 text-sm"
                  required
                  value={formLote.monto_base}
                  onChange={(e) => setFormLote(prev => ({ ...prev, monto_base: e.target.value }))}
                />
              </div>
              <p className="text-zinc-500 text-[11px] leading-relaxed italic">
                * Nota: Esta operación creará cobros pendientes por el monto especificado para TODOS los jugadores del club con estado 'activo'.
              </p>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setModalType(null)} className="btn-secondary py-2 px-4 text-xs">Cancelar</button>
                <button type="submit" disabled={submitting} className="btn-primary py-2 px-4 text-xs">Generar Lote</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PAGO MENSUALIDAD */}
      {modalType === 'pago-mensualidad' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-red-glow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-black text-white uppercase tracking-wider">Recibir Pago Mensualidad</h3>
              <button onClick={() => setModalType(null)} className="text-zinc-500 hover:text-white"><FaTimes /></button>
            </div>
            
            <div className="mb-4 p-3 bg-zinc-900 rounded-lg text-xs space-y-1">
              <div className="text-zinc-500">Jugador: <strong className="text-white">{selectedMensualidad?.nombre_completo || `${selectedMensualidad?.nombre} ${selectedMensualidad?.apellido}`}</strong></div>
              <div className="text-zinc-500">Mes: <strong className="text-white">{getMonthName(selectedMensualidad?.mes)} / {selectedMensualidad?.anio}</strong></div>
              <div className="text-zinc-500">Monto Pendiente: <strong className="text-emerald-400 font-bold">{formatCurrency(selectedMensualidad?.monto_pactado || selectedMensualidad?.monto)}</strong></div>
            </div>

            <form onSubmit={handlePagarMensualidad} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Método de Pago *</label>
                <select
                  className="sports-input py-2 text-sm bg-zinc-900 border-zinc-800"
                  required
                  value={formPago.metodo_pago}
                  onChange={(e) => setFormPago(prev => ({ ...prev, metodo_pago: e.target.value }))}
                >
                  <option value="transferencia">Transferencia Bancaria</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta Crédito/Débito</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Referencia de Transacción / Comprobante</label>
                <input
                  type="text"
                  className="sports-input py-2 text-sm"
                  placeholder="Ej. Nequi TRX-87293"
                  value={formPago.referencia}
                  onChange={(e) => setFormPago(prev => ({ ...prev, referencia: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setModalType(null)} className="btn-secondary py-2 px-4 text-xs">Cancelar</button>
                <button type="submit" disabled={submitting} className="btn-primary py-2 px-4 text-xs">Registrar Pago</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PAGO INSCRIPCION */}
      {modalType === 'pago-inscripcion' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-black text-white uppercase tracking-wider">Pagar Matrícula Torneo</h3>
              <button onClick={() => setModalType(null)} className="text-zinc-500 hover:text-white"><FaTimes /></button>
            </div>
            <form onSubmit={handleRegistrarPagoInscripcion} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Campeonato *</label>
                <select
                  className="sports-input py-2 text-sm bg-zinc-900 border-zinc-800"
                  required
                  value={formPagoInscripcion.campeonato_id}
                  onChange={(e) => setFormPagoInscripcion(prev => ({ ...prev, campeonato_id: e.target.value }))}
                >
                  <option value="">-- Escoger Campeonato --</option>
                  {campeonatos.map(camp => (
                    <option key={camp.id} value={camp.id}>{camp.nombre} ({formatCurrency(camp.valor_inscripcion)})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Equipo del Club *</label>
                <select
                  className="sports-input py-2 text-sm bg-zinc-900 border-zinc-800"
                  required
                  value={formPagoInscripcion.equipo_id}
                  onChange={(e) => setFormPagoInscripcion(prev => ({ ...prev, equipo_id: e.target.value }))}
                >
                  <option value="">-- Escoger Equipo --</option>
                  {equipos.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.nombre_equipo_completo}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Monto de Pago *</label>
                  <input
                    type="number"
                    className="sports-input py-2 text-sm"
                    required
                    value={formPagoInscripcion.monto}
                    onChange={(e) => setFormPagoInscripcion(prev => ({ ...prev, monto: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Método de Pago *</label>
                  <select
                    className="sports-input py-2 text-sm bg-zinc-900 border-zinc-800"
                    required
                    value={formPagoInscripcion.metodo_pago}
                    onChange={(e) => setFormPagoInscripcion(prev => ({ ...prev, metodo_pago: e.target.value }))}
                  >
                    <option value="transferencia">Transferencia Bancaria</option>
                    <option value="efectivo">Efectivo</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setModalType(null)} className="btn-secondary py-2 px-4 text-xs">Cancelar</button>
                <button type="submit" disabled={submitting} className="btn-primary py-2 px-4 text-xs">Registrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Finanzas;
