import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag para evitar múltiples intentos de refresh simultáneamente
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  isRefreshing = false;
  failedQueue = [];
};

// Interceptor para agregar token a peticiones salientes
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('titanes_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globales (renovación automática de token)
API.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente retornarla
    return response;
  },
  async (error) => {
    const { response, config } = error;
    const originalRequest = config;
    
    // Si la API responde con 401 (No autorizado o expirado)
    if (response && response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si ya se está refrescando, encolar esta petición
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return API(originalRequest);
          })
          .catch(error => Promise.reject(error));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('titanes_refresh_token');

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Intentar renovar el token
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (refreshResponse.data && refreshResponse.data.success) {
          const { token, refreshToken: newRefreshToken } = refreshResponse.data.data;

          // Guardar nuevo token y refresh token
          localStorage.setItem('titanes_token', token);
          localStorage.setItem('titanes_refresh_token', newRefreshToken);

          // Procesar cola de peticiones pendientes
          processQueue(null, token);

          // Reintentar la petición original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        } else {
          throw new Error('Refresh failed');
        }
      } catch (err) {
        // Si el refresh falla, hacer logout
        localStorage.removeItem('titanes_token');
        localStorage.removeItem('titanes_user');
        localStorage.removeItem('titanes_refresh_token');

        processQueue(err, null);

        // Redirigir al login si no estamos ya allí
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?expired=true';
        }

        return Promise.reject(err);
      }
    }

    // Para otros errores 401 (por ejemplo, en login)
    if (response && response.status === 401 && !isRefreshing) {
      localStorage.removeItem('titanes_token');
      localStorage.removeItem('titanes_user');
      localStorage.removeItem('titanes_refresh_token');

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?unauthorized=true';
      }
    }

    return Promise.reject(error);
  }
);

export default API;
