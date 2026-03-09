-- Esquema basado en Script_Everton + tablas de autenticacion
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA IF NOT EXISTS `hotel_everton` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `hotel_everton` ;

CREATE TABLE IF NOT EXISTS `cargo` (
  `id_cargo` INT NOT NULL AUTO_INCREMENT,
  `cargo` VARCHAR(50) NULL DEFAULT NULL,
  `salario` DECIMAL(10,2) NULL DEFAULT NULL,
  `horas_laborales` INT NULL DEFAULT NULL,
  `tipo_contrato` VARCHAR(50) NULL DEFAULT NULL,
  `horario` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`id_cargo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `hotel` (
  `NIT_hotel` VARCHAR(20) NOT NULL,
  `nombre` VARCHAR(100) NULL DEFAULT NULL,
  `direccion` VARCHAR(150) NULL DEFAULT NULL,
  `telefono` VARCHAR(20) NULL DEFAULT NULL,
  `correo_electronico` VARCHAR(100) NULL DEFAULT NULL,
  `num_empleados` INT NULL DEFAULT NULL,
  `num_habitaciones` INT NULL DEFAULT NULL,
  `num_huespedes` INT NULL DEFAULT NULL,
  PRIMARY KEY (`NIT_hotel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `empleado` (
  `RUT_empleado` VARCHAR(20) NOT NULL,
  `id_cargo` INT NULL DEFAULT NULL,
  `NIT_hotel` VARCHAR(20) NULL DEFAULT NULL,
  `nombre_empleado` VARCHAR(100) NULL DEFAULT NULL,
  `telefono_empleado` VARCHAR(20) NULL DEFAULT NULL,
  `direccion_empleado` VARCHAR(150) NULL DEFAULT NULL,
  `correo_electronico` VARCHAR(100) NULL DEFAULT NULL,
  `fecha_nacimiento` DATE NULL DEFAULT NULL,
  `EPS` VARCHAR(100) NULL DEFAULT NULL,
  `salario` DECIMAL(10,2) NULL DEFAULT NULL,
  `tipo_contrato` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`RUT_empleado`),
  INDEX `id_cargo` (`id_cargo`),
  INDEX `NIT_hotel` (`NIT_hotel`),
  CONSTRAINT `empleado_ibfk_1` FOREIGN KEY (`id_cargo`) REFERENCES `cargo` (`id_cargo`),
  CONSTRAINT `empleado_ibfk_2` FOREIGN KEY (`NIT_hotel`) REFERENCES `hotel` (`NIT_hotel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `habitacion` (
  `id_habitacion` INT NOT NULL AUTO_INCREMENT,
  `NIT_hotel` VARCHAR(20) NULL DEFAULT NULL,
  `tipo_habitacion` VARCHAR(50) NULL DEFAULT NULL,
  `precio` DECIMAL(10,2) NULL DEFAULT NULL,
  `capacidad` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id_habitacion`),
  INDEX `NIT_hotel` (`NIT_hotel`),
  CONSTRAINT `habitacion_ibfk_1` FOREIGN KEY (`NIT_hotel`) REFERENCES `hotel` (`NIT_hotel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `huesped` (
  `id_huesped` INT NOT NULL AUTO_INCREMENT,
  `nombre_huesped` VARCHAR(100) NULL DEFAULT NULL,
  `fecha_nacimiento` DATE NULL DEFAULT NULL,
  `telefono` VARCHAR(20) NULL DEFAULT NULL,
  `direccion` VARCHAR(150) NULL DEFAULT NULL,
  `correo` VARCHAR(100) NULL DEFAULT NULL,
  `procedencia` VARCHAR(100) NULL DEFAULT NULL,
  `metodo_pagoFV` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`id_huesped`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci AUTO_INCREMENT=10000;

CREATE TABLE IF NOT EXISTS `reserva` (
  `id_reserva` INT NOT NULL AUTO_INCREMENT,
  `id_huesped` INT NULL DEFAULT NULL,
  `fecha_inicio` DATE NULL DEFAULT NULL,
  `fecha_fin` DATE NULL DEFAULT NULL,
  `estado` ENUM('disponible', 'no disponible') NULL DEFAULT 'no disponible',
  PRIMARY KEY (`id_reserva`),
  INDEX `id_huesped` (`id_huesped`),
  CONSTRAINT `reserva_ibfk_1` FOREIGN KEY (`id_huesped`) REFERENCES `huesped` (`id_huesped`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `reserva_habitacion` (
  `id_reserva` INT NOT NULL,
  `id_habitacion` INT NOT NULL,
  PRIMARY KEY (`id_reserva`, `id_habitacion`),
  INDEX `id_habitacion` (`id_habitacion`),
  CONSTRAINT `reserva_habitacion_ibfk_1` FOREIGN KEY (`id_reserva`) REFERENCES `reserva` (`id_reserva`),
  CONSTRAINT `reserva_habitacion_ibfk_2` FOREIGN KEY (`id_habitacion`) REFERENCES `habitacion` (`id_habitacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tablas de autenticacion
CREATE TABLE IF NOT EXISTS `rol` (
  `id_rol` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `usuario` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `correo` VARCHAR(120) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `id_rol` INT NOT NULL,
  `RUT_empleado` VARCHAR(20) NULL,
  `id_huesped` INT NULL,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  FOREIGN KEY (`id_rol`) REFERENCES `rol`(`id_rol`),
  FOREIGN KEY (`RUT_empleado`) REFERENCES `empleado`(`RUT_empleado`) ON DELETE SET NULL,
  FOREIGN KEY (`id_huesped`) REFERENCES `huesped`(`id_huesped`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Semillas
INSERT IGNORE INTO rol(nombre) VALUES ('admin'),('empleado'),('huesped');
INSERT IGNORE INTO hotel (NIT_hotel,nombre,direccion,telefono,correo_electronico) VALUES ('900999111','Hotel Everton','Calle 1 # 2-3','000-0000','info@everton.com');
INSERT IGNORE INTO cargo (id_cargo,cargo,salario,horas_laborales,tipo_contrato,horario) VALUES
 (1,'Administrador',3000000,48,'fijo','Diurno'),
 (2,'Recepcionista',1800000,48,'fijo','Rotativo'),
 (3,'Aseo',1500000,48,'fijo','Mañana');

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
