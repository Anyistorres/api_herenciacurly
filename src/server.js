/**
 * ARCHIVO: server.js
 * 
 * PROPÓSITO: Punto de entrada principal de la aplicación.
 * 
 * RESPONSABILIDADES:
 * - Cargar variables de entorno desde archivo .env
 * - Importar la aplicación Express configurada
 * - Verificar conexión con la base de datos
 * - Iniciar el servidor en un puerto específico
 * 
 * FLUJO:
 * 1. Cargar variables de entorno (.env)
 * 2. Conectar a PostgreSQL
 * 3. Iniciar servidor en puerto especificado
 * 4. Mostrar mensaje de confirmación
 * 
 * VARIABLES REQUERIDAS:
 * - PORT: Puerto del servidor (default: 3000)
 * - DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT: Credenciales de BD
 */

require("dotenv").config();
const app = require("./app");
const { pool } = require("./config/database");

const PORT = process.env.PORT || 3000;

// Verificar que la conexión a la base de datos esté disponible
pool.query("SELECT NOW()")

// Iniciar el servidor HTTP escuchando en el puerto especificado
app.listen(PORT, () => {
  console.log(`✋Servidor corriendo en puerto ${PORT}`);
});
