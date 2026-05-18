import { Router } from "express";
import { login, registrarUsuario, registrarHuespedPublico, me } from "../controllers/authController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// Login publico: entrega token JWT
router.post("/login", login);
// Registro publico de huesped para la reserva online
router.post("/register-guest", registrarHuespedPublico);
// Solo un admin autenticado puede registrar nuevos usuarios con rol
router.post("/register", authenticate, authorize("admin"), registrarUsuario);
// Datos del usuario logueado
router.get("/me", authenticate, me);

export default router;
