// CRUD de roles
import pool from "../config/db.js";

export const listarRoles = async (_req, res) => {
  const [rows] = await pool.query("SELECT * FROM rol");
  res.json(rows);
};

export const obtenerRol = async (req, res) => {
  const { id_rol } = req.params;
  const [rows] = await pool.query("SELECT * FROM rol WHERE id_rol=?", [id_rol]);
  if (!rows.length) return res.status(404).json({ message: "Rol no encontrado" });
  res.json(rows[0]);
};

export const crearRol = async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ message: "nombre es obligatorio" });
  await pool.query("INSERT INTO rol (nombre) VALUES (?)", [nombre]);
  res.status(201).json({ message: "Rol creado" });
};

export const actualizarRol = async (req, res) => {
  const { id_rol } = req.params;
  const { nombre } = req.body;
  await pool.query("UPDATE rol SET nombre=? WHERE id_rol=?", [nombre, id_rol]);
  res.json({ message: "Rol actualizado" });
};

export const eliminarRol = async (req, res) => {
  const { id_rol } = req.params;
  await pool.query("DELETE FROM rol WHERE id_rol=?", [id_rol]);
  res.json({ message: "Rol eliminado" });
};
