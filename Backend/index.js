import dotenv from 'dotenv';
dotenv.config();
import app from './app/server.js';
import config from './app/config/index.js';
import db from './app/config/db.js';

const PORT = config.PORT;

// Inicialización del servidor y base de datos
const startServer = async () => {
    try {
        // Verificar conexión a la BD
        await db.getConnection();
        console.log('✅ Base de datos conectada correctamente');

        // Levantar servidor Express
        app.listen(PORT, () => {
            console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
            console.log('✅ JWT inicializado');
            console.log('✅ Middlewares cargados');
            console.log('✅ Rutas cargadas correctamente');
            console.log('✅ TITANES F.C Backend iniciado');
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error.message);
        process.exit(1);
    }
};

startServer();
