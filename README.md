# GPA Parqueadero - Sistema de Gestión

Sistema completo para la gestión de parqueaderos con frontend en React, backend en Node.js/Express y base de datos MySQL.

## 🏗️ Estructura del Proyecto

```
gpa-parqueadero/
├── backend/                 # Servidor Node.js/Express
│   ├── src/
│   │   ├── config/         # Configuración de base de datos
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── middlewares/    # Autenticación y validaciones
│   │   ├── models/         # Modelos de datos
│   │   ├── routes/         # Rutas de la API
│   │   └── server.js       # Punto de entrada
│   ├── database/
│   │   └── schema.sql      # Script de base de datos
│   ├── .env.example        # Variables de entorno de ejemplo
│   └── package.json
│
└── frontend/               # Aplicación React
    ├── src/
    │   ├── components/     # Componentes reutilizables
    │   ├── context/        # Contextos de React
    │   ├── pages/          # Páginas de la aplicación
    │   ├── services/       # Servicios de API
    │   ├── App.jsx         # Componente principal
    │   ├── main.jsx        # Punto de entrada
    │   └── index.css       # Estilos globales
    ├── index.html
    └── package.json
```

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior) - [Descargar](https://nodejs.org/)
- **MySQL** (versión 8.0 o superior) - [Descargar](https://dev.mysql.com/downloads/)
- **Git** (opcional, para clonar el repositorio)

## 🚀 Instrucciones de Instalación

### Paso 1: Configurar la Base de Datos

1. **Inicia MySQL** en tu sistema

2. **Ejecuta el script SQL** para crear la base de datos:

```bash
# Desde la carpeta backend
mysql -u root -p < database/schema.sql
```

O si prefieres hacerlo manualmente:

```sql
-- Abre MySQL Workbench o la consola MySQL
-- Ejecuta el contenido del archivo backend/database/schema.sql
```

3. **Verifica** que la base de datos `gpa_parqueadero` haya sido creada:

```sql
SHOW DATABASES;
USE gpa_parqueadero;
SHOW TABLES;
```

### Paso 2: Configurar el Backend

1. **Navega a la carpeta del backend**:

```bash
cd backend
```

2. **Instala las dependencias**:

```bash
npm install
```

3. **Crea el archivo de variables de entorno**:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# O manualmente: copia el contenido de .env.example a un nuevo archivo .env
```

4. **Edita el archivo `.env`** con tus credenciales de MySQL:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=gpa_parqueadero
DB_PORT=3306

JWT_SECRET=tu_secreto_muy_seguro_cambialo_en_produccion
JWT_EXPIRES_IN=24h

FRONTEND_URL=http://localhost:5173
```

### Paso 3: Configurar el Frontend

1. **Abre una nueva terminal** y navega a la carpeta del frontend:

```bash
cd frontend
```

2. **Instala las dependencias**:

```bash
npm install
```

3. **(Opcional) Crea el archivo `.env`** si necesitas configurar la URL del backend:

```bash
# En frontend/.env
VITE_API_URL=http://localhost:3000/api
```

## ▶️ Ejecutar la Aplicación

### Opción A: Ejecutar por separado (Recomendado para desarrollo)

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

El servidor se ejecutará en `http://localhost:3000`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

La aplicación se ejecutará en `http://localhost:5173`

### Opción B: Script unificado (Crear en la raíz)

Crea un archivo `start.bat` en la raíz del proyecto (Windows):

```batch
@echo off
start cmd /k "cd backend && npm run dev"
start cmd /k "cd frontend && npm run dev"
```

O `start.sh` (Linux/Mac):

```bash
#!/bin/bash
gnome-terminal -- bash -c "cd backend && npm run dev; exec bash"
gnome-terminal -- bash -c "cd frontend && npm run dev; exec bash"
```

## 🔐 Credenciales de Acceso

Al iniciar la aplicación, usa estas credenciales de prueba:

### Administrador
- **Email:** `admin@gpa.com`
- **Contraseña:** `admin123`

### Empleado
- **Email:** `empleado@gpa.com`
- **Contraseña:** `empleado123`

> **Nota:** Las contraseñas reales se generan con bcrypt. Si las credenciales no funcionan, deberás registrar un nuevo usuario desde la API o actualizar los hashes en la base de datos.

## 📡 Endpoints de la API

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/registro` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/perfil` | Obtener perfil (requiere auth) |
| PUT | `/api/auth/perfil` | Actualizar perfil (requiere auth) |

### Usuarios (Solo Admin)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/usuarios` | Listar usuarios |
| GET | `/api/usuarios/:id` | Obtener usuario por ID |
| POST | `/api/usuarios` | Crear usuario |
| PUT | `/api/usuarios/:id` | Actualizar usuario |
| DELETE | `/api/usuarios/:id` | Eliminar usuario |

### Vehículos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/vehiculos` | Registrar vehículo |
| GET | `/api/vehiculos/placa/:placa` | Buscar por placa |
| GET | `/api/vehiculos/historial` | Historial de vehículos |
| PUT | `/api/vehiculos/:id` | Actualizar vehículo |

### Movimientos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/movimientos/entrada` | Registrar entrada |
| POST | `/api/movimientos/salida/:id` | Registrar salida |
| GET | `/api/movimientos/en-parqueadero` | Vehículos actuales |
| GET | `/api/movimientos/historico` | Histórico con filtros |
| GET | `/api/movimientos/estadisticas` | Estadísticas |
| GET | `/api/movimientos/calcular-costo/:id` | Calcular costo |

### Plazas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/plazas` | Listar plazas |
| GET | `/api/plazas/disponibles` | Plazas disponibles |
| GET | `/api/plazas/:id` | Obtener plaza |
| POST | `/api/plazas` | Crear plaza (Admin) |
| PUT | `/api/plazas/:id` | Actualizar plaza (Admin) |
| DELETE | `/api/plazas/:id` | Eliminar plaza (Admin) |

## 🎯 Características Principales

### Sistema de Autenticación
- ✅ Registro y login de usuarios
- ✅ JWT para gestión de sesiones
- ✅ Roles: Admin y Empleado
- ✅ Control de acceso por roles

### Gestión de Parqueadero
- ✅ Registro de vehículos con placa, tipo, marca, modelo, color
- ✅ Registro de entrada con asignación de plaza
- ✅ Registro de salida con cálculo automático de tiempo y costo
- ✅ Historial completo de movimientos
- ✅ Visualización de plazas ocupadas/libres

### Dashboard
- ✅ Estadísticas en tiempo real
- ✅ Conteo de espacios ocupados/libres
- ✅ Vehículos actuales en el parqueadero
- ✅ Gráficos por tipo de vehículo
- ✅ Total recaudado del día

### Diseño UI/UX
- ✅ Interfaz moderna estilo SaaS
- ✅ Diseño responsive (móvil y escritorio)
- ✅ Tailwind CSS para estilos
- ✅ Notificaciones toast
- ✅ Sidebar de navegación
- ✅ Modales para formularios

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Axios
- Recharts (gráficos)
- Lucide React (iconos)
- React Hot Toast (notificaciones)
- date-fns (manejo de fechas)
- Vite (build tool)

### Backend
- Node.js
- Express
- MySQL2 (con pool de conexiones)
- Bcryptjs (hash de contraseñas)
- JSON Web Token (JWT)
- Express Validator
- Helmet (seguridad)
- Morgan (logging)
- CORS

## 🔧 Solución de Problemas

### Error: "No se puede conectar a la base de datos"

1. Verifica que MySQL esté ejecutándose:
```bash
# Windows
services.msc  # Busca "MySQL" y asegúrate de que esté iniciado

# Linux
sudo systemctl status mysql
```

2. Verifica las credenciales en `backend/.env`

3. Asegúrate de haber ejecutado el script `schema.sql`

### Error: "CORS" en el frontend

1. Verifica que `FRONTEND_URL` en `backend/.env` coincida con el puerto del frontend

2. En desarrollo, Vite usa proxy automático configurado en `vite.config.js`

### Error: "Puerto ya en uso"

```bash
# Windows - Matar proceso por puerto
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

## 📝 Notas Importantes

1. **Seguridad en Producción:**
   - Cambia `JWT_SECRET` por un valor seguro
   - Usa HTTPS
   - Configura CORS solo para tu dominio
   - No expongas el puerto de MySQL

2. **Backup de Base de Datos:**
```bash
mysqldump -u root -p gpa_parqueadero > backup.sql
```

3. **Restaurar Backup:**
```bash
mysql -u root -p gpa_parqueadero < backup.sql
```

## 👨‍💻 Comandos Útiles

### Backend
```bash
npm run dev      # Desarrollo con auto-reload
npm start        # Producción
npm test         # Ejecutar tests
```

### Frontend
```bash
npm run dev      # Desarrollo con HMR
npm run build    # Build de producción
npm run preview  # Preview del build
```

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**Desarrollado con ❤️ para GPA Parqueadero**
