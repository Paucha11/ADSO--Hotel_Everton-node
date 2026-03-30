# Backend Hotel Everton

Este proyecto corresponde al backend del sistema de gestion y reservas del **Hotel Everton**.  
Fue desarrollado en **Node.js**, **Express** y **MySQL**.

## Ejecucion del servidor

Ubicarse en la carpeta del backend y ejecutar:

```powershell
npm run dev
```

Si se presenta algun problema con `nodemon`, tambien se puede iniciar con:

```powershell
node src/server.js
```

El servidor debe ejecutarse en:

```text
http://localhost:3000
```

## Variables de entorno

El archivo `.env` debe contener las variables necesarias para la conexion con la base de datos y la autenticacion, por ejemplo:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Rutas principales de la API

### Autenticacion y usuarios

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `GET /api/usuario`
- `POST /api/usuario/:id_usuario/roles`
- `GET /api/rol`

### Modulos del sistema

- `GET /api/hotel`
- `GET /api/hotel/:NIT_hotel`
- `POST /api/hotel`
- `PUT /api/hotel/:NIT_hotel`
- `DELETE /api/hotel/:NIT_hotel`

- `GET /api/huesped`
- `POST /api/huesped`
- `PUT /api/huesped/:id_huesped`
- `DELETE /api/huesped/:id_huesped`

- `GET /api/empleado`
- `POST /api/empleado`
- `PUT /api/empleado/:RUT_empleado`
- `DELETE /api/empleado/:RUT_empleado`

- `GET /api/cargo`
- `GET /api/cargo/:id_cargo`
- `POST /api/cargo`
- `PUT /api/cargo/:id_cargo`
- `DELETE /api/cargo/:id_cargo`

- `GET /api/habitacion`
- `GET /api/habitacion/disponibles?desde=YYYY-MM-DD&hasta=YYYY-MM-DD`
- `POST /api/habitacion`
- `PUT /api/habitacion/:id`
- `DELETE /api/habitacion/:id`

- `GET /api/reserva`
- `POST /api/reserva`
- `PUT /api/reserva/:id`
- `DELETE /api/reserva/:id`
- `PATCH /api/reserva/:id/confirmar`
- `PATCH /api/reserva/:id/cancelar`
- `PATCH /api/reserva/:id/checkin`
- `PATCH /api/reserva/:id/checkout`

## Credenciales de prueba

Se deja un usuario administrador inicial para pruebas:

- Correo: `admin@everton.com`
- Contrasena: `admin123`

## Recomendacion de prueba

1. Iniciar la base de datos MySQL.
2. Iniciar el backend.
3. Iniciar el frontend en `http://localhost:3001`.
4. Probar login y modulos desde la interfaz o con Postman.

## Archivo de apoyo

Para revisar el acceso al sistema y las rutas de prueba se puede consultar:

- `INSTRUCCIONES_ACCESO_FRONTEND_BACKEND.md`
