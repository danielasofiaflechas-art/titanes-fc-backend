import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

// Importar rutas centrales
import routes from './routes/index.js';
// Importar middleware de errores globales
import { errorHandler, notFoundHandler } from './middlewares/middlewares.errors.js';
// Importar Swagger
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

const app = express();

// Middlewares Globales
app.use(helmet()); // Seguridad HTTP
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); // Cross-Origin Resource Sharing con credenciales
app.use(compression()); // Compresión de respuestas HTTP
app.use(morgan('dev')); // Logs de desarrollo
app.use(express.json()); // Parseo de JSON
app.use(express.urlencoded({ extended: true })); // Parseo de urlencoded

// Carga automática de rutas
app.use('/api', routes);

// Configuración de Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: "Documentación API Titanes F.C."
}));

// Manejo de errores centralizado
app.use(notFoundHandler); // 404
app.use(errorHandler); // Manejador de errores globales

export default app;
