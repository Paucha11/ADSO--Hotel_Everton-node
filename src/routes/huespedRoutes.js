import { Router } from "express";
import {
  obtenerHuesped,
  crearHuesped,
  actualizarHuesped,
  eliminarHuesped,
} from "../controllers/huespedcontrollers.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// Rutas de huesped: solo admin o empleado
router.use(authenticate);

router
  .route("/")
  .get(authorize("admin", "empleado"), obtenerHuesped)
  .post(authorize("admin", "empleado"), crearHuesped);

router
  .route("/:id_huesped")
  .put(authorize("admin", "empleado"), actualizarHuesped)
  .delete(authorize("admin", "empleado"), eliminarHuesped);

export default router;
