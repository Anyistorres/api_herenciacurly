/**
 * ARCHIVO: repositories/user.repository.js
 * 
 * PROPÓSITO: Gestionar el acceso a datos de usuarios en la base de datos.
 * 
 * RESPONSABILIDADES:
 * - Ejecutar todas las consultas SQL relacionadas con usuarios
 * - Transformar datos de la BD al formato de la aplicación
 * - Evitar duplicación de código SQL en más de un lugar
 * - Mantener separada la lógica de acceso a datos
 * 
 * CONEXIÓN A BD:
 * - Usa el pool de conexiones desde config/database.js
 * - Las consultas son paramétricas para evitar SQL injection
 * 
 * FLUJO GENERAL:
 * 1. Recibe parámetros del servicio
 * 2. Ejecuta query SQL con esos parámetros
 * 3. Transforma los datos con mapRow()
 * 4. Retorna los datos en formato de la aplicación
 */

const { query } = require("../config/database");

/**
 * FUNCIÓN: mapRow(row)
 * 
 * PROPÓSITO: Transformar una fila de la BD al formato de la aplicación.
 * 
 * El problema: PostgreSQL usa snake_case (password_hash, created_at)
 * La solución: Convertir a camelCase (passwordHash, createdAt) para JavaScript
 * 
 * @param {Object} row - Fila obtenida de PostgreSQL
 * @returns {Object} Objeto formateado para la aplicación
 */
const mapRow = (row) => ({
	id: row.id,                     // ID del usuario
	name: row.name,                 // Nombre del usuario
	email: row.email,               // Email del usuario
	passwordHash: row.password_hash, // Contraseña encriptada (conv. de snake_case)
	createdAt: row.created_at,      // Fecha de creación (conv. de snake_case)
});

/**
 * FUNCIÓN: findByEmail(email)
 * 
 * PROPÓSITO: Buscar un usuario por su email en la BD.
 * 
 * CASOS DE USO:
 * - Verificar si un email ya existe durante el registro
 * - Validar el email en el login
 * - Evitar registros duplicados
 * 
 * @param {string} email - Email del usuario a buscar
 * @returns {Promise<Object|null>} Usuario encontrado o null si no existe
 */
const findByEmail = async (email) => {
	// Ejecutar query SELECT con parámetro parametrizado ($1 previene inyección SQL)
	const result = await query(
		"SELECT id, name, email, password_hash, created_at FROM users WHERE email = $1",
		[email] // Valor para reemplazar $1
	);
	
	// Si no hay resultados, retornar null
	if (result.rowCount === 0) return null;
	
	// Si hay resultados, transformar la primera fila y retornarla
	return mapRow(result.rows[0]);
};

/**
 * FUNCIÓN: findById(id)
 * 
 * PROPÓSITO: Buscar un usuario por su ID en la BD.
 * 
 * CASOS DE USO:
 * - Obtener datos del usuario desde el JWT durante autenticación
 * - Obtener el perfil de un usuario autenticado (/me)
 * 
 * @param {number} id - ID del usuario a buscar
 * @returns {Promise<Object|null>} Usuario encontrado o null si no existe
 */
const findById = async (id) => {
	// Ejecutar query SELECT donde id coincida
	const result = await query(
		"SELECT id, name, email, password_hash, created_at FROM users WHERE id = $1",
		[id] // Valor para reemplazar $1
	);
	
	// Si no hay resultados, retornar null
	if (result.rowCount === 0) return null;
	
	// Si hay resultados, transformar y retornar
	return mapRow(result.rows[0]);
};

/**
 * FUNCIÓN: createUser(datos)
 * 
 * PROPÓSITO: Crear un nuevo usuario en la BD.
 * 
 * PROCESO:
 * 1. Inserta nombre, email y contraseña encriptada
 * 2. BD genera automáticamente id y created_at
 * 3. RETURNING retorna los datos del usuario creado
 * 
 * CASOS DE USO:
 * - Registrar un nuevo usuario
 * 
 * @param {Object} datos - Datos del nuevo usuario
 * @param {string} datos.name - Nombre del usuario
 * @param {string} datos.email - Email del usuario
 * @param {string} datos.passwordHash - Contraseña encriptada con bcrypt
 * @returns {Promise<Object>} Usuario creado con ID y fecha de creación
 */
const createUser = async ({ name, email, passwordHash }) => {
	// Ejecutar INSERT con RETURNING para obtener los datos del usuario creado
	const result = await query(
		"INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, password_hash, created_at",
		[name, email, passwordHash] // Valores para $1, $2, $3
	);
	
	// Transformar y retornar el usuario creado
	return mapRow(result.rows[0]);
};

module.exports = {
	findByEmail,  // Buscar usuario por email
	findById,     // Buscar usuario por ID
	createUser,   // Crear nuevo usuario
};
