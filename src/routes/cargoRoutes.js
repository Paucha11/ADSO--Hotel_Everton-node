import { Router } from 'express';
import { obtenerCargos, crearCargo } from '../controllers/cargoController.js';

const router = Router();

router.get("/", obtenerCargos);
router.post("/", crearCargo); // solo si quieres permitir creación desde frontend/admin

export default router;
