import { Router } from "express";
import { login, registrarUsuario } from "../controllers/authController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// Login publico: entrega token JWT
router.post("/login", login);
// Solo un admin autenticado puede registrar nuevos usuarios con rol
router.post("/register", authenticate, authorize("admin"), registrarUsuario);

export default router;
