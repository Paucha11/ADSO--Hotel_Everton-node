// CRUD de habitaciones con control de roles desde las rutas
import pool from "../config/db.js";

export const obtenerHabitaciones = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM habitacion");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener habitaciones", detalle: error.message });
  }
};

export const crearHabitacion = async (req, res) => {
  const { numero, tipo, precio, estado = "disponible", descripcion = null } = req.body;
  try {
    await pool.query(
      "INSERT INTO habitacion (numero, tipo, precio, estado, descripcion) VALUES (?, ?, ?, ?, ?)",
      [numero, tipo, precio, estado, descripcion]
    );
    res.status(201).json({ message: "Habitación creada" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear habitación", detalle: error.message });
  }
};

export const actualizarHabitacion = async (req, res) => {
  const { id_habitacion } = req.params;
  const { numero, tipo, precio, estado, descripcion } = req.body;
  try {
    await pool.query(
      "UPDATE habitacion SET numero=?, tipo=?, precio=?, estado=?, descripcion=? WHERE id_habitacion=?",
      [numero, tipo, precio, estado, descripcion, id_habitacion]
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
