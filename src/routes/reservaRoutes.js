import { Router } from "express";
import {
  obtenerReservas,
  crearReserva,
  actualizarReserva,
  eliminarReserva,
  confirmarReserva,
  cancelarReserva,
  checkinReserva,
  checkoutReserva,
} from "../controllers/reservaControllers.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// Todas las reservas requieren usuario autenticado
router.use(authenticate);

router.get("/", obtenerReservas);
// Reservar: admin, empleado o el propio huesped
router.post("/", authorize("admin", "empleado", "huesped"), crearReserva);
// Actualizar reserva: admin, empleado o dueño huesped
router.put("/:id_reserva", authorize("admin", "empleado", "huesped"), actualizarReserva);
// Eliminar reserva: solo admin o empleado
router.delete("/:id_reserva", authorize("admin", "empleado"), eliminarReserva);

// Acciones de negocio explicitas
router.patch("/:id_reserva/confirmar", authorize("admin", "empleado"), confirmarReserva);
router.patch("/:id_reserva/cancelar", authorize("admin", "empleado", "huesped"), cancelarReserva);
router.patch("/:id_reserva/checkin", authorize("admin", "empleado"), checkinReserva);
router.patch("/:id_reserva/checkout", authorize("admin", "empleado"), checkoutReserva);

export default router;
