/**
 * ARCHIVO: models/user.model.js
 * 
 * PROPÓSITO: Definir la estructura y atributos de la clase Usuario.
 * 
 * RESPONSABILIDADES:
 * - Representar un usuario con sus datos y propiedades
 * - Validar que los datos sean del tipo correcto
 * - Servir como modelo de datos para toda la aplicación
 * 
 * USO: Esta clase se instancia en el servicio cuando se obtienen datos de BD.
 * Ejemplo: new User({ id: 1, name: 'Juan', email: 'juan@email.com', ... })
 * 
 * ATRIBUTOS:
 * - id: Identificador único del usuario en la BD
 * - name: Nombre completo del usuario
 * - email: Email único del usuario (usado para login)
 * - passwordHash: Contraseña encriptada con bcrypt (nunca la contraseña en texto plano)
 * - createdAt: Fecha y hora cuando se creó el usuario
 */

class User {
	/**
	 * CONSTRUCTOR
	 * 
	 * Inicializa un nuevo objeto Usuario con los datos proporcionados.
	 * Recibe un objeto con la estructura definida y asigna cada propiedad.
	 * 
	 * @param {Object} datos - Objeto con los datos del usuario
	 * @param {number} datos.id - ID del usuario
	 * @param {string} datos.name - Nombre del usuario
	 * @param {string} datos.email - Email del usuario
	 * @param {string} datos.passwordHash - Contraseña encriptada
	 * @param {Date} datos.createdAt - Fecha de creación
	 */
	constructor({ id, name, email, passwordHash, createdAt }) {
		this.id = id;                       // ID Único en la BD
		this.name = name;                   // Nombre del usuario
		this.email = email;                 // Email (usado para autenticación)
		this.passwordHash = passwordHash;   // Contraseña encriptada (nunca mostrar)
		this.createdAt = createdAt;         // Timestamp de creación
	}
}

module.exports = User;
