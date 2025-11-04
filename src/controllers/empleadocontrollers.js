import pool from "../config/db.js";

// Obtener todos los empleados
<<<<<<< HEAD
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
=======
export const obtenerEmpleados = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM EMPLEADO");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener empleados:", error);
    res.status(500).json({ message: "Error al obtener empleados" });
  }
};

// Agregar un nuevo empleado
export const agregarEmpleado = async (req, res) => {
>>>>>>> d46340400ad6a8f889a90a6c7bc29498c1eecaa1
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

<<<<<<< HEAD
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
=======
    const query = `
      INSERT INTO EMPLEADO (
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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(query, [
      RUT_empleado,
>>>>>>> d46340400ad6a8f889a90a6c7bc29498c1eecaa1
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
<<<<<<< HEAD
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
=======
    ]);

    res.status(201).json({ message: "Empleado agregado correctamente" });
  } catch (error) {
    console.error("❌ Error al agregar empleado:", error);
    res.status(500).json({ message: "Error al agregar empleado" });
  }
};

// Eliminar empleado por RUT
export const eliminarEmpleado = async (req, res) => {
  try {
    const { RUT_empleado } = req.params;
    await pool.query("DELETE FROM EMPLEADO WHERE RUT_empleado = ?", [RUT_empleado]);
    res.json({ message: "Empleado eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar empleado:", error);
    res.status(500).json({ message: "Error al eliminar empleado" });
  }
};

// Actualizar empleado
export const actualizarEmpleado = async (req, res) => {
  try {
    const { RUT_empleado } = req.params;
    const campos = req.body;

    const [result] = await pool.query("UPDATE EMPLEADO SET ? WHERE RUT_empleado = ?", [
      campos,
      RUT_empleado,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    res.json({ message: "Empleado actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar empleado:", error);
    res.status(500).json({ message: "Error al actualizar empleado" });
  }
};

>>>>>>> d46340400ad6a8f889a90a6c7bc29498c1eecaa1
