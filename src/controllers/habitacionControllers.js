// CRUD de habitaciones ajustado al esquema real (tipo_habitacion/capacidad) y disponibilidad via reservas
import pool from "../config/db.js";

export const seedDefaultRooms = async () => {
  try {
    const defaultRooms = [
      [302, "900999111", "Sencilla", 120000, 1],
      [304, "900999111", "Doble", 180000, 2],
      [403, "900999111", "Multiple", 260000, 4],
      [405, "900999111", "Doble", 190000, 2],
      [407, "900999111", "Sencilla", 125000, 1],
    ];

    for (const [id, nit, tipo, precio, capacidad] of defaultRooms) {
      await pool.query(
        `INSERT INTO habitacion (id_habitacion, NIT_hotel, tipo_habitacion, precio, capacidad)
         SELECT ?, ?, ?, ?, ?
         WHERE NOT EXISTS (SELECT 1 FROM habitacion WHERE id_habitacion = ?)`,
        [id, nit, tipo, precio, capacidad, id]
      );
    }
  } catch (error) {
    console.error("No se pudieron sembrar las habitaciones base", error.message);
  }
};

export const obtenerHabitaciones = async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM habitacion");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener habitaciones", detalle: error.message });
  }
};

// Consulta especial: habitaciones disponibles en rango
export const habitacionesDisponibles = async (req, res) => {
  const { desde, hasta } = req.query;
  if (!desde || !hasta) {
    return res.status(400).json({ message: "desde y hasta son obligatorios" });
  }
  try {
    const [rows] = await pool.query(
      `SELECT h.*
       FROM habitacion h
       WHERE NOT EXISTS (
         SELECT 1 FROM reserva_habitacion rh
         JOIN reserva r ON r.id_reserva = rh.id_reserva
         WHERE rh.id_habitacion = h.id_habitacion
           AND r.estado = 'no disponible'
           AND NOT (r.fecha_fin <= ? OR r.fecha_inicio >= ?)
       )`,
      [desde, hasta]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al consultar disponibilidad", detalle: error.message });
  }
};

export const crearHabitacion = async (req, res) => {
  const { NIT_hotel = '900999111', tipo_habitacion, precio, capacidad } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO habitacion (NIT_hotel, tipo_habitacion, precio, capacidad) VALUES (?, ?, ?, ?)",
      [NIT_hotel, tipo_habitacion, precio, capacidad]
    );
    res.status(201).json({ message: "Habitación creada", id_habitacion: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Error al crear habitación", detalle: error.message });
  }
};

export const actualizarHabitacion = async (req, res) => {
  const { id_habitacion } = req.params;
  const { NIT_hotel, tipo_habitacion, precio, capacidad } = req.body;
  try {
    await pool.query(
      "UPDATE habitacion SET NIT_hotel=?, tipo_habitacion=?, precio=?, capacidad=? WHERE id_habitacion=?",
      [NIT_hotel, tipo_habitacion, precio, capacidad, id_habitacion]
    );
    res.json({ message: "Habitación actualizada" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar habitación", detalle: error.message });
  }
};

export const eliminarHabitacion = async (req, res) => {
  const { id_habitacion } = req.params;
  try {
    await pool.query("DELETE FROM habitacion WHERE id_habitacion=?", [id_habitacion]);
    res.json({ message: "Habitación eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar habitación", detalle: error.message });
  }
};
