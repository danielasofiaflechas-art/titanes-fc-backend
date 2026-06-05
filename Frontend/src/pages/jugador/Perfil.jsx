import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUser, 
  FaRunning, 
  FaFileAlt, 
  FaPhone, 
  FaEnvelope, 
  FaShieldAlt, 
  FaBriefcaseMedical
} from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Swal from 'sweetalert2';

const Perfil = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayerProfile = async () => {
      try {
        const res = await API.get(`/jugadores/${user.id}`);
        if (res.data && res.data.success) {
          setProfile(res.data.data);
        }
      } catch (error) {
        console.error('Error al obtener perfil del jugador:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error de carga',
          text: 'No pudimos recuperar tu perfil deportivo del servidor.',
          background: '#161616',
          color: '#fff',
          confirmButtonColor: '#E50914'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerProfile();
  }, [user.id]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Ficha Técnica Oficial</h1>
        <p className="text-zinc-500 text-sm mt-1">Expediente deportivo, biometría y datos de contacto.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PLAYER CARD (FIFA / E-SPORTS DESIGN STYLE) */}
        <div className="lg:col-span-1 flex justify-center">
          <div className="w-full max-w-sm rounded-2xl p-6 bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 shadow-red-glow relative overflow-hidden group">
            
            {/* Red glow details */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-titanes-red/10 rounded-full blur-[30px] pointer-events-none transition-all group-hover:bg-titanes-red/20"></div>
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-titanes-red/10 rounded-full blur-[30px] pointer-events-none"></div>

            {/* Shield and Title */}
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-titanes-red text-lg" />
                <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest">Titanes F.C.</span>
              </div>
              <span className="text-[9px] font-black bg-titanes-red/10 border border-titanes-red/20 text-titanes-red px-2 py-0.5 rounded uppercase">
                {profile?.categoria_nombre || 'Plantel'}
              </span>
            </div>

            {/* Avatar & Technical overall badge mock representation */}
            <div className="flex flex-col items-center py-8">
              <div className="relative flex items-center justify-center">
                <div className="h-28 w-28 rounded-full bg-gradient-to-br from-titanes-red to-red-800 flex items-center justify-center font-black text-white text-3xl shadow-red-glow-sm border border-red-500/25 select-none">
                  {profile?.nombre?.charAt(0)}{profile?.apellido?.charAt(0)}
                </div>
                <div className="absolute -bottom-2 right-1.5 h-8 w-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-titanes-red shadow">
                  <FaRunning />
                </div>
              </div>
              <h2 className="text-xl font-black text-white mt-5 tracking-wide text-center">
                {profile?.nombre?.toUpperCase()} {profile?.apellido?.toUpperCase()}
              </h2>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">
                {profile?.posicion || 'Mediocampista'}
              </span>
            </div>

            {/* ESports Stats Grid */}
            <div className="grid grid-cols-3 gap-2 border-t border-zinc-850 pt-6 text-center text-xs">
              <div className="bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-900">
                <span className="text-[9px] text-zinc-500 font-bold block uppercase tracking-wider">Estatura</span>
                <span className="text-sm font-black text-white block mt-0.5">{profile?.estatura_cm ? `${profile.estatura_cm} cm` : '---'}</span>
              </div>
              <div className="bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-900">
                <span className="text-[9px] text-zinc-500 font-bold block uppercase tracking-wider">Peso</span>
                <span className="text-sm font-black text-white block mt-0.5">{profile?.peso_kg ? `${profile.peso_kg} kg` : '---'}</span>
              </div>
              <div className="bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-900">
                <span className="text-[9px] text-zinc-500 font-bold block uppercase tracking-wider">Habilidad</span>
                <span className="text-sm font-black text-white block mt-0.5">{profile?.pierna_habil || 'Derecha'}</span>
              </div>
            </div>

          </div>
        </div>

        {/* PROFILE INFORMATION DETAILS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* PERSONAL INFO */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-zinc-900 pb-4 flex items-center gap-2 mb-4">
              <FaUser className="text-titanes-red" />
              Datos Personales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-1">
                <span className="text-zinc-500 font-bold text-xs uppercase tracking-wider block">Documento de Identidad</span>
                <p className="text-white font-semibold font-mono">{profile?.documento_identidad || 'Sin registro'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-500 font-bold text-xs uppercase tracking-wider block">Fecha de Nacimiento</span>
                <p className="text-white font-semibold">
                  {profile?.fecha_nacimiento ? new Date(profile.fecha_nacimiento).toLocaleDateString() : 'Sin registro'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-500 font-bold text-xs uppercase tracking-wider block">Correo Electrónico</span>
                <p className="text-white font-semibold flex items-center gap-1.5">
                  <FaEnvelope className="text-zinc-500" />
                  {profile?.email}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-500 font-bold text-xs uppercase tracking-wider block">Número Telefónico</span>
                <p className="text-white font-semibold flex items-center gap-1.5">
                  <FaPhone className="text-zinc-500" />
                  {profile?.telefono || 'Sin registro'}
                </p>
              </div>
            </div>
          </div>

          {/* ACUDIENTE & SEGURO INFO */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-zinc-900 pb-4 flex items-center gap-2 mb-4">
              <FaBriefcaseMedical className="text-titanes-red" />
              Acompañamiento y Seguro Médico
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-1">
                <span className="text-zinc-500 font-bold text-xs uppercase tracking-wider block">Acudiente Responsable</span>
                <p className="text-white font-semibold">{profile?.nombre_acudiente || 'Sin registro'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-500 font-bold text-xs uppercase tracking-wider block">Teléfono Acudiente</span>
                <p className="text-white font-semibold flex items-center gap-1.5">
                  {profile?.telefono_acudiente ? (
                    <>
                      <FaPhone className="text-zinc-500" />
                      {profile.telefono_acudiente}
                    </>
                  ) : (
                    'Sin registro'
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-500 font-bold text-xs uppercase tracking-wider block">EPS / Seguro de Salud</span>
                <p className="text-white font-semibold flex items-center gap-1.5">
                  <FaBriefcaseMedical className="text-zinc-500" />
                  {profile?.eps_seguro || 'Sin registro'}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Perfil;
