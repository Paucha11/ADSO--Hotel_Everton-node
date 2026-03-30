import pool from "../config/db.js";

// Estados permitidos según tu esquema (disponible / no disponible)
const ESTADOS = ["disponible", "no disponible"];

const validarFechas = (inicio, fin) => {
  const f1 = new Date(inicio);
  const f2 = new Date(fin);
  if (Number.isNaN(f1.getTime()) || Number.isNaN(f2.getTime())) return { ok: false, message: "Fechas inválidas" };
  if (f2 <= f1) return { ok: false, message: "La fecha fin debe ser posterior a inicio" };
  return { ok: true };
};

const habitacionDisponible = async (id_habitacion, desde, hasta, excluirId = null) => {
  const params = [id_habitacion, desde, hasta];
  let sql = `SELECT 1 FROM reserva_habitacion rh
             JOIN reserva r ON r.id_reserva = rh.id_reserva
             WHERE rh.id_habitacion = ?
               AND r.estado = 'no disponible'
               AND NOT (r.fecha_fin <= ? OR r.fecha_inicio >= ?)`;
  if (excluirId) {
    sql += " AND r.id_reserva <> ?";
    params.push(excluirId);
  }
  const [rows] = await pool.query(sql, params);
  return rows.length === 0;
};

const buildReservaPayload = (body, fallback) => ({
  fecha_inicio: body.fecha_inicio ?? fallback.fecha_inicio,
  fecha_fin: body.fecha_fin ?? fallback.fecha_fin,
  estado: body.estado ?? fallback.estado,
});

const changeState = async (req, res, nuevoEstado) => {
  const { id_reserva } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM reserva WHERE id_reserva=?", [id_reserva]);
    if (!rows.length) return res.status(404).json({ message: "Reserva no encontrada" });
    const reserva = rows[0];

    if (!ESTADOS.includes(nuevoEstado)) return res.status(400).json({ message: "Estado no válido" });
    if (req.user?.role === "huesped" && reserva.id_huesped !== req.user.id_huesped) {
      return res.status(403).json({ message: "Solo puedes modificar tus propias reservas" });
    }

    // Huesped solo puede pasar a disponible (cancelar)
    if (req.user?.role === "huesped" && nuevoEstado !== "disponible") {
      return res.status(403).json({ message: "No puedes cambiar a ese estado" });
    }

    await pool.query("UPDATE reserva SET estado=? WHERE id_reserva=?", [nuevoEstado, id_reserva]);
    res.json({ message: `Estado de reserva actualizado a ${nuevoEstado}` });
  } catch (error) {
    res.status(500).json({ message: "Error al cambiar estado", detalle: error.message });
  }
};

export const obtenerReservas = async (req, res) => {
  try {
    let sql = `SELECT r.*, GROUP_CONCAT(rh.id_habitacion) AS habitaciones
               FROM reserva r
               LEFT JOIN reserva_habitacion rh ON rh.id_reserva = r.id_reserva`;
    const params = [];
    if (req.user?.role === "huesped") {
      sql += " WHERE r.id_huesped = ?";
      params.push(req.user.id_huesped);
    }
    sql += " GROUP BY r.id_reserva";

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reservas", detalle: error.message });
  }
};

export const crearReserva = async (req, res) => {
  try {
    let { id_huesped, habitaciones = [], fecha_inicio, fecha_fin, estado = "no disponible" } = req.body;
    if (!Array.isArray(habitaciones) || habitaciones.length === 0) {
      return res.status(400).json({ message: "habitaciones debe ser un array con al menos un id_habitacion" });
    }

    if (req.user?.role === "huesped") {
      id_huesped = req.user.id_huesped;
      estado = "no disponible"; // huésped crea reservas activas
    }

    if (!id_huesped || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ message: "id_huesped, fecha_inicio y fecha_fin son obligatorios" });
    }

    if (!ESTADOS.includes(estado)) return res.status(400).json({ message: "Estado no válido" });

    const fechas = validarFechas(fecha_inicio, fecha_fin);
    if (!fechas.ok) return res.status(400).json({ message: fechas.message });

    // Validar disponibilidad de cada habitación
    for (const hab of habitaciones) {
      const libre = await habitacionDisponible(hab, fecha_inicio, fecha_fin);
      if (!libre) return res.status(400).json({ message: `La habitación ${hab} no está disponible en ese rango` });
    }

    const [result] = await pool.query(
      "INSERT INTO reserva (id_huesped, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?)",
      [id_huesped, fecha_inicio, fecha_fin, estado]
    );
    const reservaId = result.insertId;

    const values = habitaciones.map((h) => [reservaId, h]);
    await pool.query("INSERT INTO reserva_habitacion (id_reserva, id_habitacion) VALUES ?", [values]);

    res.status(201).json({ message: "Reserva creada", id_reserva: reservaId });
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

    const fechas = validarFechas(payload.fecha_inicio, payload.fecha_fin);
    if (!fechas.ok) return res.status(400).json({ message: fechas.message });

    const habitaciones = Array.isArray(req.body.habitaciones) ? req.body.habitaciones : null;
    if (habitaciones && habitaciones.length > 0) {
      for (const hab of habitaciones) {
        const libre = await habitacionDisponible(hab, payload.fecha_inicio, payload.fecha_fin, id_reserva);
        if (!libre) return res.status(400).json({ message: `La habitación ${hab} no está disponible en ese rango` });
      }
    }

    await pool.query(
      "UPDATE reserva SET fecha_inicio=?, fecha_fin=?, estado=? WHERE id_reserva=?",
      [payload.fecha_inicio, payload.fecha_fin, payload.estado, id_reserva]
    );

    if (habitaciones && habitaciones.length > 0) {
      await pool.query("DELETE FROM reserva_habitacion WHERE id_reserva=?", [id_reserva]);
      const values = habitaciones.map((h) => [id_reserva, h]);
      await pool.query("INSERT INTO reserva_habitacion (id_reserva, id_habitacion) VALUES ?", [values]);
    }

    res.json({ message: "Reserva actualizada" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar reserva", detalle: error.message });
  }
};

export const eliminarReserva = async (req, res) => {
  const { id_reserva } = req.params;
  try {
    await pool.query("DELETE FROM reserva_habitacion WHERE id_reserva=?", [id_reserva]);
    await pool.query("DELETE FROM reserva WHERE id_reserva=?", [id_reserva]);
    res.json({ message: "Reserva eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar reserva", detalle: error.message });
  }
};

// Acciones de negocio explicitas (disponible/no disponible)
export const confirmarReserva = async (req, res) => changeState(req, res, "no disponible");
export const cancelarReserva = async (req, res) => changeState(req, res, "disponible");
export const checkinReserva = async (req, res) => changeState(req, res, "no disponible");
export const checkoutReserva = async (req, res) => changeState(req, res, "disponible");
