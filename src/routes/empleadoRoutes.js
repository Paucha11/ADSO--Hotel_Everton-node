import express from "express";
import {
  obtenerEmpleados,
  agregarEmpleado,
  eliminarEmpleado,
  actualizarEmpleado
} from "../controllers/empleadoController.js";

const router = express.Router();

router.get("/", obtenerEmpleados);
router.post("/", agregarEmpleado);
router.delete("/:RUT_empleado", eliminarEmpleado);
router.put("/:RUT_empleado", actualizarEmpleado);

export default router;


