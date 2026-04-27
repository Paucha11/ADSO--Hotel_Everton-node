-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema hotel_everton
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema hotel_everton
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `hotel_everton` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `hotel_everton` ;

-- -----------------------------------------------------
-- Table `hotel_everton`.`cargo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hotel_everton`.`cargo` (
  `id_cargo` INT NOT NULL AUTO_INCREMENT,
  `cargo` VARCHAR(50) NULL DEFAULT NULL,
  `salario` DECIMAL(10,2) NULL DEFAULT NULL,
  `horas_laborales` INT NULL DEFAULT NULL,
  `tipo_contrato` VARCHAR(50) NULL DEFAULT NULL,
  `horario` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`id_cargo`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hotel_everton`.`hotel`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hotel_everton`.`hotel` (
  `NIT_hotel` VARCHAR(20) NOT NULL,
  `nombre` VARCHAR(100) NULL DEFAULT NULL,
  `direccion` VARCHAR(150) NULL DEFAULT NULL,
  `telefono` VARCHAR(20) NULL DEFAULT NULL,
  `correo_electronico` VARCHAR(100) NULL DEFAULT NULL,
  `num_empleados` INT NULL DEFAULT NULL,
  `num_habitaciones` INT NULL DEFAULT NULL,
  `num_huespedes` INT NULL DEFAULT NULL,
  PRIMARY KEY (`NIT_hotel`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hotel_everton`.`empleado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hotel_everton`.`empleado` (
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
  INDEX `id_cargo` (`id_cargo` ASC) VISIBLE,
  INDEX `NIT_hotel` (`NIT_hotel` ASC) VISIBLE,
  CONSTRAINT `empleado_ibfk_1`
    FOREIGN KEY (`id_cargo`)
    REFERENCES `hotel_everton`.`cargo` (`id_cargo`),
  CONSTRAINT `empleado_ibfk_2`
    FOREIGN KEY (`NIT_hotel`)
    REFERENCES `hotel_everton`.`hotel` (`NIT_hotel`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hotel_everton`.`habitacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hotel_everton`.`habitacion` (
  `id_habitacion` INT NOT NULL AUTO_INCREMENT,
  `NIT_hotel` VARCHAR(20) NULL DEFAULT NULL,
  `tipo_habitacion` VARCHAR(50) NULL DEFAULT NULL,
  `precio` DECIMAL(10,2) NULL DEFAULT NULL,
  `capacidad` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id_habitacion`),
  INDEX `NIT_hotel` (`NIT_hotel` ASC) VISIBLE,
  CONSTRAINT `habitacion_ibfk_1`
    FOREIGN KEY (`NIT_hotel`)
    REFERENCES `hotel_everton`.`hotel` (`NIT_hotel`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hotel_everton`.`huesped`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hotel_everton`.`huesped` (
  `id_huesped` INT NOT NULL AUTO_INCREMENT,
  `documento_identidad` VARCHAR(30) NULL DEFAULT NULL,
  `nombre_huesped` VARCHAR(100) NULL DEFAULT NULL,
  `fecha_nacimiento` DATE NULL DEFAULT NULL,
  `telefono` VARCHAR(20) NULL DEFAULT NULL,
  `direccion` VARCHAR(150) NULL DEFAULT NULL,
  `correo` VARCHAR(100) NULL DEFAULT NULL,
  `procedencia` VARCHAR(100) NULL DEFAULT NULL,
  `metodo_pagoFV` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`id_huesped`),
  UNIQUE INDEX `documento_identidad_UNIQUE` (`documento_identidad` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 10000
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hotel_everton`.`reserva`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hotel_everton`.`reserva` (
  `id_reserva` INT NOT NULL AUTO_INCREMENT,
  `id_huesped` INT NULL DEFAULT NULL,
  `fecha_inicio` DATE NULL DEFAULT NULL,
  `fecha_fin` DATE NULL DEFAULT NULL,
  `estado` ENUM('disponible', 'no disponible') NULL DEFAULT NULL,
  PRIMARY KEY (`id_reserva`),
  INDEX `id_huesped` (`id_huesped` ASC) VISIBLE,
  CONSTRAINT `reserva_ibfk_1`
    FOREIGN KEY (`id_huesped`)
    REFERENCES `hotel_everton`.`huesped` (`id_huesped`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hotel_everton`.`reserva_habitacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hotel_everton`.`reserva_habitacion` (
  `id_reserva` INT NOT NULL,
  `id_habitacion` INT NOT NULL,
  PRIMARY KEY (`id_reserva`, `id_habitacion`),
  INDEX `id_habitacion` (`id_habitacion` ASC) VISIBLE,
  CONSTRAINT `reserva_habitacion_ibfk_1`
    FOREIGN KEY (`id_reserva`)
    REFERENCES `hotel_everton`.`reserva` (`id_reserva`),
  CONSTRAINT `reserva_habitacion_ibfk_2`
    FOREIGN KEY (`id_habitacion`)
    REFERENCES `hotel_everton`.`habitacion` (`id_habitacion`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Tabla `rol` para autenticación
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hotel_everton`.`rol` (
  `id_rol` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (`id_rol`)
) ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Tabla `usuario` para login, enlazada a empleado o huesped
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hotel_everton`.`usuario` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `correo` VARCHAR(120) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `id_rol` INT NOT NULL,
  `RUT_empleado` VARCHAR(20) NULL,
  `id_huesped` INT NULL,
  `creado_en` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  CONSTRAINT `usuario_ibfk_rol` FOREIGN KEY (`id_rol`) REFERENCES `hotel_everton`.`rol` (`id_rol`),
  CONSTRAINT `usuario_ibfk_emp` FOREIGN KEY (`RUT_empleado`) REFERENCES `hotel_everton`.`empleado` (`RUT_empleado`) ON DELETE SET NULL,
  CONSTRAINT `usuario_ibfk_hue` FOREIGN KEY (`id_huesped`) REFERENCES `hotel_everton`.`huesped` (`id_huesped`) ON DELETE SET NULL
) ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- Semillas básicas de roles
INSERT IGNORE INTO `hotel_everton`.`rol` (nombre) VALUES ('admin'),('empleado'),('huesped');

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
