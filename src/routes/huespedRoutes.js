import { Router } from "express";
import { 
  obtenerHuesped, 
  crearHuesped, 
  actualizarHuesped, 
  eliminarHuesped 
} from "../controllers/huespedcontrollers.js";

const router = Router();

// Rutas limpias
router.route("/")
  .get(obtenerHuesped)
  .post(crearHuesped);

router.route("/:id_huesped")
  .put(actualizarHuesped)
  .delete(eliminarHuesped);

export default router;