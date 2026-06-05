import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/axios';
import Swal from 'sweetalert2';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar la sesión al cargar el sitio
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('titanes_token');
      const storedUser = localStorage.getItem('titanes_user');

      if (token && storedUser) {
        try {
          // Consultar perfil fresco para validar token en el backend
          const response = await API.get('/auth/me');
          if (response.data && response.data.success) {
            const updatedUser = response.data.data;
            setUser(updatedUser);
            localStorage.setItem('titanes_user', JSON.stringify(updatedUser));
          } else {
            // Limpieza si no es exitoso
            clearSession();
          }
        } catch (error) {
          console.error('Error al validar sesión persistente:', error);
          clearSession();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const clearSession = () => {
    localStorage.removeItem('titanes_token');
    localStorage.removeItem('titanes_user');
    localStorage.removeItem('titanes_refresh_token');
    setUser(null);
  };

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      
      if (response.data && response.data.success) {
        const { token, refreshToken, usuario } = response.data.data;
        
        localStorage.setItem('titanes_token', token);
        localStorage.setItem('titanes_refresh_token', refreshToken);
        localStorage.setItem('titanes_user', JSON.stringify(usuario));
        
        setUser(usuario);
        
        return {
          success: true,
          usuario
        };
      } else {
        throw new Error(response.data?.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Error de conexión';
      throw new Error(errMsg);
    }
  };

  const logout = async () => {
    try {
      // Intentar avisar al backend del cierre
      await API.post('/auth/logout');
    } catch (error) {
      console.warn('Advertencia en el cierre de sesión remoto:', error.message);
    } finally {
      clearSession();
      Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        text: '¡Vuelve pronto a TITANES F.C.!',
        background: '#161616',
        color: '#fff',
        confirmButtonColor: '#E50914',
      }).then(() => {
        window.location.href = '/login';
      });
    }
  };

  const hasPermission = (permission) => {
    if (!user || !user.permisos) return false;
    // Si tiene todos los permisos o el permiso específico
    return user.permisos.includes('usuarios.all') || user.permisos.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
