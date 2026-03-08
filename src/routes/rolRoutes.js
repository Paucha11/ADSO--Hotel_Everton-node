import { Router } from "express";
import {
  listarRoles,
  obtenerRol,
  crearRol,
  actualizarRol,
  eliminarRol,
} from "../controllers/rolController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate, authorize("admin"));

router.route("/")
  .get(listarRoles)
  .post(crearRol);

router.route("/:id_rol")
  .get(obtenerRol)
  .put(actualizarRol)
  .delete(eliminarRol);

export default router;
