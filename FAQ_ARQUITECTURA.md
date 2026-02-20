# 🎓 Preguntas Frecuentes sobre la Arquitectura

## 1. ¿Por qué separar código en controladores, servicios y repositorios?

### Respuesta:
La **separación de responsabilidades** (SRP - Single Responsibility Principle) hace que:

- **Controladores** - Solo manejan HTTP (reciben solicitudes, retornan respuestas)
- **Servicios** - Contienen la lógica de negocio (encriptación, validaciones)
- **Repositorios** - Solo hablan con la BD (queries SQL)

**Ventajas:**
- ✅ Código más limpio y legible
- ✅ Fácil de testear cada capa independientemente
- ✅ Cambios en BD no afectan controladores
- ✅ Reutilizable (un servicio puede usarse en múltiples controladores)
- ✅ Escalable (agregar nuevas funciones sin cambiar código existente)

---

## 2. ¿Qué es un Middleware?

### Respuesta:
Un **middleware** es una función que se ejecuta **antes** de llegar al controlador.

**Analogía:** Como un guardia de seguridad en la entrada de un banco
```
Cliente → Guardia (Middleware) → Empleado (Controlador) → Caja
                ↓
         ¿Tiene autorización?
         - Si: Entra
         - No: Se rechaza
```

**En nuestro proyecto:**
```javascript
router.get("/me", authMiddleware, userController.me);
         ↓         ↓              ↓
      Ruta    Middleware    Controlador
```

El `authMiddleware` verifica el token antes de ejecutar `userController.me`.

---

## 3. ¿Cómo funciona la encriptación de contraseñas con bcrypt?

### Respuesta:
Bcrypt es un algoritmo especial para contraseñas:

```
Contraseña: "miContraseña123"
         ↓
    bcrypt.hash()
    (10 rounds)
         ↓
Hash: "$2b$10$aB3dEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjK1MnOpQrStUvWx..."
```

**14 razones para usar bcrypt:**

1. **Irreversible** - No se puede convertir hash a contraseña
2. **Determinista** - Misma contraseña siempre genera mismo hash (con mismo salt)
3. **Lento** - Tarda segundos (protege contra ataques)
4. **Adaptable** - Se puede aumentar el costo con el tiempo

**Cómo funciona el login:**
```
Cliente: "miContraseña123"
         ↓
bcrypt.compare(contraseña, hashAlmacenado)
         ↓
¿Coinciden? Si → Login exitoso
           No → Credenciales inválidas
```

---

## 4. ¿Qué es JWT y cómo funciona?

### Respuesta:
**JWT (JSON Web Token)** es un token especial para autenticación:

```
JWT = Header.Payload.Signature
      ↓       ↓      ↓
    Tipo   Datos  Verificación
```

**Ejemplo real:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoianVhbiIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Desglosado:**
- **Header:** `{"alg":"HS256","typ":"JWT"}`
- **Payload:** `{"sub":1,"email":"juan","iat":1516239022}`
- **Signature:** `SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`

**Flujo:**
```
1. Login exitoso
   ↓
2. Servidor genera JWT con ID y email
   ↓
3. Envía token al cliente
   ↓
4. Cliente almacena token (localStorage, cookies)
   ↓
5. En cada solicitud, envía token en header
   ↓
6. Servidor verifica que sea válido
   ↓
7. Si es válido, permite acceso
```

---

## 5. ¿Por qué necesitamos un Pool de Conexiones?

### Respuesta:
Sin pool de conexiones:
```
Solicitud 1 → Crear conexión → Query → Cerrar conexión (lento)
Solicitud 2 → Crear conexión → Query → Cerrar conexión (lento)
Solicitud 3 → Crear conexión → Query → Cerrar conexión (lento)
               (Muchísimo tiempo)
```

Con pool de conexiones:
```
        Conexión 1 (reutilizable) ← Solicitud 1
Solicitud 2 → Conexión 2 (reutilizable)
        Conexión 3 (reutilizable) ← Solicitud 3
          (Muy rápido)
```

**Ventajas:**
- ✅ Mucho más rápido
- ✅ Usa menos recursos del servidor
- ✅ Maneja múltiples solicitudes simultáneas

---

## 6. ¿Cuál es la diferencia entre un error 401 y 403?

### Respuesta:

| Código | Significado | Ejemplo |
|--------|-------------|---------|
| **401** | No autenticado (no sé quién eres) | No tienes token o token inválido |
| **403** | No autorizado (sé quién eres pero no tienes permiso) | Queremos implementar roles de usuario |

**En nuestro proyecto:**
- Usamos `401` para problemas con autenticación/token
- Aún no usamos `403` (no hay roles/permisos)

---

## 7. ¿Qué sucede si alguien modifica el JWT?

### Respuesta:
**¡Seguro!** El JWT está protegido por una firma:

```
Token original:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOjEsImVtYWlsIjoianVhbiJ9.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

Alguien cambia el email de "juan" a "admin":
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOjEsImVtYWlsIjoiYWRtaW4ifQ. ← Cambio
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c ← Firma sigue siendo igual

Servidor verifica:
- Payload modificado ≠ Firma original
- ❌ Token rechazado (invalido)
```

**Por eso es importante:** Guardar `JWT_SECRET` en secreto.

---

## 8. ¿Cuándo expira un JWT?

### Respuesta:
El JWT expira según el tiempo configurado en `JWT_EXPIRES_IN`.

**Valor actual:** `1h` (1 hora)

```
10:00 - Login, JWT creado
10:00 a 11:00 - JWT válido
11:01 - JWT expirado
       ↓
Servidor: "Token expirado"
Cliente: Debe hacer login de nuevo
```

**Por qué expiración:**
- 🔒 Si alguien roba el token, solo funciona 1 hora
- 👤 El usuario debe login periódicamente
- 🔄 Se pueden refrescar tokens para sesiones largas

---

## 9. ¿Qué funciones hace cada capa?

### Respuesta:

| Capa | Responsabilidad | Ejemplo |
|------|-----------------|---------|
| **Routes** | Definir endpoints | `POST /api/users/register` → `userController.register` |
| **Middleware** | Validar solicitud | `authMiddleware` valida JWT |
| **Controllers** | Recibir/validar datos | Verificar que `name`, `email`, `password` existan |
| **Services** | Lógica de negocio | Encriptar contraseña, validar email único |
| **Repositories** | Hablar con BD | `INSERT INTO users...`, `SELECT FROM users...` |
| **Models** | Estructura de datos | Clase `User` con propiedades |
| **Config** | Configuración | Pool de conexiones a PostgreSQL |

---

## 10. ¿Cómo agregar nueva funcionalidad? (Cambiar contraseña)

### Respuesta:

**Orden correcto:** Routes → Controllers → Services → Repositories

**1. Repository (acceso a BD)**
```javascript
// repositories/user.repository.js
const updatePassword = async (id, newPasswordHash) => {
  const result = await query(
    "UPDATE users SET password_hash = $1 WHERE id = $2",
    [newPasswordHash, id]
  );
  return result.rowCount > 0;
};
```

**2. Service (lógica de negocio)**
```javascript
// services/user.service.js
const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await userRepository.findById(userId);
  
  // Validar contraseña vieja
  const match = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!match) throw new Error("Contraseña actual incorrecta");
  
  // Encriptar nueva
  const newHash = await bcrypt.hash(newPassword, 10);
  
  // Actualizar
  await userRepository.updatePassword(userId, newHash);
};
```

**3. Controller (entrada HTTP)**
```javascript
// controllers/user.controller.js
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Faltan datos" });
  }
  
  await userService.changePassword(req.user.id, oldPassword, newPassword);
  return res.status(200).json({ message: "Contraseña actualizada" });
};
```

**4. Route (endpoint)**
```javascript
// routes/user.routes.js
router.post("/change-password", authMiddleware, userController.changePassword);
```

---

## 11. ¿Qué son las Consultas Parametrizadas?

### Respuesta:

**MAL (vulnerable a SQL injection):**
```javascript
const query = "SELECT * FROM users WHERE email = '" + email + "'";
// Si email = "admin' OR '1'='1"
// Resultado: "SELECT * FROM users WHERE email = 'admin' OR '1'='1'" 
// Acceso a TODOS los usuarios ❌
```

**BIEN (seguro):**
```javascript
const query = "SELECT * FROM users WHERE email = $1";
const params = [email];
db.query(query, params);
// PostgreSQL trata $1 como parámetro, no como código SQL ✅
```

**En nuestro proyecto:** Usamos `$1, $2, $3...` para todas las queries (seguro).

---

## 12. ¿Cómo manejar errores?

### Respuesta:

**En Services (generar error):**
```javascript
if (existing) {
  const error = new Error("El email ya esta registrado");
  error.statusCode = 409;
  throw error;
}
```

**En Controllers (capturar error):**
```javascript
try {
  const user = await userService.registerUser(...);
  return res.status(201).json(user);
} catch (error) {
  const status = error.statusCode || 500;
  return res.status(status).json({ message: error.message });
}
```

**Códigos HTTP utilizados:**
- `201` - Recurso creado ✅
- `200` - OK ✅
- `400` - Datos inválidos ❌
- `401` - No autenticado ❌
- `404` - No encontrado ❌
- `409` - Conflicto (email duplicado) ❌
- `500` - Error del servidor ❌

---

## 13. ¿Cómo mejorar la seguridad en producción?

### Respuesta:

1. **Variables de entorno**
   - Usa servicios como Heroku Config Vars, AWS Secrets Manager
   - NUNCA hardcodees secrets en el código

2. **HTTPS/SSL**
   - Todas las conexiones deben ser encriptadas
   - Usa certificados SSL válidos

3. **Rate Limiting**
   - Limita intentos de login fallidos
   - Previene ataques de fuerza bruta

4. **CORS**
   - Controla qué dominios pueden acceder tu API
   - Actualmente permitimos todos (`cors()`)

5. **Hash más fuerte**
   - Aumenta rounds de bcrypt (15+) en producción
   - Tarda más pero más seguro

6. **Tokens de refresco**
   - JWT cortos (15 minutos)
   - Refresh tokens largos (7 días)
   - Reduce daño si token es robado

7. **Auditoría**
   - Registra quién hizo qué y cuándo
   - Detecta comportamiento sospechoso

---

**¿Más preguntas? Revisa los comentarios en cada archivo del código.**
