# 🚀 Instrucciones Rápidas - GPA Parqueadero

Sigue estos pasos para ejecutar la aplicación por primera vez.

---

## 📌 Paso 1: Verificar Requisitos

Asegúrate de tener instalado:
- ✅ **Node.js 18+** - Ejecuta `node --version`
- ✅ **MySQL 8+** - Ejecuta `mysql --version`

---

## 📌 Paso 2: Configurar Base de Datos

### 2.1 Ejecutar el Script SQL

Abre una terminal y ejecuta:

```bash
cd C:\Users\ozem1\gpa-parqueadero\backend
mysql -u root -p < database/schema.sql
```

> Si no tienes contraseña en MySQL, usa: `mysql -u root < database/schema.sql`

### 2.2 Ejecutar el Seed de Datos

```bash
cd C:\Users\ozem1\gpa-parqueadero\backend
node database/seed.js
```

Esto creará los usuarios de prueba con contraseñas válidas.

---

## 📌 Paso 3: Instalar Dependencias

### Backend:
```bash
cd C:\Users\ozem1\gpa-parqueadero\backend
npm install
```

### Frontend (en otra terminal):
```bash
cd C:\Users\ozem1\gpa-parqueadero\frontend
npm install
```

---

## 📌 Paso 4: Ejecutar la Aplicación

### Terminal 1 - Backend:
```bash
cd C:\Users\ozem1\gpa-parqueadero\backend
npm run dev
```

✅ Verás: `🚀 SERVIDOR INICIADO` en `http://localhost:3000`

### Terminal 2 - Frontend:
```bash
cd C:\Users\ozem1\gpa-parqueadero\frontend
npm run dev
```

✅ Verás: `Local: http://localhost:5173/`

---

## 📌 Paso 5: Acceder a la Aplicación

1. Abre tu navegador en: **http://localhost:5173**

2. Usa las credenciales de prueba:

   **Administrador:**
   - Email: `admin@gpa.com`
   - Contraseña: `admin123`

   **Empleado:**
   - Email: `empleado@gpa.com`
   - Contraseña: `empleado123`

---

## 🎯 ¡Listo!

Ya puedes usar la aplicación. Prueba:

1. ✅ Registrar un vehículo (Entrada)
2. ✅ Ver el dashboard con estadísticas
3. ✅ Registrar la salida y ver el cálculo del costo
4. ✅ Consultar el historial de movimientos

---

## 🐛 Problemas Comunes

### Error: "Cannot connect to MySQL"
- Verifica que MySQL esté corriendo
- Revisa las credenciales en `backend/.env`

### Error: "Database not found"
- Ejecuta nuevamente `schema.sql`

### Error: "Port already in use"
- Cierra otras aplicaciones en los puertos 3000 o 5173

---

## 📞 Soporte

Si tienes problemas, revisa el `README.md` completo para más detalles.
