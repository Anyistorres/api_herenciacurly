/**
 * ARCHIVO: middlewares/auth.middleware.js
 * 
 * PROPÓSITO: Middleware de autenticación que verifica JWT en solicitudes HTTP.
 * 
 * RESPONSABILIDADES:
 * - Validar que el header Authorization esté presente y correcto
 * - Verificar la validez del token JWT
 * - Extraer la información del usuario desde el token
 * - Permitir o denegar el acceso a rutas protegidas
 * 
 * QUÉ ES UN MIDDLEWARE:
 * Un middleware es una función que se ejecuta antes de llegar al controlador.
 * En Express, los middlewares pueden:
 * - Modificar la solicitud (req)
 * - Modificar la respuesta (res)
 * - Llamar a next() para continuar al siguiente middleware/controlador
 * - Enviar una respuesta y terminar la solicitud
 * 
 * FLUJO DE AUTENTICACIÓN:
 * Cliente envía solicitud con header Authorization: Bearer <token>
 *         ↓
 * Middleware usa jwt.verify() para validar el token
 *         ↓
 * Si es válido: agrega req.user con los datos del usuario
 *         ↓
 * Si es inválido: retorna error 401 (Unauthorized)
 * 
 * UBICACIÓN EN RUTAS:
 * - Se aplica a rutas específicas en user.routes.js
 * - Por ejemplo: router.get("/me", authMiddleware, userController.me)
 * 
 * VARIABLES DE ENTORNO REQUERIDAS:
 * - JWT_SECRET: Clave secreta usada para firmar tokens (debe ser la misma que en service)
 */

const jwt = require("jsonwebtoken");

/**
 * FUNCIÓN: authMiddleware(req, res, next)
 * 
 * PROPÓSITO: Verificar que la solicitud tenga un token JWT válido.
 * 
 * PARÁMETROS:
 * - req: Objeto de solicitud HTTP (contiene headers, etc)
 * - res: Objeto de respuesta HTTP
 * - next: Función para continuar al siguiente middleware/controlador
 * 
 * FLUJO:
 * 1. Extraer el header Authorization
 * 2. Separar el esquema ("Bearer") del token
 * 3. Validar que exista el token
 * 4. Verificar la validez del token con jwt.verify()
 * 5. Si es válido, agregar datos del usuario a req.user
 * 6. Si es inválido, retornar error 401
 * 
 * HEADER ESPERADO:
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * 
 * ESTRUCTURA DEL HEADER:
 * - scheme: "Bearer"
 * - token: El actual token JWT
 * 
 * RESPUESTA SI NO ESTÁ AUTENTICADO (401):
 * { "message": "No autorizado" }
 * 
 * RESPUESTA SI TOKEN ES INVÁLIDO (401):
 * { "message": "Token invalido" }
 */
const authMiddleware = (req, res, next) => {
	// Paso 1: Obtener el header Authorization (si no existe, usar string vacío)
	const authHeader = req.headers.authorization || "";
	
	// Paso 2: Dividir el header en dos partes
	// Formato esperado: "Bearer <token>"
	// Resultado: ["Bearer", "<token>"]
	const [scheme, token] = authHeader.split(" ");

	// Paso 3: Validar que el esquema sea "Bearer" y que exista el token
	if (scheme !== "Bearer" || !token) {
		// Si faltan datos, retornar 401 (Unauthorized)
		return res.status(401).json({ message: "No autorizado" });
	}

	try {
		// Paso 4: Verificar la validez del token usando la clave secreta
		// jwt.verify() lanza una excepción si el token es inválido o está expirado
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		
		// Paso 5: Si el token es válido, extraer la información del usuario
		// payload.sub es el ID del usuario ("sub" = subject, estándar de JWT)
		// payload.email es el email del usuario
		req.user = { 
			id: payload.sub,        // ID del usuario (extraído del token)
			email: payload.email    // Email del usuario (extraído del token)
		};
		
		// Paso 6: Continuar al siguiente middleware/controlador
		return next();
	} catch (error) {
		// Si hay error en la verificación (token inválido, expirado, etc)
		return res.status(401).json({ message: "Token invalido" });
	}
};

module.exports = authMiddleware;
