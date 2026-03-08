-- Esquema base para hotel_everton
CREATE DATABASE IF NOT EXISTS hotel_everton;
USE hotel_everton;

CREATE TABLE IF NOT EXISTS hotel (
  NIT_hotel VARCHAR(20) PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  correo VARCHAR(120)
);

CREATE TABLE IF NOT EXISTS cargo (
  id_cargo INT AUTO_INCREMENT PRIMARY KEY,
  cargo VARCHAR(80) NOT NULL,
  salario DECIMAL(10,2),
  horas_laborales INT,
  tipo_contrato ENUM('fijo','temporal','practicante','otro') DEFAULT 'fijo',
  horario VARCHAR(120)
);

CREATE TABLE IF NOT EXISTS empleado (
  RUT_empleado VARCHAR(20) PRIMARY KEY,
  id_cargo INT NOT NULL,
  NIT_hotel VARCHAR(20) NOT NULL,
  nombre_empleado VARCHAR(120) NOT NULL,
  telefono_empleado VARCHAR(20),
  direccion_empleado VARCHAR(255),
  correo_electronico VARCHAR(120) UNIQUE,
  fecha_nacimiento DATE,
  EPS VARCHAR(80),
  salario DECIMAL(10,2),
  tipo_contrato ENUM('fijo','temporal','practicante','otro') DEFAULT 'fijo',
  FOREIGN KEY (id_cargo) REFERENCES cargo(id_cargo),
  FOREIGN KEY (NIT_hotel) REFERENCES hotel(NIT_hotel)
);

CREATE TABLE IF NOT EXISTS huesped (
  id_huesped VARCHAR(20) PRIMARY KEY,
  nombre_huesped VARCHAR(120) NOT NULL,
  fecha_nacimiento DATE,
  telefono VARCHAR(20),
  direccion VARCHAR(255),
  correo VARCHAR(120) UNIQUE,
  procedencia VARCHAR(120),
  metodo_pagoFV VARCHAR(80)
);

CREATE TABLE IF NOT EXISTS habitacion (
  id_habitacion INT AUTO_INCREMENT PRIMARY KEY,
  numero VARCHAR(10) NOT NULL UNIQUE,
  tipo ENUM('sencilla','doble','suite','familiar','deluxe') DEFAULT 'sencilla',
  precio DECIMAL(10,2) NOT NULL,
  estado ENUM('disponible','ocupada','mantenimiento','reservada') DEFAULT 'disponible',
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS reserva (
  id_reserva INT AUTO_INCREMENT PRIMARY KEY,
  id_huesped VARCHAR(20) NOT NULL,
  id_habitacion INT NOT NULL,
  fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_entrada DATE NOT NULL,
  fecha_salida DATE NOT NULL,
  estado ENUM('reservada','checkin','checkout','cancelada') DEFAULT 'reservada',
  total DECIMAL(10,2),
  notas TEXT,
  FOREIGN KEY (id_huesped) REFERENCES huesped(id_huesped),
  FOREIGN KEY (id_habitacion) REFERENCES habitacion(id_habitacion)
);

CREATE TABLE IF NOT EXISTS rol (
  id_rol INT AUTO_INCREMENT PRIMARY KEY,
  nombre ENUM('admin','empleado','huesped') NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  correo VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  id_rol INT NOT NULL,
  RUT_empleado VARCHAR(20) NULL,
  id_huesped VARCHAR(20) NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_rol) REFERENCES rol(id_rol),
  FOREIGN KEY (RUT_empleado) REFERENCES empleado(RUT_empleado) ON DELETE SET NULL,
  FOREIGN KEY (id_huesped) REFERENCES huesped(id_huesped) ON DELETE SET NULL
);

-- Semillas básicas
INSERT IGNORE INTO rol(nombre) VALUES ('admin'),('empleado'),('huesped');
INSERT IGNORE INTO hotel(NIT_hotel,nombre,direccion,telefono,correo)
VALUES ('900999111','Hotel Everton','Calle 1 # 2-3','000-0000','info@everton.com');

-- Ejemplos de cargos
INSERT IGNORE INTO cargo(id_cargo,cargo,salario,horas_laborales,tipo_contrato,horario) VALUES
  (1,'Administrador',3000000,48,'fijo','Diurno'),
  (2,'Recepcionista',1800000,48,'fijo','Rotativo'),
  (3,'Aseo',1500000,48,'fijo','Mañana');
