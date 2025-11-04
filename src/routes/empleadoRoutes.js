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
