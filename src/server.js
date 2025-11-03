import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import huespedRoutes from "./routes/huespedRoutes.js";
import empleadoRoutes from "./routes/empleadoRoutes.js"; // 🔹 nuevo import

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3001", // frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Rutas
app.use("/", huespedRoutes);
app.use("/", empleadoRoutes); // 🔹 nueva línea

// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});