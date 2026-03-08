import { Router } from "express";
import {
  listarUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  asignarRol,
} from "../controllers/usuarioController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// Solo admin maneja usuarios y roles
router.use(authenticate, authorize("admin"));

router.route("/")
  .get(listarUsuarios)
  .post(crearUsuario);

router.route("/:id_usuario")
  .get(obtenerUsuario)
  .put(actualizarUsuario)
  .delete(eliminarUsuario);

// asignar rol a usuario
router.post("/:id_usuario/roles", asignarRol);

export default router;
