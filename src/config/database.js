/**
 * ARCHIVO: config/database.js
 * 
 * PROPÓSITO: Configurar y gestionar la conexión a la base de datos PostgreSQL.
 * 
 * RESPONSABILIDADES:
 * - Crear pool de conexiones para reutilizar conexiones a BD
 * - Cargar credenciales desde variables de entorno
 * - Manejar eventos de conexión y errores
 * - Proporcionar función auxiliar para ejecutar consultas
 * 
 * EL POOL:
 * - Mantiene múltiples conexiones abiertas simultáneamente
 * - Reutiliza conexiones para mejorar el rendimiento
 * - Evita crear una nueva conexión para cada solicitud
 * 
 * CREDENCIALES REQUERIDAS EN .env:
 * - DB_USER: Usuario de PostgreSQL
 * - DB_HOST: Servidor donde está la BD (localhost, IP, URL)
 * - DB_NAME: Nombre de la base de datos
 * - DB_PASSWORD: Contraseña del usuario
 * - DB_PORT: Puerto de PostgreSQL (default: 5432)
 * - DB_SSL: Usar conexión segura (true/false)
 */

const { Pool } = require("pg");
require('dotenv').config(); // Asegúrate de cargar dotenv si no lo haces en otro lado

// Crear pool de conexiones a PostgreSQL con credenciales desde .env
const pool = new Pool({
    // Priorizamos las variables individuales para tener más control
    user: process.env.DB_USER,              // Usuario de BD
    host: process.env.DB_HOST,              // Servidor (localhost, IP, URL)
    database: process.env.DB_NAME,          // Nombre de la base de datos
    password: process.env.DB_PASSWORD,      // Contraseña del usuario
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432, // Puerto (default 5432)
    
    // Configurar SSL para conexiones seguras (importante en producción)
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    
    // Opcional: Límites de conexión para no saturar la BD
    // max: 20,                          // Máximo de conexiones simultáneas
    // idleTimeoutMillis: 30000,         // Cerrar conexión sin uso después de 30s
    // connectionTimeoutMillis: 2000,    // Timeout para crear nueva conexión
});

/**
 * FUNCIÓN: query(text, params)
 * 
 * PROPÓSITO: Ejecutar consultas SQL a la base de datos.
 * 
 * PARÁMETROS:
 * - text: Consulta SQL (ej: "SELECT * FROM users WHERE id = $1")
 * - params: Array de valores para consultas parametrizadas (previene SQL injection)
 * 
 * RETORNA: Resultado de la consulta de PostgreSQL
 * 
 * EJEMPLO:
 * const result = await query("SELECT * FROM users WHERE email = $1", [email]);
 */
const query = (text, params) => pool.query(text, params);

// Evento: Cuando se establece una nueva conexión exitosa
pool.on('connect', () => {
    console.log('🐘 Conectado a la base de datos PostgreSQL');
});

// Evento: Cuando ocurre un error no esperado en el pool
pool.on('error', (err) => {
    console.error('❌ Error inesperado en el pool de Postgres', err);
});

module.exports = { pool, query };