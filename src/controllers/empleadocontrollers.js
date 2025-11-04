import pool from "../config/db.js";

// Obtener todos los empleados
export const obtenerEmpleado = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM empleado");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener empleados", detalle: error.message });
  }
};

// Crear un nuevo empleado
export const crearEmpleado = async (req, res) => {
  try {
    const {
      RUT_empleado,
      id_cargo,
      NIT_hotel,
      nombre_empleado,
      telefono_empleado,
      direccion_empleado,
      correo_electronico,
      fecha_nacimiento,
      EPS,
      salario,
      tipo_contrato
    } = req.body;

    await pool.query(
      "INSERT INTO empleado (RUT_empleado, id_cargo, NIT_hotel, nombre_empleado, telefono_empleado, direccion_empleado, correo_electronico, fecha_nacimiento, EPS, salario, tipo_contrato) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [RUT_empleado, id_cargo, NIT_hotel, nombre_empleado, telefono_empleado, direccion_empleado, correo_electronico, fecha_nacimiento, EPS, salario, tipo_contrato]
    );

    res.json({ message: "Empleado creado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al crear empleado", detalle: error.message });
  }
};

// Actualizar un empleado
export const actualizarEmpleado = async (req, res) => {
  try {
    const { RUT_empleado } = req.params;
    const {
      id_cargo,
      NIT_hotel,
      nombre_empleado,
      telefono_empleado,
      direccion_empleado,
      correo_electronico,
      fecha_nacimiento,
      EPS,
      salario,
      tipo_contrato
    } = req.body;

    await pool.query(
      "UPDATE empleado SET id_cargo=?, NIT_hotel=?, nombre_empleado=?, telefono_empleado=?, direccion_empleado=?, correo_electronico=?, fecha_nacimiento=?, EPS=?, salario=?, tipo_contrato=? WHERE RUT_empleado=?",
      [id_cargo, NIT_hotel, nombre_empleado, telefono_empleado, direccion_empleado, correo_electronico, fecha_nacimiento, EPS, salario, tipo_contrato, RUT_empleado]
    );

    res.json({ message: "Empleado actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar empleado", detalle: error.message });
  }
};

// Eliminar un empleado
export const eliminarEmpleado = async (req, res) => {
  try {
    const { RUT_empleado } = req.params;

    await pool.query("DELETE FROM empleado WHERE RUT_empleado = ?", [RUT_empleado]);
    res.json({ message: "Empleado eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar empleado", detalle: error.message });
  }
};
