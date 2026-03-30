# Instrucciones De Acceso Y Prueba

## Proyecto
Sistema de gestion y reservas del **Hotel Everton**.

Este documento resume la forma de acceso al frontend y al backend, las credenciales de prueba y las rutas sugeridas para revisar los modulos del sistema.

## Estructura General

- Backend en Node.js y Express
- Frontend en React
- Base de datos en MySQL

## Puertos De Ejecucion

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:3001`

Es importante que ambos servidores esten activos al mismo tiempo para realizar las pruebas completas.

## Inicio Del Backend

Ubicarse en la carpeta del backend y ejecutar:

```powershell
npm run dev
```

Si `npm run dev` presenta inconvenientes con `nodemon`, se puede iniciar con:

```powershell
node src/server.js
```

## Inicio Del Frontend

Ubicarse en la carpeta del frontend y ejecutar:

```powershell
npm start
```

El sistema abrira en:

```text
http://localhost:3001
```

## Credenciales De Acceso

Para ingresar al panel administrativo se dejaron credenciales de prueba:

- Correo: `admin@everton.com`
- Contrasena: `admin123`

## Rutas De Acceso En El Frontend

El frontend permite abrir directamente la pagina principal o cada modulo principal.

### Vista general

- `http://localhost:3001/`
- `http://localhost:3001/administrador`

### Modulos administrativos

- `http://localhost:3001/hotel`
- `http://localhost:3001/huesped`
- `http://localhost:3001/empleado`
- `http://localhost:3001/cargo`
- `http://localhost:3001/habitacion`
- `http://localhost:3001/reserva`

Nota:
si el usuario no ha iniciado sesion, la aplicacion mostrara primero el formulario de acceso administrativo. Despues del login, el sistema permite trabajar en el modulo solicitado.

## Funcionalidad Esperada

Los formularios del frontend estan conectados con el backend, por lo tanto:

- los datos ingresados se envian a la API
- los registros se almacenan en la base de datos
- los listados se cargan desde la informacion real del backend
- se pueden realizar operaciones de crear, editar, eliminar y consultar segun cada modulo

## Endpoints Base Del Backend

Los modulos principales consumen las siguientes rutas base:

- `GET /api/hotel`
- `GET /api/huesped`
- `GET /api/empleado`
- `GET /api/cargo`
- `GET /api/habitacion`
- `GET /api/reserva`
- `POST /api/auth/login`

## Orden Recomendado De Prueba

1. Iniciar MySQL.
2. Iniciar el backend en el puerto `3000`.
3. Iniciar el frontend en el puerto `3001`.
4. Abrir `http://localhost:3001/administrador`.
5. Iniciar sesion con el usuario de prueba.
6. Probar los modulos en este orden:
   `hotel`, `cargo`, `huesped`, `empleado`, `habitacion`, `reserva`.

## Validaciones Recomendadas

En cada modulo se recomienda revisar:

- creacion de registros
- visualizacion en tabla
- edicion de registros
- eliminacion de registros
- recarga correcta de la informacion

En el modulo `reserva` se recomienda adicionalmente probar:

- confirmar reserva
- checkin
- checkout
- cancelar reserva

## Observacion Para La Entrega

El proyecto fue desarrollado con frontend y backend en carpetas separadas, pero ambos hacen parte del mismo sistema y trabajan de forma integrada por medio de la API local.

Si se desea adjuntar esta informacion en la evidencia final, este documento puede incluirse como anexo o convertirse a PDF junto con la documentacion tecnica del proyecto.
