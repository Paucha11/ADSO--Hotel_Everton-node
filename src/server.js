import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import huespedRoutes from "./routes/huespedRoutes.js";
import empleadoRoutes from "./routes/empleadoRoutes.js";
import cargoRoutes from "./routes/cargoRoutes.js";
import habitacionRoutes from "./routes/habitacionRoutes.js";
import reservaRoutes from "./routes/reservaRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import rolRoutes from "./routes/rolRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import pool from "./config/db.js";
import { seedAdminUser } from "./controllers/authController.js";

dotenv.config();

const app = express();

// CORS para front local en 3001
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());

// Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/usuario", usuarioRoutes);
app.use("/api/rol", rolRoutes);
app.use("/api/hotel", hotelRoutes);
app.use("/api/huesped", huespedRoutes);
app.use("/api/empleado", empleadoRoutes);
app.use("/api/cargo", cargoRoutes);
app.use("/api/habitacion", habitacionRoutes);
app.use("/api/reserva", reservaRoutes);

// Probar conexión y sembrar admin inicial
(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Conexión a la base de datos exitosa");
    await seedAdminUser();
  } catch (error) {
    console.error("❌ Error de conexión a la base de datos:", error.message);
  }
})();

// Puerto del servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
