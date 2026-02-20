/**
 * ARCHIVO: controllers/user.controller.js
 * 
 * PROPÓSITO: Manejar las solicitudes HTTP relacionadas con usuarios.
 * 
 * RESPONSABILIDADES:
 * - Recibir datos del cliente (req.body, req.params, etc)
 * - Validar que los datos requeridos estén presentes
 * - Llamar al servicio para ejecutar lógica de negocio
 * - Retornar respuestas HTTP con datos y códigos de estado
 * - Manejo de errores y excepciones
 * 
 * PATRÓN:
 * 1. Validación de datos de entrada
 * 2. Llamada al servicio
 * 3. Construcción de respuesta
 * 4. Envío de respuesta HTTP
 * 5. Manejo de excepciones
 * 
 * CÓDIGOS HTTP UTILIZADOS:
 * - 201: Recurso creado (POST exitoso)
 * - 200: OK (solicitud exitosa GET/POST)
 * - 400: Bad Request (datos inválidos)
 * - 401: Unauthorized (No autenticado)
 * - 404: Not Found (Recurso no existe)
 * - 409: Conflict (Ej: email ya registrado)
 * - 500: Internal Server Error (Error del servidor)
 */

const userService = require("../services/user.service");

/**
 * FUNCIÓN: register(req, res)
 * 
 * PROPÓSITO: Manejar el registro de nuevos usuarios.
 * 
 * ENDPOINT: POST /api/users/register
 * 
 * FLUJO:
 * 1. Extraer name, email, password del cuerpo de la solicitud
 * 2. Validar que los tres campos estén presentes
 * 3. Llamar al servicio para registrar el usuario
 * 4. Si es exitoso, retornar el usuario creado (sin contraseña) con status 201
 * 5. Si hay error, retornar mensaje de error con status apropiado
 * 
 * BODY DE SOLICITUD:
 * {
 *   "name": "Juan Pérez",
 *   "email": "juan@example.com",
 *   "password": "miContraseña123"
 * }
 * 
 * RESPUESTA EXITOSA (201):
 * {
 *   "id": 1,
 *   "name": "Juan Pérez",
 *   "email": "juan@example.com",
 *   "createdAt": "2026-02-17T10:30:00.000Z"
 * }
 * 
 * RESPUESTAS DE ERROR:
 * - 400: Faltan datos requeridos
 * - 409: Email ya registrado
 * - 500: Error del servidor
 */
const register = async (req, res) => {
	try {
		// Extraer datos del cuerpo de la solicitud
		const { name, email, password } = req.body;
		
		// Validar que todos los datos requeridos estén presentes
		if (!name || !email || !password) {
			return res.status(400).json({ message: "Faltan datos requeridos" });
		}

		// Llamar al servicio para registrar el usuario
		const user = await userService.registerUser({ name, email, password });
		
		// Retornar el usuario creado con status 201 (Created)
		return res.status(201).json({
			id: user.id,
			name: user.name,
			email: user.email,
			createdAt: user.createdAt,
		});
	} catch (error) {
		// Usar status del error si existe, si no usar 500 (Internal Server Error)
		const status = error.statusCode || 500;
		return res.status(status).json({ message: error.message });
	}
};

/**
 * FUNCIÓN: login(req, res)
 * 
 * PROPÓSITO: Manejar la autenticación de usuarios.
 * 
 * ENDPOINT: POST /api/users/login
 * 
 * FLUJO:
 * 1. Extraer email y password del cuerpo de la solicitud
 * 2. Validar que ambos campos estén presentes
 * 3. Llamar al servicio para autenticar el usuario
 * 4. Si es exitoso, retornar token JWT y datos del usuario (status 200)
 * 5. Si hay error, retornar mensaje de error con status 401
 * 
 * BODY DE SOLICITUD:
 * {
 *   "email": "juan@example.com",
 *   "password": "miContraseña123"
 * }
 * 
 * RESPUESTA EXITOSA (200):
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "user": {
 *     "id": 1,
 *     "name": "Juan Pérez",
 *     "email": "juan@example.com"
 *   }
 * }
 * 
 * RESPUESTAS DE ERROR:
 * - 400: Faltan datos requeridos
 * - 401: Credenciales inválidas (email no existe o contraseña incorrecta)
 * - 500: Error del servidor
 * 
 * CÓMO USAR EL TOKEN:
 * - Guardar el token en el cliente
 * - Enviar en header de futuras solicitudes:
 *   Authorization: Bearer <token>
 */
const login = async (req, res) => {
	try {
		// Extraer credenciales del cuerpo de la solicitud
		const { email, password } = req.body;
		
		// Validar que ambos campos estén presentes
		if (!email || !password) {
			return res.status(400).json({ message: "Faltan datos requeridos" });
		}

		// Llamar al servicio para autenticar el usuario
		const { token, user } = await userService.loginUser({ email, password });
		
		// Retornar token y datos del usuario con status 200 (OK)
		return res.status(200).json({
			token,                  // Token JWT para usar en futuras solicitudes
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (error) {
		// Usar status del error si existe, si no usar 500
		const status = error.statusCode || 500;
		return res.status(status).json({ message: error.message });
	}
};

/**
 * FUNCIÓN: me(req, res)
 * 
 * PROPÓSITO: Obtener los datos del perfil del usuario autenticado.
 * 
 * ENDPOINT: GET /api/users/me (Requiere autenticación)
 * 
 * AUTENTICACIÓN:
 * - Este endpoint es protegido por el middleware authMiddleware
 * - El middleware verifica el JWT en el header Authorization
 * - Si es válido, agrega req.user con los datos del usuario
 * 
 * FLUJO:
 * 1. Verificar que el usuario está autenticado (realizado por middleware)
 * 2. Extraer userId de req.user (asignado por el middleware)
 * 3. Llamar al servicio para obtener el perfil
 * 4. Retornar los datos del usuario con status 200
 * 
 * HEADER REQUERIDO:
 * Authorization: Bearer <token-jwt>
 * 
 * RESPUESTA EXITOSA (200):
 * {
 *   "id": 1,
 *   "name": "Juan Pérez",
 *   "email": "juan@example.com",
 *   "createdAt": "2026-02-17T10:30:00.000Z"
 * }
 * 
 * RESPUESTAS DE ERROR:
 * - 401: No autorizado (sin token o token inválido) - Manejado por middleware
 * - 404: Usuario no encontrado
 * - 500: Error del servidor
 */
const me = async (req, res) => {
	try {
		// Obtener el ID del usuario del objeto req.user (asignado por authMiddleware)
		const user = await userService.getProfile(req.user.id);
		
		// Retornar los datos del usuario con status 200 (OK)
		return res.status(200).json({
			id: user.id,
			name: user.name,
			email: user.email,
			createdAt: user.createdAt,
		});
	} catch (error) {
		// Usar status del error si existe, si no usar 500
		const status = error.statusCode || 500;
		return res.status(status).json({ message: error.message });
	}
};

module.exports = {
	register, // POST /api/users/register - Registrar nuevo usuario
	login,    // POST /api/users/login - Autenticar usuario
	me,       // GET /api/users/me - Obtener perfil del usuario autenticado
};
