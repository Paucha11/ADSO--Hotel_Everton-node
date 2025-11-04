import pool from "../config/db.js";

// Obtener todos los cargos (datos estáticos para prueba)
export const obtenerCargos = async (req, res) => {
  try {
    // Datos estáticos simulando la tabla cargos
    const cargos = [
      { id_cargo: 1, cargo: 'Administrador' },
      { id_cargo: 2, cargo: 'Conductor' },
      { id_cargo: 3, cargo: 'Recepcionista' },
      { id_cargo: 4, cargo: 'Supervisor' },
      { id_cargo: 5, cargo: 'Aseo' },
      { id_cargo: 6, cargo: 'Contador' }
    ];

    res.json(cargos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error obteniendo cargos', error });
  }
};

// Crear un cargo (para cuando tengas la tabla cargo preparada)
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
