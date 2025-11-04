import pool from "../config/db.js";

// Obtener todos los cargos
export const obtenerCargos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM cargo");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener cargos", detalle: error.message });
  }
};

// (Opcional) Crear un cargo
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

// (Opcional) Actualizar un cargo
export const actualizarCargo = async (req, res) => {
  try {
    const { id_cargo } = req.params;
    const { cargo, salario, horas_laborales, tipo_contrato, horario } = req.body;
    await pool.query(
      "UPDATE cargo SET cargo = ?, salario = ?, horas_laborales = ?, tipo_contrato = ?, horario = ? WHERE id_cargo = ?",
      [cargo, salario, horas_laborales, tipo_contrato, horario, id_cargo]
    );
    res.json({ message: "Cargo actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar cargo", detalle: error.message });
  }
};;     