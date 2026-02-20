# Mi API Node.js

## 📋 Descripción del Proyecto

API REST construida con **Node.js y Express** que proporciona funcionalidades de autenticación y gestión de usuarios. Implementa una arquitectura de capas limpia para separar responsabilidades y mantener el código escalable y mantenible.

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue un patrón de **arquitectura de capas** (Layered Architecture) con la siguiente estructura:

```
┌─────────────────────────────────────────────────────────┐
│                   ROUTES (Rutas HTTP)                   │
│  (/api/users/register, /api/users/login, /api/users/me) │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│               CONTROLLERS (Controladores)                │
│  (Valida datos, llama servicios, retorna respuestas)    │
└────────────────────┬────────────────────────────────────┘
                     │
       ┌─────────────┴─────────────┐
       │                           │
       ▼                           ▼
┌─────────────────┐      ┌──────────────────┐
│  MIDDLEWARES    │      │  SERVICES        │
│  (Auth, CORS)   │      │  (Lógica negocio)│
└─────────────────┘      └─────────┬────────┘
                                   │
┌──────────────────────────────────▼───────────────────┐
│        REPOSITORIES (Acceso a datos)                 │
│  (Realiza queries a la base de datos)               │
└──────────────────────────────────┬────────────────────┘
                                   │
┌──────────────────────────────────▼───────────────────┐
│        DATABASE (PostgreSQL)                         │
│  (Almacena datos persistentes de usuarios)           │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Carpetas

```
mi-api-node/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de conexión a PostgreSQL
│   ├── controllers/
│   │   └── user.controller.js   # Maneja las solicitudes HTTP de usuarios
│   ├── middlewares/
│   │   └── auth.middleware.js   # Verifica autenticación con JWT
│   ├── models/
│   │   └── user.model.js        # Definición de la clase Usuario
│   ├── repositories/
│   │   └── user.repository.js   # Acceso a datos de usuarios en BD
│   ├── routes/
│   │   └── user.routes.js       # Define endpoints de usuarios
│   ├── services/
│   │   └── user.service.js      # Lógica de negocio de usuarios
│   ├── app.js                   # Configuración principal de Express
│   └── server.js                # Punto de entrada de la aplicación
├── package.json                 # Dependencias y scripts
└── README.md                    # Este archivo
```

---

## 🔄 Flujo de una Solicitud

### Ejemplo: Registro de Usuario (POST /api/users/register)

```
1. Cliente envía: { name, email, password }
                     ↓
2. ROUTE (user.routes.js)
   Recibe solicitud → router.post("/register", userController.register)
                     ↓
3. CONTROLLER (user.controller.js)
   Valida datos → Llama userService.registerUser()
                     ↓
4. SERVICE (user.service.js)
   Encripta contraseña con bcrypt
   Verifica si email existe
   Crea usuario nuevo
                     ↓
5. REPOSITORY (user.repository.js)
   Ejecuta INSERT en tabla users
   Retorna usuario creado
                     ↓
6. DATABASE (PostgreSQL)
   Guarda usuario con id, name, email, password_hash, created_at
                     ↓
7. Respuesta retorna al cliente
   Status: 201 + datos del usuario
```

---

## 🔐 Autenticación

El proyecto usa **JWT (JSON Web Tokens)** para seguridad:

- **Registro**: El usuario se registra con email y contraseña
- **Login**: Retorna un token JWT válido por 1 hora
- **Acceso Protegido**: Rutas protegidas verifican el token antes de acceder

**Header requerido para acceso protegido:**
```
Authorization: Bearer <token>
```

---

## 📚 Descripción de Capas

### 1. **ROUTES** (src/routes/user.routes.js)
- Define los endpoints HTTP disponibles
- Conecta rutas con controladores
- Aplica middlewares de autenticación

### 2. **CONTROLLERS** (src/controllers/user.controller.js)
- Recibe y valida datos de solicitudes HTTP
- Llama a servicios para ejecutar lógica
- Retorna respuestas con códigos de estado HTTP

### 3. **SERVICES** (src/services/user.service.js)
- Contiene la lógica de negocio principal
- Encripta contraseñas
- Genera tokens JWT
- Valida reglas de negocio (ej: email único)

### 4. **REPOSITORIES** (src/repositories/user.repository.js)
- Acceso exclusivo a la base de datos
- Mantiene queries SQL
- Transforma datos de BD a modelos

### 5. **MODELS** (src/models/user.model.js)
- Define la estructura de datos
- Representa un usuario con sus atributos

### 6. **MIDDLEWARES** (src/middlewares/auth.middleware.js)
- Verifica autenticación JWT
- Extrae información del token
- Permite o niega acceso a rutas protegidas

### 7. **CONFIG** (src/config/database.js)
- Configura conexión a PostgreSQL
- Maneja pool de conexiones
- Eventos de conexión/error

---

## 🚀 Endpoints Disponibles

### Registro
- **Método**: POST
- **Ruta**: `/api/users/register`
- **Body**: `{ name, email, password }`
- **Respuesta**: Usuario creado (201)

### Login
- **Método**: POST
- **Ruta**: `/api/users/login`
- **Body**: `{ email, password }`
- **Respuesta**: Token JWT + datos usuario (200)

### Perfil (Requiere Autenticación)
- **Método**: GET
- **Ruta**: `/api/users/me`
- **Header**: `Authorization: Bearer <token>`
- **Respuesta**: Datos del usuario autenticado (200)

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Propósito |
|-----------|-----------|
| **Express** | Framework web para Node.js |
| **PostgreSQL** | Base de datos relacional |
| **pg** | Driver para conectar Node con PostgreSQL |
| **bcrypt** | Encriptación de contraseñas |
| **jsonwebtoken** | Generación y verificación de JWT |
| **cors** | Permite solicitudes desde otros dominios |
| **dotenv** | Manejo de variables de entorno |
| **nodemon** | Recarga automática en desarrollo |

---

## 📝 Variables de Entorno Requeridas

Crea un archivo `.env` en la raíz del proyecto:

```env
# Puerto del servidor
PORT=3000

# Base de datos PostgreSQL
DB_USER=postgres
DB_HOST=localhost
DB_NAME=mi_base_datos
DB_PASSWORD=mi_contraseña
DB_PORT=5432
DB_SSL=false

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
JWT_EXPIRES_IN=1h
```

---

## 📦 Instalación y Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar en desarrollo
```bash
npm run dev
```

### 3. Ejecutar en producción
```bash
npm start
```

---

## 🔍 Resumen de Funcionalidades

| Funcionalidad | Ubicación | Descripción |
|--------------|-----------|-------------|
| Registro de usuarios | service/user.service.js | Valida email único, encripta contraseña |
| Login de usuarios | service/user.service.js | Verifica credenciales, genera JWT |
| Obtener perfil | service/user.service.js | Retorna datos del usuario autenticado |
| Verificación JWT | middlewares/auth.middleware.js | Valida token y extrae información |
| Buscar por email | repositories/user.repository.js | Query a BD para encontrar usuario |
| Buscar por ID | repositories/user.repository.js | Query a BD para obtener usuario por ID |
| Crear usuario | repositories/user.repository.js | Insert en BD, retorna usuario creado |

---

## 🎯 Beneficios de esta Arquitectura

✅ **Separación de responsabilidades**: Cada capa tiene una función específica  
✅ **Fácil de testear**: Cada componente se puede probar independientemente  
✅ **Escalable**: Nueva funcionalidad se agrega sin afectar código existente  
✅ **Mantenible**: Código organizado y fácil de entender  
✅ **Reutilizable**: Servicios y repositorios se pueden usar en múltiples controladores  

---

## 📝 Notas Importantes

- Las contraseñas se encriptan usando bcrypt con 10 rounds
- Los tokens JWT expiran en 1 hora (configurable)
- La conexión a BD usa variables de entorno por seguridad
- El proyecto sigue principios de REST API

---

**Última actualización**: 17 de febrero de 2026
