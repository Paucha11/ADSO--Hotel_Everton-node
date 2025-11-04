<<<<<<< HEAD
import { Router } from 'express';
import {
  obtenerEmpleado,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado
} from '../controllers/empleadocontrollers.js';

const router = Router();

router.get('/', obtenerEmpleado);
router.post('/', crearEmpleado);
router.put('/:RUT_empleado', actualizarEmpleado);
router.delete('/:RUT_empleado', eliminarEmpleado);

export default router;
=======
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


>>>>>>> d46340400ad6a8f889a90a6c7bc29498c1eecaa1
