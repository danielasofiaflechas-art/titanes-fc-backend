import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerSchemas } from './swagger.schemas.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TITANES F.C. API',
      version: '1.0.0',
      description: 'Documentación oficial de la API para el sistema de gestión del club deportivo Titanes F.C.',
      contact: {
        name: 'Soporte Titanes F.C.'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor Local (Desarrollo)'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa tu token JWT en el formato: Bearer <token>'
        }
      },
      schemas: swaggerSchemas
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./app/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
