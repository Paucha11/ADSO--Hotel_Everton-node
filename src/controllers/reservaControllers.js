import pool from "../config/db.js";

// Estados permitidos y transiciones simples
const ESTADOS = ["reservada", "confirmada", "checkin", "checkout", "cancelada"];
const TRANSICIONES = {
  reservada: ["confirmada", "cancelada"],
  confirmada: ["checkin", "cancelada"],
  checkin: ["checkout"],
  checkout: [],
  cancelada: [],
};

const buildReservaPayload = (body, fallback) => ({
  fecha_entrada: body.fecha_entrada ?? fallback.fecha_entrada,
  fecha_salida: body.fecha_salida ?? fallback.fecha_salida,
  estado: body.estado ?? fallback.estado,
  total: body.total ?? fallback.total,
  notas: body.notas ?? fallback.notas,
});

const verificarHabitacionLibre = async (id_habitacion, desde, hasta, excluirId = null) => {
  const params = [id_habitacion, desde, hasta];
  let sql = `SELECT 1 FROM reserva
             WHERE id_habitacion = ?
               AND estado IN ('reservada','confirmada','checkin')
               AND NOT (fecha_salida <= ? OR fecha_entrada >= ?)`;
  if (excluirId) {
    sql += " AND id_reserva <> ?";
    params.push(excluirId);
  }
  const [rows] = await pool.query(sql, params);
  return rows.length === 0;
};

const validarFechas = (entrada, salida) => {
  const inicio = new Date(entrada);
  const fin = new Date(salida);
  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) return { ok: false, message: "Fechas inválidas" };
  if (fin <= inicio) return { ok: false, message: "La fecha de salida debe ser posterior a la entrada" };
  return { ok: true };
};

const changeState = async (req, res, nuevoEstado) => {
  const { id_reserva } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM reserva WHERE id_reserva=?", [id_reserva]);
    if (!rows.length) return res.status(404).json({ message: "Reserva no encontrada" });

    const reserva = rows[0];
    if (!ESTADOS.includes(nuevoEstado)) {
      return res.status(400).json({ message: "Estado no válido" });
    }

    if (req.user?.role === "huesped" && reserva.id_huesped !== req.user.id_huesped) {
      return res.status(403).json({ message: "Solo puedes modificar tus propias reservas" });
    }

    // Huesped solo puede cancelar o mantener
    if (req.user?.role === "huesped" && nuevoEstado !== "cancelada" && nuevoEstado !== reserva.estado) {
      return res.status(403).json({ message: "No puedes cambiar a ese estado" });
    }

    const permitidos = TRANSICIONES[reserva.estado] || [];
    if (!permitidos.includes(nuevoEstado)) {
      return res.status(400).json({ message: `No se puede pasar de ${reserva.estado} a ${nuevoEstado}` });
    }

    await pool.query("UPDATE reserva SET estado=? WHERE id_reserva=?", [nuevoEstado, id_reserva]);
    res.json({ message: `Estado de reserva actualizado a ${nuevoEstado}` });
  } catch (error) {
    res.status(500).json({ message: "Error al cambiar estado", detalle: error.message });
  }
};

export const obtenerReservas = async (req, res) => {
  try {
    const base = `SELECT r.*, h.numero AS numero_habitacion, h.tipo AS tipo_habitacion
                  FROM reserva r
                  JOIN habitacion h ON r.id_habitacion = h.id_habitacion`;
    const params = [];
    let sql = base;

    if (req.user?.role === "huesped") {
      sql += " WHERE r.id_huesped = ?";
      params.push(req.user.id_huesped);
    }

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reservas", detalle: error.message });
  }
};

export const crearReserva = async (req, res) => {
  try {
    let { id_huesped, id_habitacion, fecha_entrada, fecha_salida, estado = "reservada", total = null, notas = null } = req.body;

    if (req.user?.role === "huesped") {
      id_huesped = req.user.id_huesped;
      estado = "reservada"; // los huéspedes solo crean reservas nuevas
    }

    if (!id_huesped || !id_habitacion || !fecha_entrada || !fecha_salida) {
      return res.status(400).json({ message: "id_huesped, id_habitacion, fecha_entrada y fecha_salida son obligatorios" });
    }

    if (!ESTADOS.includes(estado)) return res.status(400).json({ message: "Estado no válido" });

    const fechas = validarFechas(fecha_entrada, fecha_salida);
    if (!fechas.ok) return res.status(400).json({ message: fechas.message });

    // Validar habitación existe
    const [hab] = await pool.query("SELECT id_habitacion FROM habitacion WHERE id_habitacion=?", [id_habitacion]);
    if (!hab.length) return res.status(400).json({ message: "La habitación no existe" });

    const libre = await verificarHabitacionLibre(id_habitacion, fecha_entrada, fecha_salida);
    if (!libre) return res.status(400).json({ message: "La habitación no está disponible en ese rango" });

    await pool.query(
      `INSERT INTO reserva (id_huesped, id_habitacion, fecha_entrada, fecha_salida, estado, total, notas)
       VALUES (?, ?, ?, ?, ?, ?, ?)` ,
      [id_huesped, id_habitacion, fecha_entrada, fecha_salida, estado, total, notas]
    );

    res.status(201).json({ message: "Reserva creada" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear reserva", detalle: error.message });
  }
};

export const actualizarReserva = async (req, res) => {
  const { id_reserva } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM reserva WHERE id_reserva=?", [id_reserva]);
    if (!rows.length) return res.status(404).json({ message: "Reserva no encontrada" });

    const actual = rows[0];
    if (req.user?.role === "huesped" && actual.id_huesped !== req.user.id_huesped) {
      return res.status(403).json({ message: "Solo puedes modificar tus propias reservas" });
    }

    const payload = buildReservaPayload(req.body, actual);
    if (!ESTADOS.includes(payload.estado)) return res.status(400).json({ message: "Estado no válido" });

    // Regla: no reactivar cancelada
    if (actual.estado === "cancelada" && payload.estado !== "cancelada") {
      return res.status(400).json({ message: "Una reserva cancelada no puede reactivarse" });
    }

    const fechas = validarFechas(payload.fecha_entrada, payload.fecha_salida);
    if (!fechas.ok) return res.status(400).json({ message: fechas.message });

        const habitacionFinal = req.body.id_habitacion ?? actual.id_habitacion
    const libre = await verificarHabitacionLibre(habitacionFinal, payload.fecha_entrada, payload.fecha_salida, id_reserva);
    if (!libre) return res.status(400).json({ message: "La habitación no está disponible en ese rango" });

    await pool.query(
      "UPDATE reserva SET fecha_entrada=?, fecha_salida=?, estado=?, total=?, notas=? WHERE id_reserva=?",
      [payload.fecha_entrada, payload.fecha_salida, payload.estado, payload.total, payload.notas, id_reserva]
    );

    res.json({ message: "Reserva actualizada" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar reserva", detalle: error.message });
  }
};

export const eliminarReserva = async (req, res) => {
  const { id_reserva } = req.params;
  try {
    await pool.query("DELETE FROM reserva WHERE id_reserva=?", [id_reserva]);
    res.json({ message: "Reserva eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar reserva", detalle: error.message });
  }
};

// Acciones de negocio explicitas
export const confirmarReserva = async (req, res) => changeState(req, res, "confirmada");
export const cancelarReserva = async (req, res) => changeState(req, res, "cancelada");
export const checkinReserva = async (req, res) => changeState(req, res, "checkin");
export const checkoutReserva = async (req, res) => changeState(req, res, "checkout");
