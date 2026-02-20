/**
 * ARCHIVO: services/user.service.js
 * 
 * PROPÓSITO: Contener la lógica de negocio relacionada con usuarios.
 * 
 * RESPONSABILIDADES:
 * - Validar reglas de negocio (ej: email único)
 * - Encriptar contraseñas con bcrypt
 * - Generar y verificar JWT para autenticación
 * - Coordinar llamadas entre controladores y repositorios
 * - Manejo de errores con códigos HTTP apropiados
 * 
 * CONEXIÓN CON OTRAS CAPAS:
 * - Recibe parámetros desde CONTROLLERS
 * - Usa REPOSITORIES para acceso a BD
 * - Retorna datos al CONTROLLER o lanza errores
 * 
 * SEGURIDAD:
 * - Las contraseñas se encriptan con bcrypt (nunca se almacenan en texto plano)
 * - Los tokens JWT contienen solo ID y email (datos no sensibles)
 * - Los errores son genéricos para no revelar información de seguridad
 * 
 * VARIABLES DE ENTORNO REQUERIDAS:
 * - JWT_SECRET: Clave secreta para firmar tokens JWT
 * - JWT_EXPIRES_IN: Tiempo de expiración del token (ej: "1h", "7d")
 */

const bcrypt = require("bcrypt");                      // Librería para encriptar contraseñas
const jwt = require("jsonwebtoken");                  // Librería para crear y verificar JWT
const User = require("../models/user.model");         // Clase que representa un usuario
const userRepository = require("../repositories/user.repository"); // Acceso a datos

// Obtener tiempo de expiración del token desde .env o usar default de 1 hora
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

/**
 * FUNCIÓN: registerUser(datos)
 * 
 * PROPÓSITO: Registrar un nuevo usuario en el sistema.
 * 
 * PROCESO:
 * 1. Validar que el email no esté ya registrado
 * 2. Encriptar la contraseña con bcrypt (10 rounds)
 * 3. Guardar el usuario en la BD
 * 4. Retornar el usuario creado (SIN la contraseña)
 * 
 * ERRORES POSIBLES:
 * - Email ya registrado (status 409 Conflict)
 * 
 * @param {Object} datos - Datos del nuevo usuario
 * @param {string} datos.name - Nombre del usuario
 * @param {string} datos.email - Email (debe ser único)
 * @param {string} datos.password - Contraseña en texto plano (se encriptará)
 * @returns {Promise<User>} Usuario creado (sin contraseña)
 * @throws {Error} Si email ya existe
 */
const registerUser = async ({ name, email, password }) => {
	// Paso 1: Buscar si el email ya está registrado
	const existing = await userRepository.findByEmail(email);
	if (existing) {
		// Si ya existe, crear un error con status 409 (Conflict)
		const error = new Error("El email ya esta registrado");
		error.statusCode = 409; // Conflict: El recurso ya existe
		throw error;
	}

	// Paso 2: Encriptar la contraseña con bcrypt (10 rounds = seguridad-velocidad balanceada)
	// A más rounds, más seguro pero más lento. 10 es el estándar recomendado.
	const passwordHash = await bcrypt.hash(password, 10);
	
	// Paso 3: Crear el usuario en la BD con la contraseña encriptada
	const user = await userRepository.createUser({ name, email, passwordHash });
	
	// Paso 4: Retornar el usuario como instancia de la clase User
	return new User(user);
};

/**
 * FUNCIÓN: loginUser(credenciales)
 * 
 * PROPÓSITO: Autenticar un usuario y generar un token JWT.
 * 
 * PROCESO:
 * 1. Buscar el usuario por email
 * 2. Verificar que la contraseña es correcta (comparar con bcrypt)
 * 3. Generar un token JWT con la información del usuario
 * 4. Retornar tanto el token como los datos del usuario
 * 
 * TOKEN JWT:
 * - Contiene: sub (user ID) y email
 * - Firmado con JWT_SECRET
 * - Expira en JWT_EXPIRES_IN (ej: 1 hora)
 * - Se envía en el header: "Authorization: Bearer <token>"
 * 
 * ERRORES POSIBLES:
 * - Email no encontrado (status 401 Unauthorized)
 * - Contraseña incorrecta (status 401 Unauthorized)
 * - Los mensajes son genéricos por seguridad
 * 
 * @param {Object} credenciales - Datos para login
 * @param {string} credenciales.email - Email del usuario
 * @param {string} credenciales.password - Contraseña (texto plano)
 * @returns {Promise<Object>} { token: JWT, user: Usuario }
 * @throws {Error} Si credenciales son inválidas
 */
const loginUser = async ({ email, password }) => {
	// Paso 1: Buscar el usuario en la BD
	const user = await userRepository.findByEmail(email);
	if (!user) {
		// Si no existe, retornar error genérico (sin mencionar "email no encontrado")
		const error = new Error("Credenciales invalidas");
		error.statusCode = 401; // Unauthorized
		throw error;
	}

	// Paso 2: Comparar la contraseña del usuario con la encriptada en BD
	// bcrypt.compare() retorna true si coinciden, false si no
	const passwordMatch = await bcrypt.compare(password, user.passwordHash);
	if (!passwordMatch) {
		// Si la contraseña no coincide, retornar error genérico
		const error = new Error("Credenciales invalidas");
		error.statusCode = 401; // Unauthorized
		throw error;
	}

	// Paso 3: Generar token JWT con la información del usuario
	// sub: subject (ID del usuario) - estándar de JWT
	// email: email del usuario para rápido acceso
	const token = jwt.sign(
		{ sub: user.id, email: user.email },  // Payload: datos del usuario
		process.env.JWT_SECRET,                // Clave secreta para firmar
		{ expiresIn: JWT_EXPIRES_IN }          // Opciones: cuándo expira
	);

	// Paso 4: Retornar token y datos del usuario (sin contraseña)
	return {
		token,                      // Token JWT para usar en futuras solicitudes
		user: new User(user),       // Datos del usuario autenticado
	};
};

/**
 * FUNCIÓN: getProfile(userId)
 * 
 * PROPÓSITO: Obtener los datos del perfil del usuario autenticado.
 * 
 * PROCESO:
 * 1. Buscar el usuario en la BD por ID
 * 2. Si existe, retornar sus datos
 * 3. Si no existe, lanzar error (usuario puede haber sido eliminado)
 * 
 * CASOS DE USO:
 * - Endpoint GET /api/users/me (requiere JWT en header)
 * - El ID viene del JWT descodificado por el middleware auth
 * 
 * ERRORES POSIBLES:
 * - Usuario no encontrado (status 404 NotFound)
 * 
 * @param {number} userId - ID del usuario (obtenido del JWT)
 * @returns {Promise<User>} Datos del usuario autenticado
 * @throws {Error} Si el usuario no existe (puede haber sido eliminado)
 */
const getProfile = async (userId) => {
	// Buscar el usuario en la BD
	const user = await userRepository.findById(userId);
	if (!user) {
		// Si no existe, retornar error 404
		const error = new Error("Usuario no encontrado");
		error.statusCode = 404; // Not Found
		throw error;
	}
	
	// Retornar los datos del usuario
	return new User(user);
};

module.exports = {
	registerUser, // Registrar nuevo usuario
	loginUser,    // Autenticar usuario y generar JWT
	getProfile,   // Obtener datos del usuario autenticado
};
