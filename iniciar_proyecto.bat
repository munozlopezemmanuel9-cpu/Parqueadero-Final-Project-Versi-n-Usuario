@echo off
title GPA Parqueadero - Lanzador de Proyecto
color 0B
cls

echo ====================================================================
echo               GPA PARQUEADERO - ECOISTEMA INTELIGENTE
echo               Medellin, Colombia - Proyecto Final
echo ====================================================================
echo.
echo  [+] Iniciando el servidor de desarrollo del Frontend (Vite)...
echo  [+] La base de datos principal esta conectada en la nube (Supabase).
echo  [+] El flujo de pago (Stripe) esta en modo simulado en el frontend.
echo.
echo  --------------------------------------------------------------------
echo  CREDENCIALES DE PRUEBA PRE-CONFIGURADAS:
echo  - Rol Administrador: admin@gpa.com / admin123
echo  - Rol Empleado:      empleado@gpa.com / empleado123
echo  - Rol Cliente:       Registrate gratis con tu correo en la UI
echo  --------------------------------------------------------------------
echo.
echo  La aplicacion se abrira en http://localhost:5173
echo.
echo  Presiona cualquier tecla para arrancar la aplicacion...
pause > null

cd frontend
npm run dev

pause
