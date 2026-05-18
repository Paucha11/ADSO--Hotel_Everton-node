import { Router } from "express";
import {
  listarHoteles,
  obtenerHotel,
  crearHotel,
  actualizarHotel,
  eliminarHotel,
} from "../controllers/hotelController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authenticate, authorize("admin"), listarHoteles);
router.get("/:NIT_hotel", authenticate, authorize("admin"), obtenerHotel);
router.post("/", authenticate, authorize("admin"), crearHotel);
router.put("/:NIT_hotel", authenticate, authorize("admin"), actualizarHotel);
router.delete("/:NIT_hotel", authenticate, authorize("admin"), eliminarHotel);

export default router;
