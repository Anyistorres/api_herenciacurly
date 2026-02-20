/**
 * ARCHIVO: routes/user.routes.js
 * 
 * PROPÓSITO: Definir todas las rutas (endpoints) relacionadas con usuarios.
 * 
 * RESPONSABILIDADES:
 * - Crear instancia del router de Express
 * - Definir los endpoints disponibles
 * - Conectar cada ruta con su controlador correspondiente
 * - Aplicar middlewares de autenticación a rutas protegidas
 * 
 * QUÉ SON RUTAS:
 * Las rutas definen los endpoints HTTP disponibles en la API.
 * Cada ruta especifica:
 * - El método HTTP (GET, POST, PUT, DELETE, etc)
 * - La ruta URL
 * - Middlewares (opcional) - funciones que se ejecutan antes del controlador
 * - El controlador a ejecutar
 * 
 * FLUJO DE UNA SOLICITUD:
 * Cliente hace solicitud HTTP
 *         ↓
 * Express recibe la solicitud
 *         ↓
 * Busca la ruta que coincida
 *         ↓
 * Ejecuta middlewares asociados (ej: autenticación)
 *         ↓
 * Ejecuta el controlador
 *         ↓
 * Retorna respuesta al cliente
 * 
 * RUTAS DEFINIDAS EN ESTE ARCHIVO:
 * 1. POST /api/users/register    - Registrar nuevo usuario (sin autenticación)
 * 2. POST /api/users/login       - Autenticar usuario (sin autenticación)
 * 3. GET  /api/users/me          - Obtener perfil del usuario (requiere JWT)
 */

const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Crear instancia del router de Express
const router = express.Router();

/**
 * RUTA: POST /api/users/register
 * 
 * PROPÓSITO: Permitir que nuevos usuarios se registren en el sistema.
 * 
 * AUTENTICACIÓN: No requerida
 * 
 * CONTROLADOR: userController.register
 * 
 * FLUJO:
 * 1. Cliente envía POST con datos (name, email, password)
 * 2. Express ruete al controlador register
 * 3. Controlador valida datos
 * 4. Servicio encripta contraseña y crea usuario
 * 5. Respuesta con usuario creado (status 201)
 * 
 * EJEMPLO DE SOLICITUD:
 * POST http://localhost:3000/api/users/register
 * {
 *   "name": "Juan Pérez",
 *   "email": "juan@example.com",
 *   "password": "miContraseña123"
 * }
 */
router.post("/register", userController.register);

/**
 * RUTA: POST /api/users/login
 * 
 * PROPÓSITO: Permitir que usuarios autenticados obtengan un token JWT.
 * 
 * AUTENTICACIÓN: No requerida (pero se validan credenciales)
 * 
 * CONTROLADOR: userController.login
 * 
 * FLUJO:
 * 1. Cliente envía POST con credenciales (email, password)
 * 2. Express ruete al controlador login
 * 3. Servicio valida credenciales
 * 4. Si son válidas, genera token JWT
 * 5. Respuesta con token y datos del usuario (status 200)
 * 
 * EJEMPLO DE SOLICITUD:
 * POST http://localhost:3000/api/users/login
 * {
 *   "email": "juan@example.com",
 *   "password": "miContraseña123"
 * }
 * 
 * RESPUESTA EXITOSA:
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "user": {
 *     "id": 1,
 *     "name": "Juan Pérez",
 *     "email": "juan@example.com"
 *   }
 * }
 */
router.post("/login", userController.login);

/**
 * RUTA: GET /api/users/me
 * 
 * PROPÓSITO: Obtener los datos del perfil del usuario actualmente autenticado.
 * 
 * AUTENTICACIÓN: REQUERIDA - Usa token JWT en header Authorization
 * 
 * MIDDLEWARE: authMiddleware
 * - Valida que el token sea correcto
 * - Agrega información del usuario a req.user
 * - Si el token es inválido, retorna error 401
 * 
 * CONTROLADOR: userController.me
 * 
 * FLUJO:
 * 1. Cliente envía GET con header Authorization: Bearer <token>
 * 2. Middleware authMiddleware valida el token
 * 3. Si es válido, extrae ID del usuario
 * 4. Controlador obtiene perfil del usuario
 * 5. Respuesta con datos del usuario (status 200)
 * 
 * EJEMPLO DE SOLICITUD:
 * GET http://localhost:3000/api/users/me
 * Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * 
 * RESPUESTA EXITOSA:
 * {
 *   "id": 1,
 *   "name": "Juan Pérez",
 *   "email": "juan@example.com",
 *   "createdAt": "2026-02-17T10:30:00.000Z"
 * }
 * 
 * RESPUESTA SI NO ESTÁ AUTENTICADO:
 * Status: 401
 * { "message": "No autorizado" }
 */
router.get("/me", authMiddleware, userController.me);

// Exportar el router para que app.js pueda usarlo
module.exports = router;
