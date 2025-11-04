import { Router } from 'express';
import { obtenerCargos } from '../controllers/cargocontrollers.js';

const router = Router();

router.get('/', obtenerCargos); // Ruta GET /api/cargo que responde con los cargos

export default router;
