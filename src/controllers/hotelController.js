import pool from "../config/db.js";

export const listarHoteles = async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM hotel");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener hoteles", detalle: error.message });
  }
};

export const obtenerHotel = async (req, res) => {
  try {
    const { NIT_hotel } = req.params;
    const [rows] = await pool.query("SELECT * FROM hotel WHERE NIT_hotel = ?", [NIT_hotel]);

    if (!rows.length) {
      return res.status(404).json({ message: "Hotel no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener hotel", detalle: error.message });
  }
};

export const crearHotel = async (req, res) => {
  try {
    const {
      NIT_hotel,
      nombre,
      direccion,
      telefono,
      correo_electronico,
      num_empleados = 0,
      num_habitaciones = 0,
      num_huespedes = 0,
    } = req.body;

    await pool.query(
      `INSERT INTO hotel
      (NIT_hotel, nombre, direccion, telefono, correo_electronico, num_empleados, num_habitaciones, num_huespedes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [NIT_hotel, nombre, direccion, telefono, correo_electronico, num_empleados, num_habitaciones, num_huespedes]
    );

    res.status(201).json({ message: "Hotel creado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear hotel", detalle: error.message });
  }
};

export const actualizarHotel = async (req, res) => {
  try {
    const { NIT_hotel } = req.params;
    const {
      nombre,
      direccion,
      telefono,
      correo_electronico,
      num_empleados,
      num_habitaciones,
      num_huespedes,
    } = req.body;

    const [result] = await pool.query(
      `UPDATE hotel
       SET nombre = ?, direccion = ?, telefono = ?, correo_electronico = ?,
           num_empleados = ?, num_habitaciones = ?, num_huespedes = ?
       WHERE NIT_hotel = ?`,
      [nombre, direccion, telefono, correo_electronico, num_empleados, num_habitaciones, num_huespedes, NIT_hotel]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Hotel no encontrado" });
    }

    res.json({ message: "Hotel actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar hotel", detalle: error.message });
  }
};

export const eliminarHotel = async (req, res) => {
  try {
    const { NIT_hotel } = req.params;
    const [result] = await pool.query("DELETE FROM hotel WHERE NIT_hotel = ?", [NIT_hotel]);

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Hotel no encontrado" });
    }

    res.json({ message: "Hotel eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar hotel", detalle: error.message });
  }
};
