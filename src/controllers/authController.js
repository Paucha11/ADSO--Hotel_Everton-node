// Controlador de autenticacion: login, registro y utilidades de sesión
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "change-me";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "8h";

// Endpoint de login comun (admin, empleado, huesped)
export const login = async (req, res) => {
  const { correo, password } = req.body;
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

    const token = jwt.sign(
      {
        id_usuario: user.id_usuario,
        role: user.rol,
        RUT_empleado: user.RUT_empleado,
        id_huesped: user.id_huesped,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

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

// Solo un admin puede registrar nuevos usuarios con rol
export const registrarUsuario = async (req, res) => {
  const { correo, password, role, RUT_empleado = null, id_huesped = null } = req.body;

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
