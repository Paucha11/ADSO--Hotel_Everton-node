import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import huespedRoutes from "./routes/huespedRoutes.js";
import empleadoRoutes from "./routes/empleadoRoutes.js";
import cargoRoutes from "./routes/cargoRoutes.js";
import pool from "./config/db.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Rutas, solo UNA línea por endpoint
app.use("/api/huesped", huespedRoutes);
app.use("/api/empleado", empleadoRoutes);
app.use("/api/cargo", cargoRoutes);

// Probar conexión a la base de datos
(async () => {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("✅ Conexión a la base de datos exitosa");
  } catch (error) {
    console.error("❌ Error de conexión a la base de datos:", error.message);
  }
})();

// Puerto del servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
