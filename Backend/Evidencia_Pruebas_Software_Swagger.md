# Evidencia 1: Documentar pruebas de software de acuerdo con la planificación

## 1. Portada
- **Nombre del Aprendiz:** [Tu Nombre]
- **Programa de Formación:** [Nombre del Programa]
- **Ficha:** [Número de Ficha]
- **Fecha:** [Fecha de Entrega]

## 2. Introducción
Breve introducción sobre la importancia de documentar las pruebas de software en el ciclo de vida del desarrollo. Mención de cómo la documentación permite validar la calidad, la seguridad y el correcto funcionamiento del backend de **TITANES F.C.**

## 3. Objetivos
- Configurar y desplegar **Swagger UI** en el backend del proyecto.
- Documentar visualmente los endpoints principales (Auth, Usuarios, Jugadores, etc.).
- Probar el correcto funcionamiento de los métodos HTTP (GET, POST, PUT, DELETE).
- Validar la protección de rutas mediante autenticación **JWT (Bearer Token)**.

## 4. Tecnologías utilizadas
- Node.js & Express.js (ES Modules)
- swagger-jsdoc & swagger-ui-express
- MySQL (Base de datos)
- JSON Web Tokens (JWT)

## 5. Explicación de la implementación de Swagger
Se configuró Swagger para escanear automáticamente los comentarios `JSDoc` en la carpeta de rutas (`app/routes/*.js`). Se definió el esquema de seguridad global para inyectar automáticamente el token JWT en cada petición protegida desde la misma interfaz de Swagger.

## 6. Pantallazos de Swagger UI
*(Inserta aquí las capturas de pantalla)*
- [ ] Captura de la pantalla principal de Swagger (`http://localhost:3000/api/docs`).
- [ ] Captura del modal de autorización (ingresando el token JWT).
- [ ] Captura de los esquemas de datos (Schemas).

## 7. Explicación de Pruebas Realizadas
*(Inserta aquí las capturas de las pruebas `Try it out`)*
- **Prueba 1 (POST /auth/login):** Envío de credenciales correctas, obtención del código 200 y el token JWT.
- **Prueba 2 (GET /auth/me):** Inyección del token en el header y obtención de los datos del perfil actual.
- **Prueba 3 (GET /usuarios):** Solicitud a una ruta protegida y validación de permisos de Administrador, visualizando los usuarios de la base de datos.

## 8. Conclusiones
La implementación de Swagger permite validar de forma centralizada y visual que el backend funciona según lo planificado. Facilita enormemente las pruebas manuales antes del desarrollo del frontend y evidencia el robusto diseño del sistema (validaciones, roles, middlewares y ES modules).
