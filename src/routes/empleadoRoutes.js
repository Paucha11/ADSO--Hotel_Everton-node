import { Router } from "express";
import {
  obtenerEmpleado,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
} from "../controllers/empleadocontrollers.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// Solo administradores gestionan empleados
router.use(authenticate, authorize("admin"));

router.get("/", obtenerEmpleado);
router.post("/", crearEmpleado);
router.put("/:RUT_empleado", actualizarEmpleado);
router.delete("/:RUT_empleado", eliminarEmpleado);

export default router;
