/**
 * ARCHIVO: app.js
 * 
 * PROPÓSITO: Configuración principal de la aplicación Express.
 * 
 * RESPONSABILIDADES:
 * - Crear instancia de la aplicación Express
 * - Registrar middlewares globales (CORS, parseo JSON)
 * - Conectar rutas de la API
 * - Exportar la aplicación para ser usada en server.js
 * 
 * FLUJO: Las solicitudes HTTP pasan a través de los middlewares
 *        y luego son enrutadas a los controladores correspondientes.
 * 
 * NOTA: Este archivo NO inicia el servidor, solo lo configura.
 */

const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const roleRoutes = require("./routes/role.routes");

// Crear instancia de la aplicación Express
const app = express();

// Middleware: Permitir solicitudes desde otros dominios (CORS)
app.use(cors());

// Middleware: Parsear el cuerpo de solicitudes JSON automáticamente
app.use(express.json());

// Registrar rutas de usuarios bajo el prefijo /api/users
app.use("/api/users", userRoutes);

app.use("/api/roles", roleRoutes);

// Exportar la aplicación para que server.js pueda iniciarla
module.exports = app;
