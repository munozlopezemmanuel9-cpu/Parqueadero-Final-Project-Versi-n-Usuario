# GPA Parqueadero — Sistema de Gestión Inteligente

> Sistema SaaS completo para la gestión de parqueaderos en Medellín, Colombia.  
> Frontend React 18 · Backend Node.js/Express · Base de datos Supabase (PostgreSQL) · Pagos Stripe.

---

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTE (Navegador)                   │
│           React 18 + Vite + Tailwind CSS                 │
└──────────────────────┬──────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
┌─────────────────┐      ┌─────────────────────┐
│    SUPABASE      │      │  Backend Node.js     │
│  (BD principal)  │      │  Express · Puerto 3000│
│                  │      │                      │
│ • Auth (JWT)     │      │ Solo para:           │
│ • Usuarios       │      │ • Pagos (Stripe)     │
│ • Vehículos      │      │ • Suscripciones      │
│ • Plazas         │      └──────────┬──────────┘
│ • Movimientos    │                 │
│ • Parqueaderos   │                 ▼
│ • Reservas       │      ┌─────────────────────┐
│ • Calificaciones │      │       STRIPE          │
└─────────────────┘      │  Pagos en línea       │
                          └─────────────────────┘
```

---

## 📋 Estructura del Proyecto

```
gpa-parqueadero/
├── backend/                     # Servidor Node.js/Express
│   ├── src/
│   │   ├── config/             # Configuración de base de datos
│   │   ├── controllers/        # Lógica de negocio
│   │   │   ├── authController.js
│   │   │   ├── pagosController.js       ← Stripe
│   │   │   ├── suscripcionesController.js ← Suscripciones
│   │   │   └── ...
│   │   ├── middlewares/        # JWT y validaciones
│   │   ├── models/             # Modelos de datos
│   │   ├── routes/             # Rutas de la API
│   │   └── server.js
│   ├── database/
│   │   ├── schema.sql           # Esquema MySQL (legacy/referencia)
│   │   └── supabase_reservas.sql ← Script para crear tabla en Supabase
│   └── .env.example
│
└── frontend/                    # Aplicación React
    ├── src/
    │   ├── components/         # Componentes reutilizables
    │   │   ├── ModalReserva.jsx    # Comprobante con QR
    │   │   ├── SistemaCalificacion.jsx
    │   │   ├── VoiceAssistant.jsx
    │   │   ├── TarjetaParqueadero.jsx
    │   │   └── StripeCheckout.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx  # Auth con Supabase
    │   ├── pages/              # Páginas de la aplicación
    │   │   ├── Dashboard.jsx   # Panel admin
    │   │   ├── MapaParqueaderos.jsx
    │   │   ├── Reservar.jsx    # Flujo de reserva (3 pasos)
    │   │   ├── MisReservas.jsx # Gestión de reservas del cliente
    │   │   ├── Suscripciones.jsx
    │   │   ├── Vehiculos.jsx
    │   │   ├── Plazas.jsx
    │   │   ├── Historial.jsx
    │   │   └── ...
    │   ├── services/
    │   │   └── api.js          # Todos los servicios de Supabase + backend
    │   └── config/
    │       └── supabase.js     # Cliente Supabase
    └── package.json
```

---

## 🎯 Características Implementadas

### Sistema de Autenticación
- ✅ Registro y login con Supabase Auth
- ✅ JWT para gestión de sesiones
- ✅ Roles: **Admin**, **Empleado** y **Cliente**
- ✅ Control de acceso por rol (rutas protegidas)
- ✅ Persistencia de sesión con localStorage

### Portal del Cliente
- ✅ Mapa interactivo de parqueaderos en Medellín
- ✅ Búsqueda por distancia (geolocalización)
- ✅ Flujo de reserva en 3 pasos (fecha → vehículo → pago)
- ✅ Código QR único por reserva
- ✅ Panel "Mis Reservas" con acciones (Llegué / Cancelar)
- ✅ Historial y calificación de sedes
- ✅ Suscripciones mensuales a parqueaderos
- ✅ Asistente de voz integrado

### Panel de Administración (Admin/Empleado)
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gráficos de ocupación por tipo de vehículo
- ✅ Gestión de Plazas (CRUD completo)
- ✅ Gestión de Vehículos (registro, búsqueda por placa)
- ✅ Registro de Entrada y Salida de vehículos
- ✅ Historial completo con filtros (placa, estado, fecha)
- ✅ Gestión de Usuarios (solo Admin)

### UI/UX
- ✅ Diseño dark mode premium estilo SaaS
- ✅ Responsive (móvil y escritorio)
- ✅ Animaciones y transiciones suaves
- ✅ Notificaciones toast
- ✅ Skeletons de carga
- ✅ Modales con backdrop blur
- ✅ Confetti al confirmar reserva

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Uso |
|---|---|
| React 18 | Framework UI |
| Vite | Build tool + dev server |
| Tailwind CSS | Estilos |
| React Router DOM | Navegación |
| Supabase JS | Base de datos y auth |
| Recharts | Gráficos del dashboard |
| Lucide React | Íconos |
| React Hot Toast | Notificaciones |
| React QR Code | Código QR de reservas |
| Canvas Confetti | Animación de confirmación |
| date-fns | Manejo de fechas |

### Backend
| Tecnología | Uso |
|---|---|
| Node.js + Express | Servidor API |
| Stripe | Procesamiento de pagos |
| JWT | Autenticación |
| Bcryptjs | Hash de contraseñas |
| MySQL2 | BD local (legacy) |
| Helmet | Seguridad HTTP |
| Morgan | Logging |

### Infraestructura
| Servicio | Uso |
|---|---|
| Supabase | Base de datos PostgreSQL + Auth en la nube |
| Stripe | Pagos online |

---

## 🗃️ Modelo de Datos (Supabase)

```
usuarios            parqueaderos
──────────          ────────────────
id                  id
nombre              nombre
email               direccion
password_hash       barrio / ciudad
rol                 lat / lng
activo              capacidad_total
creado_en           espacios_disponibles
                    tarifa_hora / tarifa_dia
                    horario_apertura / cierre
                    abierto_24h
                    tiene_camaras / techado
                    rating_promedio
                    activo

plazas              vehiculos
──────              ─────────
id                  id
nombre              placa
tipo                tipo / marca / modelo
estado              color
tarifa_por_hora     propietario_id → usuarios
                    creado_en

movimientos         reservas
───────────         ────────
id                  id
vehiculo_id         usuario_id → usuarios
plaza_id            parqueadero_id → parqueaderos
fecha_entrada       vehiculo_placa / tipo
fecha_salida        fecha_inicio / fin
estado              horas_estimadas
total_pagar         total / metodo_pago
metodo_pago         estado (confirmada|activa|completada|cancelada)
                    codigo_reserva (QR)
                    pago_confirmado

calificaciones      suscripciones
──────────────      ─────────────
id                  id
usuario_id          usuario_id → usuarios
parqueadero_id      parqueadero_id → parqueaderos
puntuacion_general  fecha_inicio / fin
comentario          precio_mensual
creado_en           estado / stripe_subscription_id
```

---

## 🚀 Instalación y Ejecución

### Requisitos
- Node.js 18+
- Cuenta Supabase (ya configurada)
- (Opcional) Cuenta Stripe para pagos reales

### 1. Configurar Supabase

La base de datos principal ya está en Supabase. Si necesitas crear la tabla de reservas:

```bash
# En Supabase Dashboard → SQL Editor
# Ejecuta el script:
backend/database/supabase_reservas.sql
```

### 2. Instalar y ejecutar el Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### 3. (Opcional) Instalar y ejecutar el Backend

El backend solo es necesario para pagos con Stripe real.

```bash
cd backend
npm install
# Crea el .env desde el ejemplo:
copy .env.example .env
# Edita .env con tu STRIPE_SECRET_KEY
npm run dev
# → http://localhost:3000
```

---

## 🔐 Credenciales de Prueba

| Rol | Email | Contraseña |
|---|---|---|
| Admin | admin@gpa.com | admin123 |
| Empleado | empleado@gpa.com | empleado123 |
| Cliente | (registrarse en /registro) | — |

> Los usuarios se crean en Supabase Auth. Si las credenciales no funcionan, registra un nuevo usuario desde la pantalla de Login.

---

## 📡 API del Backend (Stripe / Suscripciones)

El backend Node.js solo expone los endpoints relacionados con pagos:

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/pagos/create-payment-intent` | Crear intención de pago Stripe |
| GET | `/api/suscripciones/mis-suscripciones` | Ver suscripciones activas |
| POST | `/api/suscripciones/adquirir` | Adquirir nueva suscripción |

---

## 🔧 Variables de Entorno

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:3000/api
```

### Backend (`backend/.env`)
```env
PORT=3000
NODE_ENV=development

# Supabase (opcional, para validar tokens JWT desde el backend)
SUPABASE_URL=https://jrkoqmvhcfrqtuibstjl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<tu service role key>

# Stripe
STRIPE_SECRET_KEY=sk_test_<tu_clave>

# JWT (solo si usas auth del backend)
JWT_SECRET=tu_secreto_muy_seguro
JWT_EXPIRES_IN=24h

FRONTEND_URL=http://localhost:5173
```

---

## 📝 Notas Técnicas

1. **Supabase es la BD principal**: Todo el CRUD de negocio (reservas, vehículos, plazas, movimientos) usa Supabase directamente desde el frontend mediante Row Level Security (RLS).

2. **El backend Node.js** existe para integrar con Stripe (que requiere la clave secreta, la cual nunca debe exponerse en el frontend).

3. **RLS en Supabase**: Cada usuario solo puede ver y modificar sus propios datos. Los admins tienen acceso total.

4. **`schema.sql`** en `backend/database/` es el esquema legacy de MySQL y sirve como referencia técnica. No se usa en producción.

---

## 👨‍💻 Comandos de Desarrollo

```bash
# Frontend
npm run dev       # Servidor de desarrollo con HMR
npm run build     # Build de producción
npm run preview   # Preview del build

# Backend
npm run dev       # Desarrollo con auto-reload (nodemon)
npm start         # Producción
```

---

**Desarrollado con ❤️ para GPA Parqueadero · Medellín, Colombia**
