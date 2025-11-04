import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import huespedRoutes from "./routes/huespedRoutes.js";
HEAD
import empleadoRoutes from './routes/empleadoRoutes.js';
git 


import empleadoRoutes from "./routes/empleadoRoutes.js"; // 🔹 nuevo import
import pool from "./config/db.js"; // 👈 importa la conexión

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3001", // frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Rutas
app.use("/api/huesped", huespedRoutes);
HEAD
app.use('/api/empleado', empleadoRoutes);
app.use("/api/empleados", empleadoRoutes); // 🔹 nueva línea

// ✅ Probar conexión a la base de datos
(async () => {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("✅ Conexión a la base de datos exitosa");
  } catch (error) {
    console.error("❌ Error de conexión a la base de datos:", error.message);
  }
})();



// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});