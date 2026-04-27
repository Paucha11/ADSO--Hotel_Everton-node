// CRUD de usuarios (solo admin)
import bcrypt from "bcryptjs";
import pool from "../config/db.js";

const mapUser = (u) => ({
  id_usuario: u.id_usuario,
  correo: u.correo,
  rol: u.rol,
  RUT_empleado: u.RUT_empleado,
  id_huesped: u.id_huesped,
});

export const listarUsuarios = async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT u.id_usuario, u.correo, r.nombre AS rol, u.RUT_empleado, u.id_huesped
     FROM usuario u JOIN rol r ON u.id_rol = r.id_rol`
  );
  res.json(rows.map(mapUser));
};

export const obtenerUsuario = async (req, res) => {
  const { id_usuario } = req.params;
  const [rows] = await pool.query(
    `SELECT u.id_usuario, u.correo, r.nombre AS rol, u.RUT_empleado, u.id_huesped
     FROM usuario u JOIN rol r ON u.id_rol = r.id_rol
     WHERE u.id_usuario = ?`,
    [id_usuario]
  );
  if (!rows.length) return res.status(404).json({ message: "Usuario no encontrado" });
  res.json(mapUser(rows[0]));
};

export const crearUsuario = async (req, res) => {
  const { correo, password, rol, RUT_empleado = null, id_huesped = null } = req.body;
  if (!correo || !password || !rol) return res.status(400).json({ message: "correo, password, rol son obligatorios" });

  const [roleRows] = await pool.query("SELECT id_rol FROM rol WHERE nombre=?", [rol]);
  if (!roleRows.length) return res.status(400).json({ message: "Rol inválido" });
  const roleId = roleRows[0].id_rol;

  const [exists] = await pool.query("SELECT id_usuario FROM usuario WHERE correo=?", [correo]);
  if (exists.length) return res.status(409).json({ message: "Correo ya existe" });

  if (rol === "empleado") {
    if (!RUT_empleado) return res.status(400).json({ message: "RUT_empleado es obligatorio para rol empleado" });
    const [empleado] = await pool.query("SELECT RUT_empleado FROM empleado WHERE RUT_empleado=?", [RUT_empleado]);
    if (!empleado.length) return res.status(400).json({ message: "El empleado indicado no existe" });
  }

  if (rol === "huesped") {
    if (!id_huesped) return res.status(400).json({ message: "id_huesped es obligatorio para rol huesped" });
    const [huesped] = await pool.query("SELECT id_huesped FROM huesped WHERE id_huesped=?", [id_huesped]);
    if (!huesped.length) return res.status(400).json({ message: "El huésped indicado no existe" });
  }

  const hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO usuario (correo, password_hash, id_rol, RUT_empleado, id_huesped) VALUES (?,?,?,?,?)",
    [correo, hash, roleId, rol === "empleado" ? RUT_empleado : null, rol === "huesped" ? id_huesped : null]
  );
  res.status(201).json({ message: "Usuario creado", id_usuario: result.insertId });
};

export const actualizarUsuario = async (req, res) => {
  const { id_usuario } = req.params;
  const { correo, password, rol, RUT_empleado = null, id_huesped = null } = req.body;

  const [current] = await pool.query("SELECT * FROM usuario WHERE id_usuario=?", [id_usuario]);
  if (!current.length) return res.status(404).json({ message: "Usuario no encontrado" });

  let roleId = current[0].id_rol;
  if (rol) {
    const [r] = await pool.query("SELECT id_rol FROM rol WHERE nombre=?", [rol]);
    if (!r.length) return res.status(400).json({ message: "Rol inválido" });
    roleId = r[0].id_rol;
  }

  const hash = password ? await bcrypt.hash(password, 10) : current[0].password_hash;
  await pool.query(
    "UPDATE usuario SET correo=?, password_hash=?, id_rol=?, RUT_empleado=?, id_huesped=? WHERE id_usuario=?",
    [correo || current[0].correo, hash, roleId, rol === "empleado" ? RUT_empleado : null, rol === "huesped" ? id_huesped : null, id_usuario]
  );

  res.json({ message: "Usuario actualizado" });
};

export const eliminarUsuario = async (req, res) => {
  const { id_usuario } = req.params;
  await pool.query("DELETE FROM usuario WHERE id_usuario=?", [id_usuario]);
  res.json({ message: "Usuario eliminado" });
};

// Asignar rol a usuario existente
export const asignarRol = async (req, res) => {
  const { id_usuario } = req.params;
  const { rol } = req.body;
  if (!rol) return res.status(400).json({ message: "rol es obligatorio" });
  const [r] = await pool.query("SELECT id_rol FROM rol WHERE nombre=?", [rol]);
  if (!r.length) return res.status(400).json({ message: "Rol inválido" });
  const [u] = await pool.query("SELECT id_usuario FROM usuario WHERE id_usuario=?", [id_usuario]);
  if (!u.length) return res.status(404).json({ message: "Usuario no encontrado" });
  await pool.query("UPDATE usuario SET id_rol=? WHERE id_usuario=?", [r[0].id_rol, id_usuario]);
  res.json({ message: "Rol asignado" });
};
