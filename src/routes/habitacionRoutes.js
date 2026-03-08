import { Router } from "express";
import {
  obtenerHabitaciones,
  crearHabitacion,
  actualizarHabitacion,
  eliminarHabitacion,
} from "../controllers/habitacionControllers.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// Cualquier rol autenticado puede listar habitaciones
router.get("/", authenticate, obtenerHabitaciones);
// Crear/editar habitaciones: admin o empleado
router.post("/", authenticate, authorize("admin", "empleado"), crearHabitacion);
router.put("/:id_habitacion", authenticate, authorize("admin", "empleado"), actualizarHabitacion);
// Eliminar habitacion: solo admin
router.delete("/:id_habitacion", authenticate, authorize("admin"), eliminarHabitacion);

export default router;
