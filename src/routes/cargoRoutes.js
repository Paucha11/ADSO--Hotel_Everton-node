import { Router } from "express";
import { obtenerCargos, crearCargo } from "../controllers/cargocontrollers.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// Listado de cargos: admin o empleado
router.get("/", authenticate, authorize("admin", "empleado"), obtenerCargos);
// Crear cargo: solo admin
router.post("/", authenticate, authorize("admin"), crearCargo);

export default router;
