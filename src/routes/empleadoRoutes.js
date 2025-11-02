import { Router } from "express";
import { 
  obtenerEmpleado, 
  crearEmpleado, 
  actualizarEmpleado, 
  eliminarEmpleado 
} from "../controllers/empleadocontrollers.js";

const router = Router();

router.get("/empleado", obtenerEmpleado);
router.post("/empleado", crearEmpleado);
router.put("/empleado/:RUT_empleado", actualizarEmpleado);
router.delete("/empleado/:RUT_empleado", eliminarEmpleado);

export default router;
