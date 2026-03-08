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

export const crearCargo = async (req, res) => {
  try {
    const { cargo, salario, horas_laborales, tipo_contrato, horario } = req.body;
    await pool.query(
      "INSERT INTO cargo (cargo, salario, horas_laborales, tipo_contrato, horario) VALUES (?, ?, ?, ?, ?)",
      [cargo, salario, horas_laborales, tipo_contrato, horario]
    );
    res.json({ message: "Cargo creado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al crear cargo", detalle: error.message });
  }
};
