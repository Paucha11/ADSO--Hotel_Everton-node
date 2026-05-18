// Controlador de autenticacion: login, registro y utilidades de sesión
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES || "8h";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET es obligatorio en el archivo .env");
}

const signUserToken = (user) =>
  jwt.sign(
    {
      id_usuario: user.id_usuario,
      role: user.rol,
      RUT_empleado: user.RUT_empleado,
      id_huesped: user.id_huesped,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

// Endpoint de login comun (admin, empleado, huesped)
export const login = async (req, res) => {
  const { correo, password } = req.body || {};
  if (!correo || !password) {
    return res.status(400).json({ message: "Correo y contraseña son obligatorios" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT u.id_usuario, u.correo, u.password_hash, r.nombre AS rol, u.RUT_empleado, u.id_huesped
       FROM usuario u
       JOIN rol r ON u.id_rol = r.id_rol
       WHERE u.correo = ?`,
      [correo]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];
    const passwordOk = await bcrypt.compare(password, user.password_hash);
    if (!passwordOk) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = signUserToken(user);

    res.json({
      token,
      usuario: {
        id: user.id_usuario,
        correo: user.correo,
        role: user.rol,
        RUT_empleado: user.RUT_empleado,
        id_huesped: user.id_huesped,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", detalle: error.message });
  }
};

export const registrarHuespedPublico = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const {
      documento_identidad,
      nombre_huesped,
      fecha_nacimiento,
      telefono,
      direccion,
      correo,
      procedencia,
      metodo_pagoFV,
      password,
    } = req.body || {};

    if (!documento_identidad || !nombre_huesped || !fecha_nacimiento || !telefono || !direccion || !correo || !procedencia || !metodo_pagoFV || !password) {
      return res.status(400).json({ message: "Todos los campos del registro son obligatorios" });
    }

    const [existingUser] = await connection.query("SELECT id_usuario FROM usuario WHERE correo = ?", [correo]);
    if (existingUser.length) {
      return res.status(409).json({ message: "Ya existe un usuario registrado con ese correo" });
    }

    const [existingGuest] = await connection.query(
      "SELECT id_huesped FROM huesped WHERE correo = ? OR documento_identidad = ?",
      [correo, documento_identidad]
    );
    if (existingGuest.length) {
      return res.status(409).json({ message: "Ya existe un huesped registrado con ese correo o documento" });
    }

    const [roleRows] = await connection.query("SELECT id_rol FROM rol WHERE nombre = 'huesped' LIMIT 1");
    if (!roleRows.length) {
      return res.status(500).json({ message: "No existe el rol huesped en la base de datos" });
    }

    await connection.beginTransaction();

    const [guestResult] = await connection.query(
      `INSERT INTO huesped (
        documento_identidad, nombre_huesped, fecha_nacimiento, telefono, direccion, correo, procedencia, metodo_pagoFV
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [documento_identidad, nombre_huesped, fecha_nacimiento, telefono, direccion, correo, procedencia, metodo_pagoFV]
    );

    const passwordHash = await bcrypt.hash(password, 10);
    const [userResult] = await connection.query(
      "INSERT INTO usuario (correo, password_hash, id_rol, id_huesped) VALUES (?, ?, ?, ?)",
      [correo, passwordHash, roleRows[0].id_rol, guestResult.insertId]
    );

    await connection.commit();

    const user = {
      id_usuario: userResult.insertId,
      correo,
      rol: "huesped",
      RUT_empleado: null,
      id_huesped: guestResult.insertId,
    };

    const token = signUserToken(user);

    res.status(201).json({
      message: "Registro completado correctamente",
      token,
      usuario: {
        id: user.id_usuario,
        correo: user.correo,
        role: user.rol,
        RUT_empleado: user.RUT_empleado,
        id_huesped: user.id_huesped,
      },
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: "Error al registrar huesped", detalle: error.message });
  } finally {
    connection.release();
  }
};

// Solo un admin puede registrar nuevos usuarios con rol
export const registrarUsuario = async (req, res) => {
  const { correo, password, role, RUT_empleado = null, id_huesped = null } = req.body || {};

  if (!correo || !password || !role) {
    return res.status(400).json({ message: "correo, password y role son obligatorios" });
  }

  try {
    const [roleRows] = await pool.query("SELECT id_rol FROM rol WHERE nombre = ?", [role]);
    if (roleRows.length === 0) return res.status(400).json({ message: "Rol inválido" });
    const roleId = roleRows[0].id_rol;

    const [exists] = await pool.query("SELECT id_usuario FROM usuario WHERE correo = ?", [correo]);
    if (exists.length) return res.status(409).json({ message: "El correo ya está registrado" });

    if (role === "empleado" && !RUT_empleado) {
      return res.status(400).json({ message: "RUT_empleado es obligatorio para role empleado" });
    }
    if (role === "huesped" && !id_huesped) {
      return res.status(400).json({ message: "id_huesped es obligatorio para role huesped" });
    }

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO usuario (correo, password_hash, id_rol, RUT_empleado, id_huesped) VALUES (?, ?, ?, ?, ?)",
      [correo, hash, roleId, role === "empleado" ? RUT_empleado : null, role === "huesped" ? id_huesped : null]
    );

    res.status(201).json({ message: "Usuario creado" });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario", detalle: error.message });
  }
};

// Crea un admin por defecto usando las credenciales del .env si no existe
export const seedAdminUser = async () => {
  try {
    const correo = process.env.ADMIN_EMAIL || "admin@everton.com";
    const password = process.env.ADMIN_PASSWORD || "admin123";

    const [roleRows] = await pool.query("SELECT id_rol FROM rol WHERE nombre='admin'");
    const adminRole = roleRows[0];
    if (!adminRole) return;

    const [existing] = await pool.query("SELECT id_usuario FROM usuario WHERE correo = ?", [correo]);
    if (existing.length) return;

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO usuario (correo, password_hash, id_rol) VALUES (?, ?, ?)",
      [correo, hash, adminRole.id_rol]
    );
    console.log(`Admin creado por defecto: ${correo} / ${password}`);
  } catch (error) {
    console.error("No se pudo crear el admin por defecto", error.message);
  }
};

const ensureDemoEmployee = async () => {
  const demoRUT = process.env.EMPLOYEE_DEMO_RUT || "RUTDEMO001";
  const demoEmail = process.env.EMPLOYEE_DEMO_EMAIL || "empleado@everton.com";

  const [existingEmployee] = await pool.query("SELECT RUT_empleado FROM empleado WHERE RUT_empleado = ?", [demoRUT]);
  if (existingEmployee.length) {
    return { RUT_empleado: demoRUT, correo: demoEmail };
  }

  const [hoteles] = await pool.query("SELECT NIT_hotel FROM hotel ORDER BY NIT_hotel LIMIT 1");
  const [cargos] = await pool.query("SELECT id_cargo FROM cargo ORDER BY id_cargo LIMIT 1");

  if (!hoteles.length || !cargos.length) {
    throw new Error("No existe informacion base de hotel o cargo para crear el empleado demo");
  }

  await pool.query(
    `INSERT INTO empleado (
      RUT_empleado, id_cargo, NIT_hotel, nombre_empleado, telefono_empleado, direccion_empleado,
      correo_electronico, fecha_nacimiento, EPS, salario, tipo_contrato
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      demoRUT,
      cargos[0].id_cargo,
      hoteles[0].NIT_hotel,
      "Empleado Demo",
      "3001234567",
      "Manizales, Caldas",
      demoEmail,
      "1995-05-15",
      "Nueva EPS",
      1800000,
      "Termino fijo",
    ]
  );

  return { RUT_empleado: demoRUT, correo: demoEmail };
};

const ensureDemoGuest = async () => {
  const demoGuestEmail = process.env.GUEST_DEMO_EMAIL || "huesped@everton.com";
  const demoDocument = process.env.GUEST_DEMO_DOCUMENT || "CC10000001";

  const [existingGuest] = await pool.query("SELECT id_huesped FROM huesped WHERE correo = ? OR documento_identidad = ?", [
    demoGuestEmail,
    demoDocument,
  ]);

  if (existingGuest.length) {
    return { id_huesped: existingGuest[0].id_huesped, correo: demoGuestEmail };
  }

  const [result] = await pool.query(
    `INSERT INTO huesped (
      documento_identidad, nombre_huesped, fecha_nacimiento, telefono, direccion, correo, procedencia, metodo_pagoFV
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      demoDocument,
      "Huesped Demo",
      "1998-08-20",
      "3007654321",
      "Manizales, Caldas",
      demoGuestEmail,
      "Colombia",
      "Tarjeta",
    ]
  );

  return { id_huesped: result.insertId, correo: demoGuestEmail };
};

const ensureDemoUser = async ({ correo, password, role, RUT_empleado = null, id_huesped = null }) => {
  const [existingUser] = await pool.query("SELECT id_usuario FROM usuario WHERE correo = ?", [correo]);
  if (existingUser.length) return false;

  const [roleRows] = await pool.query("SELECT id_rol FROM rol WHERE nombre = ?", [role]);
  if (!roleRows.length) {
    throw new Error(`No existe el rol ${role}`);
  }

  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO usuario (correo, password_hash, id_rol, RUT_empleado, id_huesped) VALUES (?, ?, ?, ?, ?)",
    [correo, hash, roleRows[0].id_rol, RUT_empleado, id_huesped]
  );
  return true;
};

export const seedDemoUsers = async () => {
  try {
    const employeePassword = process.env.EMPLOYEE_DEMO_PASSWORD || "empleado123";
    const guestPassword = process.env.GUEST_DEMO_PASSWORD || "huesped123";

    const employee = await ensureDemoEmployee();
    const guest = await ensureDemoGuest();

    const employeeCreated = await ensureDemoUser({
      correo: employee.correo,
      password: employeePassword,
      role: "empleado",
      RUT_empleado: employee.RUT_empleado,
    });

    const guestCreated = await ensureDemoUser({
      correo: guest.correo,
      password: guestPassword,
      role: "huesped",
      id_huesped: guest.id_huesped,
    });

    if (employeeCreated) {
      console.log(`Empleado demo creado: ${employee.correo} / ${employeePassword}`);
    }

    if (guestCreated) {
      console.log(`Huesped demo creado: ${guest.correo} / ${guestPassword}`);
    }
  } catch (error) {
    console.error("No se pudieron crear los usuarios demo", error.message);
  }
};

// Devuelve los datos del usuario logueado usando el token
export const me = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Token requerido" });
  const { id_usuario } = req.user;
  const [rows] = await pool.query(
    `SELECT u.id_usuario, u.correo, r.nombre AS rol, u.RUT_empleado, u.id_huesped
     FROM usuario u
     JOIN rol r ON u.id_rol = r.id_rol
     WHERE u.id_usuario = ?`,
    [id_usuario]
  );
  if (!rows.length) return res.status(404).json({ message: "Usuario no encontrado" });
  res.json(rows[0]);
};
