import { Router } from "express";
import {
  obtenerCargos,
  obtenerCargo,
  crearCargo,
  actualizarCargo,
  eliminarCargo,
} from "../controllers/cargocontrollers.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// Listado y detalle: admin o empleado
router.get("/", authenticate, authorize("admin", "empleado"), obtenerCargos);
router.get("/:id_cargo", authenticate, authorize("admin", "empleado"), obtenerCargo);
// Crear cargo: solo admin
router.post("/", authenticate, authorize("admin"), crearCargo);
router.put("/:id_cargo", authenticate, authorize("admin"), actualizarCargo);
router.delete("/:id_cargo", authenticate, authorize("admin"), eliminarCargo);

export default router;
