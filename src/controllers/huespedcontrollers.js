import pool from "../config/db.js";

// Obtener todos los huéspedes
export const obtenerHuesped = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM huesped");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener huéspedes", detalle: error.message });
  }
};

// Crear un nuevo huésped
export const crearHuesped = async (req, res) => {
  try {
    const {
      id_huesped,
      nombre_huesped,
      fecha_nacimiento,
      telefono,
      direccion,
      correo,
      procedencia,
      metodo_pagoFV
    } = req.body;

    await pool.query(
      "INSERT INTO huesped (id_huesped, nombre_huesped, fecha_nacimiento, telefono, direccion, correo, procedencia, metodo_pagoFV) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id_huesped, nombre_huesped, fecha_nacimiento, telefono, direccion, correo, procedencia, metodo_pagoFV]
    );

    res.json({ message: "Huésped creado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al crear huésped", detalle: error.message });
  }
};


// Actualizar un huésped
export const actualizarHuesped = async (req, res) => {
  try {
    const { id_huesped } = req.params;
    const {
      nombre_huesped,
      fecha_nacimiento,
      telefono,
      direccion,
      correo,
      procedencia,
      metodo_pagoFV
    } = req.body;

    await pool.query(
      "UPDATE huesped SET nombre_huesped = ?, fecha_nacimiento = ?, telefono = ?, direccion = ?, correo = ?, procedencia = ?, metodo_pagoFV = ? WHERE id_huesped = ?",
      [nombre_huesped, fecha_nacimiento, telefono, direccion, correo, procedencia, metodo_pagoFV, id_huesped]
    );

    res.json({ message: "Huésped actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar huésped", detalle: error.message });
  }
};

// Eliminar un huésped
export const eliminarHuesped = async (req, res) => {
  try {
    const { id_huesped } = req.params;

    await pool.query(
      "DELETE FROM huesped WHERE id_huesped = ?",
      [id_huesped]
    );

    res.json({ message: "Huésped eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar huésped", detalle: error.message });
  }
};

