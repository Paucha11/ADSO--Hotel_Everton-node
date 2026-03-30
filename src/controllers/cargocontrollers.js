// Maneja cargos (puestos) del hotel
import pool from "../config/db.js";

export const obtenerCargos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM cargo");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ mensaje: "Error obteniendo cargos", detalle: error.message });
  }
};

export const obtenerCargo = async (req, res) => {
  try {
    const { id_cargo } = req.params;
    const [rows] = await pool.query("SELECT * FROM cargo WHERE id_cargo = ?", [id_cargo]);

    if (!rows.length) {
      return res.status(404).json({ message: "Cargo no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener cargo", detalle: error.message });
  }
};

export const crearCargo = async (req, res) => {
  try {
    const { cargo, salario, horas_laborales, tipo_contrato, horario } = req.body;
    await pool.query(
      "INSERT INTO cargo (cargo, salario, horas_laborales, tipo_contrato, horario) VALUES (?, ?, ?, ?, ?)",
      [cargo, salario, horas_laborales, tipo_contrato, horario]
    );
    res.status(201).json({ message: "Cargo creado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al crear cargo", detalle: error.message });
  }
};

export const actualizarCargo = async (req, res) => {
  try {
    const { id_cargo } = req.params;
    const { cargo, salario, horas_laborales, tipo_contrato, horario } = req.body;

    const [result] = await pool.query(
      `UPDATE cargo
       SET cargo = ?, salario = ?, horas_laborales = ?, tipo_contrato = ?, horario = ?
       WHERE id_cargo = ?`,
      [cargo, salario, horas_laborales, tipo_contrato, horario, id_cargo]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Cargo no encontrado" });
    }

    res.json({ message: "Cargo actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar cargo", detalle: error.message });
  }
};

export const eliminarCargo = async (req, res) => {
  try {
    const { id_cargo } = req.params;
    const [result] = await pool.query("DELETE FROM cargo WHERE id_cargo = ?", [id_cargo]);

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Cargo no encontrado" });
    }

    res.json({ message: "Cargo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar cargo", detalle: error.message });
  }
};
