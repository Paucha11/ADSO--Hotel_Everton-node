import { Router } from "express";
import { obtenerHuesped, crearHuesped, actualizarHuesped, eliminarHuesped } from "../controllers/huespedcontrollers.js";

const router = Router();

router.get("/huesped", obtenerHuesped);
router.post("/huesped", crearHuesped);
router.put("/huesped/:id", actualizarHuesped);
router.delete("/huesped/:id", eliminarHuesped);

export default router;
