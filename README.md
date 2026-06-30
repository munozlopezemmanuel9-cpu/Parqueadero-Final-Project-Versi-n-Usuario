# 🅿️ GPA Parqueadero — Sistema de Gestión Inteligente

> **Proyecto Final** — Sistema SaaS completo para la gestión de parqueaderos en Medellín, Colombia.  
> React 18 · Vite · Supabase (PostgreSQL) · Node.js/Express · Pagos Stripe · Deploy en Vercel.

[![Deploy en Vercel](https://vercel.com/button)](https://vercel.com/new)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)

---

## 🏗️ Arquitectura General

```
┌──────────────────────────────────────────────────────────┐
│                  CLIENTE (Navegador)                      │
│          React 18 + Vite + Vanilla CSS/Tailwind           │
└─────────────────────┬────────────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
┌─────────────────┐      ┌─────────────────────┐
│    SUPABASE      │      │  Backend Node.js     │
│  (BD principal)  │      │  Express · Puerto 3000│
│                  │      │                      │
│ • Auth local     │      │ Solo para:           │
│ • Usuarios       │      │ • Pagos (Stripe)     │
│ • Vehículos      │      │ • Suscripciones      │
│ • Plazas         │      └──────────┬──────────┘
│ • Movimientos    │                 │
│ • Parqueaderos   │                 ▼
│ • Reservas       │      ┌─────────────────────┐
│ • Calificaciones │      │       STRIPE          │
└─────────────────┘      │   Pagos en línea       │
                          └─────────────────────┘
```

---

## 📋 Estructura del Proyecto

```
gpa-parqueadero/
├── backend/                     # Servidor Node.js/Express
│   ├── src/
│   │   ├── controllers/         # Lógica de negocio (Stripe, suscripciones)
│   │   ├── middlewares/         # JWT y validaciones
│   │   ├── routes/              # Rutas de la API REST
│   │   └── server.js
│   ├── database/
│   │   ├── supabase_schema.sql  # Esquema completo de Supabase
│   │   ├── supabase_reservas.sql ← Tabla reservas + RPC
│   │   ├── insertar_plazas.sql
│   │   └── insertar_movimientos_prueba.sql
│   └── .env.example
│
└── frontend/                    # Aplicación React 18
    ├── src/
    │   ├── components/          # Componentes reutilizables
    │   │   ├── ModalReserva.jsx    # Comprobante con QR
    │   │   ├── SistemaCalificacion.jsx
    │   │   ├── VoiceAssistant.jsx
    │   │   ├── TarjetaParqueadero.jsx
    │   │   ├── Skeleton.jsx
    │   │   └── StripeCheckout.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx  # Gestión de sesión con localStorage
    │   ├── pages/               # Vistas de la aplicación
    │   │   ├── Dashboard.jsx    # Panel admin con estadísticas
    │   │   ├── MapaParqueaderos.jsx
    │   │   ├── Reservar.jsx     # Flujo en 3 pasos
    │   │   ├── MisReservas.jsx  # Panel de cliente
    │   │   ├── Vehiculos.jsx    # Gestión operativa
    │   │   ├── Plazas.jsx
    │   │   ├── Historial.jsx
    │   │   └── ...
    │   ├── services/
    │   │   └── api.js           # Capa de acceso a Supabase
    │   └── config/
    │       └── supabase.js      # Cliente Supabase
    ├── .env                     # Variables de entorno (no subido al repo)
    └── package.json
```

---

## 🎯 Características Implementadas

### 🔐 Sistema de Autenticación
- ✅ Registro con validación de contraseñas en tiempo real
- ✅ Login local contra tabla `usuarios` (sin dependencia de Supabase Auth)
- ✅ Tres roles diferenciados: **Admin**, **Empleado** y **Cliente**
- ✅ Rutas protegidas según rol
- ✅ Persistencia de sesión con `localStorage`

### 👤 Portal del Cliente
- ✅ Mapa interactivo de parqueaderos en Medellín (Leaflet)
- ✅ Búsqueda por distancia y geolocalización GPS
- ✅ Flujo de reserva en **3 pasos** (parqueadero → vehículo → pago)
- ✅ Código QR único por reserva (comprobante descargable)
- ✅ Panel **"Mis Reservas"** con acciones en tiempo real (Llegué / Cancelar / Navegar)
- ✅ Historial de reservas pasadas con calificación de sedes
- ✅ Suscripciones mensuales a parqueaderos
- ✅ Asistente de voz integrado

### 🛡️ Panel de Administración (Admin/Empleado)
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gráficos de ocupación por tipo de vehículo (Recharts)
- ✅ Gestión de Plazas: CRUD completo
- ✅ **Registro de Entrada y Salida** de vehículos con timer
- ✅ Visualización de vehículos estacionados con búsqueda por placa
- ✅ Reservas pendientes del día (clientes que llegarán)
- ✅ Historial con filtros (placa, estado, fecha)
- ✅ Gestión de Usuarios (solo Admin)

### ✨ UI/UX
- ✅ Diseño dark mode premium estilo SaaS
- ✅ Totalmente responsivo (móvil, tablet y escritorio)
- ✅ Animaciones y transiciones suaves con CSS nativo
- ✅ Notificaciones toast (react-hot-toast)
- ✅ Skeletons de carga
- ✅ Modales con glassmorphism y backdrop-blur
- ✅ Confetti al confirmar reserva

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Uso |
|---|---|
| React 18 | Framework UI |
| Vite 6 | Build tool + dev server |
| React Router DOM | Navegación SPA |
| Supabase JS | Base de datos directa + Auth |
| Recharts | Gráficos del dashboard |
| Lucide React | Íconos |
| React Hot Toast | Notificaciones |
| React QR Code | Código QR de reservas |
| Leaflet + React-Leaflet | Mapa interactivo |
| Canvas Confetti | Animación de confirmación |
| date-fns | Manejo de fechas |

### Backend
| Tecnología | Uso |
|---|---|
| Node.js + Express | Servidor API REST |
| Stripe | Procesamiento de pagos en línea |
| JWT | Autenticación de tokens |
| Bcryptjs | Hash de contraseñas |
| Helmet | Seguridad HTTP |
| Morgan | Logging de peticiones |

### Infraestructura
| Servicio | Uso |
|---|---|
| Supabase | Base de datos PostgreSQL en la nube |
| Vercel | Hosting del frontend |

---

## 🗃️ Modelo de Datos

```
usuarios            parqueaderos
──────────          ────────────────
id (PK)             id (PK)
nombre              nombre / direccion
email               barrio / ciudad
password_hash       lat / lng
rol                 capacidad_total / espacios_disponibles
activo              tarifa_hora / tarifa_dia
creado_en           horario_apertura / cierre
                    tiene_camaras / techado
                    rating_promedio / activo

plazas              vehiculos
──────              ─────────
id (PK)             id (PK)
nombre              placa (UNIQUE)
tipo                tipo / marca / modelo / color
estado              propietario_id → usuarios
tarifa_por_hora     creado_en

movimientos         reservas
───────────         ────────
id (PK)             id (PK)
vehiculo_id → (FK)  usuario_id → usuarios
plaza_id → (FK)     parqueadero_id → parqueaderos
fecha_entrada       vehiculo_placa / vehiculo_tipo
fecha_salida        fecha_inicio / fecha_fin
estado              horas_estimadas / total
total_pagar         metodo_pago / pago_confirmado
metodo_pago         estado (confirmada|activa|completada|cancelada)
                    codigo_reserva UNIQUE (para QR)

calificaciones      suscripciones
──────────────      ─────────────
id (PK)             id (PK)
usuario_id → (FK)   usuario_id → usuarios
parqueadero_id(FK)  parqueadero_id → parqueaderos
puntuacion_general  fecha_inicio / fecha_fin
comentario          precio_mensual
creado_en           estado / stripe_subscription_id
```

---

## 🚀 Instalación y Ejecución Local

### Requisitos
- Node.js 18+
- Cuenta Supabase activa

### 1. Clonar el repositorio
```bash
git clone https://github.com/munozlopezemmanuel9-cpu/Parqueadero-Final-Project-Versi-n-Usuario.git
cd Parqueadero-Final-Project-Versi-n-Usuario
```

### 2. Configurar variables de entorno del Frontend
```bash
cd frontend
# Crear el archivo .env con:
VITE_SUPABASE_URL=https://ueigbdtzcfgzrqcazkby.supabase.co
VITE_SUPABASE_KEY=sb_publishable_kiXBFneNtp595bfEWf16Zg_a4DBODuH
```

### 3. Instalar dependencias y ejecutar
```bash
npm install
npm run dev
# → http://localhost:5173
```

### 4. (Opcional) Backend para Stripe
```bash
cd ../backend
npm install
cp .env.example .env
# Edita .env con tu STRIPE_SECRET_KEY
npm run dev
# → http://localhost:3000
```

---

## 🔐 Credenciales de Prueba

| Rol | Email | Contraseña |
|---|---|---|
| **Administrador** | `admin@gpa.com` | `admin123` |
| **Administrador** | `munozlopezemmanuel9@gmail.com` | `Fornite123.` |
| **Administrador** | `gloria.admin@gpa.com` | `gloria123` |
| **Empleado** | `empleado@gpa.com` | `empleado123` |
| **Empleado** | `carlos.empleado@gpa.com` | `carlos123` |
| **Cliente** | `cliente@gpa.com` | `cliente123` |
| **Cliente** | `emma123@gmail.com` | `Fornite123.` |

---

## ☁️ Deploy en Vercel

1. Conecta el repositorio de GitHub en [vercel.com](https://vercel.com/new)
2. En **Settings → Environment Variables** configura:
   ```
   VITE_SUPABASE_URL = https://ueigbdtzcfgzrqcazkby.supabase.co
   VITE_SUPABASE_KEY = sb_publishable_kiXBFneNtp595bfEWf16Zg_a4DBODuH
   ```
3. En **Root Directory** selecciona `frontend`
4. Framework Preset: **Vite**
5. ¡Despliega! 🚀

---

## 📡 API del Backend (Endpoints Stripe)

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/pagos/create-payment-intent` | Crear intención de pago Stripe |
| GET | `/api/suscripciones/mis-suscripciones` | Ver suscripciones activas |
| POST | `/api/suscripciones/adquirir` | Adquirir nueva suscripción |

---

## 👨‍💻 Comandos de Desarrollo

```bash
# Frontend
npm run dev       # Servidor de desarrollo con HMR
npm run build     # Build de producción optimizado
npm run preview   # Preview del build antes de desplegar

# Backend
npm run dev       # Desarrollo con auto-reload (nodemon)
npm start         # Modo producción
```

---

**Desarrollado con ❤️ por Emanuel Muñoz López para GPA Parqueadero · Medellín, Colombia**
