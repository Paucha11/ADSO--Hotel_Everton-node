// CRUD de reservas; los permisos se controlan via middleware y validaciones por rol
import pool from "../config/db.js";

const buildReservaPayload = (body, fallback) => ({
  fecha_entrada: body.fecha_entrada ?? fallback.fecha_entrada,
  fecha_salida: body.fecha_salida ?? fallback.fecha_salida,
  estado: body.estado ?? fallback.estado,
  total: body.total ?? fallback.total,
  notas: body.notas ?? fallback.notas,
});

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

    // limitar los estados que un huésped puede fijar
    if (req.user?.role === "huesped" && payload.estado !== actual.estado) {
      if (["cancelada", "reservada"].includes(payload.estado)) {
        // ok
      } else {
        payload.estado = actual.estado;
      }
    }

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
