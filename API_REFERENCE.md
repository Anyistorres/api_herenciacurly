# 📚 GUÍA DE REFERENCIA RÁPIDA - API de Usuarios

## 🚀 Inicio Rápido

### 1. Instalación
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
# Copia .env.example a .env y configura con tus valores
cp .env.example .env
```

### 3. Ejecutar en desarrollo
```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

---

## 📡 Endpoints Disponibles

### 1. **Registro de Usuario**
Crear una nueva cuenta de usuario.

**URL:** `POST /api/users/register`

**Body (JSON):**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "miContraseña123"
}
```

**Respuesta exitosa (201):**
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "createdAt": "2026-02-17T10:30:00.000Z"
}
```

**Posibles errores:**
- `400 Bad Request` - Faltan datos requeridos
- `409 Conflict` - Email ya registrado
- `500 Internal Server Error` - Error del servidor

---

### 2. **Login (Obtener Token)**
Autenticar usuario y recibir un token JWT.

**URL:** `POST /api/users/login`

**Body (JSON):**
```json
{
  "email": "juan@example.com",
  "password": "miContraseña123"
}
```

**Respuesta exitosa (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoianVhbkBleCIsImlhdCI6MTcwODEwODAwMCwiZXhwIjoxNzA4MTExNjAwfQ.XXX",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

**Posibles errores:**
- `400 Bad Request` - Faltan datos requeridos
- `401 Unauthorized` - Credenciales inválidas
- `500 Internal Server Error` - Error del servidor

---

### 3. **Obtener Perfil del Usuario Actual**
Recuperar datos del usuario autenticado.

**URL:** `GET /api/users/me`

**Headers requeridos:**
```
Authorization: Bearer <token>
```

**Respuesta exitosa (200):**
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "createdAt": "2026-02-17T10:30:00.000Z"
}
```

**Posibles errores:**
- `401 Unauthorized` - Token no presente, inválido o expirado
- `404 Not Found` - Usuario no encontrado
- `500 Internal Server Error` - Error del servidor

---

## 🔑 Cómo usar Tokens JWT

### Obtener Token
1. Haz login en `/api/users/login`
2. Guarda el `token` de la respuesta

### Usar Token en Solicitudes
Incluye el token en el header `Authorization` de cualquier solicitud protegida:

```bash
curl -H "Authorization: Bearer TOKEN_AQUI" \
  http://localhost:3000/api/users/me
```

**Formato correcto:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Códigos de Error JWT
- `401 No autorizado` - Header Authorization no presente
- `401 Token invalido` - Token expirado o inválido
- `401 Token invalido` - Esquema incorrecto (debe ser "Bearer")

---

## 🧪 Pruebas con cURL

### Registrar usuario
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "miContraseña123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "miContraseña123"
  }'
```

### Obtener perfil (sustituye TOKEN)
```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer TOKEN_AQUI"
```

---

## 🧪 Pruebas con Postman/Insomnia

### 1. Crear colección "Mi API"

### 2. Registrar usuario
- **Método:** POST
- **URL:** `http://localhost:3000/api/users/register`
- **Body (JSON):**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "miContraseña123"
}
```

### 3. Login
- **Método:** POST
- **URL:** `http://localhost:3000/api/users/login`
- **Body (JSON):**
```json
{
  "email": "juan@example.com",
  "password": "miContraseña123"
}
```
- **Guardar el token** de la respuesta

### 4. Obtener Perfil
- **Método:** GET
- **URL:** `http://localhost:3000/api/users/me`
- **Headers:**
  - `Authorization: Bearer PASTE_TOKEN_HERE`

---

## 🏗️ Explicación de Capas (Arquitectura)

```
CLIENTE (Postman, Frontend, etc)
     ↓
ROUTES (user.routes.js)
   Define endpoints
     ↓
MIDDLEWARE (auth.middleware.js)
   Valida autenticación
     ↓
CONTROLLERS (user.controller.js)
   Valida datos, llama servicios
     ↓
SERVICES (user.service.js)
   Lógica de negocio
     ↓
REPOSITORIES (user.repository.js)
   Consultas SQL
     ↓
DATABASE (PostgreSQL)
   Almacena datos
```

---

## 🔒 Seguridad

### Contraseñas
- Se encriptan con bcrypt (10 rounds)
- Nunca se almacenan en texto plano
- Se validan al hacer login

### Tokens JWT
- Expiran en 1 hora (configurable)
- Contienen: User ID y Email (no datos sensibles)
- Se firman con JWT_SECRET

### Headers
- Se valida que exista Authorization
- Se valida que use esquema "Bearer"
- Se verifica que el token sea válido

---

## 📝 Ejemplos de Errores

### Email ya registrado
```json
Status: 409
{
  "message": "El email ya esta registrado"
}
```

### Credenciales inválidas
```json
Status: 401
{
  "message": "Credenciales invalidas"
}
```

### Token expirado
```json
Status: 401
{
  "message": "Token invalido"
}
```

### Usuario no encontrado
```json
Status: 404
{
  "message": "Usuario no encontrado"
}
```

---

## 🐛 Debugging

### Ver logs de la BD
Los logs aparecen en consola:
- `🐘 Conectado a la base de datos PostgreSQL` ✅
- `❌ Error inesperado en el pool de Postgres` ⚠️

### Verificar token JWT
Usa [jwt.io](https://jwt.io) para decodificar y estudiar tokens

### Verificar conexión a BD
```bash
psql -U postgres -h localhost -d mi_base_datos
```

---

## 📚 Recursos Adicionales

- [Express.js Docs](https://expressjs.com)
- [JWT.io](https://jwt.io)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [bcrypt npm](https://www.npmjs.com/package/bcrypt)

---

**Versión:** 1.0.0  
**Última actualización:** 17 de febrero de 2026
